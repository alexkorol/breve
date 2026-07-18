import { useRef, useState } from 'react';
import type { AppState, CardProgress, Deck } from '../types';
import { isMastered } from '../srs';
import { deckCounts, DAILY_GOAL } from '../session';
import { dayKey, exportState, parseDeckFile, daysSinceBackup } from '../storage';
import { DAILY_REVIEW_ID } from '../data';
import { pickFocus, loadFocusReroll, saveFocusReroll } from '../focus';

const TRACKS_KEY = 'breve:ui:tracks';

interface Props {
  decks: Deck[];
  state: AppState;
  shareNotice: string;
  pendingShared: Deck | null;
  onAcceptShared: () => void;
  onDismissShared: () => void;
  onOpenDeck: (deckId: string) => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
  onOpenGenerate: () => void;
  onOpenPostmortem: () => void;
  onAddDeck: (deck: Deck) => void;
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

function DeckCard({
  deck,
  progress,
  onOpen,
}: {
  deck: Deck;
  progress: Record<string, CardProgress>;
  onOpen: (deckId: string) => void;
}) {
  const { due, fresh } = deckCounts(deck, progress);
  const seen = deck.cards.filter((c) => progress[c.id]).length;
  const pct = Math.round((seen / deck.cards.length) * 100);
  const ready = due + fresh > 0;
  return (
    <button
      className="deck-card"
      style={{ ['--deck-color' as string]: deck.color }}
      onClick={() => onOpen(deck.id)}
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

export function Home({
  decks,
  state,
  shareNotice,
  pendingShared,
  onAcceptShared,
  onDismissShared,
  onOpenDeck,
  onOpenStats,
  onOpenSettings,
  onOpenGenerate,
  onOpenPostmortem,
  onAddDeck,
}: Props) {
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
  const deckInput = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState('');
  const [focusReroll, setFocusReroll] = useState(() => loadFocusReroll(today));
  const focusDecks = pickFocus(decks, state.progress, today, focusReroll);
  const rerollFocus = () => {
    const next = focusReroll + 1;
    saveFocusReroll(today, next);
    setFocusReroll(next);
  };
  const backupAge = daysSinceBackup();
  const showBackupNudge = state.stats.totalReviews > 0 && backupAge > 7;

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
          <button className="streak stats-btn" onClick={onOpenSettings} title="Settings">
            ⚙️
          </button>
          <button className="streak stats-btn" onClick={onOpenStats} title="Your stats">
            📊
          </button>
          <button className="streak" onClick={onOpenStats} title="Day streak — tap for stats">
            🔥 {state.stats.streak}
          </button>
        </div>
      </header>

      {pendingShared && (
        <div className="share-notice share-confirm">
          <p>
            Someone shared <strong>{pendingShared.icon} {pendingShared.title}</strong> (
            {pendingShared.cards.length} cards) with you.
          </p>
          <div className="share-confirm-actions">
            <button className="btn primary" onClick={onAcceptShared}>
              Add deck
            </button>
            <button className="btn ghost" onClick={onDismissShared}>
              No thanks
            </button>
          </div>
        </div>
      )}
      {shareNotice && !pendingShared && <p className="share-notice">{shareNotice}</p>}
      {showBackupNudge && (
        <button className="backup-nudge" onClick={() => exportState(state)}>
          ⚠️ It’s been {backupAge === Infinity ? 'a while' : `${backupAge} days`} since your
          last backup — tap to export your progress.
        </button>
      )}

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

      {focusDecks.length > 0 && (
        <section className="track focus-track">
          <div className="track-header focus-header">
            <span className="track-name">🎯 Today’s focus</span>
            <button className="link-btn" onClick={rerollFocus} title="Swap the suggested decks">
              ↻ reroll
            </button>
          </div>
          <div className="deck-list">
            {focusDecks.map((deck) => (
              <DeckCard key={deck.id} deck={deck} progress={state.progress} onOpen={onOpenDeck} />
            ))}
          </div>
        </section>
      )}

      <div className="ai-actions">
        <button className="ai-action" onClick={onOpenGenerate}>
          <span>✨</span> New deck from anything
        </button>
        <button className="ai-action" onClick={onOpenPostmortem}>
          <span>📝</span> Interview postmortem
        </button>
      </div>

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
                {trackDecks.map((deck) => (
                  <DeckCard
                    key={deck.id}
                    deck={deck}
                    progress={state.progress}
                    onOpen={onOpenDeck}
                  />
                ))}
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
        <button className="link-btn" onClick={() => deckInput.current?.click()}>
          Add deck file
        </button>
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
        Progress is saved on this device — back it up from Settings. Tap a deck to practice
        or read its study cards.
      </p>
    </div>
  );
}
