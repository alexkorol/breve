import type { Deck } from './types';
import { isNative } from './native';
import type { Plan } from './membership';

/**
 * Free/paid split per docs/strategy.md. Gating applies only to the native
 * (App Store) build: the web PWA stays ungated. The habit loop (sessions,
 * daily review, streak, stats) is never gated; only built-in deck depth is.
 * User-generated content (imported, shared, AI-generated, postmortem decks)
 * is always free: it is the viral loop.
 */

/** Complete, free-forever flagship decks: one per launch track. */
export const FREE_DECK_IDS = new Set([
  'big-o',
  'py-basics',
  'ml-fundamentals',
  'ai-interview-drills',
  'sql-interview',
]);

/** Cards of a locked deck that stay playable as a preview. */
export const PREVIEW_CARDS = 3;

export function gatingActive(plan: Plan): boolean {
  return isNative && plan.tier !== 'paid';
}

/** Restrict locked built-in decks to their preview; everything else untouched. */
export function gateDecks(decks: Deck[], gated: boolean): Deck[] {
  if (!gated) return decks;
  return decks.map((d) =>
    d.custom || FREE_DECK_IDS.has(d.id)
      ? d
      : { ...d, cards: d.cards.slice(0, PREVIEW_CARDS), locked: true, lockedTotal: d.cards.length },
  );
}
