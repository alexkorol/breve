import { useEffect, useState } from 'react';
import type { Plan } from '../membership';
import { fetchUnlockProduct, purchaseUnlock, restoreUnlock } from '../iap';

interface Props {
  deckCount: number;
  cardCount: number;
  onUnlocked: (plan: Plan) => void;
  onClose: () => void;
}

export function Paywall({ deckCount, cardCount, onUnlocked, onClose }: Props) {
  const [price, setPrice] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    void fetchUnlockProduct().then((p) => {
      if (p) setPrice(p.displayPrice);
      else setNotice('Store unavailable right now. Check your connection and try again.');
    });
  }, []);

  const buy = async () => {
    setBusy(true);
    setNotice('');
    try {
      const plan = await purchaseUnlock();
      if (plan) onUnlocked(plan);
    } catch {
      setNotice('Purchase didn’t complete. You were not charged twice; try again.');
    } finally {
      setBusy(false);
    }
  };

  const restore = async () => {
    setBusy(true);
    setNotice('');
    try {
      const plan = await restoreUnlock();
      if (plan) onUnlocked(plan);
      else setNotice('No previous purchase found for this Apple account.');
    } catch {
      setNotice('Restore failed. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="paywall-backdrop" onClick={onClose}>
      <div className="paywall" onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn paywall-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <div className="paywall-icon">🦝</div>
        <h2>Unlock everything</h2>
        <p className="paywall-pitch">
          All {deckCount} decks and {cardCount}+ cards, plus every deck we ship in the future.
          One purchase, yours forever. No subscription.
        </p>
        <ul className="paywall-points">
          <li>Full System Design, Coding, AI Engineering, ML, Python, JS/TS and Behavioral tracks</li>
          <li>All future decks and updates included</li>
          <li>Your own decks, shared decks, and AI-generated decks stay free either way</li>
        </ul>
        <button className="btn primary block" disabled={busy} onClick={() => void buy()}>
          {busy ? 'Working…' : price ? `Unlock forever · ${price}` : 'Unlock forever'}
        </button>
        <button className="link-btn" disabled={busy} onClick={() => void restore()}>
          Restore purchase
        </button>
        {notice && <p className="chart-note paywall-notice">{notice}</p>}
      </div>
    </div>
  );
}
