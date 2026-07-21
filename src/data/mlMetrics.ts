import type { Deck } from '../types';

export const mlMetrics: Deck = {
  id: 'ml-metrics',
  title: 'Metrics: Precision & Recall',
  description: 'Confusion matrix, F1, ROC — rehearse the answers you say out loud.',
  icon: '🎯',
  color: '#ec4899',
  track: 'ML & Data',
  cards: [
    {
      id: 'met-verbal-pr',
      type: 'flash',
      front:
        'Interview: "Explain precision vs recall." Give the 20-second answer, with an example.',
      back: 'Precision: of everything I flagged positive, how much was actually positive — it measures how much you can trust the alarms. Recall: of everything actually positive, how much did I catch — it measures what you miss. Spam filter: precision drops when real mail lands in spam (false alarms); recall drops when spam reaches the inbox (misses).',
    },
    {
      id: 'met-mnemonic',
      type: 'flash',
      front: 'A mnemonic to never mix up precision and recall again.',
      back: 'Both start with TP on top. Precision = TP / all PREDICTED positive (TP + FP) — "of my Predictions, how many right?" Recall = TP / all REAL positive (TP + FN) — "of the Real ones, how many did I recall?" P → Predicted, R → Real.',
    },
    {
      id: 'met-precision-formula',
      type: 'fill',
      prompt: 'Precision penalizes false alarms:',
      code: 'precision = TP / (TP + ____)',
      answers: ['FP'],
      distractors: ['FN', 'TN', 'P'],
      explanation: 'Denominator = everything you predicted positive. FP is the false alarm.',
    },
    {
      id: 'met-recall-formula',
      type: 'fill',
      prompt: 'Recall penalizes misses:',
      code: 'recall = TP / (TP + ____)',
      answers: ['FN'],
      distractors: ['FP', 'TN', 'N'],
      explanation: 'Denominator = everything actually positive. FN is the miss.',
    },
    {
      id: 'met-compute',
      type: 'mcq',
      prompt:
        'Your spam model flags 50 emails; 40 of them are truly spam. The inbox contained 60 spam emails total. Precision and recall?',
      choices: [
        'Precision 0.80, recall ≈ 0.67',
        'Precision ≈ 0.67, recall 0.80',
        'Both 0.80',
        'Precision 0.40, recall 0.50',
      ],
      answer: 0,
      explanation:
        'Precision = 40/50 flagged = 0.80. Recall = 40/60 actual = 0.67.',
    },
    {
      id: 'met-which-error',
      type: 'mcq',
      prompt: 'Optimizing for precision means you most fear…',
      choices: ['False positives', 'False negatives', 'True negatives', 'Class imbalance'],
      answer: 0,
      explanation:
        'Precision punishes false alarms. Recall punishes misses (false negatives). Name the costly error first, then pick the metric.',
    },
    {
      id: 'met-scenarios',
      type: 'mcq',
      prompt:
        'A small fraud team can review only the top 100 alerts per day out of millions of transactions. Which metric matters most for what you send them?',
      choices: [
        'Precision — wasted reviews on false alarms burn the scarce resource',
        'Recall — catching every fraud is all that matters',
        'Accuracy — overall correctness',
        'Mean squared error',
      ],
      answer: 0,
      explanation:
        'The reviewers are the bottleneck, so false positives are the expensive error. Compare: cancer screening flips it — a miss is catastrophic, so recall wins. Same logic, different cost structure.',
    },
    {
      id: 'met-tradeoff',
      type: 'flash',
      front:
        'Interview: "How do precision and recall trade off?" (Hint: the classification threshold.)',
      back: 'A classifier outputs a score; the threshold turns it into a decision. Raise the threshold → fewer, more confident positives → precision up, recall down. Lower it → you catch more but flag more junk → recall up, precision down. So you tune the threshold to the business cost of each error — the model doesn’t have one precision, it has a curve.',
    },
    {
      id: 'met-f1',
      type: 'flash',
      front: 'What is F1, and why the harmonic mean instead of a plain average?',
      back: 'F1 = 2·P·R/(P+R), the harmonic mean of precision and recall. Harmonic mean crashes toward the worse of the two — a model with P=1.0, R=0.02 averages to 0.51 but scores F1≈0.04, exposing the uselessness. Use it when both error types matter and classes are imbalanced.',
    },
    {
      id: 'met-accuracy-trap',
      type: 'mcq',
      prompt: 'When is 99% accuracy meaningless?',
      choices: [
        'When 99% of the data is one class — always predicting it scores 99%',
        'When the model is a neural network',
        'When the test set is too large',
        'Accuracy is always the best summary metric',
      ],
      answer: 0,
      explanation:
        'The accuracy paradox: with 1% fraud, "never fraud" is 99% accurate and 0% useful. This is exactly why precision and recall exist.',
    },
    {
      id: 'met-confusion',
      type: 'flash',
      front: 'Draw the 2×2 confusion matrix from memory and read each cell.',
      back: 'Rows = actual, columns = predicted. TP: actual + predicted positive. FN: actual positive, predicted negative (the miss). FP: actual negative, predicted positive (the false alarm). TN: both negative. Every threshold metric — precision, recall, specificity, accuracy, F1 — is arithmetic on these four cells.',
    },
    {
      id: 'met-roc',
      type: 'flash',
      front: 'ROC curve and AUC — what is plotted, and what does AUC actually mean?',
      back: 'ROC plots true-positive rate (recall) vs false-positive rate as the threshold sweeps. AUC is the area under it: the probability a random positive example scores higher than a random negative one. 1.0 = perfect ranking, 0.5 = coin flip. Under heavy class imbalance prefer the precision-recall curve — ROC can look deceptively good.',
    },
    {
      id: 'met-auc-half',
      type: 'mcq',
      prompt: 'A model has AUC = 0.5. What does that tell you?',
      choices: [
        'It ranks positives no better than random guessing',
        'It is correct half the time',
        'Precision and recall are both 0.5',
        'The threshold is set to 0.5',
      ],
      answer: 0,
      explanation:
        'AUC is about ranking, not accuracy at a threshold. (And an AUC near 0 means the model is informative but inverted — flip its predictions.)',
    },
    {
      id: 'met-specificity',
      type: 'fill',
      prompt: 'Specificity is recall for the negative class:',
      code: 'specificity = TN / (TN + ____)',
      answers: ['FP'],
      distractors: ['FN', 'TP', 'N'],
      explanation:
        'Of everything actually negative, how much did you correctly leave alone. Common in medical contexts alongside sensitivity (= recall).',
    },
    {
      id: 'met-eval-checklist',
      type: 'flash',
      front: 'Interview: "How would you evaluate a new classifier end to end?"',
      back: 'A checklist you can recite: 1) Pick the metric from the business cost of FP vs FN — before modeling. 2) Compare against a dumb baseline (majority class). 3) Use a proper hold-out or cross-validation; stratify if imbalanced. 4) Look at the confusion matrix, not just one number. 5) Tune the decision threshold on validation data. 6) Slice performance by segment to find where it fails.',
    },
  ],
};
