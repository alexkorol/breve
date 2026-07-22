import { getSetting, setSetting, dayKey } from './storage';

/**
 * Interview-date countdown mode: the user picks a date and sessions pace the
 * introduction of new cards so the whole remaining corpus is seen before it,
 * leaving the last day as pure review. No scheduling internals are surfaced;
 * the user sees only "days left" and "new cards per day".
 */

export function getInterviewDate(): string {
  return getSetting('interviewDate');
}

export function setInterviewDate(date: string): void {
  setSetting('interviewDate', date);
}

/** Whole days from today to the interview date; null when unset. */
export function daysUntilInterview(now = new Date()): number | null {
  const d = getInterviewDate();
  if (!d) return null;
  const target = new Date(`${d}T00:00:00`).getTime();
  const today = new Date(`${dayKey(now)}T00:00:00`).getTime();
  return Math.round((target - today) / 86400000);
}

/** Floor so early pacing never makes sessions feel starved. */
const MIN_NEW_PER_DAY = 5;

/**
 * How many new cards today may introduce. Infinity when no date is set
 * (the pre-countdown behavior). The day before and the day of the interview
 * introduce nothing: they are for review.
 */
export function dailyNewBudget(totalUnseen: number, now = new Date()): number {
  const days = daysUntilInterview(now);
  if (days === null) return Infinity;
  if (days <= 1) return 0;
  return Math.max(MIN_NEW_PER_DAY, Math.ceil(totalUnseen / (days - 1)));
}
