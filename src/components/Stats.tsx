import type { AppState, Card, Deck } from '../types';
import { isMastered } from '../srs';
import { DAILY_GOAL } from '../session';
import { dayKey } from '../storage';

interface Props {
  decks: Deck[];
  state: AppState;
  onPracticeWeak: () => void;
  onBack: () => void;
}

function lastNDays(n: number): { key: string; label: string }[] {
  const days: { key: string; label: string }[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({ key: dayKey(d), label: 'SMTWTFS'[d.getDay()] });
  }
  return days;
}

function cardTitle(card: Card): string {
  const text = card.type === 'flash' ? card.front : card.prompt;
  return text.length > 64 ? `${text.slice(0, 64)}…` : text;
}

export function Stats({ decks, state, onPracticeWeak, onBack }: Props) {
  const days = lastNDays(14);
  const counts = days.map((d) => state.stats.reviewsByDay[d.key] ?? 0);
  const max = Math.max(DAILY_GOAL, ...counts);

  const tracks = [...new Set(decks.map((d) => d.track))];

  // Cards with 2+ lapses, worst first — the personal trouble list.
  const cardIndex = new Map<string, { card: Card; deck: Deck }>();
  for (const deck of decks) for (const card of deck.cards) cardIndex.set(card.id, { card, deck });
  const weak = Object.entries(state.progress)
    .filter(([id, p]) => p.lapses >= 2 && cardIndex.has(id))
    .sort((a, b) => b[1].lapses - a[1].lapses)
    .slice(0, 10)
    .map(([id, p]) => ({ ...cardIndex.get(id)!, lapses: p.lapses }));

  return (
    <div className="screen">
      <header className="detail-header">
        <button className="icon-btn" onClick={onBack} aria-label="Back">
          ←
        </button>
        <span className="detail-track">Your stats</span>
      </header>

      <div className="stat-strip">
        <div className="stat">
          <strong>🔥 {state.stats.streak}</strong>
          <span>day streak</span>
        </div>
        <div className="stat">
          <strong>{state.stats.totalReviews}</strong>
          <span>all-time reviews</span>
        </div>
        <div className="stat">
          <strong>
            {decks.reduce(
              (n, d) => n + d.cards.filter((c) => isMastered(state.progress[c.id])).length,
              0,
            )}
          </strong>
          <span>mastered</span>
        </div>
      </div>

      <section className="stats-section">
        <h3>Last 14 days</h3>
        <div className="bar-chart" role="img" aria-label="Reviews per day, last 14 days">
          {days.map((d, i) => (
            <div key={d.key} className="bar-col">
              <div
                className={`bar ${counts[i] >= DAILY_GOAL ? 'goal' : ''}`}
                style={{ height: `${Math.max(4, (counts[i] / max) * 72)}px` }}
                title={`${d.key}: ${counts[i]}`}
              />
              <span className="bar-label">{d.label}</span>
            </div>
          ))}
        </div>
        <p className="chart-note">Teal bars hit the {DAILY_GOAL}-review daily goal.</p>
      </section>

      <section className="stats-section">
        <h3>Mastery by track</h3>
        {tracks.map((track) => {
          const cards = decks.filter((d) => d.track === track).flatMap((d) => d.cards);
          const mastered = cards.filter((c) => isMastered(state.progress[c.id])).length;
          const seen = cards.filter((c) => state.progress[c.id]).length;
          return (
            <div key={track} className="track-mastery">
              <div className="track-mastery-head">
                <span>{track}</span>
                <span className="track-mastery-nums">
                  {mastered}/{cards.length}
                </span>
              </div>
              <div className="deck-progress">
                <div className="deck-progress-fill seen" style={{ width: `${(seen / cards.length) * 100}%` }} />
                <div
                  className="deck-progress-fill"
                  style={{ width: `${(mastered / cards.length) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
        <p className="chart-note">Dim = seen, bright = mastered (21-day interval).</p>
      </section>

      <section className="stats-section">
        <h3>Toughest cards</h3>
        {weak.length === 0 ? (
          <p className="chart-note">
            Nothing here yet — cards you miss twice or more will show up for targeted practice.
          </p>
        ) : (
          <>
            <div className="weak-list">
              {weak.map(({ card, deck, lapses }) => (
                <div key={card.id} className="weak-item">
                  <span className="weak-icon">{deck.icon}</span>
                  <span className="weak-text">{cardTitle(card)}</span>
                  <span className="weak-count">×{lapses}</span>
                </div>
              ))}
            </div>
            <button className="btn primary block" onClick={onPracticeWeak}>
              Practice weak cards
            </button>
          </>
        )}
      </section>
    </div>
  );
}
