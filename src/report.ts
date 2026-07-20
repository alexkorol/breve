import type { AppState, Card, Deck } from './types';
import { isMastered, trackReadiness } from './srs';
import { DAILY_GOAL } from './session';
import { dayKey, downloadText, getSetting, setSetting } from './storage';
import { dayIntensity, flameTier } from './flame';

/**
 * Weekly readiness report for the career_dev pipeline. The file is dropped
 * into career_dev's inbox/, where the morning routine clarifies it — so the
 * preamble states what it is and what it's for, and every section is a factual
 * signal the study-plan steering can act on without seeing the app.
 */

function cardTitle(card: Card): string {
  const text = card.type === 'flash' ? card.front : card.prompt;
  return text.length > 64 ? `${text.slice(0, 64)}…` : text;
}

function lastNDayKeys(n: number, endOffset = 0): string[] {
  const keys: string[] = [];
  for (let i = n - 1 + endOffset; i >= endOffset; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    keys.push(dayKey(d));
  }
  return keys;
}

export function buildReport(decks: Deck[], state: AppState): string {
  const { stats, progress } = state;
  const now = Date.now();
  const tracks = [...new Set(decks.map((d) => d.track))];
  const cardIndex = new Map<string, { card: Card; deck: Deck }>();
  for (const d of decks) for (const c of d.cards) cardIndex.set(c.id, { card: c, deck: d });

  const week = lastNDayKeys(7);
  const prevWeek = lastNDayKeys(7, 7);
  const sum = (keys: string[]) => keys.reduce((n, k) => n + (stats.reviewsByDay[k] ?? 0), 0);
  const weekReviews = sum(week);
  const prevWeekReviews = sum(prevWeek);
  const daysPracticed = week.filter((k) => dayIntensity(stats, k) > 0).length;
  const goalDays = week.filter((k) => (stats.reviewsByDay[k] ?? 0) >= DAILY_GOAL).length;
  const decksRead = week.reduce((n, k) => n + (stats.readsByDay[k]?.length ?? 0), 0);

  const seenEntries = Object.entries(progress).filter(([id]) => cardIndex.has(id));
  const dueNow = seenEntries.filter(([, p]) => p.due <= now).length;
  const dueWeek = seenEntries.filter(([, p]) => p.due <= now + 7 * 86400000).length;

  const lines = [
    `# Breve weekly readiness report — ${dayKey()}`,
    '',
    '> Source: Breve spaced-repetition PWA (alexkorol.github.io/breve), exported weekly.',
    '> Purpose: steering signal for STUDY_PLAN.md and deck priorities — readiness by track,',
    '> consistency, production-recall evidence, and the cards Alex keeps missing.',
    '> Compare with the previous week’s report for deltas.',
    '',
    '## Consistency',
    '',
    `- Streak: ${stats.streak} days (${flameTier(stats.streak).name})`,
    `- Last 7 days: ${weekReviews} reviews across ${daysPracticed} days · ${goalDays} day${goalDays === 1 ? '' : 's'} hit the ${DAILY_GOAL}-review goal${decksRead > 0 ? ` · ${decksRead} deck${decksRead === 1 ? '' : 's'} read in study mode` : ''}`,
    `- Previous 7 days: ${prevWeekReviews} reviews (${weekReviews >= prevWeekReviews ? '+' : ''}${weekReviews - prevWeekReviews} week over week)`,
    `- All-time: ${stats.totalReviews} reviews`,
    '',
    '## Due pressure',
    '',
    `- Due now: ${dueNow} cards · due within 7 days: ${dueWeek} of ${seenEntries.length} seen cards`,
    '',
    '## Readiness by track',
    '',
    '| Track | Readiness | Mastered | Seen | Cards | Avg recall |',
    '|---|---|---|---|---|---|',
  ];

  for (const track of tracks) {
    const cards = decks.filter((d) => d.track === track).flatMap((d) => d.cards);
    const mastered = cards.filter((c) => isMastered(progress[c.id])).length;
    const seen = cards.filter((c) => progress[c.id]).length;
    const recalls = cards
      .map((c) => progress[c.id]?.recall)
      .filter((r): r is number => r !== undefined);
    const avgRecall =
      recalls.length > 0
        ? `${Math.round(recalls.reduce((a, b) => a + b, 0) / recalls.length)} (${recalls.length} tested)`
        : '—';
    lines.push(
      `| ${track} | ${trackReadiness(cards, progress)}% | ${mastered} | ${seen} | ${cards.length} | ${avgRecall} |`,
    );
  }
  lines.push(
    '',
    '_Readiness = 70% mastery + 30% coverage, blended 60/40 with recall-mode grades where present._',
    '_Avg recall = production ability: answering from memory, AI-graded 0–100. The known gap is_',
    '_explaining own projects — watch the My Projects row._',
  );

  const weak = seenEntries
    .filter(([, p]) => p.lapses >= 2)
    .sort((a, b) => b[1].lapses - a[1].lapses)
    .slice(0, 10);
  lines.push('', '## Toughest cards (2+ misses)', '');
  if (weak.length === 0) {
    lines.push('- None right now.');
  } else {
    for (const [id, p] of weak) {
      const { card, deck } = cardIndex.get(id)!;
      lines.push(`- (×${p.lapses}) [${deck.title}] ${cardTitle(card)}`);
    }
  }

  const untouched = decks.filter((d) => d.cards.every((c) => !progress[c.id]));
  if (untouched.length > 0) {
    lines.push('', '## Not started', '');
    const shown = untouched.slice(0, 12);
    for (const d of shown) lines.push(`- ${d.title} (${d.track} · ${d.cards.length} cards)`);
    if (untouched.length > shown.length) lines.push(`- …and ${untouched.length - shown.length} more`);
  }

  return lines.join('\n');
}

/** Build, download, and remember the export day (drives the weekly nudge). */
export function exportReport(decks: Deck[], state: AppState): void {
  downloadText(`breve-report-${dayKey()}.md`, buildReport(decks, state), 'text/markdown');
  setSetting('lastReport', dayKey());
}

/** Days since the last report export, or Infinity if never exported. */
export function daysSinceReport(): number {
  const last = getSetting('lastReport');
  if (!last) return Infinity;
  return Math.floor((Date.now() - new Date(last).getTime()) / 86400000);
}
