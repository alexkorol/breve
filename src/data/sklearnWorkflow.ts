import type { Deck } from '../types';

export const sklearnWorkflow: Deck = {
  id: 'sklearn-workflow',
  title: 'scikit-learn Workflow',
  description: 'fit/transform/predict and Pipelines — the muscle memory of applied ML.',
  icon: '⚗️',
  color: '#f472b6',
  track: 'ML & Data',
  cards: [
    {
      id: 'sk-api',
      type: 'flash',
      front: 'The sklearn API contract — the three verbs and who owns which.',
      back: 'fit() learns from data (weights for models, statistics for transformers). transform() applies a learned transformation (scalers, encoders). predict() produces outputs from a fitted model. fit_transform() fuses the first two — TRAIN DATA ONLY; test data gets plain transform() with the train-fitted state. That asymmetry IS leakage prevention.',
    },
    {
      id: 'sk-split',
      type: 'fill',
      prompt: 'The split, with reproducibility and class balance:',
      code: 'X_tr, X_te, y_tr, y_te = train_test_split(\n    X, y, test_size=0.2,\n    random_state=42, ____=y)',
      answers: ['stratify'],
      distractors: ['balance', 'groups', 'shuffle'],
      explanation:
        'stratify=y preserves class proportions in both halves — essential when classes are imbalanced, harmless otherwise.',
    },
    {
      id: 'sk-transform-test',
      type: 'mcq',
      prompt: 'Why `scaler.transform(X_test)` and never `scaler.fit_transform(X_test)`?',
      choices: [
        'Refitting on test learns test statistics — leakage, and train/test land in different spaces',
        'fit_transform is slower',
        'Test sets cannot be transformed twice',
        'Both are equivalent',
      ],
      answer: 0,
      explanation:
        'The single most common sklearn mistake. The scaler must apply the TRAINING mean/std to test data, exactly as production will apply them to unseen data.',
    },
    {
      id: 'sk-pipeline',
      type: 'fill',
      prompt: 'The leak-proof way to chain preprocessing and model:',
      code: 'from sklearn.pipeline import ____\nmodel = ____([("scale", StandardScaler()),\n         ("clf", LogisticRegression())])\nmodel.fit(X_tr, y_tr)',
      answers: ['Pipeline'],
      distractors: ['Chain', 'Sequential', 'Workflow'],
      explanation:
        'A Pipeline fits transformers on train only and applies them at predict time automatically — cross-validation on a Pipeline is leak-proof by construction. The one-word answer to "how do you prevent preprocessing leakage in CV?"',
    },
    {
      id: 'sk-column-transformer',
      type: 'mcq',
      prompt: 'Numeric columns need scaling, categoricals need one-hot. The idiomatic tool?',
      choices: [
        'ColumnTransformer — different transformers per column group, inside the Pipeline',
        'Transform manually before splitting',
        'Two separate models',
        'Convert everything to strings',
      ],
      answer: 0,
      explanation:
        'ColumnTransformer([("num", StandardScaler(), num_cols), ("cat", OneHotEncoder(handle_unknown="ignore"), cat_cols)]) — handle_unknown="ignore" saves you when production sends an unseen category.',
    },
    {
      id: 'sk-cross-val',
      type: 'fill',
      prompt: 'Five-fold CV score in one line:',
      code: 'scores = cross_val_____(pipe, X_tr, y_tr,\n         cv=5, scoring="f1")',
      answers: ['score'],
      distractors: ['idate', 'run', 'fold'],
      explanation:
        'cross_val_score returns the five fold scores — report mean ± std, not just the mean. Passing the PIPELINE keeps preprocessing inside each fold.',
    },
    {
      id: 'sk-gridsearch',
      type: 'mcq',
      prompt: 'GridSearchCV(pipe, params, cv=5) — what happens on .fit, and what do you use after?',
      choices: [
        'Every param combo is CV-scored; best_estimator_ is refit on all training data — use that',
        'It fits once with default params',
        'It touches the test set to pick the winner',
        'You must refit manually',
      ],
      answer: 0,
      explanation:
        'Param naming crosses pipeline steps with double underscores: clf__C, scale__with_mean. refit=True (default) retrains the winner on the full training set.',
    },
    {
      id: 'sk-predict-proba',
      type: 'mcq',
      prompt: '`predict()` vs `predict_proba()` — and which one does threshold tuning need?',
      choices: [
        'predict applies a fixed 0.5 cut; predict_proba gives scores so YOU choose the threshold',
        'predict_proba is only for regression',
        'predict is more accurate',
        'They are identical for classifiers',
      ],
      answer: 0,
      explanation:
        'Cost-sensitive decisions (fraud, medical) tune the threshold on validation probabilities. Default 0.5 is a convention, not a law.',
    },
    {
      id: 'sk-classification-report',
      type: 'fill',
      prompt: 'Per-class precision/recall/F1 in one call:',
      code: 'from sklearn.metrics import classification_____\nprint(classification_____(y_te, y_pred))',
      answers: ['report'],
      distractors: ['summary', 'matrix', 'table'],
      explanation:
        'Pairs with confusion_matrix(y_te, y_pred). Reading these two outputs fluently — including macro vs weighted averages — is a live-interview skill.',
    },
    {
      id: 'sk-random-state',
      type: 'mcq',
      prompt: 'Why set random_state everywhere?',
      choices: [
        'Reproducibility — splits, shuffles, and stochastic models give identical results across runs',
        'It improves accuracy',
        'sklearn errors without it',
        'It seeds the GPU',
      ],
      answer: 0,
      explanation:
        '"I can’t reproduce my own number" is a credibility killer. Fix the seed for experiments; vary it to check your result isn’t a lucky seed.',
    },
    {
      id: 'sk-dummy',
      type: 'mcq',
      prompt: 'The one-line baseline model?',
      choices: [
        'DummyClassifier(strategy="most_frequent") — the floor every real model must beat',
        'LinearRegression on the labels',
        'A random forest with defaults',
        'There is no baseline estimator',
      ],
      answer: 0,
      explanation:
        'sklearn ships the dumb baseline as a first-class estimator precisely because skipping it is so tempting. DummyRegressor(strategy="mean") for regression.',
    },
    {
      id: 'sk-persist',
      type: 'mcq',
      prompt: 'Shipping the trained pipeline to production — the standard move?',
      choices: [
        'joblib.dump(pipe, "model.joblib") — persist the WHOLE pipeline, preprocessing included',
        'Save only the model weights and rewrite preprocessing in the API',
        'Pickle just the scaler',
        'Retrain on every request',
      ],
      answer: 0,
      explanation:
        'Serializing the full pipeline guarantees serving applies byte-identical preprocessing. Re-implementing transforms in the API layer is where train/serve skew is born.',
    },
  ],
};
