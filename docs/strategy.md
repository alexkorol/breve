# Jimothy: free curriculum, paid corpus, pricing, and positioning

Drafted 2026-07-21 from a two-round verified competitive research pass (sources cited inline; all prices verified live on 2026-07-21 and subject to change).

## The market picture (verified)

**Monetized incumbents are subscriptions with thin free tiers, and they price interview prep as premium.**

- Codecademy: Plus $14.99/mo billed annually ($29.99 monthly), Pro $19.99/mo billed annually ($39.99 monthly). Technical interview prep, code challenges, and the interview simulator are Pro-only, their highest individual tier. Free tier is deliberately thin (no quizzes or projects). [codecademy.com/pricing]
- Boot.dev: $59/mo or $399/yr. Free tier is a demo of the first few chapters of each course, then read-only. [boot.dev/pricing]
- That prices a year of interview prep at $240 to $708. A one-time unlock in the $15 to $30 band undercuts every incumbent by an order of magnitude over a typical 3 to 12 month job hunt.

**The SRS-for-interviews niche is occupied as a phrase but commercially vacant.**

- AlgoCards (iOS): SM-2 spaced repetition, 390 DSA problems, completely free, no IAP, negligible traction. DSA only. [App Store id6754247227]
- PatternBank (iOS, "Spaced Repetition for Coding"): free scheduler for externally solved LeetCode problems, 2 ratings since Feb 2026 launch. No content of its own. [App Store id6759760762]
- System Design Primer distributes free Anki decks for system design and OO design. [github.com/donnemartin/system-design-primer]
- No verified player combines SRS mechanics, content breadth beyond DSA (AI engineering, ML, SQL, certs), multiple card formats, and paid one-time unlock. That combination is the open gap.

**Pricing evidence supports a lean free tier and a $20-25 one-time unlock.**

- Hard-paywall apps convert downloads to paid at a 12.11% median vs 2.18% for freemium, a ~5.5x gap (intent-selection caveat applies; not a straight revenue multiplier). [RevenueCat State of Subscription Apps 2025]
- Education is the highest-priced category by annual subscription median: $44.99/yr. A $24.99 one-time unlock is about half of one year of median education subscription spend. [RevenueCat 2026, Airbridge]
- Roughly one in four subscription apps offers a lifetime plan; one-time unlocks are mainstream, not exotic. [RevenueCat 2025/2026]
- AnkiMobile has sustained $24.99 paid-upfront on iOS for over a decade in the SRS category specifically, with the developer citing App Store purchase trust and low friction as the reason to prefer it over web subscriptions. [faqs.ankiweb.net]
- Education funnel benchmarks: 6.5% median download-to-trial (D30), ~25% trial-to-paid. [RevenueCat 2026, Adapty]

## Positioning

**Claim: the spaced-repetition trainer for tech interviews, built for the AI era.**

- The code-writing-practice crowd (LeetCode, Boot.dev, Codecademy, Sololearn) teaches you to solve. Nobody owns "makes it stick". Jimothy's one-liner writes itself: practice apps teach you to solve; Jimothy makes sure you still remember it in the interview.
- The AI engineering corpus (11 decks: transformers, RAG, inference, fine-tuning, evals, AI system design) is content no verified competitor has in card form. In 2026 hiring, AI-adjacent interview loops are the growth segment. Lead with it.
- Five card formats + AI recall grading beat the "flashcards = passive flipping" objection that hangs over Anki-style tools.
- Not positioned against Anki: Anki is a tool you fill; Jimothy is a curriculum you start using in the first 30 seconds.

## Free curriculum (the enticing part)

Design rules from the evidence: keep the free tier lean enough to preserve purchase intent (the 5.5x hard-paywall signal), but complete enough that a free user builds a real habit, hits a real streak, and has a reason to tell a friend. Gate content depth, never the habit loop.

**Free forever:**

1. All mechanics: sessions, daily review, SRS scheduling, streak flame, stats, weekly report. A gated streak is a dead streak, and the streak is the retention engine.
2. One complete flagship deck per track (the full first-interview loop, all five card formats on display):
   - Big-O & Complexity (19 cards)
   - Python Fundamentals (18)
   - ML Fundamentals (15)
   - AI Interview Drills (15)
   - plus SQL Interview (13) as the "useful at every job" hook
   That is ~80 cards of genuinely complete prep, more than AlgoCards' entire value proposition in scope, against ~500+ paid.
