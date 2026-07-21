# iOS (Capacitor) setup

Goal: ship Jimothy as a real App Store app by wrapping the existing Vite/React PWA with Capacitor.

## Current state (done on the Windows machine, 2026-07-21)

- `@capacitor/core`, `@capacitor/ios` (deps) and `@capacitor/cli` (dev dep) are installed.
- `capacitor.config.ts` is committed: appId `com.alexkorol.jimothy`, appName `Jimothy`, webDir `dist`. The appId can still be changed, but it must be final before the first App Store Connect upload.
- `.gitignore` already excludes iOS build artifacts (`ios/App/Pods`, generated `public` assets, etc.). The `ios/` platform folder itself should be committed once generated.
- The `ios/` platform folder does NOT exist yet. Generating it requires macOS tooling, so that is the first step on the MacBook.

## Steps on the MacBook

1. Prerequisites: Xcode (with command line tools) and CocoaPods (`sudo gem install cocoapods` or Homebrew). Node is already required for the web build.
2. `npm install`
3. `npm run build` (Capacitor copies from `dist/`, so build before every sync)
4. `npx cap add ios`
5. `npx cap sync ios` (or `npm run ios:sync`, which builds then syncs)
6. `npx cap open ios`, then in Xcode: select a signing team, pick a simulator or device, run.
7. Commit the generated `ios/` folder.

## Things to verify or fix once it runs in the simulator

- **localStorage durability.** All user data lives in localStorage under `breve:` keys. Inside WKWebView, iOS may evict website data when the device is low on storage. For a local-first app this is the biggest risk. Plan: keep localStorage as the source of truth for now, but consider mirroring to `@capacitor/preferences` (backed by native storage that iOS does not evict) before App Store release.
- **Service worker.** vite-plugin-pwa registers a service worker; inside Capacitor the assets are already bundled locally, so the SW is unnecessary and may fail to register on the `capacitor://` scheme. Confirm the app does not break when registration fails; ideally skip registration when `Capacitor.isNativePlatform()`.
- **Safe areas.** Check the notch/home-indicator insets. `viewport-fit=cover` in `index.html` plus `env(safe-area-inset-*)` padding where the header and bottom controls sit.
- **AI calls.** OpenRouter and Anthropic calls are plain fetch/SSE from the webview and should work natively (no CORS restrictions in Capacitor). Verify streaming still renders.
- **Keyboard.** Test typed-answer inputs; consider `@capacitor/keyboard` if the webview viewport jumps.

## App Store checklist (later)

- 1024x1024 App Store icon (no transparency). Existing icon assets are in `public/icons/`.
- Launch screen / splash (Capacitor generates a storyboard; `@capacitor/assets` can generate icons and splash from one source image).
- Privacy: the app stores data locally and sends card content to the user's chosen AI provider with the user's own API key. That needs a privacy policy URL and accurate App Privacy answers in App Store Connect.
- Apple Developer Program membership ($99/yr) for TestFlight and App Store distribution.
