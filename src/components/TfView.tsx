import { useEffect, useState } from 'react';
import type { TfCard } from '../types';
import { Rich, CodeBlock } from './Rich';
import { FeedbackSheet } from './FeedbackSheet';

interface Props {
  card: TfCard;
  onResult: (correct: boolean) => void;
}

/** True/false statement — two big buttons, instant feedback. */
export function TfView({ card, onResult }: Props) {
  const [picked, setPicked] = useState<boolean | null>(null);
  const answered = picked !== null;
  const correct = picked === card.answer;

  // Desktop: 1 = true, 2 = false.
  useEffect(() => {
    if (answered) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '1') setPicked(true);
      else if (e.key === '2') setPicked(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [answered]);

  const cls = (value: boolean) => {
    let c = 'choice tf-choice';
    if (answered) {
      if (value === card.answer) c += ' correct';
      else if (value === picked) c += ' wrong';
      else c += ' faded';
    }
    return c;
  };

  return (
    <div className="card-view">
      <p className="prompt">
        <Rich text={card.prompt} />
      </p>
      {card.code && <CodeBlock code={card.code} />}
      <div className="choices tf-row">
        <button className={cls(true)} disabled={answered} onClick={() => setPicked(true)}>
          ✓ True
        </button>
        <button className={cls(false)} disabled={answered} onClick={() => setPicked(false)}>
          ✗ False
        </button>
      </div>
      {answered && (
        <FeedbackSheet
          correct={correct}
          heading={correct ? 'Correct!' : `It’s ${card.answer ? 'true' : 'false'}.`}
          explanation={card.explanation}
          onContinue={() => onResult(correct)}
        />
      )}
    </div>
  );
}
