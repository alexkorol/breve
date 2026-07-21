import type { Deck } from '../types';

export const projProsodyJudge: Deck = {
  id: 'proj-prosody-judge',
  title: 'My Project: prosody-judge',
  description: 'Your LLM-as-judge system and its honest polish-bias story.',
  icon: '🎼',
  color: '#db2777',
  track: 'My Projects',
  cards: [
    {
      id: 'pj-pitch',
      type: 'flash',
      front: 'Deliver the prosody-judge 30-second pitch.',
      back: '"An asynchronous LLM-as-a-judge tool that scores lyric artifacts and optional creative traces through eight focused rubrics: five lyric dimensions plus three trace dimensions. It calls a DeepSeek-compatible API with bounded concurrency, runs repeated judgments per rubric for uncertainty signals, aggregates structured scores, tracks estimated cost, and produces reports. Built as the evaluation dependency for my lyric-generation project."',
    },
    {
      id: 'pj-separate-rubrics',
      type: 'mcq',
      prompt: 'Why one API call per rubric dimension instead of one all-in-one score?',
      choices: [
        'Isolated dimensions have clear interpretations and one broad impression can’t anchor every score: at the cost of more API calls',
        'The API rejects prompts with multiple questions',
        'It is cheaper than a combined call',
        'Single scores are impossible to parse',
      ],
      answer: 0,
      explanation:
        'Rubric isolation is the design decision interviewers probe first. Name the tradeoff yourself (more calls per song) before they do.',
    },
    {
      id: 'pj-repeated-runs',
      type: 'mcq',
      prompt: 'What do the repeated judgment runs per rubric buy you?',
      choices: [
        'An uncertainty signal: high dispersion on the same lyric routes it to human review instead of silent promotion',
        'Higher average scores',
        'Faster batch completion',
        'Protection against rate limits',
      ],
      answer: 0,
      explanation:
        'A mean score means little if the judge disagrees with itself. Dispersion-as-routing-signal is your version of self-consistency, and it connects directly to the LLM Judges & Bias deck.',
    },
    {
      id: 'pj-async',
      type: 'flash',
      front: 'Why async with bounded concurrency? (Whiteboard the mechanism.)',
      back: 'The workload is dominated by remote API waits, so asyncio overlaps hundreds of in-flight requests on one thread, collapsing batch wall-time. An asyncio.Semaphore bounds concurrent requests: that single knob controls both rate-limit behavior and spend velocity. This is also your concrete answer to any generic "explain async in Python" question: your own judge is the example.',
    },
    {
      id: 'pj-blind-test',
      type: 'mcq',
      prompt: 'Your blind validation: 70 human pairwise comparisons vs the judge. The result?',
      choices: [
        '33% agreement: worse than the 50% coin flip, because polish bias inverted the rankings',
        '92% agreement: the judge was ready for production',
        '50%: exactly random',
        'The study was never run',
      ],
      answer: 0,
      explanation:
        'The judge systematically preferred clean-but-forgettable writing over what humans actually chose. Below-random means it tracked a real signal: the WRONG one. This is your strongest eval-role story precisely because it is a failure you caught by measuring.',
    },
    {
      id: 'pj-failure-story',
      type: 'flash',
      front: '"Tell me about a time your evaluation approach failed.": deliver the polish-bias story arc.',
      back: 'Built the judge → sanity-checked on a 4-item calibration set (it correctly ranked the deliberately generic AI sample last) → ran 70 blinded human pairwise comparisons → 33% judge–human agreement vs a 50% coin flip → diagnosed polish bias: fluent, tidy lyrics outscored the raw ones humans preferred → conclusion: an LLM judge is a model, and unvalidated judges are worse than no judge, because they invert your rankings with confidence. Sixty seconds, no notes.',
    },
    {
      id: 'pj-process-vs-artifact',
      type: 'mcq',
      prompt: 'Why judge process/trace quality separately from artifact quality?',
      choices: [
        'A fluent reasoning trace can mask weak final lyrics: conflating them lets style launder substance',
        'Process judging is cheaper',
        'The API requires separate endpoints',
        'Artifacts cannot be scored directly',
      ],
      answer: 0,
      explanation:
        'The same polish-bias theme at the architectural level: never let presentation of the journey stand in for quality of the destination.',
    },
    {
      id: 'pj-overclaim',
      type: 'flash',
      front: 'The do-not-overclaim list: what do you refuse to say about prosody-judge, and why does that help you?',
      back: 'Never claim: it replaces human evaluation; measured correlation with human taste (the full study is the next step); that the large corpus was artifact-quality judged (that pass judged process/linkage usefulness); that it’s a working GRPO/DPO reward model. Calibrated claims are a feature: interviewers for eval roles are professionally allergic to overclaiming, and the discipline itself demonstrates evaluation maturity.',
    },
    {
      id: 'pj-scale-numbers',
      type: 'mcq',
      prompt: 'The headline numbers from the large Prosody judging run?',
      choices: [
        '14,007 sheets for $1.51: roughly $0.0001 per item; a 0.3% keep rate (45 kept)',
        '1,400 sheets for $151',
        '14,007 sheets for $144',
        '500 sheets, cost untracked',
      ],
      answer: 0,
      explanation:
        'Cheap triage at scale: "taste as a compute problem." Companion number: a $0.25 eval once cancelled a $144 training run, because the spending gate existed before the results did.',
    },
    {
      id: 'pj-spending-gate',
      type: 'mcq',
      prompt: 'The $0.25 eval that cancelled a $144 training run: the transferable principle?',
      choices: [
        'Build cheap evaluation gates before expensive compute, so bad runs die at the gate',
        'Training runs should never be cancelled',
        'Evals should cost at least as much as training',
        'Always train first, evaluate later',
      ],
      answer: 0,
      explanation:
        'Eval-first discipline, stated in dollars. This one sentence carries an entire production-mindset argument in interviews.',
    },
    {
      id: 'pj-versioning',
      type: 'flash',
      front: '"Your prompt code didn’t change but scores drifted. Why?": your versioning answer.',
      back: 'The judge model behind the API changed, or sampling variance moved the distribution. That’s why rubric text, prompt template, and judge-model identifier are all versioned together: changing ANY of them changes the annotation distribution, making old and new scores incomparable. Treat judge output like data with a schema version, not like truth.',
    },
    {
      id: 'pj-10k-run',
      type: 'mcq',
      prompt: 'Before running the judge over 10,000 rows, what must exist?',
      choices: [
        'Incremental JSONL persistence with checkpoint/resume, plus an explicit spend ceiling',
        'A GPU cluster',
        'A larger judge model',
        'Nothing: just run it overnight',
      ],
      answer: 0,
      explanation:
        'Long API batches fail mid-run; without persistence you pay twice, without a budget cap a retry loop can burn real money. You know this because your batch design already does incremental writes.',
    },
    {
      id: 'pj-pairwise-next',
      type: 'flash',
      front: 'The planned evolution: absolute scores → pairwise. Why, and how would you aggregate?',
      back: 'Absolute 1–10 scores are readable but drift between calls; pairwise "which of these two is better" aligns with the actual decision (model selection) and is more stable. Aggregate pairwise outcomes with win rates or Elo/Bradley–Terry. Bonus connection: the same-brief pairwise mode against ReMi and open-model outputs is exactly the preference data a future reward model would train on.',
    },
  ],
};
