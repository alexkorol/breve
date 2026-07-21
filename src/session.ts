import type { Card, CardKind, CardProgress, Deck } from './types';
import { cardKind } from './types';

/**
 * Sessions are served as short packs you can knock off one at a time,
 * instead of one long slog through everything due.
 */
export const PACK_SIZE = 10;

/** Reviews per day to stay on a ~3-month mastery pace. */
export const DAILY_GOAL = 30;

export interface SessionOptions {
  /** Restrict the pack to quick (tap) or longform (drill) cards. */
  kind?: CardKind;
  /** Set false to serve due cards only — no new cards (Daily Review). */
  includeNew?: boolean;
}

export function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function deckCounts(
  deck: Deck,
  progress: Record<string, CardProgress>,
  now = Date.now(),
  kind?: CardKind,
): { due: number; fresh: number } {
  let due = 0;
  let fresh = 0;
  for (const card of deck.cards) {
    if (kind && cardKind(card) !== kind) continue;
    const p = progress[card.id];
    if (!p) fresh++;
    else if (p.due <= now) due++;
  }
  return { due, fresh };
}

/**
 * One pack: due cards first (oldest due first), topped up with new cards.
 * Within the pack, quick tap-cards come before longform drills so the
 * rhythm never alternates between 5-second taps and 60-second rehearsals.
 */
export function buildSession(
  deck: Deck,
  progress: Record<string, CardProgress>,
  now = Date.now(),
  opts: SessionOptions = {},
): Card[] {
  const { kind, includeNew = true } = opts;
  const due: Card[] = [];
  const fresh: Card[] = [];
  for (const card of deck.cards) {
    if (kind && cardKind(card) !== kind) continue;
    const p = progress[card.id];
    if (!p) fresh.push(card);
    else if (p.due <= now) due.push(card);
  }
  due.sort((a, b) => progress[a.id].due - progress[b.id].due);
  const pack = due.slice(0, PACK_SIZE);
  if (includeNew && pack.length < PACK_SIZE) {
    pack.push(...shuffle(fresh).slice(0, PACK_SIZE - pack.length));
  }
  // Stable partition: quick first, longform last.
  return [...pack.filter((c) => cardKind(c) === 'quick'), ...pack.filter((c) => cardKind(c) === 'longform')];
}
