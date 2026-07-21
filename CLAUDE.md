# Jimothy

Local-first React PWA for spaced-repetition interview prep (formerly "Breve"; the `breve:` localStorage prefixes are legacy and must not be renamed). Deck content lives in `src/data/*.ts`.

## Card content style (all decks and generated material)

- **No em dashes (—), ever.** Use a colon, comma, parentheses, or a separate sentence. This applies to card fronts, backs, prompts, choices, explanations, and deck descriptions, and to the AI generation prompts in `src/ai.ts`.
- No personal references (specific employers, project codenames, personal metrics). The `proj*` decks in the My Projects track are the only exception.
- No cheerleading or meta commentary in answers ("say it out loud", "this is interview gold", pep-talk closers). Answers end when the technical answer ends.
- Substantive interview guidance (what interviewers probe, how to structure an answer) is welcome; keep it factual.

## Session mechanics (do not regress)

- Sessions are 10-card packs (`PACK_SIZE` in `src/session.ts`); no in-session requeue of missed cards (they come back ~10 min later via `srs.ts`).
- Daily Review is due-only and split into quick (mcq/fill/tf/order) vs longform (flash) via `cardKind()` in `src/types.ts`.
- Never surface scheduling internals (intervals, ease) in the session loop; grading is binary plus the "Too easy" escape hatch.
