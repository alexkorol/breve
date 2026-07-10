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

interface Props {
  state: AppState;
  onImport: (state: AppState) => void;
  onHidePersonalChange: (hidden: boolean) => void;
  onBack: () => void;
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
