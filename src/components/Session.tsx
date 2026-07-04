import { useState } from 'react';
import type { Card, CardProgress, Deck } from '../types';
import type { Grade } from '../srs';
import { newProgress } from '../srs';
import { buildSession } from '../session';
import { McqView } from './McqView';
import { FillView } from './FillView';
import { FlashView } from './FlashView';

interface Props {
  deck: Deck;
  progress: Record<string, CardProgress>;
  onReview: (cardId: string, grade: Grade) => void;
  onExit: () => void;
}

export function Session({ deck, progress, onReview, onExit }: Props) {
  // Queue is captured once at session start; "again" cards get requeued.
  const [queue, setQueue] = useState<Card[]>(() => buildSession(deck, progress));
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [firstTries, setFirstTries] = useState(0);
  // Forces a remount of the card view when the same card comes around again.
  const [pass, setPass] = useState(0);

  const card = queue[index];
  const total = queue.length + 0; // queue grows when cards are requeued

  const advance = (grade: Grade, wasRequeued: boolean) => {
    onReview(card.id, grade);
    if (!wasRequeued) {
      setFirstTries((f) => f + 1);
      if (grade >= 2) setCorrectCount((c) => c + 1);
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

  if (!card) {
    const pct = firstTries > 0 ? Math.round((correctCount / firstTries) * 100) : 100;
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
          <button className="btn primary" onClick={onExit}>
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
      {card.type === 'flash' && (
        <FlashView
          key={key}
          card={card}
          progress={cardProgress}
          onGrade={(g) => advance(g, wasRequeued)}
        />
      )}
    </div>
  );
}
