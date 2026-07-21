import type { Deck } from '../types';

export const llmEvalBias: Deck = {
  id: 'llm-eval-bias',
  title: 'LLM Judges & Bias',
  description: 'LLM-as-judge biases, fairness metrics, and how to validate a judge.',
  icon: '⚖️',
  color: '#f43f5e',
  track: 'AI Engineering',
  cards: [
    {
      id: 'eb-judge-biases',
      type: 'flash',
      front: 'Interview: "What biases show up when you use an LLM as a judge?" Name five.',
      back: 'Position bias — favors the first (sometimes last) option shown. Verbosity bias — longer answers score higher regardless of substance. Self-preference — rates its own model family’s outputs higher. Style/polish bias — fluent, well-formatted answers beat messy-but-correct ones. Sycophancy — agrees with a preference hinted in the prompt. Follow the list with mitigations and the answer is complete.',
    },
    {
      id: 'eb-mitigations',
      type: 'flash',
      front: 'And the follow-up: "How do you mitigate judge bias?"',
      back: 'Run both orders and average (kills position bias). Score against an explicit rubric with named criteria instead of "rate 1–10". Control or penalize length. Use a different model family as judge than generator. And above all: validate the judge against a human-labeled golden set before trusting it — a judge is a model, and unvalidated models are guesses.',
    },
    {
      id: 'eb-position',
      type: 'mcq',
      prompt: 'Your pairwise judge prefers response A — but when you swap the order, it prefers B. What is this and what do you do?',
      choices: [
        'Position bias — evaluate both orders and average (or count it a tie if they disagree)',
        'The responses are exactly equal in quality',
        'Temperature is too low',
        'The judge needs a longer context window',
      ],
      answer: 0,
      explanation:
        'Order-swap disagreement rates run 10–30% in practice. Any pairwise eval that presents a single fixed order is structurally broken.',
    },
    {
      id: 'eb-polish',
      type: 'mcq',
      prompt: 'A judge rates a beautifully formatted but factually wrong answer above a messy correct one. The fix?',
      choices: [
        'Rubric that scores correctness separately from presentation, plus programmatic fact checks where possible',
        'A bigger judge model — size eliminates the bias',
        'Ask the judge to "be objective"',
        'Strip all formatting and hope',
      ],
      answer: 0,
      explanation:
        'Style/polish bias. Decompose the rubric (correctness / completeness / style scored independently) so fluency can’t launder wrong content. If you have ground truth, check facts with code, not the judge.',
    },
    {
      id: 'eb-pairwise-absolute',
      type: 'flash',
      front: 'Pairwise comparison vs absolute scoring for LLM judges — which and why?',
      back: 'Pairwise ("which is better, A or B?") is more consistent — models are poor at stable absolute scales ("7/10" drifts between calls) but decent at comparisons. Aggregate pairwise results with win rates or Elo/Bradley–Terry. Use absolute scoring only with a tight rubric and calibration examples, when you need per-item scores rather than rankings.',
    },
    {
      id: 'eb-selfconsistency',
      type: 'mcq',
      prompt: 'Sampling the judge 5 times and taking the majority verdict is called…',
      choices: [
        'Self-consistency — it reduces variance from any single noisy sample',
        'Distillation',
        'Reinforcement learning',
        'Beam search',
      ],
      answer: 0,
      explanation:
        'Judges are stochastic; majority-of-k trades cost for stability. Report the agreement rate too — 5/5 verdicts and 3/2 verdicts deserve different confidence.',
    },
    {
      id: 'eb-validate-judge',
      type: 'flash',
      front: '"How do you know your LLM judge is any good?"',
      back: 'Build a golden set: real examples labeled by humans. Measure judge–human agreement on it (accuracy or kappa) before deployment, and per-slice — a judge can be fine on average and broken on one category. Re-validate whenever the judge prompt or model changes. If judge–human agreement is no better than human–human agreement, the judge is fine; if you never measured either, you don’t have an eval, you have an oracle you chose to believe.',
    },
    {
      id: 'eb-kappa',
      type: 'fill',
      prompt: 'The chance-corrected agreement metric between two annotators:',
      code: "agreement = cohen_____(labels_a, labels_b)",
      answers: ['kappa'],
      distractors: ['alpha', 'rho', 'score'],
      explanation:
        "Cohen's kappa corrects raw agreement for agreement expected by chance. ~0.6–0.8 is substantial. (Fleiss' kappa for 3+ raters, Krippendorff's alpha for the general case.)",
    },
    {
      id: 'eb-dataset-bias',
      type: 'flash',
      front: 'Dataset bias taxonomy — the four kinds worth naming in an interview.',
      back: 'Sampling/selection bias: who ended up in the data (survey only reached daytime landlines). Label bias: annotator judgments encode their priors. Measurement bias: the proxy you measure differs from the concept (arrests ≠ crime). Historical bias: the world the data records was itself unfair, so a faithful model reproduces it. Then the kicker: dropping the protected attribute doesn’t help, because of proxies.',
    },
    {
      id: 'eb-proxy',
      type: 'mcq',
      prompt: 'You removed race from the features, but the model still discriminates. How?',
      choices: [
        'Proxy variables — zip code, name, school correlate with the removed attribute',
        'Impossible; removing the column removes the signal',
        'The random seed is unlucky',
        'The model memorized the original column',
      ],
      answer: 0,
      explanation:
        '"Fairness through unawareness" fails because correlated features reconstruct the signal. Real answers: measure outcomes across groups and apply fairness constraints — which requires KEEPING the attribute for measurement.',
    },
    {
      id: 'eb-fairness-metrics',
      type: 'flash',
      front: 'Demographic parity vs equalized odds vs calibration — and the impossibility result.',
      back: 'Demographic parity: equal positive-prediction rates across groups. Equalized odds: equal TPR and FPR across groups. Calibration: a score of 0.8 means 80% for every group. The theorem: with different base rates, you mathematically cannot satisfy all three — so fairness is choosing which to prioritize for this application, explicitly. Knowing there’s a tradeoff IS the answer.',
    },
    {
      id: 'eb-contamination',
      type: 'mcq',
      prompt: 'A model scores suspiciously well on a public benchmark. First suspicion?',
      choices: [
        'Contamination — the benchmark leaked into its training data',
        'The model is simply superior',
        'The benchmark is too hard',
        'Someone set temperature to 0',
      ],
      answer: 0,
      explanation:
        'Public test sets end up in web-scale training corpora. Mitigations: private held-out sets, freshly generated test data, canary strings. Same reason your golden set should never enter any fine-tuning data.',
    },
    {
      id: 'eb-rubric',
      type: 'mcq',
      prompt: 'Why does a rubric ("score correctness 0–2: 2 means…, with examples") beat "rate this 1–10"?',
      choices: [
        'Anchored criteria reduce drift, decompose quality, and make scores auditable',
        'Longer prompts always improve any output',
        'It runs cheaper',
        'Judges refuse numeric scales otherwise',
      ],
      answer: 0,
      explanation:
        'Unanchored scales drift between calls and conflate correctness with style. Rubrics with worked examples are few-shot learning for judgment — and reviewers can audit WHY a score was given.',
    },
  ],
};
