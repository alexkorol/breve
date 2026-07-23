import type { Deck } from '../types';

export const featureEng: Deck = {
  id: 'feature-eng',
  title: 'Features & Model Selection',
  description: 'Structuring a model project: baselines, features, selection, drift.',
  icon: '🧪',
  color: '#34d399',
  track: 'ML & Data',
  cards: [
    {
      id: 'fe-project-structure',
      type: 'flash',
      front: '"How would you structure an ML project from scratch?": the answer you rehearse.',
      back: 'A recitable arc: 1) Define the target and the metric FROM BUSINESS COST, plus a dumb baseline. 2) Split data first (leakage-proof), stratified/temporal as appropriate. 3) EDA + cleaning. 4) Feature pipeline (fit on train only). 5) Simple model first: logistic regression / gradient boosting. 6) Iterate against validation; error analysis over hyperparameter worship. 7) One final test-set reading. 8) Ship with monitoring for drift.',
    },
    {
      id: 'fe-baseline',
      type: 'mcq',
      prompt: 'Why insist on a dumb baseline (majority class, mean predictor) before modeling?',
      choices: [
        'It anchors every later number: 92% accuracy is meaningless until you know the baseline is 91%',
        'scikit-learn requires a fitted DummyClassifier baseline before it will report metrics on a pipeline',
        'It speeds up training: the baseline warm-starts the real model, so it converges in fewer iterations',
        'Stakeholders demand simple models',
      ],
      answer: 0,
      explanation:
        'It also guards against the accuracy paradox. "What did the baseline score?" is one of the most common interviewer probes on any modeling story.',
    },
    {
      id: 'fe-datetime',
      type: 'mcq',
      prompt: 'Best features from a raw timestamp column for demand prediction?',
      choices: [
        'Decomposed parts: hour, day-of-week, month, is-weekend; cyclical patterns become learnable',
        'The raw Unix epoch as one number: all the calendar information is in there, so any model can recover hour and weekday from it',
        'Drop it: time is not a feature',
        'A string like "2026-07-04"',
      ],
      answer: 0,
      explanation:
        'Epoch seconds hide periodicity behind a monotonic ramp. Bonus points: sin/cos encoding for cyclic features so hour 23 sits next to hour 0.',
    },
    {
      id: 'fe-target-encoding',
      type: 'mcq',
      prompt: 'Target encoding (replace category with mean target): the danger?',
      choices: [
        'Leakage: each row’s own target sneaks into its feature; use out-of-fold encoding and smoothing',
        'It only works for binary targets: continuous targets cannot be averaged within a category',
        'Dimensionality explosion: it creates one new column per category level, even worse than one-hot',
        'No danger; it is always safe',
      ],
      answer: 0,
      explanation:
        'Naive target encoding gives dazzling validation scores that evaporate in production. Rare categories need smoothing toward the global mean too.',
    },
    {
      id: 'fe-interaction',
      type: 'flash',
      front: 'When does feature engineering still beat "throw it at a big model"?',
      back: 'Tabular data: gradient-boosted trees plus thoughtful features routinely beat neural nets there. High-leverage moves: ratios (price/sqft), aggregates per entity (user’s 30-day average), counts since last event, and domain flags encoding expert knowledge. Deep learning earns its keep on images, text, and audio, where it learns the features itself.',
    },
    {
      id: 'fe-multicollinearity',
      type: 'mcq',
      prompt: 'Two features correlate at 0.98. Who cares, and who doesn’t?',
      choices: [
        'Linear-model coefficients become unstable/uninterpretable; trees barely care about predictive performance',
        'Every model fails: correlated features double-count the same signal, so predictions are biased upward in any algorithm',
        'It always improves accuracy',
        'Only neural networks are affected, since backprop cannot separate gradients flowing through correlated inputs',
      ],
      answer: 0,
      explanation:
        'Multicollinearity is an INTERPRETATION problem more than a prediction problem. Drop one, combine them, or use regularization if coefficients must mean something.',
    },
    {
      id: 'fe-feature-importance',
      type: 'mcq',
      prompt: 'Most trustworthy way to ask "which features matter?"',
      choices: [
        'Permutation importance on the VALIDATION set: shuffle a feature, watch the metric drop',
        'Tree impurity importances: they come from the actual splits, so they are unbiased by construction',
        'Coefficient sizes on unscaled features: the biggest coefficient marks the most important feature',
        'The order columns appear in the dataframe',
      ],
      answer: 0,
      explanation:
        'Impurity importances inflate high-cardinality features; unscaled coefficients compare apples to freight trains. Permutation importance measures what the model actually uses. SHAP for per-prediction stories.',
    },
    {
      id: 'fe-cv',
      type: 'flash',
      front: 'k-fold cross-validation: mechanics, and the two situations that break vanilla k-fold.',
      back: 'Split into k folds; train on k−1, validate on the held-out fold, rotate, average the k scores: every row validates exactly once. Breaks: 1) time series; random folds train on the future; use expanding-window/TimeSeriesSplit. 2) grouped data: same user in train and validation leaks identity; use GroupKFold. Stratify for imbalanced classes.',
    },
    {
      id: 'fe-imbalanced-choice',
      type: 'mcq',
      prompt: 'Fraud at 0.5% positive rate: your first modeling levers?',
      choices: [
        'class_weight="balanced" (or scale_pos_weight), PR-AUC as the metric, threshold tuned to cost: resampling only if those fall short',
        'SMOTE the full dataset immediately: synthetic minority rows fix the imbalance at the source, so metrics and thresholds can stay at their defaults',
        'Accuracy as the metric with a 0.5 threshold',
        'Drop 99% of the negatives to balance the classes; the discarded rows are redundant anyway',
      ],
      answer: 0,
      explanation:
        'Class weights are one line and leak-proof; SMOTE adds synthetic-data risks. Metric and threshold come before data surgery.',
    },
    {
      id: 'fe-model-selection',
      type: 'mcq',
      prompt: 'Tabular business data, 50k rows, mixed types, need decent results this week. First model?',
      choices: [
        'Gradient boosting (XGBoost/LightGBM): the tabular default; strong, fast, handles mixed features',
        'A 12-layer transformer from scratch: attention layers learn tabular feature interactions better than trees at this scale',
        'k-nearest neighbors on raw features: nonparametric, so it needs no training time and no assumptions',
        'Whatever is trending on arXiv',
      ],
      answer: 0,
      explanation:
        'And logistic regression beside it as the interpretable baseline. "GBM for tabular, deep nets for perception, start simple" is a complete model-selection philosophy in one line.',
    },
    {
      id: 'fe-hyperparam',
      type: 'mcq',
      prompt: 'Grid search vs random search vs Bayesian optimization?',
      choices: [
        'Random beats grid at equal budget (covers more values per axis); Bayesian adds smart guessing when evals are expensive',
        'Grid is always best: exhaustive coverage guarantees hitting the optimum, while random search can only stumble on it by luck',
        'Bayesian is required for any tuning',
        'They give identical results',
      ],
      answer: 0,
      explanation:
        'The Bergstra–Bengio result: few hyperparameters matter, random explores each dimension better. Honest add-on: error analysis usually pays more than tuning past the first pass.',
    },
    {
      id: 'fe-drift',
      type: 'flash',
      front: 'The model shipped. What breaks silently, and what do you monitor?',
      back: 'Data drift (input distributions shift: new user segments, upstream schema changes) and concept drift (the input→output relationship itself changes; fraud adapts). Monitor: input stats vs training profile, prediction distribution, delayed ground-truth metrics, and per-segment slices. Alert thresholds + scheduled retraining. Deployment is where ML engineering starts, not where it ends.',
    },
    {
      id: 'fe-scaling-recap',
      type: 'mcq',
      prompt: 'Which models need feature scaling, quick-fire?',
      choices: [
        'kNN, SVM, linear/logistic with regularization, neural nets: yes; tree ensembles, no',
        'All models equally: any algorithm doing arithmetic on features is distorted by unscaled inputs',
        'Only neural networks: other estimators standardize internally before fitting',
        'None, scaling is cosmetic',
      ],
      answer: 0,
      explanation:
        'Distance- and gradient-based methods care about scale; trees split on order and don’t. Regularization especially: penalties compare coefficient sizes across features, which is meaningless unscaled.',
    },
    {
      id: 'fe-error-analysis',
      type: 'flash',
      front: 'Your model plateaus at 85%. The highest-leverage next step is NOT more tuning: what is it?',
      back: 'Error analysis: read 50–100 actual mistakes and categorize them. You will find label errors, a data-quality subgroup, a missing feature, or a class the model never sees: each worth more than any hyperparameter. Andrew Ng’s discipline: fix the pipeline the errors point at, not the knob you happen to know. The same discipline applies to LLM evals.',
    },
  ],
};
