import type { AppState, Card, CardProgress, Deck } from '../types';
import { isMastered } from '../srs';
import { DAILY_GOAL } from '../session';
import { dayKey, downloadText } from '../storage';
import {
  FLAME_TIERS,
  INTENSITY_CHECKPOINTS,
  dayIntensity,
  flameTier,
  intensityLevel,
  nextFlameTier,
} from '../flame';
import { Flame } from './Flame';

/**
 * Readiness per track: how prepared you'd be if this topic came up tomorrow.
 * Base = retention (mastered 70%, seen 30%); recall-mode grades, when present,
 * blend in as direct evidence of production ability.
 */
export function trackReadiness(cards: Card[], progress: Record<string, CardProgress>): number {
  if (cards.length === 0) return 0;
  const entries = cards.map((c) => progress[c.id]).filter(Boolean) as CardProgress[];
  const masteredFrac = cards.filter((c) => isMastered(progress[c.id])).length / cards.length;
  const seenFrac = entries.length / cards.length;
  const base = 70 * masteredFrac + 30 * seenFrac;
  const recalls = entries.map((p) => p.recall).filter((r): r is number => r !== undefined);
  if (recalls.length === 0) return Math.round(base);
  const avgRecall = recalls.reduce((a, b) => a + b, 0) / recalls.length;
  return Math.round(0.6 * base + 0.4 * avgRecall);
}

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

/** Weekly review totals for the last 13 weeks (≈ the 90-day plan). */
function weeklyCounts(state: AppState): { label: string; count: number }[] {
  const weeks: { label: string; count: number }[] = [];
  const monday = new Date();
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  for (let w = 12; w >= 0; w--) {
    const start = new Date(monday);
    start.setDate(monday.getDate() - w * 7);
    let count = 0;
    for (let d = 0; d < 7; d++) {
      const day = new Date(start);
      day.setDate(start.getDate() + d);
      count += state.stats.reviewsByDay[dayKey(day)] ?? 0;
    }
    weeks.push({ label: `${start.getMonth() + 1}/${start.getDate()}`, count });
  }
  return weeks;
}

function exportReport(decks: Deck[], state: AppState): void {
  const tracks = [...new Set(decks.map((d) => d.track))];
  const lines = [
    `# Breve readiness report — ${dayKey()}`,
    '',
    `- Streak: ${state.stats.streak} days · Total reviews: ${state.stats.totalReviews}`,
    '',
    '| Track | Readiness | Mastered | Seen | Cards |',
    '|---|---|---|---|---|',
  ];
  for (const track of tracks) {
    const cards = decks.filter((d) => d.track === track).flatMap((d) => d.cards);
    const mastered = cards.filter((c) => isMastered(state.progress[c.id])).length;
    const seen = cards.filter((c) => state.progress[c.id]).length;
    lines.push(
      `| ${track} | ${trackReadiness(cards, state.progress)}% | ${mastered} | ${seen} | ${cards.length} |`,
    );
  }
  const cardIndex = new Map<string, Card>();
  for (const d of decks) for (const c of d.cards) cardIndex.set(c.id, c);
  const weak = Object.entries(state.progress)
    .filter(([id, p]) => p.lapses >= 2 && cardIndex.has(id))
    .sort((a, b) => b[1].lapses - a[1].lapses)
    .slice(0, 10);
  if (weak.length > 0) {
    lines.push('', '## Toughest cards', '');
    for (const [id, p] of weak) lines.push(`- (×${p.lapses}) ${cardTitle(cardIndex.get(id)!)}`);
  }
  lines.push('', '_Readiness = 70% mastery + 30% coverage, blended 60/40 with recall-mode grades where present._');
  downloadText(`breve-readiness-${dayKey()}.md`, lines.join('\n'), 'text/markdown');
}

