import type { Deck } from '../types';

export const aiInterviewDrills: Deck = {
  id: 'ai-interview-drills',
  title: 'AI Interview Drills',
  description: 'Real interview scenarios: explain, debug, estimate — out loud.',
  icon: '🎤',
  color: '#e879f9',
  track: 'AI Engineering',
  cards: [
    {
      id: 'aid-explain-llm',
      type: 'flash',
      front: 'DRILL: "Explain how ChatGPT works" — to a smart non-engineer, 60 seconds.',
      back: 'One version: "It’s a next-word predictor trained on a huge slice of the internet — like autocomplete, but so good at predicting that it had to learn grammar, facts, and reasoning to do it. Then it was tuned on examples of helpful conversations, and refined by humans rating its answers. When you type, it generates the reply one word at a time, each word chosen from what’s most plausible given everything so far." Practice until it flows — this question opens more AI interviews than any other.',
    },
    {
      id: 'aid-trace-request',
      type: 'flash',
      front: 'DRILL: "Walk me through what happens end-to-end when a user asks your RAG app a question."',
      back: 'The trace, spoken: request hits the FastAPI endpoint → Pydantic validates → the question is embedded with the same model as ingestion → vector search returns top-k chunks → (rerank) → prompt assembled: instructions + chunks + question → LLM call with timeout/retry → answer streams back with citations → trace logged with request ID. Practicing THIS trace killed you at TCS — now it’s a party trick. Adapt per project.',
    },
    {
      id: 'aid-no-citations',
      type: 'mcq',
      prompt: 'Your RAG bot answers well but never cites sources. First thing to check?',
      choices: [
        'The prompt — are citations explicitly instructed AND demonstrated in the expected output format?',
        'The embedding model quality',
        'The vector database index',
        'The GPU drivers',
      ],
      answer: 0,
      explanation:
        'Debug in causal order: the model can only cite if asked and shown how. Format compliance is a prompting problem before it is a retrieval problem — check the cheap layer first.',
    },
    {
      id: 'aid-user-says-lied',
      type: 'flash',
      front: 'DRILL: "A user reports your bot gave a wrong answer. Debug it live for me."',
      back: 'Narrate the split: pull the trace for that request → look at the retrieved chunks FIRST. Path A — the right info never arrived: retrieval failure (chunking? query phrasing? missing doc?). Path B — good context arrived but the answer ignored/contradicted it: generation failure (prompt, model, context position). The one question "was it retrieval or generation?" halves the search space, and asking it out loud is what competence sounds like.',
    },
    {
      id: 'aid-token-math',
      type: 'mcq',
      prompt: 'Quick estimate: a 500-word document is roughly how many tokens?',
      choices: ['~650–700 (≈1.3 tokens per English word)', '~250', '~500 exactly', '~2,000'],
      answer: 0,
      explanation:
        'The 1.3×-words rule (or ~4 chars/token) powers every cost and context estimate. Code tokenizes worse (~2×). Doing this instantly makes the next card possible.',
    },
    {
      id: 'aid-embed-cost',
      type: 'flash',
      front: 'DRILL: "Ballpark the cost of embedding 10 million documents." Do the arithmetic out loud.',
      back: 'Assume ~500 words ≈ 650 tokens/doc → 6.5B tokens. At ~$0.02/M tokens (small embedding model): ≈ $130. Punchline: embedding is cheap — the real costs are the vector-store hosting and the LLM calls at query time. Interviewers care about the METHOD: state assumptions, multiply, sanity-check, name what dominates. Wrong-but-reasoned beats silent-and-right.',
    },
    {
      id: 'aid-json-prod',
      type: 'mcq',
      prompt: 'Model returns valid JSON in dev; in production ~2% of responses are cut off mid-object. Likely cause?',
      choices: [
        'max_tokens truncation on longer inputs — raise the cap, validate + retry on parse failure, or use structured output',
        'The model forgets JSON under load',
        'Network packet loss',
        'Temperature drift',
      ],
      answer: 0,
      explanation:
        'finish_reason: "length" is the tell. The robust stack: structured output/schema mode + Pydantic validation + one bounded retry — never trust, always verify, degrade gracefully.',
    },
    {
      id: 'aid-eval-summarizer',
      type: 'flash',
      front: 'DRILL: "How would you evaluate our new summarization feature?"',
      back: 'Layered answer: 1) Define failure modes first (missed key facts, fabrications, wrong tone/length). 2) Programmatic checks: length bounds, entity coverage against the source. 3) LLM judge with a rubric scoring faithfulness and coverage separately — validated against a small human-labeled set (cite your 33%-agreement scar here). 4) Pairwise A/B against the current version. 5) In production: user edit-rate as the behavioral metric. Metrics you don’t validate are vibes with decimals.',
    },
    {
      id: 'aid-context-overflow',
      type: 'mcq',
      prompt: 'A user pastes a 300-page contract; it exceeds the context window. Best strategy ladder?',
      choices: [
        'Depends on the task: RAG over the doc for Q&A; hierarchical map-reduce summarization for a summary; never silently truncate the middle',
        'Truncate to the first N pages, silently',
        'Refuse all long documents',
        'Always summarize first regardless of task',
      ],
      answer: 0,
      explanation:
        '"It depends on the task, here’s the mapping" is the senior answer shape. Silent truncation is the trap option — it produces confident answers about the missing part.',
    },
    {
      id: 'aid-embeddings-pm',
      type: 'flash',
      front: 'DRILL: "Explain embeddings to a product manager" — no math allowed.',
      back: 'An analogy that lands: "We turn every piece of text into coordinates on a giant map of meaning — texts about the same thing end up near each other, even with zero words in common. Search then becomes: drop the question onto the map, grab whatever’s closest. That’s why it finds ‘reset my password’ when the user typed ‘can’t log in’." Keep one analogy rehearsed per core concept: embeddings, context window, fine-tuning vs RAG, temperature.',
    },
    {
      id: 'aid-favorite-paper',
      type: 'flash',
      front: 'DRILL: "What AI developments are you excited about lately?" — how do you prep this?',
      back: 'Have TWO rehearsed, each tied to your own work: one technique you’ve actually used (e.g. LLM-as-judge validation — segue to prosody-judge) and one you’re exploring (e.g. agentic evaluation or DPO on preference exhaust — segue to your roadmap). Structure each: what it is → why it matters → what you did or would do with it. Never answer this cold; it’s an audition for "does this person actually follow the field?"',
    },
    {
      id: 'aid-role-positioning',
      type: 'flash',
      front: 'DRILL: "What does an AI engineer do that a data scientist or ML engineer doesn’t?"',
      back: 'A clean cut: data scientists find signal in data; ML engineers train and productionize models; AI engineers build products on top of foundation models — prompting, retrieval, tool use, evals, cost/latency engineering — where the model is an API, not an artifact you trained. The skill center of gravity: systems + evaluation, not gradient math. Then land it: your judge, RAG, and extraction projects are all exactly this layer.',
    },
    {
      id: 'aid-hallucination-fix',
      type: 'mcq',
      prompt: '"Our bot hallucinates. Fix it." — the strongest opening move in your answer?',
      choices: [
        'Quantify it first: build a groundedness eval to measure the rate, THEN apply grounding/citations/abstention — you can’t fix what you can’t measure',
        'Switch to the biggest model available',
        'Set temperature to 0 and declare it fixed',
        'Add "do not hallucinate" to the prompt',
      ],
      answer: 0,
      explanation:
        'Measurement before mitigation, every time. The other three options are real things people do — naming why each falls short (cost, marginal, mostly placebo) earns the follow-up respect.',
    },
  ],
};
