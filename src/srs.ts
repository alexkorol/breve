import type { CardProgress } from './types';

/** 0 = again, 1 = hard, 2 = good, 3 = easy */
export type Grade = 0 | 1 | 2 | 3;

const DAY_MS = 24 * 60 * 60 * 1000;
const MIN_EASE = 1.3;
const MAX_INTERVAL_DAYS = 365;

export function newProgress(now = Date.now()): CardProgress {
  return { ease: 2.5, interval: 0, due: now, reps: 0, lapses: 0 };
}

/**
 * Simplified SM-2. "Again" resets the interval and leaves the card due
 * immediately so the session can requeue it; graduating intervals are
 * 1d (good) / 2.5d (easy), then multiply by ease.
 */
export function applyGrade(p: CardProgress, grade: Grade, now = Date.now()): CardProgress {
  let { ease, interval } = p;
  const reps = p.reps + 1;
  let lapses = p.lapses;

  if (grade === 0) {
    return {
      ease: Math.max(MIN_EASE, ease - 0.2),
      interval: 0,
      due: now,
      reps,
      lapses: lapses + 1,
    };
  }

  if (grade === 1) {
    ease = Math.max(MIN_EASE, ease - 0.15);
    interval = interval === 0 ? 0.5 : interval * 1.2;
  } else if (grade === 2) {
    interval = interval === 0 ? 1 : interval * ease;
  } else {
    ease += 0.15;
    interval = interval === 0 ? 2.5 : interval * ease * 1.3;
  }

  interval = Math.min(interval, MAX_INTERVAL_DAYS);
  return { ease, interval, due: now + Math.round(interval * DAY_MS), reps, lapses };
}

/** A card counts as "mastered" once its interval reaches 3 weeks. */
export function isMastered(p: CardProgress | undefined): boolean {
  return !!p && p.interval >= 21;
}
