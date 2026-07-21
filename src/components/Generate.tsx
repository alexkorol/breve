import { useRef, useState } from 'react';
import type { Card, Deck } from '../types';
import { generateDeck, getApiKey, type GenerateOptions } from '../ai';
import { StudyItem } from './StudyView';

interface Props {
  decks: Deck[];
  onSave: (deck: Deck) => void;
  onOpenSettings: () => void;
  onBack: () => void;
}

export function Generate({ decks, onSave, onOpenSettings, onBack }: Props) {
  const [source, setSource] = useState('');
  const [count, setCount] = useState(12);
  const [difficulty, setDifficulty] = useState<GenerateOptions['difficulty']>('interview');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [draft, setDraft] = useState<Deck | null>(null);
  const [busy, setBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const run = async () => {
    setBusy(true);
    setError('');
    try {
      const deck = await generateDeck(source, { count, difficulty }, decks, setStatus);
      setDraft(deck);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed.');
    } finally {
      setBusy(false);
      setStatus('');
    }
  };

  const removeCard = (id: string) => {
    setDraft((d) => (d ? { ...d, cards: d.cards.filter((c) => c.id !== id) } : d));
  };

  if (!getApiKey()) {
    return (
      <div className="screen">
        <header className="detail-header">
          <button className="icon-btn" onClick={onBack} aria-label="Back">←</button>
          <span className="detail-track">✨ Generate a deck</span>
        </header>
        <div className="empty-note">
          <p>
            Deck generation uses your own API key (OpenRouter recommended, Anthropic works
            too), stored only on this device. Add a key to unlock it.
          </p>
          <button className="btn primary" onClick={onOpenSettings}>
            Open Settings
          </button>
        </div>
      </div>
    );
  }

  if (draft) {
    return (
      <div className="screen">
        <header className="detail-header">
          <button className="icon-btn" onClick={() => setDraft(null)} aria-label="Back">←</button>
          <span className="detail-track">
            {draft.icon} {draft.title} · review before saving
          </span>
        </header>
        <p className="footnote" style={{ marginTop: 0 }}>
          {draft.cards.length} cards. Remove any you don’t want — then save.
        </p>
        <div className="study-list">
          {draft.cards.map((card: Card, i: number) => (
            <div key={card.id} className="review-item">
              <StudyItem card={card} index={i} />
              <button className="link-btn danger" onClick={() => removeCard(card.id)}>
                Remove card
              </button>
            </div>
          ))}
        </div>
        <button
          className="btn primary block"
          disabled={draft.cards.length === 0}
          onClick={() => onSave(draft)}
        >
          Save deck · {draft.cards.length} cards
        </button>
      </div>
    );
  }

  return (
    <div className="screen">
      <header className="detail-header">
        <button className="icon-btn" onClick={onBack} aria-label="Back">←</button>
        <span className="detail-track">✨ Generate a deck</span>
      </header>

      <p className="footnote" style={{ marginTop: 0, textAlign: 'left' }}>
        Paste anything — a job description, interview notes, an article, docs — and get a
        calibrated practice deck.
      </p>

      <textarea
        className="recall-input"
        rows={10}
        placeholder="Paste your material here…"
        value={source}
        onChange={(e) => setSource(e.target.value)}
      />
      <div className="gen-row">
        <button className="link-btn" onClick={() => fileInput.current?.click()}>
          …or upload a .md / .txt file
        </button>
        <input
          ref={fileInput}
          type="file"
          accept=".md,.txt,text/plain,text/markdown"
          hidden
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (f) setSource(await f.text());
            e.target.value = '';
          }}
        />
      </div>

      <div className="gen-options">
        <label>
          Cards
          <select value={count} onChange={(e) => setCount(Number(e.target.value))}>
            {[8, 12, 16, 20].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
        <label>
          Difficulty
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as GenerateOptions['difficulty'])}
          >
            <option value="intro">Intro</option>
            <option value="interview">Interview</option>
            <option value="expert">Expert</option>
          </select>
        </label>
      </div>

      {error && <p className="import-error">{error}</p>}
      <button
        className="btn primary block"
        disabled={busy || source.trim().length < 80}
        onClick={() => void run()}
      >
        {busy ? status || 'Generating…' : 'Generate deck'}
      </button>
      {source.trim().length > 0 && source.trim().length < 80 && (
        <p className="footnote">Add a bit more material — at least a paragraph.</p>
      )}
    </div>
  );
}
