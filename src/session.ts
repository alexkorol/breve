import type { Card, CardProgress, Deck } from './types';

export const MAX_NEW_PER_SESSION = 8;
export const MAX_DUE_PER_SESSION = 30;

function shuffle<T>(items: T[]): T[] {
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
): { due: number; fresh: number } {
  let due = 0;
  let fresh = 0;
  for (const card of deck.cards) {
    const p = progress[card.id];
    if (!p) fresh++;
    else if (p.due <= now) due++;
  }
  return { due, fresh };
}

/** Due cards first (oldest due first), then a capped batch of new cards. */
export function buildSession(
  deck: Deck,
  progress: Record<string, CardProgress>,
  now = Date.now(),
): Card[] {
  const due: Card[] = [];
  const fresh: Card[] = [];
  for (const card of deck.cards) {
    const p = progress[card.id];
    if (!p) fresh.push(card);
    else if (p.due <= now) due.push(card);
  }
  due.sort((a, b) => progress[a.id].due - progress[b.id].due);
  return [
    ...due.slice(0, MAX_DUE_PER_SESSION),
    ...shuffle(fresh).slice(0, MAX_NEW_PER_SESSION),
  ];
}
