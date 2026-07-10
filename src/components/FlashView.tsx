import { useEffect, useState } from 'react';
import type { FlashCard, CardProgress } from '../types';
import type { Grade } from '../srs';
import { previewInterval } from '../srs';
import { Rich, CodeBlock } from './Rich';

interface Props {
  card: FlashCard;
  progress: CardProgress;
  onGrade: (grade: Grade) => void;
}

const GRADES: { grade: Grade; label: string; cls: string }[] = [
  { grade: 0, label: 'Again', cls: 'again' },
  { grade: 1, label: 'Hard', cls: 'hard' },
  { grade: 2, label: 'Good', cls: 'good' },
  { grade: 3, label: 'Easy', cls: 'easy' },
];

export function FlashView({ card, progress, onGrade }: Props) {
  const [revealed, setRevealed] = useState(false);

  // Desktop: space/enter reveals; 1–4 grade Again/Hard/Good/Easy.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!revealed && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        setRevealed(true);
      } else if (revealed) {
        const n = Number(e.key);
        if (n >= 1 && n <= 4) onGrade((n - 1) as Grade);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [revealed, onGrade]);

  return (
    <div className="card-view">
      <p className="prompt">
        <Rich text={card.front} />
      </p>
      {card.code && <CodeBlock code={card.code} />}
      {!revealed ? (
        <button className="btn primary reveal" onClick={() => setRevealed(true)}>
          Show answer
        </button>
      ) : (
        <>
          <div className="flash-back">
            <Rich text={card.back} />
          </div>
          <div className="grade-row">
            {GRADES.map(({ grade, label, cls }) => (
              <button key={grade} className={`grade ${cls}`} onClick={() => onGrade(grade)}>
                <span>{label}</span>
                <small>{previewInterval(progress, grade)}</small>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
