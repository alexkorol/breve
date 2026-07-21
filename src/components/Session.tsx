import { useMemo, useState } from 'react';
import type { Card, CardProgress, Deck } from '../types';
import type { Grade } from '../srs';
import type { SessionOptions } from '../session';
import { buildSession, deckCounts, shuffle, DAILY_GOAL, PACK_SIZE } from '../session';
import { aiAvailable } from '../ai';
import { getSetting } from '../storage';
import { McqView } from './McqView';
import { FillView } from './FillView';
import { FlashView } from './FlashView';
import { RecallView } from './RecallView';
import { TfView } from './TfView';
import { OrderView } from './OrderView';

interface Props {
  deck: Deck;
  progress: Record<string, CardProgress>;
  /** Practice every card in the deck regardless of schedule (weak-card drills). */
  forceAll?: boolean;
  /**
   * For cross-deck sessions (Daily Review, Weak Cards): the real decks, so each
   * card can display which topic it came from.
   */
  sourceDecks?: Deck[];
  /** Pack composition: quick/longform filter, due-only mode. */
  options?: SessionOptions;
  /** Live count of reviews done today, for the goal banner. */
  reviewsToday: number;
  onReview: (cardId: string, grade: Grade, recallScore?: number) => void;
  onExit: () => void;
}

export function Session({ deck, progress, forceAll, sourceDecks, options, reviewsToday, onReview, onExit }: Props) {
  // card id → owning deck, for the topic chip in mixed sessions.
  const topicByCard = useMemo(() => {
    if (!sourceDecks) return undefined;
    const m = new Map<string, Deck>();
    for (const d of sourceDecks) for (const c of d.cards) if (!m.has(c.id)) m.set(c.id, d);
    return m;
  }, [sourceDecks]);
  // One pack, captured at session start. Missed cards are NOT requeued here —
  // they go back to the end of the due queue for later instead.
  const [queue, setQueue] = useState<Card[]>(() =>
    forceAll ? shuffle(deck.cards) : buildSession(deck, progress, Date.now(), options),
  );
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [missedIds, setMissedIds] = useState<string[]>([]);
  // Cards where the user bailed out of recall mode into classic flip.
  const [fallbackIds, setFallbackIds] = useState<string[]>([]);
  // Forces a remount of the card view when the same card comes around again.
  const [pass, setPass] = useState(0);

  const card = queue[index];
  const total = queue.length;
  const recallMode = getSetting('recallMode') === 'on' && aiAvailable();

  const advance = (grade: Grade, recallScore?: number) => {
    onReview(card.id, grade, recallScore);
    if (grade >= 2) setCorrectCount((c) => c + 1);
    else if (grade === 0) setMissedIds((m) => (m.includes(card.id) ? m : [...m, card.id]));
    setIndex((i) => i + 1);
    setPass((p) => p + 1);
  };

  const restartWith = (cards: Card[]) => {
    setQueue(shuffle(cards));
    setIndex(0);
    setCorrectCount(0);
    setMissedIds([]);
    setPass((p) => p + 1);
  };

  if (!card) {
    const pct = total > 0 ? Math.round((correctCount / total) * 100) : 100;
    const missedCards = deck.cards.filter((c) => missedIds.includes(c.id));
    const goalReached = reviewsToday >= DAILY_GOAL;
    const left = forceAll
      ? { due: 0, fresh: 0 }
      : deckCounts(deck, progress, Date.now(), options?.kind);
    const nextPackCount = left.due + (options?.includeNew === false ? 0 : left.fresh);
    return (
      <div className="screen">
        <div className="session-end">
          <div className="end-emoji">{pct >= 80 ? '🎉' : pct >= 50 ? '💪' : '📚'}</div>
          <h2>Pack complete</h2>
          {total > 0 ? (
            <p>
              {total} card{total === 1 ? '' : 's'} reviewed · {pct}% right
            </p>
          ) : (
            <p>Nothing due in this deck right now — come back later.</p>
          )}
          <div className={`goal-line ${goalReached ? 'reached' : ''}`}>
            {goalReached ? '🎯 Daily goal reached — ' : ''}
            {Math.min(reviewsToday, 999)}/{DAILY_GOAL} today
          </div>
          {nextPackCount > 0 && (
            <button
              className="btn primary block"
              onClick={() => restartWith(buildSession(deck, progress, Date.now(), options))}
            >
              Next pack · {Math.min(nextPackCount, PACK_SIZE)} card
              {Math.min(nextPackCount, PACK_SIZE) === 1 ? '' : 's'}
            </button>
          )}
          {missedCards.length > 0 && (
            <button className="btn ghost block" onClick={() => restartWith(missedCards)}>
              Practice the {missedCards.length} you missed
            </button>
          )}
          <button className={`btn ${nextPackCount > 0 ? 'ghost' : 'primary'} block`} onClick={onExit}>
            Back to decks
          </button>
        </div>
      </div>
    );
  }

  const key = `${card.id}:${pass}`;
  const topic = topicByCard?.get(card.id);

  return (
    <div className="screen">
      <header className="session-header">
        <button className="icon-btn" onClick={onExit} aria-label="Exit session">
          ✕
        </button>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${(index / Math.max(1, queue.length)) * 100}%` }}
          />
        </div>
        <span className="session-count">
          {Math.min(index + 1, total)}/{total}
        </span>
      </header>

      {topic && (
        <div className="card-topic" style={{ ['--deck-color' as string]: topic.color }}>
          <span className="card-topic-icon">{topic.icon}</span> {topic.title}
        </div>
      )}

      {card.type === 'mcq' && (
        <McqView key={key} card={card} onResult={(ok) => advance(ok ? 2 : 0)} />
      )}
      {card.type === 'fill' && (
        <FillView key={key} card={card} onResult={(ok) => advance(ok ? 2 : 0)} />
      )}
      {card.type === 'tf' && (
        <TfView key={key} card={card} onResult={(ok) => advance(ok ? 2 : 0)} />
      )}
      {card.type === 'order' && (
        <OrderView key={key} card={card} onResult={(ok) => advance(ok ? 2 : 0)} />
      )}
      {card.type === 'flash' &&
        (recallMode && !fallbackIds.includes(card.id) ? (
          <RecallView
            key={key}
            card={card}
            onGrade={(g, score) => advance(g, score)}
            onFallback={() => setFallbackIds((f) => [...f, card.id])}
          />
        ) : (
          <FlashView key={key} card={card} onGrade={(g) => advance(g)} />
        ))}
    </div>
  );
}
