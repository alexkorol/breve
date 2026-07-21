import { useEffect, useRef, useState } from 'react';
import type { Card, Deck } from '../types';
import { Rich, CodeBlock } from './Rich';

interface Props {
  deck: Deck;
  /** Called when the deck is read to the end — counts toward daily intensity. */
  onRead?: () => void;
  onBack: () => void;
}

/** One card rendered as reading material: question + answer + why. */
export function StudyItem({ card, index }: { card: Card; index: number }) {
  return (
    <div className="study-item">
      <div className="study-num">{index + 1}</div>
      {card.type === 'flash' && (
        <>
          <p className="study-q">
            <Rich text={card.front} />
          </p>
          {card.code && <CodeBlock code={card.code} />}
          <div className="study-a">
            <Rich text={card.back} />
          </div>
        </>
      )}
      {card.type === 'mcq' && (
        <>
          <p className="study-q">
            <Rich text={card.prompt} />
          </p>
          {card.code && <CodeBlock code={card.code} />}
          <div className="study-a">
            <span className="study-answer-chip">✓ {card.choices[card.answer]}</span>
            {card.explanation && (
              <p>
                <Rich text={card.explanation} />
              </p>
            )}
          </div>
        </>
      )}
      {card.type === 'fill' && (
        <>
          <p className="study-q">
            <Rich text={card.prompt} />
          </p>
          <pre className="code-block">
            <code>
              {card.code.split('____')[0]}
              <span className="study-blank">{card.answers[0]}</span>
              {card.code.split('____')[1]}
            </code>
          </pre>
          {card.explanation && (
            <div className="study-a">
              <p>
                <Rich text={card.explanation} />
              </p>
            </div>
          )}
        </>
      )}
      {card.type === 'tf' && (
        <>
          <p className="study-q">
            <Rich text={card.prompt} />
          </p>
          {card.code && <CodeBlock code={card.code} />}
          <div className="study-a">
            <span className="study-answer-chip">{card.answer ? '✓ True' : '✗ False'}</span>
            {card.explanation && (
              <p>
                <Rich text={card.explanation} />
              </p>
            )}
          </div>
        </>
      )}
      {card.type === 'order' && (
        <>
          <p className="study-q">
            <Rich text={card.prompt} />
          </p>
          {card.code && <CodeBlock code={card.code} />}
          <div className="study-a">
            <ol className="order-answer">
              {card.items.map((item) => (
                <li key={item}>
                  <Rich text={item} />
                </li>
              ))}
            </ol>
            {card.explanation && (
              <p>
                <Rich text={card.explanation} />
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/** One card at a time, flipped through Codecademy Go-style: swipe, tap, or arrow keys. */
export function StudyView({ deck, onRead, onBack }: Props) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<'fwd' | 'back'>('fwd');
  const touchX = useRef<number | null>(null);
  const total = deck.cards.length;
  // Clamp everywhere: rapid taps can queue several updates before a re-render.
  const card = deck.cards[Math.min(index, total - 1)];
  const last = index >= total - 1;

  const next = () => {
    if (last) {
      onRead?.();
      onBack();
    } else {
      setDir('fwd');
      setIndex((i) => Math.min(i + 1, total - 1));
    }
  };
  const prev = () => {
    setDir('back');
    setIndex((i) => Math.max(0, i - 1));
  };

  // Desktop: arrows page through; space/enter advance.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft') {
        prev();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="screen">
      <header className="session-header">
        <button className="icon-btn" onClick={onBack} aria-label="Back">
          ←
        </button>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
        <span className="session-count">
          {index + 1}/{total}
        </span>
      </header>
      <p className="study-deck-label">
        {deck.icon} {deck.title}
      </p>

      <div
        key={`${card.id}:${dir}`}
        className={`study-flip ${dir}`}
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (dx < -48) next();
          else if (dx > 48) prev();
        }}
      >
        <StudyItem card={card} index={index} />
      </div>

      <div className="study-nav">
        <button className="btn ghost" onClick={prev} disabled={index === 0}>
          ← Back
        </button>
        <button className="btn primary" onClick={next}>
          {last ? 'Done reading ✓' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
