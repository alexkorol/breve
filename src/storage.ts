import type { AppState } from './types';

const KEY = 'breve:v1';

function emptyState(): AppState {
  return {
    progress: {},
    stats: { streak: 0, lastStudyDay: '', totalReviews: 0, reviewsByDay: {} },
  };
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as Partial<AppState>;
    const base = emptyState();
    return {
      progress: parsed.progress ?? base.progress,
      stats: { ...base.stats, ...parsed.stats },
    };
  } catch {
    return emptyState();
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable (e.g. private browsing) — progress
    // simply won't persist; the app keeps working in memory.
  }
}

/** Local-timezone date key, e.g. "2026-07-03". */
export function dayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dayKey(d);
}