export function Stats({ decks, state, onPracticeWeak, onBack }: Props) {
  const days = lastNDays(14);

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
          <strong>
            <Flame streak={state.stats.streak} intensity={dayIntensity(state.stats)} />{' '}
            {state.stats.streak}
          </strong>
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
        <h3>Your flame</h3>
        {(() => {
          const streak = state.stats.streak;
          const today = dayIntensity(state.stats);
          const tier = flameTier(streak);
          const next = nextFlameTier(streak);
          return (
            <>
              <div className="flame-current">
                <Flame streak={streak} intensity={today} size={40} />
                <div>
                  <strong>{tier.name}</strong>
                  <span className="flame-temp">
                    {streak > 0 ? `burning at ${tier.temp}` : 'study today to light it'}
                  </span>
                </div>
              </div>
              <h4 className="flame-subhead">Streak — color</h4>
              <div className="flame-ladder">
                {FLAME_TIERS.slice(1).map((t) => (
                  <div key={t.name} className={`flame-rung ${streak >= t.minDays ? 'reached' : ''}`}>
                    <Flame streak={t.minDays} size={18} />
                    <span className="flame-rung-days">{t.minDays}</span>
                  </div>
                ))}
              </div>
              <p className="chart-note">
                {next
                  ? `The flame burns hotter the longer the streak — ${next.name} (${next.temp}) at ${next.minDays === 1 ? '1 day' : `${next.minDays} days`}, ${next.minDays - streak} to go.`
                  : 'Hottest tier reached — the flame doesn’t get hotter than this.'}
              </p>
              <h4 className="flame-subhead">Today’s intensity — size &amp; glow</h4>
              <div className="flame-ladder intensity">
                {INTENSITY_CHECKPOINTS.map((c) => (
                  <div key={c} className={`flame-rung ${today >= c ? 'reached' : ''}`}>
                    <Flame
                      streak={streak || 1}
                      intensity={c}
                      size={12 + Math.round(14 * intensityLevel(c))}
                    />
                    <span className="flame-rung-days">{c}</span>
                  </div>
                ))}
              </div>
              <p className="chart-note">
                {today} today ({state.stats.reviewsByDay[dayKey()] ?? 0} answered
                {(state.stats.readsByDay[dayKey()]?.length ?? 0) > 0
                  ? ` + ${state.stats.readsByDay[dayKey()]!.length} decks read`
                  : ''}
                ) — the more you practice in a day, the bigger and brighter the flame blooms.
              </p>
            </>
          );
        })()}
      </section>

      <section className="stats-section">
        <h3>Last 14 days</h3>
        <div className="flame-graph" role="img" aria-label="Study intensity per day, last 14 days">
          {days.map((d) => {
            const n = dayIntensity(state.stats, d.key);
            return (
              <div key={d.key} className={`bar-col ${n >= DAILY_GOAL ? 'goal-day' : ''}`}>
                <span className="flame-graph-slot" title={`${d.key}: ${n}`}>
                  <Flame
                    streak={n > 0 ? state.stats.streak || 1 : 0}
                    intensity={n}
                    size={12 + Math.round(22 * intensityLevel(n))}
                  />
                </span>
                <span className="bar-label">{d.label}</span>
              </div>
            );
          })}
        </div>
        <p className="chart-note">
          Bigger, brighter flames = more intense days. Underlined days hit the {DAILY_GOAL}-review
          goal.
        </p>
      </section>

      <section className="stats-section">
        <h3>Readiness by track</h3>
        {tracks.map((track) => {
          const cards = decks.filter((d) => d.track === track).flatMap((d) => d.cards);
          const readiness = trackReadiness(cards, state.progress);
          const mastered = cards.filter((c) => isMastered(state.progress[c.id])).length;
          const seen = cards.filter((c) => state.progress[c.id]).length;
          return (
            <div key={track} className="track-mastery">
              <div className="track-mastery-head">
                <span>{track}</span>
                <span className="track-mastery-nums">
                  {readiness}% · {mastered}/{cards.length} mastered
                </span>
              </div>
              <div className="deck-progress">
                <div className="deck-progress-fill seen" style={{ width: `${(seen / cards.length) * 100}%` }} />
                <div
                  className="deck-progress-fill"
                  style={{ width: `${readiness}%` }}
                />
              </div>
            </div>
          );
        })}
        <p className="chart-note">
          Readiness blends retention (mastery) with recall-mode grades where you’ve
          practiced answering from memory. Dim bar = cards seen.
        </p>
        <button className="btn ghost block" onClick={() => exportReport(decks, state)}>
          Export readiness report (.md)
        </button>
      </section>

      <section className="stats-section">
        <h3>Last 13 weeks</h3>
        <div className="bar-chart" role="img" aria-label="Reviews per week, last 13 weeks">
          {weeklyCounts(state).map((w, i) => (
            <div key={i} className="bar-col">
              <div
                className={`bar ${w.count >= DAILY_GOAL * 5 ? 'goal' : ''}`}
                style={{ height: `${Math.max(4, (w.count / Math.max(DAILY_GOAL * 7, ...weeklyCounts(state).map((x) => x.count))) * 72)}px` }}
                title={`week of ${w.label}: ${w.count}`}
              />
              <span className="bar-label">{i === 0 || i === 12 ? w.label : ''}</span>
            </div>
          ))}
        </div>
        <p className="chart-note">
          Review volume across the 90-day plan. Teal weeks hit 5+ goal-days of volume.
        </p>
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
