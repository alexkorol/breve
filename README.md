# Brĕve

**▶ Open the app: [alexkorol.github.io/breve](https://alexkorol.github.io/breve/)** — then Share → Add to Home Screen on iPhone.

Spaced repetition for code challenges, technical interviews, and Python/ML knowledge — a mobile-first PWA in the spirit of Sololearn / Codecademy Go.

## Features

- **Three exercise types** — multiple choice, flip-style flashcards (Again/Hard/Good/Easy), and fill-in-the-blank code.
- **SM-2 spaced repetition** — cards you miss come back within the session and again the next day; cards you know drift out to weeks. Mastery at a 21-day interval.
- **Study mode** — every deck has a readable "study cards" view mirroring its questions one-to-one (question + answer + explanation), for refreshing before you practice. No effect on the review schedule.
- **Progress export/import** — back up or move your progress between devices as a JSON file. No accounts, no backend.
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
