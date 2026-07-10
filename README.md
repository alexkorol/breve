# Brĕve

**▶ Open the app: [alexkorol.github.io/breve](https://alexkorol.github.io/breve/)** — then Share → Add to Home Screen on iPhone.

Spaced repetition for code challenges, technical interviews, and Python/ML knowledge — a mobile-first PWA in the spirit of Sololearn / Codecademy Go.

## Features

- **Three exercise types** — multiple choice, flip-style flashcards (Again/Hard/Good/Easy), and fill-in-the-blank code.
- **SM-2 spaced repetition** — cards you miss come back within the session and again the next day; cards you know drift out to weeks. Mastery at a 21-day interval.
- **AI deck generation (bring your own key)** — paste a job description, article, notes, or upload a .md/.txt file; Claude generates a validated deck you review card-by-card before saving. Your Anthropic API key lives only in your browser; requests go straight to the API.
- **Recall mode** — answer flashcards from memory (typed, or dictated where supported) before seeing the back; Claude grades you against the model answer with feedback, and the score drives the SRS grade. Optional 60-second interview-pressure timer. Falls back to classic flip when offline.
- **Interview postmortems** — jot what tripped you up after an interview or mock; each stumble becomes targeted drill cards in a persistent "Interview Misses" deck.
- **Readiness scores** — per-track readiness blending retention with recall-mode grades, a 13-week volume trend, and an exportable markdown readiness report.
- **Deck sharing without a server** — every deck exports as a file or a copyable link (the deck travels gzip-compressed inside the URL fragment); recipients get an add-deck banner. A "hide My Projects" toggle keeps personal decks out of sight.
- **Data durability** — persistent-storage request, backup age tracking with nudges, one-tap backup, and restore.
- **Study mode** — every deck has a readable "study cards" view mirroring its questions one-to-one (question + answer + explanation), for refreshing before you practice. No effect on the review schedule.
- **Stats & weak-card drills** — 14-day activity chart, mastery by track, and a "toughest cards" list (2+ misses) with one-tap targeted practice.
- **Custom decks** — import your own decks as JSON files (see format below); they live on-device and are removable any time.
- **Progress export/import** — back up or move your progress between devices as a JSON file. No accounts, no backend.
- **Desktop-friendly** — number keys answer, space flips, enter continues.
- **A full curriculum** — 502 cards in 38 decks across six tracks (AI Engineering first):
  - *Python* (6): Fundamentals · Advanced · Lists, Dicts & Pairs · Strings & Regex · Gotchas & Debugging · OOP & Testing
  - *Coding Interview* (8): Big-O · DS&A · Intervals & Arrays · Binary Search · Lists/Stacks/Queues · Strings & Hashing · Trees, Graphs & DP · SQL
  - *ML & Data* (7): ML Fundamentals · Statistics & Probability · Metrics · Data Cleaning · Pandas & NumPy · scikit-learn · Features & Model Selection
  - *AI Engineering* (11): AI Interview Drills · Deep Learning Core · Transformers & LLMs · Prompt Engineering · Embeddings & Retrieval · RAG, Agents & Evals · FastAPI & Serving · Inference & Serving · LLM Judges & Bias · Fine-tuning · AI System Design
  - *My Projects* (3): LedgerLens · SongCraft RAG · prosody-judge (self-quiz decks)
  - *Credentials* (3): AI-103 Azure AI Apps · HF Agents Course · Azure AI Services
- **Daily Review** — one tap pulls everything due across all decks, plus a 30-review daily goal ring.
- **Streaks and stats** — daily streak, reviews today/all-time, mastered count.
- **Installable PWA** — offline-capable, add to home screen, no app store.
- **Local-first** — progress lives in `localStorage` on the device; no accounts, no backend.

## Development

```sh
npm install
npm run dev        # dev server, exposed on LAN (test from your phone)
npm run build      # type-check + production build to dist/
```

## Using it on an iPhone

1. Deploy `dist/` anywhere static (a push to `main` deploys via GitHub Pages using the included workflow — enable **Settings → Pages → Source: GitHub Actions** on the repo), or open the LAN dev URL printed by `npm run dev` while on the same Wi-Fi.
2. Open the URL in Safari.
3. Share button → **Add to Home Screen**. It launches fullscreen with its own icon, works offline, and keeps your progress on-device.

## Adding content

Decks are plain TypeScript in [src/data/](src/data/) — each deck is a list of cards:

```ts
{ id: 'unique-id', type: 'mcq',   prompt: '…', code: '…?', choices: [...], answer: 0, explanation: '…' }
{ id: 'unique-id', type: 'flash', front: '…', back: '…' }
{ id: 'unique-id', type: 'fill',  prompt: '…', code: 'line with ____', answers: ['…'], distractors: ['…', '…', '…'] }
```

Backticks in any text render as inline code. Add the deck to [src/data/index.ts](src/data/index.ts) and it appears on the home screen.

### Importing a deck without touching code

Tap **Add deck** on the home screen and pick a `.json` file shaped like this (same card format as above; `track` defaults to "Imported"):

```json
{
  "id": "my-deck",
  "title": "My Deck",
  "description": "What it covers.",
  "icon": "📦",
  "color": "#8b949e",
  "track": "Imported",
  "cards": [
    { "id": "md-1", "type": "mcq", "prompt": "…?", "choices": ["A", "B"], "answer": 0, "explanation": "…" },
    { "id": "md-2", "type": "flash", "front": "…", "back": "…" },
    { "id": "md-3", "type": "fill", "prompt": "…", "code": "line with ____", "answers": ["x"], "distractors": ["y", "z"] }
  ]
}
```

Deck and card ids must be unique (imports are validated and rejected with a reason if not). Imported decks join Daily Review and the SRS like any other deck.
