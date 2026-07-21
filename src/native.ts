import { Capacitor } from '@capacitor/core';

/**
 * Native (Capacitor) storage durability layer.
 *
 * All user data lives in localStorage under `breve:` keys, but iOS may evict
 * WKWebView website data when the device is low on storage. On native we
 * mirror every `breve:` key into @capacitor/preferences (UserDefaults, which
 * iOS does not evict) and restore from that backup if localStorage ever comes
 * back empty. localStorage stays the source of truth while the app runs.
 */

const BACKUP_KEY = 'breve-backup';
const MIRROR_INTERVAL_MS = 60_000;

export const isNative = Capacitor.isNativePlatform();

function snapshot(): string {
  const data: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('breve:')) data[key] = localStorage.getItem(key) ?? '';
  }
  return JSON.stringify(data);
}

/**
 * Restore the Preferences backup into localStorage if eviction wiped it,
 * then start mirroring. Must run before the app first reads state.
 */
export async function initNativeStorage(): Promise<void> {
  if (!isNative) return;
  const { Preferences } = await import('@capacitor/preferences');

  let backupHasData = false;
  try {
    const { value } = await Preferences.get({ key: BACKUP_KEY });
    backupHasData = !!value && value !== '{}';
    if (localStorage.getItem('breve:v1') === null && value) {
      const data = JSON.parse(value) as Record<string, string>;
      for (const [k, v] of Object.entries(data)) localStorage.setItem(k, v);
    }
  } catch {
    // Best-effort restore; a corrupt backup must not block app startup.
  }

  const mirror = () => {
    const snap = snapshot();
    // Never replace a backup that has data with an empty snapshot; if
    // localStorage was wiped and restore failed, the backup is all that
    // is left of the user's progress.
    if (snap === '{}' && backupHasData) return;
    backupHasData = snap !== '{}';
    Preferences.set({ key: BACKUP_KEY, value: snap }).catch(() => {});
  };

  // Eviction only happens while the app is not running, so backing up when
  // the app goes to background (plus a periodic safety net) covers it.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') mirror();
  });
  window.addEventListener('pagehide', mirror);
  setInterval(mirror, MIRROR_INTERVAL_MS);
  mirror();
}
