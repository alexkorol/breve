export type CardType = 'mcq' | 'flash' | 'fill';

interface BaseCard {
  id: string;
  type: CardType;
  /** Optional code snippet shown in a monospace block. */
  code?: string;
}

/** Multiple choice question. `answer` indexes into `choices`. */
export interface McqCard extends BaseCard {
  type: 'mcq';
  prompt: string;
  choices: string[];
  answer: number;
  explanation?: string;
}

/** Flip-style recall card, graded missed/got-it (plus a too-easy fast track). */
export interface FlashCard extends BaseCard {
  type: 'flash';
  front: string;
  back: string;
}

/**
 * Code with a `____` blank, answered by tapping a token chip
 * (Codecademy Go-style) rather than typing.
 */
export interface FillCard extends BaseCard {
  type: 'fill';
  prompt: string;
  code: string;
  /** Accepted answers; the first one is shown in the chip bank. */
  answers: string[];
  /** Wrong tokens mixed into the chip bank. */
  distractors: string[];
  explanation?: string;
}

export type Card = McqCard | FlashCard | FillCard;

export interface Deck {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  /** Curriculum section this deck belongs to, e.g. "Coding Interview". */
  track: string;
  /** True for user-imported decks (stored locally, removable). */
  custom?: boolean;
  cards: Card[];
}

/** SM-2-style scheduling state for one card. */
export interface CardProgress {
  ease: number;
  /** Current interval in days; 0 means learning/relearning. */
  interval: number;
  /** Epoch ms when the card is next due. */
  due: number;
  reps: number;
  lapses: number;
  /** Last recall-mode grade (0-100), when the card was answered from memory. */
  recall?: number;
}

export interface Stats {
  streak: number;
  /** Local date key (YYYY-MM-DD) of the last day with at least one review. */
  lastStudyDay: string;
  totalReviews: number;
  reviewsByDay: Record<string, number>;
  /** Deck ids fully read per day; each read counts as 1 toward daily intensity. */
  readsByDay: Record<string, string[]>;
}

export interface AppState {
  progress: Record<string, CardProgress>;
  stats: Stats;
}
