import type { AppState, Deck } from '../types';
import { isMastered } from '../srs';
import { deckCounts } from '../session';
import { dayKey } from '../storage';
import { DAILY_REVIEW_ID } from '../data';

/** Reviews per day to stay on a ~3-month mastery pace. */
export const DAILY_GOAL = 30;

interface Props {
  decks: Deck[];
  state: AppState;
  onOpenDeck: (deckId: string) => void;
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

export function Home({ decks, state, onOpenDeck }: Props) {
  const today = dayKey();
  const reviewsToday = state.stats.reviewsByDay[today] ?? 0;
  const totalCards = decks.reduce((n, d) => n + d.cards.length, 0);
  const mastered = decks.reduce(
    (n, d) => n + d.cards.filter((c) => isMastered(state.progress[c.id])).length,
    0,
  );

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

  return (
    <div className="screen">
      <header className="home-header">
        <div className="brand">
          <img className="brand-logo" src="./logo.png" alt="" />
          <h1>Breve</h1>
        </div>
        <div className="streak" title="Day streak">
          🔥 {state.stats.streak}
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

      {[...new Set(decks.map((d) => d.track))].map((track) => (
        <section key={track} className="track">
          <h2 className="track-title">{track}</h2>
          <div className="deck-list">
            {decks
              .filter((d) => d.track === track)
              .map((deck) => {
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
        </section>
      ))}

      <p className="footnote">
        Progress is saved on this device. Come back daily to keep the streak — cards you
        struggle with return sooner.
      </p>
    </div>
  );
}
