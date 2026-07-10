import { useRef, useState } from 'react';
import type { AppState, Deck } from '../types';
import { isMastered } from '../srs';
import { deckCounts, DAILY_GOAL } from '../session';
import { dayKey, exportState, importStateFile, parseDeckFile } from '../storage';
import { DAILY_REVIEW_ID } from '../data';

const TRACKS_KEY = 'breve:ui:tracks';

interface Props {
  decks: Deck[];
  state: AppState;
  onOpenDeck: (deckId: string) => void;
  onOpenStats: () => void;
  onImport: (state: AppState) => void;
  onAddDeck: (deck: Deck) => void;
}

/** Mon–Sun dots for the current week; filled when that day had reviews. */
function WeekDots({ reviewsByDay }: { reviewsByDay: Record<string, number> }) {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const todayKey = dayKey(now);
  return (
    <div className="week-dots" aria-label="Days practiced this week">
      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((label, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const key = dayKey(d);
        const didPractice = (reviewsByDay[key] ?? 0) > 0;
        const isToday = key === todayKey;
        const isFuture = d > now && !isToday;
        return (
          <div key={i} className={`week-dot ${didPractice ? 'hit' : ''} ${isToday ? 'today' : ''} ${isFuture ? 'future' : ''}`}>
            <span className="week-dot-circle">{didPractice ? '✓' : ''}</span>
            <span className="week-dot-label">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

function GoalRing({ value, goal }: { value: number; goal: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const frac = Math.min(1, value / goal);
  return (
    <svg className="ring" viewBox="0 0 64 64" role="img" aria-label={`${value} of ${goal} daily reviews`}>
      <circle className="ring-track" cx="32" cy="32" r={r} />
      <circle
        className="ring-fill"
        cx="32"
        cy="32"
        r={r}
        strokeDasharray={c}
        strokeDashoffset={c * (1 - frac)}
        transform="rotate(-90 32 32)"
      />
      <text className="ring-num" x="32" y="31">
        {value}
      </text>
      <text className="ring-goal" x="32" y="44">
        /{goal}
      </text>
    </svg>
  );
}

function loadOpenTracks(firstTrack: string): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(TRACKS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fall through to default
  }
  return { [firstTrack]: true };
}

export function Home({ decks, state, onOpenDeck, onOpenStats, onImport, onAddDeck }: Props) {
  const today = dayKey();
  const reviewsToday = state.stats.reviewsByDay[today] ?? 0;
  const totalCards = decks.reduce((n, d) => n + d.cards.length, 0);
  const mastered = decks.reduce(
    (n, d) => n + d.cards.filter((c) => isMastered(state.progress[c.id])).length,
    0,
  );

  const tracks = [...new Set(decks.map((d) => d.track))];
  const [openTracks, setOpenTracks] = useState<Record<string, boolean>>(() =>
    loadOpenTracks(tracks[0]),
  );
  const fileInput = useRef<HTMLInputElement>(null);
  const deckInput = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState('');

  const toggleTrack = (track: string) => {
    setOpenTracks((prev) => {
      const next = { ...prev, [track]: !prev[track] };
      try {
        localStorage.setItem(TRACKS_KEY, JSON.stringify(next));
      } catch {
        // non-fatal
      }
      return next;
    });
  };

  const totals = decks.reduce(
    (acc, d) => {
      const c = deckCounts(d, state.progress);
      acc.due += c.due;
      acc.fresh += c.fresh;
      return acc;
    },
    { due: 0, fresh: 0 },
  );
  const freshest = [...decks].sort(
    (a, b) => deckCounts(b, state.progress).fresh - deckCounts(a, state.progress).fresh,
  )[0];
  const freshestCount = freshest ? deckCounts(freshest, state.progress).fresh : 0;

  const handleImport = async (file: File | undefined) => {
    if (!file) return;
    try {
      onImport(await importStateFile(file));
      setImportError('');
    } catch {
      setImportError('That file doesn’t look like a Breve progress export.');
    }
  };

  const handleDeckImport = async (file: File | undefined) => {
    if (!file) return;
    try {
      onAddDeck(parseDeckFile(await file.text(), decks));
      setImportError('');
    } catch (e) {
      setImportError(`Deck import failed: ${e instanceof Error ? e.message : 'unknown error'}`);
    }
  };

  return (
    <div className="screen">
      <header className="home-header">
        <div className="brand">
          <img className="brand-logo" src="./logo.png" alt="" />
          <h1>Breve</h1>
        </div>
        <div className="header-actions">
          <button className="streak stats-btn" onClick={onOpenStats} title="Your stats">
            📊
          </button>
          <button className="streak" onClick={onOpenStats} title="Day streak — tap for stats">
            🔥 {state.stats.streak}
          </button>
        </div>
      </header>

      <div className="today-card">
        <GoalRing value={reviewsToday} goal={DAILY_GOAL} />
        <div className="today-info">
          {totals.due > 0 ? (
            <>
              <h3>Daily review</h3>
              <p>
                {totals.due} card{totals.due === 1 ? '' : 's'} due across your decks
              </p>
              <button className="btn primary" onClick={() => onOpenDeck(DAILY_REVIEW_ID)}>
                Review now
              </button>
            </>
          ) : freshestCount > 0 ? (
            <>
              <h3>Learn something new</h3>
              <p>
                {freshest.icon} {freshest.title} · {freshestCount} new
              </p>
              <button className="btn primary" onClick={() => onOpenDeck(freshest.id)}>
                Start learning
              </button>
            </>
          ) : (
            <>
              <h3>All caught up 🎉</h3>
              <p>Nothing due — come back tomorrow to keep the streak.</p>
            </>
          )}
        </div>
      </div>

      <WeekDots reviewsByDay={state.stats.reviewsByDay} />

      <div className="stat-strip">
        <div className="stat">
          <strong>{reviewsToday}</strong>
          <span>today</span>
        </div>
        <div className="stat">
          <strong>{state.stats.totalReviews}</strong>
          <span>all time</span>
        </div>
        <div className="stat">
          <strong>
            {mastered}/{totalCards}
          </strong>
          <span>mastered</span>
        </div>
      </div>

      {tracks.map((track) => {
        const trackDecks = decks.filter((d) => d.track === track);
        const trackTotals = trackDecks.reduce(
          (acc, d) => {
            const c = deckCounts(d, state.progress);
            acc.due += c.due;
            acc.fresh += c.fresh;
            return acc;
          },
          { due: 0, fresh: 0 },
        );
        const open = !!openTracks[track];
        return (
          <section key={track} className="track">
            <button className="track-header" onClick={() => toggleTrack(track)}>
              <span className={`chevron ${open ? 'open' : ''}`}>›</span>
              <span className="track-name">{track}</span>
              <span className="track-meta">
                {trackTotals.due > 0 && <span className="badge due">{trackTotals.due} due</span>}
                {trackTotals.fresh > 0 && (
                  <span className="badge fresh">{trackTotals.fresh} new</span>
                )}
                <span className="track-count">{trackDecks.length} decks</span>
              </span>
            </button>
            {open && (
              <div className="deck-list">
                {trackDecks.map((deck) => {
                  const { due, fresh } = deckCounts(deck, state.progress);
                  const seen = deck.cards.filter((c) => state.progress[c.id]).length;
                  const pct = Math.round((seen / deck.cards.length) * 100);
                  const ready = due + fresh > 0;
                  return (
                    <button
                      key={deck.id}
                      className="deck-card"
                      style={{ ['--deck-color' as string]: deck.color }}
                      onClick={() => onOpenDeck(deck.id)}
                    >
                      <div className="deck-icon">{deck.icon}</div>
                      <div className="deck-info">
                        <h3>{deck.title}</h3>
                        <p>{deck.description}</p>
                        <div className="deck-progress">
                          <div className="deck-progress-fill" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <div className="deck-badges">
                        {due > 0 && <span className="badge due">{due} due</span>}
                        {fresh > 0 && <span className="badge fresh">{fresh} new</span>}
                        {!ready && <span className="badge done">✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}

      <div className="data-row">
        <button className="link-btn" onClick={() => exportState(state)}>
          Export progress
        </button>
        <span className="dot">·</span>
        <button className="link-btn" onClick={() => fileInput.current?.click()}>
          Import progress
        </button>
        <span className="dot">·</span>
        <button className="link-btn" onClick={() => deckInput.current?.click()}>
          Add deck
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json"
          hidden
          onChange={(e) => {
            void handleImport(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
        <input
          ref={deckInput}
          type="file"
          accept="application/json"
          hidden
          onChange={(e) => {
            void handleDeckImport(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
      </div>
      {importError && <p className="import-error">{importError}</p>}

      <p className="footnote">
        Progress is saved on this device — export a backup any time. Tap a deck to practice
        or read its study cards.
      </p>
    </div>
  );
}
