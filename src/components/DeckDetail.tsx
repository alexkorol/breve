import { useState } from 'react';
import type { CardProgress, Deck } from '../types';
import { isMastered } from '../srs';
import { deckCounts } from '../session';
import { downloadText } from '../storage';
import { deckToShareUrl } from '../share';

interface Props {
  deck: Deck;
  progress: Record<string, CardProgress>;
  onPractice: () => void;
  onStudy: () => void;
  /** Present only for user-imported decks. */
  onRemove?: () => void;
  onBack: () => void;
}

export function DeckDetail({ deck, progress, onPractice, onStudy, onRemove, onBack }: Props) {
  const [shareState, setShareState] = useState('');
  const { due, fresh } = deckCounts(deck, progress);

  const share = async () => {
    try {
      const url = await deckToShareUrl(deck);
      await navigator.clipboard.writeText(url);
      setShareState('Link copied — anyone who opens it can add this deck.');
    } catch {
      setShareState('Couldn’t copy a link — use Export instead.');
    }
  };

  const exportDeck = () => {
    const { custom: _custom, ...clean } = deck;
    downloadText(`${deck.id}.json`, JSON.stringify(clean, null, 2));
  };
  const mastered = deck.cards.filter((c) => isMastered(progress[c.id])).length;
  const seen = deck.cards.filter((c) => progress[c.id]).length;
  const pct = Math.round((seen / deck.cards.length) * 100);
  const ready = due + fresh > 0;

  return (
    <div className="screen">
      <header className="detail-header">
        <button className="icon-btn" onClick={onBack} aria-label="Back">
          ←
        </button>
        <span className="detail-track">{deck.track}</span>
      </header>

      <div className="detail-hero">
        <div className="detail-icon">{deck.icon}</div>
        <h2>{deck.title}</h2>
        <p>{deck.description}</p>
        <div className="deck-progress">
          <div className="deck-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="stat-strip">
        <div className="stat">
          <strong>{due}</strong>
          <span>due</span>
        </div>
        <div className="stat">
          <strong>{fresh}</strong>
          <span>new</span>
        </div>
        <div className="stat">
          <strong>
            {mastered}/{deck.cards.length}
          </strong>
          <span>mastered</span>
        </div>
      </div>

      <div className="detail-actions">
        <button className="btn primary block" disabled={!ready} onClick={onPractice}>
          {ready
            ? `Practice · ${Math.min(due, 30) + Math.min(fresh, 8)} card${
                Math.min(due, 30) + Math.min(fresh, 8) === 1 ? '' : 's'
              }`
            : 'All caught up — practice again later'}
        </button>
        <button className="btn ghost block" onClick={onStudy}>
          📖 Study cards · read all {deck.cards.length}
        </button>
      </div>

      <div className="data-row">
        <button className="link-btn" onClick={() => void share()}>
          Share link
        </button>
        <span className="dot">·</span>
        <button className="link-btn" onClick={exportDeck}>
          Export deck file
        </button>
      </div>
      {shareState && <p className="chart-note" style={{ textAlign: 'center' }}>{shareState}</p>}

      <p className="footnote">
        Study mode shows every question with its answer — read before practicing, or as a
        refresher. It doesn’t affect your review schedule.
      </p>

      {onRemove && (
        <button
          className="link-btn danger"
          onClick={() => {
            if (window.confirm(`Remove the imported deck "${deck.title}"?`)) onRemove();
          }}
        >
          Remove this imported deck
        </button>
      )}
    </div>
  );
}
