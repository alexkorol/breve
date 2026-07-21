import type Anthropic from '@anthropic-ai/sdk';
import type { Card, Deck } from './types';
import type { Grade } from './srs';
import { getSetting, setSetting, parseDeckFile, isValidCard } from './storage';

/**
 * Provider-agnostic AI layer. OpenRouter is the primary provider (one key,
 * any model, OpenAI chat-completions format); Anthropic keys (sk-ant-…) are
 * detected and sent straight to Anthropic instead. Requests always go
 * directly from the browser to the provider; the key never leaves the device.
 */
export type Provider = 'openrouter' | 'anthropic';

export function getApiKey(): string {
  return getSetting('apikey');
}

export function setApiKey(key: string): void {
  setSetting('apikey', key.trim());
}

export function provider(): Provider {
  return getApiKey().startsWith('sk-ant-') ? 'anthropic' : 'openrouter';
}

/** Same model either way; OpenRouter routes by vendor-prefixed slug. */
export function defaultModel(): string {
  return provider() === 'anthropic' ? 'claude-opus-4-8' : 'anthropic/claude-opus-4.8';
}

export function getModel(): string {
  return getSetting('model') || defaultModel();
}

export function setModel(model: string): void {
  setSetting('model', model.trim());
}

export function aiAvailable(): boolean {
  return !!getApiKey() && navigator.onLine;
}

async function makeAnthropicClient(): Promise<Anthropic> {
  // Lazy import keeps the SDK out of the initial bundle; only loaded for sk-ant keys.
  const { default: AnthropicCtor } = await import('@anthropic-ai/sdk');
  return new AnthropicCtor({ apiKey: getApiKey(), dangerouslyAllowBrowser: true });
}

async function callAnthropic(system: string, user: string, maxTokens: number): Promise<string> {
  const client = await makeAnthropicClient();
  const stream = client.messages.stream({
    model: getModel(),
    max_tokens: maxTokens,
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

async function callOpenRouter(system: string, user: string, maxTokens: number): Promise<string> {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      'Content-Type': 'application/json',
      'X-Title': 'Jimothy',
    },
    body: JSON.stringify({
      model: getModel(),
      max_tokens: maxTokens,
      stream: true,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  });
  if (!res.ok || !res.body) {
    let detail = `HTTP ${res.status}`;
    try {
      const err = (await res.json()) as { error?: { message?: string } };
      if (err.error?.message) detail = err.error.message;
    } catch {
      // keep the status text
    }
    throw new Error(`OpenRouter request failed: ${detail}`);
  }
  // Accumulate the SSE stream; streaming keeps long generations alive through proxies.
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let text = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue; // skips SSE comments/keepalives
      const payload = line.slice(6).trim();
      if (payload === '[DONE]') continue;
      let chunk: { choices?: { delta?: { content?: string } }[]; error?: { message?: string } };
      try {
        chunk = JSON.parse(payload);
      } catch {
        continue;
      }
      if (chunk.error?.message) throw new Error(`OpenRouter: ${chunk.error.message}`);
      text += chunk.choices?.[0]?.delta?.content ?? '';
    }
  }
  if (!text) throw new Error('The model returned no text.');
  return text;
}

/** One entry point for every AI feature, dispatched by key type. */
async function callText(system: string, user: string, maxTokens: number): Promise<string> {
  if (!getApiKey()) throw new Error('No API key set — add one in Settings.');
  return provider() === 'anthropic'
    ? callAnthropic(system, user, maxTokens)
    : callOpenRouter(system, user, maxTokens);
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
Style rules:
- NEVER use em dashes (—) anywhere in card text. Use a colon, comma, parentheses, or a separate sentence instead.
- No walls of text: when a flash back covers a pipeline, checklist, or more than ~3 steps, format it as numbered or labeled lines separated by \\n (rendered as real line breaks). Never write a paragraph-length arrow chain.`;

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
  const raw = await callText(system, user, 32000);
  try {
    return parseDeckFile(extractJson(raw), existing);
  } catch (firstError) {
    onStatus?.('Repairing output…');
    const message = firstError instanceof Error ? firstError.message : 'invalid';
    const repaired = await callText(
      system,
      `Your previous deck JSON failed validation with: "${message}".\nHere is what you produced:\n${raw.slice(0, 30000)}\n\nReturn the corrected, complete JSON object only.`,
      32000,
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
  const text = await callText(
    `You grade interview-prep recall attempts. Compare the learner's answer to the rubric (the model answer). Score SUBSTANCE, not phrasing — synonyms and different orderings are fine; missing core concepts are not. Respond with ONLY JSON: {"score":<0-100>,"feedback":"<1-2 sentences: what was right, what was missing — address the learner as 'you'>"}`,
    `Question: ${front}\n\nModel answer (rubric):\n${rubric}\n\nLearner's answer:\n${answer}`,
    1024,
  );
  const parsed = JSON.parse(extractJson(text)) as { score?: number; feedback?: string };
  const score = Math.max(0, Math.min(100, Math.round(Number(parsed.score) || 0)));
  const grade: Grade = score >= 85 ? 3 : score >= 65 ? 2 : score >= 40 ? 1 : 0;
  return { score, grade, feedback: String(parsed.feedback ?? '') };
}

/** Turn postmortem bullets into targeted cards for the Misses deck. */
export async function generateMissCards(notes: string): Promise<Card[]> {
  const raw = await callText(
    `You convert interview-postmortem notes into targeted drill cards for Jimothy. For each stumble the learner describes, create 2-4 cards that would have prevented it: one flash card rehearsing the spoken answer they couldn't give, plus mcq/fill cards drilling the underlying concept. Respond with ONLY JSON: {"cards":[...]}
${CARD_SCHEMA_DOC}
Card ids use prefix "miss-".`,
    `Postmortem notes:\n\n${notes.slice(0, 20000)}`,
    32000,
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
