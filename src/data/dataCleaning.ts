import type { Deck } from '../types';

export const dataCleaning: Deck = {
  id: 'data-cleaning',
  title: 'Data Cleaning & Prep',
  description: 'The "how would you clean this dataset?" answer, drilled step by step.',
  icon: '🧹',
  color: '#0ea5e9',
  track: 'ML & Data',
  cards: [
    {
      id: 'dc-walkthrough',
      type: 'flash',
      front:
        'Interview: "You get a messy CSV. Walk me through cleaning it." Give the structured answer.',
      back: 'A pipeline you can recite: 1) Profile first — shape, dtypes, head(), describe(), null counts. 2) Fix types (dates, numeric strings, categories). 3) Remove duplicates. 4) Handle missing values — ask WHY they’re missing before choosing drop/impute/flag. 5) Investigate outliers — typo or truth? 6) Standardize strings and category labels. 7) Validate ranges and cross-field consistency. 8) Do it in code, not by hand, so it’s reproducible and documented. Naming the steps in order is 80% of the answer.',
    },
    {
      id: 'dc-first-move',
      type: 'mcq',
      prompt: 'First thing you do with a dataset you have never seen?',
      choices: [
        'Profile it — df.info(), df.describe(), null counts, a few rows',
        'Impute all missing values with the mean',
        'Drop every row containing a null',
        'Normalize all numeric columns',
      ],
      answer: 0,
      explanation:
        'Never transform before you understand. Profiling reveals wrong dtypes, sentinel values like -999, duplicates, and skew — each changes what "cleaning" means.',
    },
    {
      id: 'dc-null-count',
      type: 'fill',
      prompt: 'Missing values per column, the one-liner:',
      code: 'df.isnull().____()',
      answers: ['sum'],
      distractors: ['count', 'mean', 'any'],
      explanation:
        'True counts as 1, so summing booleans counts nulls. (.mean() gives the fraction missing — also worth knowing.)',
    },
    {
      id: 'dc-missing-strategies',
      type: 'flash',
      front: 'Your options for missing values — and how you choose.',
      back: 'Drop rows (fine when few and random), drop the whole column (when mostly empty), impute median/mode (median beats mean under skew), model/KNN imputation (when relationships matter), or add an is_missing indicator column (when missingness itself is signal). Choose based on how much is missing and WHY. Always compute imputation values on training data only.',
    },
    {
      id: 'dc-mnar',
      type: 'mcq',
      prompt:
        'In a salary survey, income is missing mostly for high earners. Dropping those rows would…',
      choices: [
        'Bias the data — this is MNAR, not missing at random',
        'Be fine, dropping nulls is always safe',
        'Improve model accuracy',
        'Only matter if more than half are missing',
      ],
      answer: 0,
      explanation:
        'Missing Not At Random: the gap depends on the hidden value itself. Dropping silently deletes the top of the distribution. Mentioning MCAR vs MNAR is a strong interview signal.',
    },
    {
      id: 'dc-impute-skew',
      type: 'fill',
      prompt: 'Impute a skewed column (like income) with the robust center:',
      code: "df['income'] = df['income'].fillna(df['income'].____())",
      answers: ['median'],
      distractors: ['mean', 'mode', 'max'],
      explanation:
        'A few billionaires drag the mean far above a typical value; the median ignores them.',
    },
    {
      id: 'dc-duplicates',
      type: 'mcq',
      prompt: 'Why can duplicate rows be worse than they look?',
      choices: [
        'They leak across train/test splits and inflate evaluation scores',
        'They only waste memory',
        'They cause syntax errors in pandas',
        'They are impossible to detect',
      ],
      answer: 0,
      explanation:
        'The same record landing in both train and test means the model is graded on data it memorized. Dedupe (df.drop_duplicates()) before splitting.',
    },
    {
      id: 'dc-outlier-detect',
      type: 'mcq',
      prompt: 'Which outlier rule is itself robust to extreme outliers?',
      choices: [
        'IQR rule — flag values beyond 1.5×IQR from the quartiles',
        'Z-score > 3 — based on mean and standard deviation',
        'Min-max clipping to [0, 1]',
        'Removing the top 50% of values',
      ],
      answer: 0,
      explanation:
        'Quartiles barely move when a monster value appears; the mean and std that z-scores depend on get dragged by the very outliers you are hunting.',
    },
    {
      id: 'dc-outlier-action',
      type: 'flash',
      front: 'You found outliers. What do you actually do with them?',
      back: 'Investigate before touching: is it a data error (age 250, unit mixup) → fix or drop; or a real extreme (an actual whale customer) → keep it, and consider winsorizing/capping, a log transform, or robust models. The interview trap is "I’d remove outliers" — the right verb is "I’d investigate them."',
    },
    {
      id: 'dc-leakage-scale',
      type: 'mcq',
      prompt: 'Where is the data leakage?',
      code: 'scaler = StandardScaler().fit(X)      # all data\nX_train, X_test = train_test_split(\n    scaler.transform(X))',
      choices: [
        'The scaler learned mean/std from test rows before the split',
        'StandardScaler cannot be used before a split',
        'train_test_split shuffles, which is leakage',
        'There is no leakage here',
      ],
      answer: 0,
      explanation:
        'Fit on train only, then transform both: split first, scaler.fit(X_train). Test statistics bleeding into preprocessing is the most common leakage in the wild.',
    },
    {
      id: 'dc-leakage-def',
      type: 'flash',
      front: 'Define data leakage and name three common causes.',
      back: 'Leakage = information unavailable at prediction time sneaking into training, giving fake validation scores that collapse in production. Classics: 1) preprocessing (scaling/imputing) fit on the full dataset before splitting, 2) target leakage — features derived from the outcome (e.g. "charged_off_date" when predicting default), 3) temporal leakage — random splits on time-series letting the model train on the future.',
    },
    {
      id: 'dc-encode',
      type: 'fill',
      prompt: 'One-hot encode a nominal categorical column:',
      code: "pd.____(df, columns=['color'])",
      answers: ['get_dummies'],
      distractors: ['onehot', 'to_numeric', 'factorize'],
      explanation:
        'get_dummies expands each category into a 0/1 column. (sklearn’s OneHotEncoder does the same inside a pipeline.)',
    },
    {
      id: 'dc-ordinal-vs-onehot',
      type: 'mcq',
      prompt: 'Encode `size = {S, M, L, XL}` vs `city = {NYC, LA, Chicago}`. Which pairing is right?',
      choices: [
        'size → ordinal integers (order is real), city → one-hot (no order)',
        'Both → ordinal integers',
        'size → one-hot, city → ordinal integers',
        'Both → leave as strings',
      ],
      answer: 0,
      explanation:
        'Integer-encoding cities invents a fake ranking (LA < NYC?) that linear models will happily learn. Sizes genuinely order, so integers preserve information there.',
    },
    {
      id: 'dc-scaling',
      type: 'flash',
      front: 'Standardization vs min-max scaling — and which models don’t care?',
      back: 'Standardization: (x−mean)/std → centered, unbounded; the default, robust-ish to outliers. Min-max: squeeze to [0,1]; nice for neural nets, but one outlier crushes the rest. Scaling matters for distance- and gradient-based models (kNN, SVM, linear/logistic regression, neural nets). Tree ensembles (random forest, XGBoost) split on order, so scaling changes nothing.',
    },
    {
      id: 'dc-imbalance',
      type: 'mcq',
      prompt: 'Handling a 99:1 class imbalance — which is correct?',
      choices: [
        'Resample (e.g. SMOTE) the training set only; keep the test set untouched',
        'Oversample the whole dataset, then split',
        'Oversample the test set so metrics look stable',
        'Class imbalance never needs handling',
      ],
      answer: 0,
      explanation:
        'The test set must mirror reality. Resampling before the split also clones synthetic rows into the test set — leakage plus a fantasy evaluation. Also mention class weights as the simpler alternative.',
    },
  ],
};
