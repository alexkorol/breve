import type { Stats } from './types';
import { dayKey } from './storage';

/**
 * The flame has two axes:
 *  - Streak (days) sets the COLOR, following real combustion temperature —
 *    a longer streak literally burns hotter.
 *  - Daily intensity (reviews + deck reads today) sets SIZE and BRIGHTNESS —
 *    a heavier study day blooms bigger and brighter.
 *
 * Tier thresholds are dense early (fast wins at 1/3/7 are the retention-critical
 * ones), include the 70-day personal-record beat point, and keep the classic
 * 100/180/365 long-horizon marks.
 */
export interface FlameTier {
  /** Streak days required to reach this tier. */
  minDays: number;
  name: string;
  /** Approximate real-flame temperature, for flavor. */
  temp: string;
  /** Body color of the flame. */
  outer: string;
  /** Hotter inner core color. */
  core: string;
}

export const FLAME_TIERS: FlameTier[] = [
  { minDays: 0, name: 'Unlit', temp: '—', outer: '#3d444d', core: '#565e68' },
  { minDays: 1, name: 'Ember', temp: '~800 K', outer: '#dc2626', core: '#fb923c' },
  { minDays: 3, name: 'Kindled', temp: '~950 K', outer: '#ea580c', core: '#fdba74' },
  { minDays: 7, name: 'Orange flame', temp: '~1,100 K', outer: '#f97316', core: '#fcd34d' },
  { minDays: 14, name: 'Golden flame', temp: '~1,250 K', outer: '#f59e0b', core: '#fde047' },
  { minDays: 30, name: 'Yellow flame', temp: '~1,400 K', outer: '#facc15', core: '#fef08a' },
  { minDays: 50, name: 'White-hot', temp: '~1,600 K', outer: '#e8e6df', core: '#fffbeb' },
  { minDays: 70, name: 'Blue-white', temp: '~1,800 K', outer: '#c7d9f7', core: '#f0f7ff' },
  { minDays: 100, name: 'Blue flame', temp: '~2,000 K', outer: '#3b82f6', core: '#bfdbfe' },
  { minDays: 180, name: 'Indigo flame', temp: '~2,400 K', outer: '#6366f1', core: '#c7d2fe' },
  { minDays: 365, name: 'Violet plasma', temp: '~3,000 K', outer: '#8b5cf6', core: '#ddd6fe' },
];

export function flameTier(streak: number): FlameTier {
  let tier = FLAME_TIERS[0];
  for (const t of FLAME_TIERS) if (streak >= t.minDays) tier = t;
  return tier;
}

/** The tier after the current one, or undefined at Violet plasma. */
export function nextFlameTier(streak: number): FlameTier | undefined {
  return FLAME_TIERS.find((t) => t.minDays > streak);
}

/**
 * Daily-intensity checkpoints (reviews + deck reads in one day). Dense in the
 * 1–40 range where real study days live — the 30-review daily goal sits on a
 * checkpoint — then sparse, since past ~40 volume stops being fun or useful.
 */
export const INTENSITY_CHECKPOINTS = [1, 5, 10, 20, 30, 40, 60, 100];

/**
 * Map a day's activity count to 0–1 with diminishing returns (sqrt), capped at
 * 100 — the flame brightens fast early in a session and saturates late, so
 * grinding far past the goal isn't over-rewarded.
 */
export function intensityLevel(count: number): number {
  return Math.sqrt(Math.min(count, 100) / 100);
}

/** The highest checkpoint newly crossed going from `before` to `after` reviews. */
export function crossedCheckpoint(before: number, after: number): number | undefined {
  return [...INTENSITY_CHECKPOINTS].reverse().find((c) => before < c && after >= c);
}

/** Activity count for a day: reviews plus full-deck reads (a read counts as 1). */
export function dayIntensity(stats: Stats, key: string = dayKey()): number {
  return (stats.reviewsByDay[key] ?? 0) + (stats.readsByDay[key]?.length ?? 0);
}

/**
 * The streak as it stood on a given day — consecutive active days ending
 * there. History views use this so each day's flame keeps the color it
 * actually burned at, instead of being repainted by the current streak.
 */
export function streakOnDay(stats: Stats, key: string): number {
  let streak = 0;
  const d = new Date(`${key}T00:00:00`);
  let k = key;
  while (dayIntensity(stats, k) > 0) {
    streak++;
    d.setDate(d.getDate() - 1);
    k = dayKey(d);
    if (streak > 3660) break; // sanity cap: ten years of unbroken streak
  }
  return streak;
}
