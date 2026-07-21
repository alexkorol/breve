import type { Deck } from '../types';

export const mlFundamentals: Deck = {
  id: 'ml-fundamentals',
  title: 'ML Fundamentals',
  description: 'The concepts every ML interview loops back to.',
  icon: '🧠',
  color: '#10b981',
  track: 'ML & Data',
  cards: [
    {
      id: 'ml-bias-variance',
      type: 'flash',
      front: 'Explain the bias–variance tradeoff.',
      back: 'Bias is error from a model too simple to capture the pattern (underfitting); variance is error from a model too sensitive to the training data (overfitting). Increasing model capacity lowers bias but raises variance — you tune for the sweet spot via validation error.',
    },
    {
      id: 'ml-overfit-sign',
      type: 'mcq',
      prompt: 'Training accuracy is 99%, validation accuracy is 71%. What is happening?',
      choices: [
        'Overfitting — the model memorized the training set',
        'Underfitting — the model is too simple',
        'Data leakage from validation into training',
        'The learning rate is too low',
      ],
      answer: 0,
      explanation:
        'A large train/validation gap is the classic overfitting signature. Fixes: more data, regularization, dropout, early stopping, or a simpler model.',
    },
    {
      id: 'ml-l2',
      type: 'mcq',
      prompt: 'What does L2 regularization do?',
      choices: [
        'Penalizes large weights, shrinking them toward zero',
        'Removes features with zero variance',
        'Normalizes inputs to unit length',
        'Increases the learning rate over time',
      ],
      answer: 0,
      explanation:
        'It adds λ·Σw² to the loss, discouraging large weights and reducing variance. L1 (Σ|w|) instead drives some weights exactly to zero — feature selection.',
    },
    {
      id: 'ml-precision-recall',
      type: 'flash',
      front: 'Precision vs recall — define both.',
      back: 'Precision = TP / (TP + FP): of everything you flagged positive, how much was right. Recall = TP / (TP + FN): of all actual positives, how many you caught. F1 is their harmonic mean.',
    },
    {
      id: 'ml-recall-when',
      type: 'mcq',
      prompt: 'For a cancer screening model, which metric matters most?',
      choices: [
        'Recall — a missed cancer (false negative) is the costly error',
        'Precision — false alarms are the costly error',
        'Accuracy — overall correctness',
        'Training loss',
      ],
      answer: 0,
      explanation:
        'When false negatives are catastrophic, optimize recall (then manage precision downstream with follow-up tests). Spam filtering is the reverse: precision matters more.',
    },
    {
      id: 'ml-sigmoid',
      type: 'fill',
      prompt: 'The sigmoid function squashes any real number into the open interval:',
      code: 'sigmoid(x) = 1 / (1 + e^(-x))   # output range (0, ____)',
      answers: ['1'],
      distractors: ['0.5', 'e', '∞'],
      explanation: 'That (0, 1) range is why sigmoid outputs are read as probabilities.',
    },
    {
      id: 'ml-gd',
      type: 'flash',
      front: 'How does gradient descent work, in one breath?',
      back: 'Compute the gradient of the loss with respect to the parameters — the direction of steepest increase — then step the parameters the opposite way, scaled by the learning rate. Repeat until convergence. SGD/mini-batch uses a data subset per step for speed and noise-driven escape from bad minima.',
    },
    {
      id: 'ml-lr-high',
      type: 'mcq',
      prompt: 'The training loss oscillates wildly and sometimes explodes to NaN. Most likely cause?',
      choices: [
        'Learning rate is too high',
        'Learning rate is too low',
        'Too much training data',
        'Batch size is too large',
      ],
      answer: 0,
      explanation:
        'Steps that overshoot the minimum cause divergence. Too-low a rate looks different: loss creeps down painfully slowly.',
    },
    {
      id: 'ml-splits',
      type: 'flash',
      front: 'What are the train, validation, and test sets each for?',
      back: 'Train: fit the parameters. Validation: choose hyperparameters and detect overfitting during development. Test: touched once at the end for an unbiased estimate of real-world performance — the moment you tune on it, it stops being a test set.',
    },
    {
      id: 'ml-xent',
      type: 'mcq',
      prompt: 'Which loss function is standard for multi-class classification?',
      choices: ['Cross-entropy', 'Mean squared error', 'Hinge loss', 'Huber loss'],
      answer: 0,
      explanation:
        'Cross-entropy on softmax outputs heavily penalizes confident wrong predictions and gives well-behaved gradients; MSE is the regression default.',
    },
    {
      id: 'ml-supervised',
      type: 'flash',
      front: 'Supervised vs unsupervised learning — difference plus one example of each.',
      back: 'Supervised learns from labeled pairs (x, y): spam classification, price regression. Unsupervised finds structure in unlabeled data: k-means clustering, PCA, autoencoders. (Self-supervised — predicting masked parts of the input — is how LLMs pretrain.)',
    },
    {
      id: 'ml-kmeans',
      type: 'mcq',
      prompt: 'k-means clustering is an example of…',
      choices: [
        'Unsupervised learning',
        'Supervised learning',
        'Reinforcement learning',
        'Semi-supervised learning',
      ],
      answer: 0,
      explanation:
        'No labels involved: it alternates assigning points to the nearest centroid and recomputing centroids until stable.',
    },
    {
      id: 'ml-tf-testset',
      type: 'tf',
      prompt: 'It’s fine to tune hyperparameters against the test set as long as you report the final number honestly.',
      answer: false,
      explanation:
        'The moment you tune on it, the test set stops estimating real-world performance — that’s what the validation set is for.',
    },
    {
      id: 'ml-confusion',
      type: 'flash',
      front: 'What is a confusion matrix?',
      back: 'A table of predicted vs actual classes. For binary problems: TP, FP, FN, TN in a 2×2 grid. Every threshold metric — precision, recall, specificity, F1 — is computed from its cells.',
    },
    {
      id: 'ml-relu',
      type: 'fill',
      prompt: 'The ReLU activation function:',
      code: 'relu(x) = max(____, x)',
      answers: ['0'],
      distractors: ['1', '-1', '-x'],
      explanation:
        'max(0, x) — cheap, non-saturating for positive inputs, and the default hidden-layer activation. Watch for "dying ReLU" when units get stuck at 0.',
    },
  ],
};
