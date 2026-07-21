# Jimothy

Local-first React PWA for spaced-repetition interview prep (formerly "Breve"; the `breve:` localStorage prefixes are legacy and must not be renamed). Deck content lives in `src/data/*.ts`.

## Card content style (all decks and generated material)

- **No em dashes (—), ever.** Use a colon, comma, parentheses, or a separate sentence. This applies to card fronts, backs, prompts, choices, explanations, and deck descriptions, and to the AI generation prompts in `src/ai.ts`.
- No personal references (specific employers, project codenames, personal metrics). The `proj*` decks in the My Projects track are the only exception.
- No cheerleading or meta commentary in answers ("say it out loud", "this is interview gold", pep-talk closers). Answers end when the technical answer ends.
- Substantive interview guidance (what interviewers probe, how to structure an answer) is welcome; keep it factual.
- **No walls of text.** Any answer covering a pipeline, checklist, or 4+ steps uses `\n` line breaks with numbered or labeled lines (the `Rich` renderer turns `\n` into real breaks). Arrow chains (→) are allowed only as short notation, roughly 4 steps on one line; never as a paragraph-length chain.

## AI layer

- Provider-agnostic by key prefix in `src/ai.ts`: OpenRouter is primary (OpenAI chat-completions format via fetch/SSE, any model slug); `sk-ant-` keys go directly to Anthropic via the lazily imported SDK. Keep new AI features going through `callText()` so both providers keep working.

## iOS app

- The App Store build wraps this PWA with Capacitor. See `docs/ios.md` for current state and the macOS-side setup steps. The `ios/` platform folder is generated on macOS (`npx cap add ios`) and committed; build first, then `npm run ios:sync`.

## Session mechanics (do not regress)

- Sessions are 10-card packs (`PACK_SIZE` in `src/session.ts`); no in-session requeue of missed cards (they come back ~10 min later via `srs.ts`).
- Daily Review is due-only and split into quick (mcq/fill/tf/order) vs longform (flash) via `cardKind()` in `src/types.ts`.
- Never surface scheduling internals (intervals, ease) in the session loop; grading is binary plus the "Too easy" escape hatch.
