import { useState } from 'react';
import type { Card } from '../types';
import { generateMissCards, getApiKey } from '../ai';
import { StudyItem } from './StudyView';

interface Props {
  onSave: (cards: Card[]) => void;
  onOpenSettings: () => void;
  onBack: () => void;
}

export function Postmortem({ onSave, onOpenSettings, onBack }: Props) {
  const [notes, setNotes] = useState('');
  const [cards, setCards] = useState<Card[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const run = async () => {
    setBusy(true);
    setError('');
    try {
      setCards(await generateMissCards(notes));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed.');
    } finally {
      setBusy(false);
    }
  };

  if (!getApiKey()) {
    return (
      <div className="screen">
        <header className="detail-header">
          <button className="icon-btn" onClick={onBack} aria-label="Back">←</button>
          <span className="detail-track">📝 Postmortem</span>
        </header>
        <div className="empty-note">
          <p>
            Postmortem drills use your own API key (OpenRouter recommended, Anthropic works
            too). Add one in Settings.
          </p>
          <button className="btn primary" onClick={onOpenSettings}>Open Settings</button>
        </div>
      </div>
    );
  }

  if (cards) {
    return (
      <div className="screen">
        <header className="detail-header">
          <button className="icon-btn" onClick={() => setCards(null)} aria-label="Back">←</button>
          <span className="detail-track">🩹 Review your new drills</span>
        </header>
        <div className="study-list">
          {cards.map((card, i) => (
            <div key={card.id} className="review-item">
              <StudyItem card={card} index={i} />
              <button
                className="link-btn danger"
                onClick={() => setCards((cs) => cs?.filter((c) => c.id !== card.id) ?? null)}
              >
                Remove card
              </button>
            </div>
          ))}
        </div>
        <button
          className="btn primary block"
          disabled={cards.length === 0}
          onClick={() => onSave(cards)}
        >
          Add {cards.length} card{cards.length === 1 ? '' : 's'} to Interview Misses
        </button>
      </div>
    );
  }

  return (
    <div className="screen">
      <header className="detail-header">
        <button className="icon-btn" onClick={onBack} aria-label="Back">←</button>
        <span className="detail-track">📝 Interview postmortem</span>
      </header>
      <p className="footnote" style={{ marginTop: 0, textAlign: 'left' }}>
        Just out of an interview or mock? Jot what tripped you up — one stumble per line.
        Each becomes targeted drill cards in your Interview Misses deck.
      </p>
      <textarea
        className="recall-input"
        rows={8}
        placeholder={'couldn\'t explain precision vs recall cleanly\nfroze on the pairs coding exercise\nasked about LangGraph, only had a vague answer'}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      {error && <p className="import-error">{error}</p>}
      <button
        className="btn primary block"
        disabled={busy || notes.trim().length < 10}
        onClick={() => void run()}
      >
        {busy ? 'Building your drills…' : 'Turn stumbles into drills'}
      </button>
    </div>
  );
}
