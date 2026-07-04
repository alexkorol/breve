import type { AppState, Deck } from '../types';
import { isMastered } from '../srs';
import { deckCounts } from '../session';
import { dayKey } from '../storage';

interface Props {
  decks: Deck[];
  state: AppState;
  onOpenDeck: (deckId: string) => void;
}

export function Home({ decks, state, onOpenDeck }: Props) {
  const today = dayKey();
  const reviewsToday = state.stats.reviewsByDay[today] ?? 0;
  const totalCards = decks.reduce((n, d) => n + d.cards.length, 0);
  const mastered = decks.reduce(
    (n, d) => n + d.cards.filter((c) => isMastered(state.progress[c.id])).length,
    0,
  );

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

      {(() => {
        // "Up next" hero (Codecademy Go "Today" pattern): the deck with the
        // most due cards, falling back to the most unseen ones.
        const ranked = decks
          .map((d) => ({ deck: d, counts: deckCounts(d, state.progress) }))
          .filter(({ counts }) => counts.due + counts.fresh > 0)
          .sort(
            (a, b) =>
              b.counts.due - a.counts.due || b.counts.fresh - a.counts.fresh,
          );
        const next = ranked[0];
        if (!next) return null;
        const ready = Math.min(next.counts.due, 30) + Math.min(next.counts.fresh, 8);
        return (
          <div className="up-next" style={{ ['--deck-color' as string]: next.deck.color }}>
            <span className="up-next-label">Up next</span>
            <div className="up-next-body">
              <span className="deck-icon">{next.deck.icon}</span>
              <div>
                <h3>{next.deck.title}</h3>
                <p>
                  {ready} card{ready === 1 ? '' : 's'} ready · ~{Math.max(1, Math.round(ready / 3))} min
                </p>
              </div>
            </div>
            <button className="btn primary block" onClick={() => onOpenDeck(next.deck.id)}>
              Start practice
            </button>
          </div>
        );
      })()}

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