3. Preview of every locked deck: browse the full deck list, study the first 3 cards of any locked deck (Boot.dev's demo-chapters pattern). Breadth stays visible so the corpus sells itself.
4. Everything user-generated: imported deck files, shared-link decks, AI-generated decks (BYO API key), and Interview Misses postmortem decks. This is the viral loop; it must never touch the paywall. A free user who generates and shares a great deck is doing our marketing.

## Paid corpus (the one-time unlock)

**Unlock everything: all built-in decks, current and future.** One SKU, no consumables, no subscription at launch. "Buy once, every deck we ever ship" is the anti-Codecademy pitch and matches App Store one-time-unlock trust.

At launch the paid corpus is the remaining ~30 decks (~410 cards): the AI Engineering depth track (10 more decks), all coding patterns, ML & Data, Python beyond fundamentals, and cert prep.

**Corpus build-out targets (pre-launch content work):**

- Grow to ~60 decks / 1000+ cards so the unlock feels bottomless next to the free 80:
  - New track: System Design (5-6 decks: fundamentals, scaling, storage, queues and caches, case-study drills). Expected by every senior loop; currently our biggest gap and partially commoditized by free Anki decks, so ours must be better structured, not merely present.
  - New track: Behavioral & Story (3-4 decks: STAR drills, conflict and failure stories, manager/senior variants).
  - New track: JavaScript & TypeScript (4-5 decks) to widen the top of funnel beyond Python.
  - Deepen thin decks toward 20+ cards (current average is 14).
- Quality bar per CLAUDE.md style rules; every deck usable in both quick and longform daily review.

## Price

**$24.99 one-time, launching at $14.99 intro price.**

- $24.99 is AnkiMobile parity: the one proven, decade-stable price point for a paid SRS app on iOS, and about half of one year of the median education subscription. Under Codecademy Pro, one month costs nearly as much as Jimothy costs once.
- Round-2 anchors make $24.99 look conservative, not expensive: NeetCode charges $119 for one YEAR and $297 for lifetime; Interview Cake starts at $249 for three weeks. Jimothy's lifetime unlock at a tenth of NeetCode's is an easy comparison to market, and there is no verified one-time-unlock competitor on the App Store itself.
- Launch at $14.99 ("launch price") for the first weeks: captures the early, price-sensitive audience, creates urgency, and leaves an announced-price-rise story for launch marketing. Raise to $24.99 once ratings accumulate.
- Keep the door open for a later hybrid (optional subscription for server-side AI features that cost us money per use, e.g. built-in AI grading without BYO key). Hybrid subscription+lifetime is mainstream (~25% of apps). Never move existing buyers' entitlements.

## Round-2 competitor fact sheets (verified 2026-07-21)

**One-time/lifetime tiers exist in this market, at web prices far above ours:**

- NeetCode Pro: Lifetime $297 one-time (struck from $599, all future content included) or One-Year $119 one-time with auto-renew OFF by default, explicitly positioned against subscriptions. [neetcode.io/pro]
- Interview Cake: one-time-only across ALL tiers: $249 for 3 weeks, $349 for 12 months, $999 lifetime. "Just pay once" is their pitch. [interviewcake.com/upgrade]
- Coddy: four tiers (Free, Plus, Pro, Lifetime); Lifetime is a one-time payment for Pro forever (price not published on FAQ). Free tier is generous on content but throttled by a daily energy limit. [coddy.tech/faqs]
- Critically: none of the three sells its one-time tier through iOS in-app purchase. There is still no verified App Store one-time-unlock competitor in this niche.

**Subscription-only players:**

- LeetCode Premium: $35/mo or $159/yr, no lifetime. [leetcode.com]
- Sololearn: PRO $12.99/mo or ~$69.96/yr; MAX ~$119.52/yr adds AI features. No lifetime SKU on web or in App Store IAPs. Traction: 4.8 stars, 81K US ratings, the strongest verified traction in the cohort.
- Mimo: free Basic (intro sections of all paths) + Pro/Max billed yearly; support page states "we do not offer lifetime subscriptions."
- Brilliant: subscription only (gift refs: $240/yr); free tier is 2 "keys" (lessons) per day; streaks, XP, and leagues explicitly free.

**Engagement-mechanics playbook (recurs across Sololearn, Coddy, Brilliant, Mimo):**

- Monetize by rate-limiting free usage with a consumable (Hearts, energy, keys), never by paywalling streaks/XP/leagues, which stay free.
- AI features are the emerging second-tier upsell everywhere (Sololearn MAX, Coddy Pro, Brilliant's tutor, Mimo's AI tutor).
- Jimothy's read: the consumable rate-limiter pattern exists to create recurring annoyance that sells recurring subscriptions. A one-time unlock monetizes completeness instead, so we content-gate (Boot.dev demo pattern) and leave practice volume unlimited; punishing reviews would fight the SRS learning outcome that is our whole positioning.

**Still unverified (research gaps):** Codefinity entirely (including its reported billing complaints); Duolingo's mechanics/pricing; DataCamp mobile; exact Coddy/Mimo/Brilliant prices (client-side rendered checkouts); App Store ratings for LeetCode mobile, Brilliant, Mimo.

## Explicitly not doing

- No ads, ever (poisons the "serious prep" positioning).
- No hearts/energy caps on studying (we want more reviews, not fewer; punishing practice is for engagement-farming, not learning outcomes).
- No subscription for content at launch (the whole positioning is anti-subscription-fatigue).
- No claims from refuted research data (Sensor Tower education figures, Adapty education price medians, one-time-purchase revenue share).
