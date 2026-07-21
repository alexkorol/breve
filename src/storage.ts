import type { AppState, Card, Deck } from './types';

const KEY = 'breve:v1';
const DECKS_KEY = 'breve:decks';

function emptyState(): AppState {
  return {
    progress: {},
    stats: { streak: 0, lastStudyDay: '', totalReviews: 0, reviewsByDay: {}, readsByDay: {} },
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

/** User-imported decks, persisted locally alongside progress. */
export function loadCustomDecks(): Deck[] {
  try {
    const raw = localStorage.getItem(DECKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Deck[]) : [];
  } catch {
    return [];
  }
}

export function saveCustomDecks(decks: Deck[]): void {
  try {
    localStorage.setItem(DECKS_KEY, JSON.stringify(decks));
  } catch {
    // storage full — import will appear to succeed but not persist; acceptable edge
  }
}

export function isValidCard(c: unknown): c is Card {
  return validCard(c);
}

function validCard(c: unknown): c is Card {
  if (!c || typeof c !== 'object') return false;
  const card = c as Record<string, unknown>;
  if (typeof card.id !== 'string' || !card.id) return false;
  if (card.type === 'flash') {
    return typeof card.front === 'string' && typeof card.back === 'string';
  }
  if (card.type === 'mcq') {
    return (
      typeof card.prompt === 'string' &&
      Array.isArray(card.choices) &&
      card.choices.length >= 2 &&
      typeof card.answer === 'number' &&
      card.answer >= 0 &&
      card.answer < card.choices.length
    );
  }
  if (card.type === 'fill') {
    return (
      typeof card.prompt === 'string' &&
      typeof card.code === 'string' &&
      (card.code as string).includes('____') &&
      Array.isArray(card.answers) &&
      card.answers.length > 0 &&
      Array.isArray(card.distractors)
    );
  }
  if (card.type === 'tf') {
    return typeof card.prompt === 'string' && typeof card.answer === 'boolean';
  }
  if (card.type === 'order') {
    return (
      typeof card.prompt === 'string' &&
      Array.isArray(card.items) &&
      card.items.length >= 2 &&
      (card.items as unknown[]).every((i) => typeof i === 'string')
    );
  }
  return false;
}

/**
 * Parse and validate a deck JSON file. Throws with a human-readable
 * message on any problem, including id collisions with existing decks.
 */
export function parseDeckFile(text: string, existing: Deck[]): Deck {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('Not valid JSON.');
  }
  const d = parsed as Record<string, unknown>;
  if (!d || typeof d !== 'object' || typeof d.id !== 'string' || !d.id) {
    throw new Error('Deck needs a string "id".');
  }
  if (typeof d.title !== 'string' || !d.title) throw new Error('Deck needs a "title".');
  if (!Array.isArray(d.cards) || d.cards.length === 0) {
    throw new Error('Deck needs a non-empty "cards" array.');
  }
  if (existing.some((e) => e.id === d.id)) {
    throw new Error(`A deck with id "${d.id}" already exists.`);
  }
  const bad = (d.cards as unknown[]).findIndex((c) => !validCard(c));
  if (bad !== -1) throw new Error(`Card ${bad + 1} is malformed (check id, type, and fields).`);
  const ids = new Set((d.cards as Card[]).map((c) => c.id));
  if (ids.size !== d.cards.length) throw new Error('Card ids must be unique within the deck.');
  const existingCardIds = new Set(existing.flatMap((e) => e.cards.map((c) => c.id)));
  const clash = (d.cards as Card[]).find((c) => existingCardIds.has(c.id));
  if (clash) throw new Error(`Card id "${clash.id}" collides with an existing card.`);

  return {
    id: d.id,
    title: d.title,
    description: typeof d.description === 'string' ? d.description : '',
    icon: typeof d.icon === 'string' && d.icon ? d.icon : '📦',
    color: typeof d.color === 'string' && d.color ? d.color : '#8b949e',
    track: typeof d.track === 'string' && d.track ? d.track : 'Imported',
    custom: true,
    cards: d.cards as Card[],
  };
}

/** Simple persisted UI/config values ("breve:<name>"). */
export function getSetting(name: string): string {
  try {
    return localStorage.getItem(`breve:${name}`) ?? '';
  } catch {
    return '';
  }
}

export function setSetting(name: string, value: string): void {
  try {
    if (value) localStorage.setItem(`breve:${name}`, value);
    else localStorage.removeItem(`breve:${name}`);
  } catch {
    // non-fatal
  }
}

/** Download current progress as a JSON file (backup / device migration). */
export function exportState(state: AppState): void {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `breve-progress-${dayKey()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  setSetting('lastBackup', dayKey());
}

/** Download any text file (deck exports, readiness reports). */
export function downloadText(filename: string, text: string, type = 'application/json'): void {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Days since the last manual backup, or Infinity if never backed up. */
export function daysSinceBackup(): number {
  const last = getSetting('lastBackup');
  if (!last) return Infinity;
  const then = new Date(last).getTime();
  return Math.floor((Date.now() - then) / 86400000);
}

/** Parse an exported progress file; throws on anything malformed. */
export async function importStateFile(file: File): Promise<AppState> {
  const parsed = JSON.parse(await file.text()) as Partial<AppState>;
  if (!parsed || typeof parsed !== 'object' || typeof parsed.progress !== 'object') {
    throw new Error('Not a Breve progress file');
  }
  const base = { progress: {}, stats: { streak: 0, lastStudyDay: '', totalReviews: 0, reviewsByDay: {}, readsByDay: {} } };
  return {
    progress: parsed.progress ?? {},
    stats: { ...base.stats, ...parsed.stats },
  };
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
