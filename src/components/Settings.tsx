import { useEffect, useRef, useState } from 'react';
import type { AppState } from '../types';
import { getApiKey, setApiKey, getModel, setModel, defaultModel } from '../ai';
import {
  exportState,
  importStateFile,
  getSetting,
  setSetting,
  daysSinceBackup,
} from '../storage';
import type { Plan } from '../membership';
import { loadPlan, remainingDays } from '../membership';
import { redeemGiftCode } from '../giftcodes';
import { isNative, setDailyReminder } from '../native';

interface Props {
  state: AppState;
  onImport: (state: AppState) => void;
  /** Present on the gated native build: opens the unlock sheet. */
  onUnlock?: () => void;
  /** Notifies App so gating reacts immediately to a redeemed gift code. */
  onPlanChange?: (plan: Plan) => void;
  onBack: () => void;
}

/**
 * Membership: plan status, gift-code redemption, and the "I met my goal"
 * testimonial program (12 giftable one-month passes; fulfillment is manual
 * until the backend ships). Never tied to App Store reviews.
 */
const TESTIMONIAL_EMAIL = 'korolalexei@gmail.com';
const GOAL_STREAK = 30;
const GOAL_REVIEWS = 500;

function MembershipSection({
  onUnlock,
  onPlanChange,
}: {
  onUnlock?: () => void;
  onPlanChange?: (plan: Plan) => void;
}) {
  const [plan, setPlan] = useState(loadPlan);
  const [code, setCode] = useState('');
  const [redeemMsg, setRedeemMsg] = useState('');

  const redeem = async () => {
    const result = await redeemGiftCode(code);
    if (result.ok) {
      setPlan(result.plan);
      onPlanChange?.(result.plan);
      setCode('');
      setRedeemMsg('Gift month activated. Everything is unlocked for 30 days.');
    } else {
      setRedeemMsg(
        result.reason === 'already-used'
          ? 'That code was already redeemed on this device.'
          : 'That code is not valid. Check for typos and try again.',
      );
    }
  };

  const redeemRow = (
    <>
      <div className="setting-row">
        <div className="setting-text">
          <strong>Have a gift code?</strong>
          <p>A friend can gift you a month of full access.</p>
        </div>
      </div>
      <div className="gift-recipient-row">
        <input
          placeholder="JIM1.…"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          autoCapitalize="none"
          autoCorrect="off"
        />
        <button className="btn ghost" disabled={!code.trim()} onClick={() => void redeem()}>
          Redeem
        </button>
      </div>
      {redeemMsg && <p className="chart-note">{redeemMsg}</p>}
    </>
  );

  if (plan.tier !== 'paid') {
    return (
      <section className="stats-section">
        <h3>Membership</h3>
        {onUnlock && (
          <div className="setting-row">
            <div className="setting-text">
              <strong>One purchase, every deck forever</strong>
              <p>All built-in decks and every future one. No subscription.</p>
            </div>
            <button className="btn primary" onClick={onUnlock}>
              Unlock
            </button>
          </div>
        )}
        {redeemRow}
      </section>
    );
  }

  if (plan.expiresAt === undefined) {
    return (
      <section className="stats-section">
        <h3>Membership</h3>
        <p className="chart-note">Everything unlocked. Thanks for supporting Jimothy. 🦝</p>
      </section>
    );
  }

  return (
    <section className="stats-section">
      <h3>Membership</h3>
      <p className="chart-note">
        Gift month active: full access for {remainingDays(plan)} more day
        {remainingDays(plan) === 1 ? '' : 's'}.
      </p>
      {redeemRow}
    </section>
  );
}

/**
 * Usage-gated testimonial program. Submitting a story (manual fulfillment for
 * now) earns 12 one-month gift codes to hand out. Deliberately not connected
 * to App Store reviews: incentivized reviews are prohibited.
 */
