interface Props {
  onStart: () => void;
  onDismiss: () => void;
}

/** First-launch explainer: shown once, only to accounts with zero reviews. */
export function Welcome({ onStart, onDismiss }: Props) {
  return (
    <div className="paywall-backdrop">
      <div className="paywall welcome" onClick={(e) => e.stopPropagation()}>
        <div className="paywall-icon">🦝</div>
        <h2>Hey, I&apos;m Jimothy</h2>
        <p className="paywall-pitch">
          Interview prep that sticks. Short daily sessions, and cards come back right
          before you&apos;d forget them.
        </p>
        <ul className="paywall-points">
          <li>10-card sessions: flashcards, quizzes, code fills</li>
          <li>Miss a card? It returns in minutes, then on a widening schedule</li>
          <li>Keep the flame alive: study a little every day</li>
        </ul>
        <button className="btn primary block" onClick={onStart}>
          Try a two-minute session
        </button>
        <button className="link-btn" onClick={onDismiss}>
          Look around first
        </button>
      </div>
    </div>
  );
}
