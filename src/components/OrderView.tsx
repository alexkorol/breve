import { useMemo, useState } from 'react';
import type { OrderCard } from '../types';
import { Rich, CodeBlock } from './Rich';
import { FeedbackSheet } from './FeedbackSheet';

interface Props {
  card: OrderCard;
  onResult: (correct: boolean) => void;
}

function shuffled(n: number): number[] {
  const idx = Array.from({ length: n }, (_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  // Don't present the already-correct order.
  if (idx.every((v, i) => v === i) && n > 1) [idx[0], idx[1]] = [idx[1], idx[0]];
  return idx;
}

/**
 * Arrange-in-order (Parsons-style): tap shuffled steps to build the sequence;
 * tap a placed step to send it back.
 */
export function OrderView({ card, onResult }: Props) {
  const bank = useMemo(() => shuffled(card.items.length), [card]);
  // Sequence of item indexes the user has placed, in placement order.
  const [placed, setPlaced] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);

  const correct = placed.every((itemIdx, pos) => itemIdx === pos);
  const complete = placed.length === card.items.length;

  return (
    <div className="card-view">
      <p className="prompt">
        <Rich text={card.prompt} />
      </p>
      {card.code && <CodeBlock code={card.code} />}
      <div className="order-slots">
        {placed.length === 0 && <p className="order-hint">Tap the steps below in order.</p>}
        {placed.map((itemIdx, pos) => {
          let cls = 'order-step placed';
          if (checked) cls += itemIdx === pos ? ' correct' : ' wrong';
          return (
            <button
              key={itemIdx}
              className={cls}
              disabled={checked}
              onClick={() => setPlaced((p) => p.filter((i) => i !== itemIdx))}
            >
              <span className="order-num">{pos + 1}</span>
              <Rich text={card.items[itemIdx]} />
            </button>
          );
        })}
      </div>
      <div className="order-bank">
        {bank
          .filter((itemIdx) => !placed.includes(itemIdx))
          .map((itemIdx) => (
            <button
              key={itemIdx}
              className="order-step"
              disabled={checked}
              onClick={() => setPlaced((p) => [...p, itemIdx])}
            >
              <Rich text={card.items[itemIdx]} />
            </button>
          ))}
      </div>
      {checked && !correct && (
        <ol className="order-answer">
          {card.items.map((item) => (
            <li key={item}>
              <Rich text={item} />
            </li>
          ))}
        </ol>
      )}
      {!checked && (
        <button
          className="btn primary block bottom"
          disabled={!complete}
          onClick={() => setChecked(true)}
        >
          Check
        </button>
      )}
      {checked && (
        <FeedbackSheet
          correct={correct}
          heading={correct ? 'Correct!' : 'Not quite — here’s the right order.'}
          explanation={card.explanation}
          onContinue={() => onResult(correct)}
        />
      )}
    </div>
  );
}
