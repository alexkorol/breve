import { useEffect, useRef, useState } from 'react';
import type { AppState } from '../types';
import { getApiKey, setApiKey, getModel, setModel, DEFAULT_MODEL } from '../ai';
import {
  exportState,
  importStateFile,
  getSetting,
  setSetting,
  daysSinceBackup,
} from '../storage';
import type { GiftGrant } from '../membership';
import { loadPlan, remainingDays, createGiftGrants, savePlan } from '../membership';

interface Props {
  state: AppState;
  onImport: (state: AppState) => void;
  onHidePersonalChange: (hidden: boolean) => void;
  onBack: () => void;
}

/**
 * "I met my goal" — a paid user who no longer needs the app (got the job)
 * gifts the remainder of their membership to one or more friends.
 * Hidden entirely on the free tier, so it stays invisible until payments ship.
 */
function MembershipSection() {
  const [plan, setPlan] = useState(loadPlan);
  const [gifting, setGifting] = useState(false);
  const [recipients, setRecipients] = useState<string[]>(['']);
  const [grants, setGrants] = useState<GiftGrant[]>([]);
  if (plan.tier !== 'paid') return null;

  const days = remainingDays(plan);
  const done = grants.length > 0;

  const sendGifts = () => {
    const created = createGiftGrants(plan, recipients);
    if (created.length === 0) return;
    setGrants(created);
    // The sender's remaining term is transferred away.
    savePlan({ tier: 'free' });
    setPlan({ tier: 'free' });
  };

  const shareGrant = async (g: GiftGrant) => {
    const text = `I met my goal with Breve — passing my membership on to you: ${g.days} days, code ${g.code}`;
    if (navigator.share) await navigator.share({ text }).catch(() => undefined);
    else await navigator.clipboard?.writeText(text);
  };

  return (
    <section className="stats-section">
      <h3>Membership</h3>
      {!gifting ? (
        <div className="setting-row">
          <div className="setting-text">
            <strong>I met my goal 🎁</strong>
            <p>
              Got the job? Gift the {days} days left on your membership to one or more friends —
              split evenly between them.
            </p>
          </div>
          <button className="btn ghost" onClick={() => setGifting(true)}>
            Gift it
          </button>
        </div>
      ) : !done ? (
        <>
          <p className="chart-note">
            {days} days left to give. Add one or more recipients — each gets an equal share, and
            your own membership ends when you send.
          </p>
          <div className="gift-recipients">
            {recipients.map((r, i) => (
              <div key={i} className="gift-recipient-row">
                <input
                  placeholder="Friend’s name or email"
                  value={r}
                  onChange={(e) =>
                    setRecipients((prev) => prev.map((p, j) => (j === i ? e.target.value : p)))
                  }
                />
                {recipients.length > 1 && (
                  <button
                    className="icon-btn"
                    aria-label="Remove recipient"
                    onClick={() => setRecipients((prev) => prev.filter((_, j) => j !== i))}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <button className="link-btn" onClick={() => setRecipients((prev) => [...prev, ''])}>
            + Add another recipient
          </button>
          <button
            className="btn primary block"
            disabled={recipients.every((r) => !r.trim())}
            onClick={sendGifts}
          >
            Send my membership as a gift
          </button>
          <button className="btn ghost block" onClick={() => setGifting(false)}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <p className="chart-note">
            Done — your membership has been passed on. Share each code with its recipient:
          </p>
          <div className="gift-codes">
            {grants.map((g) => (
              <button key={g.code} className="btn ghost" onClick={() => void shareGrant(g)}>
                {g.recipient}: {g.code} · {g.days} days — tap to share
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function Toggle({ name, label, hint, onChange }: { name: string; label: string; hint: string; onChange?: (on: boolean) => void }) {
  const [on, setOn] = useState(getSetting(name) === 'on');
  return (
    <label className="setting-row">
      <div className="setting-text">
        <strong>{label}</strong>
        <p>{hint}</p>
      </div>
      <input
        type="checkbox"
        checked={on}
        onChange={(e) => {
          setOn(e.target.checked);
          setSetting(name, e.target.checked ? 'on' : '');
          onChange?.(e.target.checked);
        }}
      />
    </label>
  );
}

export function Settings({ state, onImport, onHidePersonalChange, onBack }: Props) {
  const [key, setKey] = useState(getApiKey());
  const [model, setModelState] = useState(getModel());
  const [saved, setSaved] = useState(false);
  const [persisted, setPersisted] = useState<boolean | null>(null);
  const [notifState, setNotifState] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported',
  );
  const [importError, setImportError] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const backupAge = daysSinceBackup();

  useEffect(() => {
    void navigator.storage?.persisted?.().then(setPersisted);
  }, []);

  const requestPersist = async () => {
    const granted = await navigator.storage?.persist?.();
    setPersisted(!!granted);
  };

  const saveAi = () => {
    setApiKey(key);
    setModel(model === DEFAULT_MODEL ? '' : model);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="screen">
      <header className="detail-header">
        <button className="icon-btn" onClick={onBack} aria-label="Back">←</button>
        <span className="detail-track">⚙️ Settings</span>
      </header>

      <MembershipSection />

      <section className="stats-section">
        <h3>Claude API (powers generation, grading, postmortems)</h3>
        <label className="setting-field">
          API key
          <input
            type="password"
            placeholder="sk-ant-…"
            value={key}
            autoComplete="off"
            onChange={(e) => setKey(e.target.value)}
          />
        </label>
        <label className="setting-field">
          Model
          <input value={model} onChange={(e) => setModelState(e.target.value)} />
        </label>
        <button className="btn primary" onClick={saveAi}>
          {saved ? 'Saved ✓' : 'Save'}
        </button>
        <p className="chart-note">
          Stored only in this browser. Requests go directly from this device to Anthropic —
          no server in between. Get a key at console.anthropic.com.
        </p>
      </section>

      <section className="stats-section">
        <h3>Practice</h3>
        <Toggle
          name="recallMode"
          label="Recall mode for flashcards"
          hint="Answer from memory first; Claude grades you against the model answer. Needs an API key. Falls back to classic flip when offline."
        />
        <Toggle
          name="recallTimer"
          label="60-second answer timer"
          hint="Interview pressure: recall answers auto-submit when time runs out."
        />
        <Toggle
          name="hidePersonal"
          label="Hide My Projects track"
          hint="Tidies the app when someone else is using it — personal project decks disappear from home and Daily Review."
          onChange={onHidePersonalChange}
        />
      </section>

      <section className="stats-section">
        <h3>Data durability</h3>
        <div className="setting-row">
          <div className="setting-text">
            <strong>Persistent storage</strong>
            <p>
              {persisted === null
                ? 'Checking…'
                : persisted
                  ? '✓ Granted — the browser won’t evict your progress under storage pressure.'
                  : 'Not granted — progress could be evicted if the device runs low on space.'}
            </p>
          </div>
          {persisted === false && (
            <button className="btn ghost" onClick={() => void requestPersist()}>
              Request
            </button>
          )}
        </div>
        <div className="setting-row">
          <div className="setting-text">
            <strong>Backups</strong>
            <p>
              {backupAge === Infinity
                ? 'Never backed up — export a copy of your progress now.'
                : `Last backup: ${backupAge === 0 ? 'today' : `${backupAge} day${backupAge === 1 ? '' : 's'} ago`}.`}
            </p>
          </div>
          <button className="btn ghost" onClick={() => exportState(state)}>
            Back up now
          </button>
        </div>
        <div className="setting-row">
          <div className="setting-text">
            <strong>Restore from backup</strong>
            <p>Replaces current progress with an exported file.</p>
          </div>
          <button className="btn ghost" onClick={() => fileInput.current?.click()}>
            Import
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json"
            hidden
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              try {
                onImport(await importStateFile(f));
                setImportError('');
              } catch {
                setImportError('That file doesn’t look like a Breve progress export.');
              }
              e.target.value = '';
            }}
          />
        </div>
        {importError && <p className="import-error">{importError}</p>}
        <div className="setting-row">
          <div className="setting-text">
            <strong>Notifications</strong>
            <p>
              {notifState === 'granted'
                ? '✓ Allowed. Note: without a server, Breve can’t wake your device on a schedule — on iPhone, a daily alarm or Shortcuts automation opening Breve is the reliable reminder.'
                : notifState === 'unsupported'
                  ? 'Not supported in this browser.'
                  : 'Allow notifications so future reminder features can reach you.'}
            </p>
          </div>
          {notifState === 'default' && (
            <button
              className="btn ghost"
              onClick={() => void Notification.requestPermission().then(setNotifState)}
            >
              Allow
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
