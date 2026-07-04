import { useMemo, useState } from 'react';
import type { McqCard } from '../types';
import { Rich, CodeBlock } from './Rich';
import { FeedbackSheet } from './FeedbackSheet';

interface Props {
  card: McqCard;
  onResult: (correct: boolean) => void;
}

export function McqView({ card, onResult }: Props) {
  // Shuffle choices per presentation, remembering where the answer went.
  const order = useMemo(() => {
    const idx = card.choices.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    return idx;
  }, [card]);

  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;
  const correct = picked !== null && order[picked] === card.answer;

  return (
    <div className="card-view">
      <p className="prompt">
        <Rich text={card.prompt} />
      </p>
      {card.code && <CodeBlock code={card.code} />}
      <div className="choices">
        {order.map((choiceIdx, i) => {
          let cls = 'choice';
          if (answered) {
            if (choiceIdx === card.answer) cls += ' correct';
            else if (i === picked) cls += ' wrong';
            else cls += ' faded';
          }
          return (
            <button
              key={choiceIdx}
              className={cls}
              disabled={answered}
              onClick={() => setPicked(i)}
            >
              <Rich text={card.choices[choiceIdx]} />
            </button>
          );
        })}
      </div>
      {answered && (
        <FeedbackSheet
          correct={correct}
          heading={correct ? 'Correct!' : 'Not quite.'}
          explanation={card.explanation}
          onContinue={() => onResult(correct)}
        />
      )}
    </div>
  );
}
