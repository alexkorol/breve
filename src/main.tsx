import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { initNativeStorage, isNative } from './native';

async function boot() {
  if (isNative) {
    // Restore any Preferences backup before the app reads localStorage.
    await initNativeStorage();
  } else {
    // Service worker is web-only; on capacitor:// assets are already local
    // and registration would fail.
    import('virtual:pwa-register')
      .then(({ registerSW }) => registerSW({ immediate: true }))
      .catch(() => {});
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void boot();
