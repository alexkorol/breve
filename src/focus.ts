import type { CardProgress, Deck } from './types';
import { deckCounts } from './session';

/** Decks shown in the Today's-focus strip. */
export const FOCUS_SIZE = 4;

/** How many focus slots SRS-due decks may claim before variety picks fill the rest. */
const MAX_DUE_SLOTS = 2;

/** Tracks that never enter the focus strip (still reachable in the full list). */
const EXCLUDED_TRACKS = new Set(['Spanish']);

const FOCUS_KEY = 'breve:ui:focus';

/** Small string hash → 32-bit seed. */
function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic PRNG (mulberry32) so the day's picks are stable until rerolled. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(items: T[], rng: () => number): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Pick the day's focus decks:
 * 1. Up to MAX_DUE_SLOTS decks with the most due cards — the spaced-repetition
 *    schedule always outranks novelty.
 * 2. Remaining slots: a date-seeded draw from decks with unseen cards,
 *    preferring tracks not already represented so the set spans the curriculum.
 * Same inputs → same picks all day; `reroll` bumps the seed for the draw slots
 * only (due-based picks are non-negotiable).
 */
export function pickFocus(
  decks: Deck[],
  progress: Record<string, CardProgress>,
  dateKey: string,
  reroll: number,
  now = Date.now(),
): Deck[] {
  const counted = decks
    .filter((d) => !EXCLUDED_TRACKS.has(d.track))
    .map((d) => ({ deck: d, ...deckCounts(d, progress, now) }));

  const chosen: Deck[] = counted
    .filter((x) => x.due > 0)
    .sort((a, b) => b.due - a.due)
    .slice(0, MAX_DUE_SLOTS)
    .map((x) => x.deck);

  const usedTracks = new Set(chosen.map((d) => d.track));
  const rng = mulberry32(hashSeed(`${dateKey}:${reroll}`));
  const drawn = seededShuffle(
    counted.filter((x) => x.fresh > 0 && !chosen.includes(x.deck)),
    rng,
  );
  // Playable decks claim variety slots before paywalled ones, so a free
  // user's focus strip is never a wall of locks.
  const pool = [...drawn.filter((x) => !x.deck.locked), ...drawn.filter((x) => x.deck.locked)];

  for (const x of pool) {
    if (chosen.length >= FOCUS_SIZE) break;
    if (!usedTracks.has(x.deck.track)) {
      chosen.push(x.deck);
      usedTracks.add(x.deck.track);
    }
  }
  for (const x of pool) {
    if (chosen.length >= FOCUS_SIZE) break;
    if (!chosen.includes(x.deck)) chosen.push(x.deck);
  }
  return chosen;
}

/** Reroll count for the given day (resets to 0 when the day changes). */
export function loadFocusReroll(dateKey: string): number {
  try {
    const raw = localStorage.getItem(FOCUS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { day?: string; reroll?: number };
      if (parsed.day === dateKey && typeof parsed.reroll === 'number') return parsed.reroll;
    }
  } catch {
    // corrupted or unavailable storage — fall through to default
  }
  return 0;
}

export function saveFocusReroll(dateKey: string, reroll: number): void {
  try {
    localStorage.setItem(FOCUS_KEY, JSON.stringify({ day: dateKey, reroll }));
  } catch {
    // non-fatal
  }
}
