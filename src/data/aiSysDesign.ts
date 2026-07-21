import type { Deck } from '../types';

export const aiSysDesign: Deck = {
  id: 'ai-sys-design',
  title: 'AI System Design',
  description: 'The "design a support bot" round: frameworks for whiteboard composure.',
  icon: '📐',
  color: '#f87171',
  track: 'AI Engineering',
  cards: [
    {
      id: 'sd-framework',
      type: 'flash',
      front: 'The 5-step frame for ANY "design an AI system" interview question.',
      back: '1) Requirements: users, scale, latency budget, cost ceiling, failure tolerance. ASK before designing. 2) Simplest architecture that could work (often one model call + retrieval). 3) Data flow end to end, naming components. 4) Evaluation & feedback loop: how you know it works and improves. 5) Failure modes & guardrails. Interviewers grade the PROCESS; step 4 is where AI candidates differentiate, because most forget it.',
    },
    {
      id: 'sd-support-bot',
      type: 'flash',
      front: 'Whiteboard drill: "Design a customer-support bot over our help docs.": 90 seconds.',
      back: 'Ingestion: docs → chunk (structure-aware, heading context) → embed → vector store; nightly sync.\nQuery path: rewrite conversational query → hybrid retrieve → rerank → generate with citations, strict "answer only from context".\nGuardrails: confidence threshold with human handoff, injection defenses, PII filtering.\nEval: golden Q&A set, retrieval recall@k, groundedness judge, thumbs-down review queue.\nOps: streaming, model routing, prompt caching, dashboards.\nThat skeleton adapts to any RAG product question.',
    },
    {
      id: 'sd-clarify',
      type: 'mcq',
      prompt: 'The interviewer says "design an AI code reviewer." Your FIRST move?',
      choices: [
        'Clarify scope: which languages, inline comments or summary, latency (pre-merge vs async), what does "good" mean?',
        'Start drawing the architecture immediately',
        'Pick the model first',
        'Estimate GPU count',
      ],
      answer: 0,
      explanation:
        'Same discipline as restate-then-example in coding rounds. Two minutes of scoping visibly separates engineers from feature-listers.',
    },
    {
      id: 'sd-human-loop',
      type: 'mcq',
      prompt: 'Where does human-in-the-loop belong in an AI pipeline?',
      choices: [
        'Wherever error cost exceeds review cost: with uncertainty routing deciding WHICH items humans see',
        'Reviewing every output, always',
        'Nowhere; automation is the goal',
        'Only during development',
      ],
      answer: 0,
      explanation:
        'The strong version: route on countable uncertainty signals (confidence scores, missing fields, conflicts) and measure the precision/recall of the routing itself.',
    },
    {
      id: 'sd-cache-layers',
      type: 'mcq',
      prompt: 'The three cache layers of an LLM product, cheapest hit first?',
      choices: [
        'Exact-response cache → semantic cache (similar-enough queries) → provider prompt-prefix cache',
        'GPU cache → RAM → disk',
        'Only one cache is ever needed',
        'Caching breaks LLM correctness',
      ],
      answer: 0,
      explanation:
        'Each layer has a staleness/correctness tradeoff: semantic caching especially needs a similarity threshold and TTL. Naming all three unprompted is a strong systems signal.',
    },
    {
      id: 'sd-fallback',
      type: 'mcq',
      prompt: 'The LLM provider has a 30-minute outage. Your product should…',
      choices: [
        'Degrade gracefully per a designed ladder: secondary provider → smaller local model → cached/static responses → honest error',
        'Show spinners until it returns',
        'Retry every request forever',
        'Have no plan; outages are rare',
      ],
      answer: 0,
      explanation:
        'Model-agnostic plumbing (an OpenRouter-style gateway) makes the first rung nearly free. "What happens when the model is down?" is a favorite follow-up: have the ladder ready.',
    },
    {
      id: 'sd-latency-budget',
      type: 'mcq',
      prompt: 'Chat product, 3-second perceived-latency budget. How do you spend it?',
      choices: [
        'Retrieval + rerank ≤ 500ms, TTFT ≤ 1.5s via streaming: the user reads while decode continues',
        'Generate fully (10s), then display',
        'Skip retrieval to save time',
        'Batch user requests each minute',
      ],
      answer: 0,
      explanation:
        'Streaming converts "total latency" into "TTFT + reading speed". Budget the latency per component, not for the system as a whole.',
    },
    {
      id: 'sd-feedback-loop',
      type: 'flash',
      front: 'Design the feedback loop: how does a shipped AI product get better?',
      back: 'Capture: thumbs up/down with the full trace (prompt version, retrieved chunks, model, output).\nTriage: a negative-feedback review queue where humans label the failure mode (retrieval miss? hallucination? formatting?).\nFeed back: failures become eval cases so the regression suite grows, then prompt/retrieval fixes, eventually fine-tuning data.\nThe flywheel: traces → labels → evals → fixes → better traces. Without capture at step 1, nothing downstream exists.',
    },
    {
      id: 'sd-cost-estimate',
      type: 'mcq',
      prompt: 'Back-of-envelope: 100k queries/day, ~2k input + 500 output tokens each, at $3/M in and $15/M out. Daily cost?',
      choices: [
        '≈ $1,350/day: (0.2B × $3 + 0.05B × $15) per million',
        '≈ $135/day',
        '≈ $13,500/day',
        'Impossible to estimate',
      ],
      answer: 0,
      explanation:
        '100k × 2k = 200M input ($600); 100k × 500 = 50M output ($750). After the estimate, name routing and caching as the levers that bring it down.',
    },
    {
      id: 'sd-abuse',
      type: 'mcq',
      prompt: 'Your free AI endpoint is getting hammered by scripts. Defense stack?',
      choices: [
        'Auth + per-user rate limits + spend caps + anomaly alerts + output size limits',
        'Hope the provider rate-limits for you',
        'CAPTCHA alone',
        'Make the model refuse robots',
      ],
      answer: 0,
      explanation:
        'LLM endpoints are expensive compute behind an HTTP call: treat abuse as a cost attack, not just a nuisance. Per-key budgets are the non-negotiable.',
    },
    {
      id: 'sd-buy-vs-build',
      type: 'flash',
      front: '"Should we build this AI feature or use a vendor?": the structured answer.',
      back: 'Build when the capability IS your differentiation, data is proprietary, or vendor costs at scale exceed an owned solution. Buy/API when it’s table-stakes functionality, volume is unproven, or speed-to-market rules. The hybrid default: prototype on the best API to validate demand, then optimize costs (routing, distillation, self-hosting) once usage justifies it. Premature GPU ownership is the AI version of premature optimization.',
    },
    {
      id: 'sd-monitoring',
      type: 'mcq',
      prompt: 'Day-2 operations: what do you alert on for an LLM feature?',
      choices: [
        'Error/refusal rates, latency percentiles (p95 TTFT), token spend vs budget, eval-score drift on a canary set, feedback-rate changes',
        'Only server CPU',
        'Nothing; LLMs are stateless',
        'Raw output length',
      ],
      answer: 0,
      explanation:
        'A silent model update can shift behavior overnight: the scheduled canary eval catches what infra metrics can’t. "Quality is a metric too" is the closing line.',
    },
  ],
};
