import { useEffect, useState } from 'react';
import type { FlashCard } from '../types';
import type { Grade } from '../srs';
import { Rich, CodeBlock } from './Rich';

interface Props {
  card: FlashCard;
  onGrade: (grade: Grade) => void;
}

/**
 * Flip card with binary grading — did you know it or not — matching how MCQ
 * and fill cards already work. Scheduling is the app's job, not a question to
 * answer after every card. "Too easy" is the one escape hatch: it fast-tracks
 * a known-cold card so it stops coming back.
 */
export function FlashView({ card, onGrade }: Props) {
  const [revealed, setRevealed] = useState(false);

  // Desktop: space/enter reveals; 1 = missed, 2 = got it, 3 = too easy.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!revealed && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        setRevealed(true);
      } else if (revealed) {
        if (e.key === '1') onGrade(0);
        else if (e.key === '2') onGrade(2);
        else if (e.key === '3') onGrade(3);
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
          <div className="grade-actions">
            <div className="grade-row binary">
              <button className="grade again" onClick={() => onGrade(0)}>
                <span>✗ Missed it</span>
              </button>
              <button className="grade good" onClick={() => onGrade(2)}>
                <span>✓ Got it</span>
              </button>
            </div>
            <button className="link-btn too-easy" onClick={() => onGrade(3)}>
              Too easy — show me this much later
            </button>
          </div>
        </>
      )}
    </div>
  );
}
