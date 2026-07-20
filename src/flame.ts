/**
 * Physics-of-fire streak ladder: the flame's color tracks real combustion
 * temperature, so a longer streak literally burns hotter. Tier thresholds
 * follow the retention-critical milestones (1 / 7 / 30 / 100 / 365 days).
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
  { minDays: 1, name: 'Ember', temp: '~900 K', outer: '#e2451f', core: '#fb923c' },
  { minDays: 7, name: 'Golden flame', temp: '~1,300 K', outer: '#f59e0b', core: '#fde047' },
  { minDays: 30, name: 'White-hot', temp: '~1,600 K', outer: '#e8e6df', core: '#fffbeb' },
  { minDays: 100, name: 'Blue flame', temp: '~2,000 K', outer: '#3b82f6', core: '#bfdbfe' },
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