function MetGoalSection({ state }: { state: AppState }) {
  const [open, setOpen] = useState(false);
  const [story, setStory] = useState('');
  const [sent, setSent] = useState(getSetting('goalTestimonial') === 'sent');

  const eligible =
    state.stats.streak >= GOAL_STREAK || state.stats.totalReviews >= GOAL_REVIEWS;
  if (!eligible) return null;

  const submit = () => {
    const subject = encodeURIComponent('I met my goal with Jimothy');
    const body = encodeURIComponent(
      `${story.trim()}\n\n(Stats: ${state.stats.totalReviews} reviews, ${state.stats.streak}-day streak.)\n\nSend my 12 gift months to this address.`,
    );
    window.location.href = `mailto:${TESTIMONIAL_EMAIL}?subject=${subject}&body=${body}`;
    setSetting('goalTestimonial', 'sent');
    setSent(true);
  };

  return (
    <section className="stats-section">
      <h3>I met my goal 🎁</h3>
      {sent ? (
        <p className="chart-note">
          Story received. Your 12 gift months arrive by email within a day or two: hand them to
          friends and other learners.
        </p>
      ) : !open ? (
        <div className="setting-row">
          <div className="setting-text">
            <strong>Got the job? Passed the interview?</strong>
            <p>
              Share your story and get 12 one-month full-access passes to give to friends and
              other learners.
            </p>
          </div>
          <button className="btn ghost" onClick={() => setOpen(true)}>
            Share it
          </button>
        </div>
      ) : (
        <>
          <textarea
            className="testimonial-input"
            rows={5}
            placeholder="What were you preparing for, and how did it go?"
            value={story}
            onChange={(e) => setStory(e.target.value)}
          />
          <button
            className="btn primary block"
            disabled={story.trim().length < 40}
            onClick={submit}
          >
            Send my story (opens email)
          </button>
          <button className="btn ghost block" onClick={() => setOpen(false)}>
            Cancel
          </button>
        </>
      )}
    </section>
  );
}

/** Daily study reminder: native only, opt-in, cancellable. */
function ReminderRow() {
  const [time, setTime] = useState(getSetting('reminderTime'));
  const [denied, setDenied] = useState(false);
  if (!isNative) return null;

  const apply = async (next: string) => {
    setDenied(false);
    const ok = await setDailyReminder(next || null);
    if (!ok && next) {
      setDenied(true);
      return;
    }
    setSetting('reminderTime', next);
    setTime(next);
  };

  return (
    <div className="setting-row">
      <div className="setting-text">
        <strong>Daily reminder</strong>
        <p>
          One notification a day to keep the streak alive. Clear the time to turn it off.
          {denied && ' Notifications are blocked: enable them for Jimothy in iOS Settings.'}
        </p>
      </div>
      <input
        type="time"
        value={time}
        onChange={(e) => void apply(e.target.value)}
      />
    </div>
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

export function Settings({ state, onImport, onUnlock, onPlanChange, onBack }: Props) {
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
    setModel(model === defaultModel() ? '' : model);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="screen">
      <header className="detail-header">
        <button className="icon-btn" onClick={onBack} aria-label="Back">←</button>
        <span className="detail-track">⚙️ Settings</span>
      </header>

      <MembershipSection onUnlock={onUnlock} onPlanChange={onPlanChange} />
      <MetGoalSection state={state} />

      <section className="stats-section">
        <h3>AI features (deck generation, grading, postmortems)</h3>
        <label className="setting-field">
          API key
          <input
            type="password"
            placeholder="sk-or-…"
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
          OpenRouter keys (sk-or-…) are recommended: one key, any model, priced per use — get
          one at openrouter.ai/keys. Anthropic keys (sk-ant-…) also work and go straight to
          Anthropic. Either way the key is stored only in this browser and requests go
          directly from this device to the provider, no server in between.
        </p>
      </section>

      <section className="stats-section">
        <h3>Practice</h3>
        <Toggle
          name="recallMode"
          label="Recall mode for flashcards"
          hint="Answer from memory first; the model grades you against the card's answer. Needs an API key. Falls back to classic flip when offline."
        />
        <Toggle
          name="recallTimer"
          label="60-second answer timer"
          hint="Interview pressure: recall answers auto-submit when time runs out."
        />
        <ReminderRow />
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
                setImportError('That file doesn’t look like a Jimothy progress export.');
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
                ? '✓ Allowed. Note: without a server, Jimothy can’t wake your device on a schedule — on iPhone, a daily alarm or Shortcuts automation opening Jimothy is the reliable reminder.'
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
