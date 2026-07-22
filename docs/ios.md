# iOS (Capacitor) setup

Goal: ship Jimothy as a real App Store app by wrapping the existing Vite/React PWA with Capacitor.

## Current state (done on the MacBook, 2026-07-21)

- `@capacitor/core`, `@capacitor/ios`, `@capacitor/preferences` (deps) and `@capacitor/cli` (dev dep) are installed.
- `capacitor.config.ts` is committed: appId `com.alexkorol.jimothy`, appName `Jimothy`, webDir `dist`. The appId must be final before the first App Store Connect upload.
- The `ios/` platform folder is generated and committed. Capacitor 8 uses Swift Package Manager (no CocoaPods); `ios/App/CapApp-SPM` is the generated local package.
- **localStorage durability**: `src/native.ts` mirrors all `breve:` localStorage keys into `@capacitor/preferences` (UserDefaults, which iOS does not evict) whenever the app is backgrounded plus every 60s, and restores the backup at boot if localStorage came back empty. localStorage stays the source of truth.
- **Service worker**: registration moved out of vite-plugin-pwa auto-injection (`injectRegister: false`) into `src/main.tsx`, which only registers on web; native skips it.
- **App icon**: `ios/App/App/Assets.xcassets/AppIcon.appiconset` holds a 1024x1024 icon upscaled from `public/icons/icon-512.png`. Replace with a true 1024px export of the original art before release if available.
- **Safe areas**: already handled (`viewport-fit=cover` + `env(safe-area-inset-*)` in `src/index.css`).

## Day-to-day workflow

1. `npm run ios:sync` after any web change (builds, then copies `dist/` into the iOS project).
2. `npm run ios:open` to open in Xcode; select a signing team to run on a device.
3. Simulator build from CLI: `xcodebuild -project ios/App/App.xcodeproj -scheme App -sdk iphonesimulator -destination 'platform=iOS Simulator,name=iPhone 17 Pro' build`

## Still to verify on a real device

- **AI calls.** OpenRouter and Anthropic calls are plain fetch/SSE from the webview and should work natively (no CORS restrictions in Capacitor). Verify streaming still renders.
- **Keyboard.** Test typed-answer inputs; consider `@capacitor/keyboard` if the webview viewport jumps.

## In-app purchase (one-time unlock)

- Product id `com.alexkorol.jimothy.unlock` (non-consumable). The native side is `ios/App/App/UnlockPlugin.swift` (StoreKit 2), registered via `AppViewController` (Main.storyboard points at it); the JS side is `src/iap.ts`, gating in `src/gating.ts`.
- Before purchases work: create the non-consumable IAP with that exact product id in App Store Connect (the Paid Applications agreement must be signed first) and set its price ($24.99 tier, or $14.99 for the launch window).
- To test purchases in the simulator before App Store Connect setup: add a StoreKit configuration file in Xcode (File > New > File > StoreKit Configuration) with the product, and select it in the scheme's Run options.
- Gating is native-only: the web/PWA build stays ungated.

## App Store checklist (later)

- 1024x1024 App Store icon (no transparency). Existing icon assets are in `public/icons/`.
- Launch screen / splash (Capacitor generates a storyboard; `@capacitor/assets` can generate icons and splash from one source image).
- Privacy: the app stores data locally and sends card content to the user's chosen AI provider with the user's own API key. That needs a privacy policy URL and accurate App Privacy answers in App Store Connect.
- Apple Developer Program membership ($99/yr) for TestFlight and App Store distribution.
