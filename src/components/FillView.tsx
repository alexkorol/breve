import { useEffect, useMemo, useState } from 'react';
import type { FillCard } from '../types';
import { Rich } from './Rich';
import { FeedbackSheet } from './FeedbackSheet';

interface Props {
  card: FillCard;
  onResult: (correct: boolean) => void;
}

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function FillView({ card, onResult }: Props) {
  const chips = useMemo(() => shuffle([card.answers[0], ...card.distractors]), [card]);
  const [picked, setPicked] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const correct = picked !== null && card.answers.includes(picked);
  const [before, after] = card.code.split('____');

  // Desktop: number keys pick chips; Enter checks.
  useEffect(() => {
    if (checked) return;
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= chips.length) {
        const token = chips[n - 1];
        setPicked((p) => (p === token ? null : token));
      } else if (e.key === 'Enter' && picked) {
        e.preventDefault();
        setChecked(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [checked, chips, picked]);

  const blankCls = checked
    ? `code-blank filled ${correct ? 'ok' : 'bad'}`
    : picked
      ? 'code-blank filled'
      : 'code-blank';

  return (
    <div className="card-view">
      <p className="prompt">
        <Rich text={card.prompt} />
      </p>
      <pre className="code-block">
        <code>
          {before}
          <button
            className={blankCls}
            disabled={checked}
            onClick={() => setPicked(null)}
            aria-label={picked ? `Remove ${picked}` : 'Blank'}
          >
            {picked ?? '    '}
          </button>
          {after}
        </code>
      </pre>
      <div className="chip-bank">
        {chips.map((token) => (
          <button
            key={token}
            className={`chip ${picked === token ? 'used' : ''}`}
            disabled={checked}
            onClick={() => setPicked(picked === token ? null : token)}
          >
            {token}
          </button>
        ))}
      </div>
      {!checked && (
        <button
          className="btn primary block bottom"
          disabled={!picked}
          onClick={() => setChecked(true)}
        >
          Check
        </button>
      )}
      {checked && (
        <FeedbackSheet
          correct={correct}
          heading={correct ? 'Correct!' : `Answer: ${card.answers[0]}`}
          explanation={card.explanation}
          onContinue={() => onResult(correct)}
        />
      )}
    </div>
  );
}
