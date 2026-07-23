import { useEffect, useMemo, useState } from 'react';
import type { MultiFillCard } from '../types';
import { Rich } from './Rich';
import { FeedbackSheet } from './FeedbackSheet';

interface Props {
  card: MultiFillCard;
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

/**
 * Multi-blank code cloze: the snippet has `__1__`..`__n__` slots and a chip
 * bank of terms. Tapping a chip fills the first empty slot; tapping a filled
 * slot returns its chip. Graded all-or-nothing like the other quick formats.
 */
export function MultiFillView({ card, onResult }: Props) {
  const chips = useMemo(() => shuffle([...card.blanks, ...card.distractors]), [card]);
  const [filled, setFilled] = useState<(string | null)[]>(() => card.blanks.map(() => null));
  const [checked, setChecked] = useState(false);

  const allFilled = filled.every((f) => f !== null);
  const correct = filled.every((f, i) => f === card.blanks[i]);
  // Chip index → slot it currently occupies (chips can repeat a token, so
  // occupancy is tracked per bank position, not per token string).
  const [usedBy, setUsedBy] = useState<(number | null)[]>(() => chips.map(() => null));

  const placeChip = (chipIdx: number) => {
    if (checked || usedBy[chipIdx] !== null) return;
    const slot = filled.findIndex((f) => f === null);
    if (slot === -1) return;
    setFilled((f) => f.map((v, i) => (i === slot ? chips[chipIdx] : v)));
    setUsedBy((u) => u.map((v, i) => (i === chipIdx ? slot : v)));
  };

  const clearSlot = (slot: number) => {
    if (checked || filled[slot] === null) return;
    setFilled((f) => f.map((v, i) => (i === slot ? null : v)));
    setUsedBy((u) => u.map((v) => (v === slot ? null : v)));
  };

  // Desktop: number keys place chips; Enter checks.
  useEffect(() => {
    if (checked) return;
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= chips.length) {
        placeChip(n - 1);
      } else if (e.key === 'Enter' && allFilled) {
        e.preventDefault();
        setChecked(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // Split the code around __1__, __2__, ... markers; odd segments are slots.
  const segments = card.code.split(/__(\d+)__/);

  const slotCls = (slot: number) =>
    checked
      ? `code-blank filled ${filled[slot] === card.blanks[slot] ? 'ok' : 'bad'}`
      : filled[slot]
        ? 'code-blank filled'
        : 'code-blank';

  return (
    <div className="card-view">
      <p className="prompt">
        <Rich text={card.prompt} />
      </p>
      <pre className="code-block">
        <code>
          {segments.map((seg, i) => {
            if (i % 2 === 0) return seg;
            const slot = Number(seg) - 1;
            return (
              <button
                key={`slot-${slot}`}
                className={slotCls(slot)}
                disabled={checked}
                onClick={() => clearSlot(slot)}
                aria-label={filled[slot] ? `Remove ${filled[slot]}` : `Blank ${slot + 1}`}
              >
                {filled[slot] ?? '    '}
              </button>
            );
          })}
        </code>
      </pre>
      <div className="chip-bank">
        {chips.map((token, i) => (
          <button
            key={`${token}-${i}`}
            className={`chip ${usedBy[i] !== null ? 'used' : ''}`}
            disabled={checked || usedBy[i] !== null}
            onClick={() => placeChip(i)}
          >
            {token}
          </button>
        ))}
      </div>
      {!checked && (
        <button
          className="btn primary block bottom"
          disabled={!allFilled}
          onClick={() => setChecked(true)}
        >
          Check
        </button>
      )}
      {checked && (
        <FeedbackSheet
          correct={correct}
          heading={correct ? 'Correct!' : `Answer: ${card.blanks.join(' · ')}`}
          explanation={card.explanation}
          onContinue={() => onResult(correct)}
        />
      )}
    </div>
  );
}
