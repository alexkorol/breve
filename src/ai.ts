import type Anthropic from '@anthropic-ai/sdk';
import type { Card, Deck } from './types';
import type { Grade } from './srs';
import { getSetting, setSetting, parseDeckFile, isValidCard } from './storage';

export const DEFAULT_MODEL = 'claude-opus-4-8';

export function getApiKey(): string {
  return getSetting('apikey');
}

export function setApiKey(key: string): void {
  setSetting('apikey', key.trim());
}

export function getModel(): string {
  return getSetting('model') || DEFAULT_MODEL;
}

export function setModel(model: string): void {
  setSetting('model', model.trim());
}

export function aiAvailable(): boolean {
  return !!getApiKey() && navigator.onLine;
}

async function makeClient(): Promise<Anthropic> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('No API key set — add one in Settings.');
  // Lazy import keeps the SDK out of the initial bundle; BYO key stored
  // locally; requests go directly from this browser to Anthropic.
  const { default: AnthropicCtor } = await import('@anthropic-ai/sdk');
  return new AnthropicCtor({ apiKey, dangerouslyAllowBrowser: true });
}

/** Pull the first JSON object out of a model response (tolerates ``` fences). */
function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = fenced ? fenced[1] : text;
  const start = body.indexOf('{');
  const end = body.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON object in response.');
  return body.slice(start, end + 1);
}

const CARD_SCHEMA_DOC = `Card formats (every card needs a unique "id" string):
- {"id","type":"mcq","prompt","choices":[4 strings],"answer":<index of correct choice>,"explanation"} — optional "code" string shown as a code block. Choices are shuffled at display time, so never write "all of the above".
- {"id","type":"flash","front","back"} — back must be written as a model spoken answer the learner rehearses aloud (60 seconds, complete sentences, the way a strong candidate would say it).
- {"id","type":"fill","prompt","code":<snippet containing ____ exactly once>,"answers":[accepted strings],"distractors":[3 wrong tokens],"explanation"}
- {"id","type":"tf","prompt":<a statement to judge>,"answer":<true|false>,"explanation"} — optional "code". Make false statements plausibly wrong, not silly.
- {"id","type":"order","prompt","items":[3-6 steps in CORRECT order],"explanation"} — steps/pipeline stages/code lines the learner arranges; they see them shuffled.
Inline code in any text field uses backticks. Explanations are 1-2 sentences stating WHY.
Style rule: NEVER use em dashes (—) anywhere in card text. Use a colon, comma, parentheses, or a separate sentence instead.`;

async function callForDeck(system: string, user: string): Promise<string> {
  const client = await makeClient();
  const stream = client.messages.stream({
    model: getModel(),
    max_tokens: 32000,
    system,
    messages: [{ role: 'user', content: user }],
  });
  const final = await stream.finalMessage();
  const text = final.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('');
  if (final.stop_reason === 'refusal' || !text) {
    throw new Error('The model declined to generate this content.');
  }
  return text;
}

export interface GenerateOptions {
  count: number;
  difficulty: 'intro' | 'interview' | 'expert';
}

/**
 * Generate a complete deck from source material, validating against the same
 * parser used for file imports. One automatic repair round-trip on failure.
 */
export async function generateDeck(
  source: string,
  opts: GenerateOptions,
  existing: Deck[],
  onStatus?: (s: string) => void,
): Promise<Deck> {
  const system = `You create spaced-repetition decks for Jimothy, an interview-prep app. Respond with ONLY a JSON object, no prose:
{"id":"<kebab-case, prefixed gen->","title":"<max 28 chars>","description":"<one line>","icon":"<one emoji>","color":"<hex>","cards":[...]}
${CARD_SCHEMA_DOC}
Mix card types (~35% mcq, ~30% flash, ~15% fill when code is relevant, ~10% tf, ~10% order; skip fill for non-code material). Card ids share the deck's prefix. Target difficulty: ${opts.difficulty}. Write questions that test understanding and interview-readiness, not trivia. Ground every card in the provided material; if the material names specific technologies, drill those.`;

  const user = `Create a ${opts.count}-card deck from this material:\n\n<material>\n${source.slice(0, 60000)}\n</material>`;

  onStatus?.('Generating cards…');
  const raw = await callForDeck(system, user);
  try {
    return parseDeckFile(extractJson(raw), existing);
  } catch (firstError) {
    onStatus?.('Repairing output…');
    const message = firstError instanceof Error ? firstError.message : 'invalid';
    const repaired = await callForDeck(
      system,
      `Your previous deck JSON failed validation with: "${message}".\nHere is what you produced:\n${raw.slice(0, 30000)}\n\nReturn the corrected, complete JSON object only.`,
    );
    return parseDeckFile(extractJson(repaired), existing);
  }
}

export interface RecallResult {
  score: number;
  grade: Grade;
  feedback: string;
}

/** Grade a spoken/typed answer against the card's back as rubric. */
export async function gradeRecall(front: string, rubric: string, answer: string): Promise<RecallResult> {
  const client = await makeClient();
  const response = await client.messages.create({
    model: getModel(),
    max_tokens: 1024,
    system: `You grade interview-prep recall attempts. Compare the learner's answer to the rubric (the model answer). Score SUBSTANCE, not phrasing — synonyms and different orderings are fine; missing core concepts are not. Respond with ONLY JSON: {"score":<0-100>,"feedback":"<1-2 sentences: what was right, what was missing — address the learner as 'you'>"}`,
    messages: [
      {
        role: 'user',
        content: `Question: ${front}\n\nModel answer (rubric):\n${rubric}\n\nLearner's answer:\n${answer}`,
      },
    ],
  });
  if (response.stop_reason === 'refusal') throw new Error('Grading declined.');
  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('');
  const parsed = JSON.parse(extractJson(text)) as { score?: number; feedback?: string };
  const score = Math.max(0, Math.min(100, Math.round(Number(parsed.score) || 0)));
  const grade: Grade = score >= 85 ? 3 : score >= 65 ? 2 : score >= 40 ? 1 : 0;
  return { score, grade, feedback: String(parsed.feedback ?? '') };
}

/** Turn postmortem bullets into targeted cards for the Misses deck. */
export async function generateMissCards(notes: string): Promise<Card[]> {
  const raw = await callForDeck(
    `You convert interview-postmortem notes into targeted drill cards for Jimothy. For each stumble the learner describes, create 2-4 cards that would have prevented it: one flash card rehearsing the spoken answer they couldn't give, plus mcq/fill cards drilling the underlying concept. Respond with ONLY JSON: {"cards":[...]}
${CARD_SCHEMA_DOC}
Card ids use prefix "miss-".`,
    `Postmortem notes:\n\n${notes.slice(0, 20000)}`,
  );
  const parsed = JSON.parse(extractJson(raw)) as { cards?: unknown[] };
  if (!Array.isArray(parsed.cards) || parsed.cards.length === 0) {
    throw new Error('No cards in response.');
  }
  const cards = parsed.cards.filter(isValidCard);
  if (cards.length === 0) throw new Error('Generated cards were malformed.');
  // Remap ids so repeated postmortems can never collide.
  const stamp = Date.now().toString(36);
  return cards.map((c, i) => ({ ...c, id: `miss-${stamp}-${i}` }));
}
