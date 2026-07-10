import { useState } from 'react';
import type { Card, CardProgress, Deck } from '../types';
import type { Grade } from '../srs';
import { newProgress } from '../srs';
import { buildSession, shuffle, DAILY_GOAL } from '../session';
import { aiAvailable } from '../ai';
import { getSetting } from '../storage';
import { McqView } from './McqView';
import { FillView } from './FillView';
import { FlashView } from './FlashView';
import { RecallView } from './RecallView';

interface Props {
  deck: Deck;
  progress: Record<string, CardProgress>;
  /** Practice every card in the deck regardless of schedule (weak-card drills). */
  forceAll?: boolean;
  /** Live count of reviews done today, for the goal banner. */
  reviewsToday: number;
  onReview: (cardId: string, grade: Grade, recallScore?: number) => void;
  onExit: () => void;
}

export function Session({ deck, progress, forceAll, reviewsToday, onReview, onExit }: Props) {
  // Queue is captured once at session start; "again" cards get requeued.
  const [queue, setQueue] = useState<Card[]>(() =>
    forceAll ? shuffle(deck.cards) : buildSession(deck, progress),
  );
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [firstTries, setFirstTries] = useState(0);
  const [missedIds, setMissedIds] = useState<string[]>([]);
  // Cards where the user bailed out of recall mode into classic flip.
  const [fallbackIds, setFallbackIds] = useState<string[]>([]);
  // Forces a remount of the card view when the same card comes around again.
  const [pass, setPass] = useState(0);

  const card = queue[index];
  const total = queue.length;
  const recallMode = getSetting('recallMode') === 'on' && aiAvailable();

  const advance = (grade: Grade, wasRequeued: boolean, recallScore?: number) => {
    onReview(card.id, grade, recallScore);
    if (!wasRequeued) {
      setFirstTries((f) => f + 1);
      if (grade >= 2) setCorrectCount((c) => c + 1);
      else if (grade === 0) setMissedIds((m) => (m.includes(card.id) ? m : [...m, card.id]));
    }
    if (grade === 0) {
      // Requeue at the end for another try this session.
      setQueue((q) => [...q, card]);
    } else {
      setDone((d) => d + 1);
    }
    setIndex((i) => i + 1);
    setPass((p) => p + 1);
  };

  const restartWith = (cards: Card[]) => {
    setQueue(shuffle(cards));
    setIndex(0);
    setDone(0);
    setCorrectCount(0);
    setFirstTries(0);
    setMissedIds([]);
    setPass((p) => p + 1);
  };

  if (!card) {
    const pct = firstTries > 0 ? Math.round((correctCount / firstTries) * 100) : 100;
    const missedCards = deck.cards.filter((c) => missedIds.includes(c.id));
    const goalReached = reviewsToday >= DAILY_GOAL;
    return (
      <div className="screen">
        <div className="session-end">
          <div className="end-emoji">{pct >= 80 ? '🎉' : pct >= 50 ? '💪' : '📚'}</div>
          <h2>Session complete</h2>
          {done > 0 ? (
            <p>
              {done} card{done === 1 ? '' : 's'} reviewed · {pct}% right on the first try
            </p>
          ) : (
            <p>Nothing due in this deck right now — come back later.</p>
          )}
          <div className={`goal-line ${goalReached ? 'reached' : ''}`}>
            {goalReached ? '🎯 Daily goal reached — ' : ''}
            {Math.min(reviewsToday, 999)}/{DAILY_GOAL} today
          </div>
          {missedCards.length > 0 && (
            <button className="btn ghost block" onClick={() => restartWith(missedCards)}>
              Practice the {missedCards.length} you missed
            </button>
          )}
          <button className="btn primary block" onClick={onExit}>
            Back to decks
          </button>
        </div>
      </div>
    );
  }

  // Was this card already seen earlier in the session (i.e. a requeue)?
  const wasRequeued = queue.slice(0, index).some((c) => c.id === card.id);
  const cardProgress = progress[card.id] ?? newProgress();
  const key = `${card.id}:${pass}`;

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

      {card.type === 'mcq' && (
        <McqView key={key} card={card} onResult={(ok) => advance(ok ? 2 : 0, wasRequeued)} />
      )}
      {card.type === 'fill' && (
        <FillView key={key} card={card} onResult={(ok) => advance(ok ? 2 : 0, wasRequeued)} />
      )}
      {card.type === 'flash' &&
        (recallMode && !fallbackIds.includes(card.id) ? (
          <RecallView
            key={key}
            card={card}
            onGrade={(g, score) => advance(g, wasRequeued, score)}
            onFallback={() => setFallbackIds((f) => [...f, card.id])}
          />
        ) : (
          <FlashView
            key={key}
            card={card}
            progress={cardProgress}
            onGrade={(g) => advance(g, wasRequeued)}
          />
        ))}
    </div>
  );
}
