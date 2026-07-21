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

export function StudyView({ deck, onRead, onBack }: Props) {
  return (
    <div className="screen">
      <header className="detail-header">
        <button className="icon-btn" onClick={onBack} aria-label="Back">
          ←
        </button>
        <span className="detail-track">
          {deck.icon} {deck.title} · study
        </span>
      </header>
      <div className="study-list">
        {deck.cards.map((card, i) => (
          <StudyItem key={card.id} card={card} index={i} />
        ))}
      </div>
      <button
        className="btn primary block"
        onClick={() => {
          onRead?.();
          onBack();
        }}
      >
        Done reading
      </button>
    </div>
  );
}
