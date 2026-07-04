import { Rich } from './Rich';

interface Props {
  correct: boolean;
  heading: string;
  explanation?: string;
  onContinue: () => void;
}

/** Bottom feedback sheet (Sololearn/Duolingo pattern) with a pinned Continue. */
export function FeedbackSheet({ correct, heading, explanation, onContinue }: Props) {
  return (
    <div className={`sheet ${correct ? 'ok' : 'bad'}`}>
      <strong>{heading}</strong>
      {explanation && (
        <p>
          <Rich text={explanation} />
        </p>
      )}
      <button className="btn primary block" onClick={onContinue}>
        Continue
      </button>
    </div>
  );
}
