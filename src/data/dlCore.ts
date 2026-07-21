import type { Deck } from '../types';

export const dlCore: Deck = {
  id: 'dl-core',
  title: 'Deep Learning Core',
  description: 'Backprop, attention’s prerequisites, and why nets train at all.',
  icon: '🧬',
  color: '#8b5cf6',
  track: 'AI Engineering',
  cards: [
    {
      id: 'dl-backprop',
      type: 'flash',
      front: 'Explain backpropagation in one breath (interviewers ask exactly this).',
      back: 'Forward pass computes the output and loss; backward pass applies the chain rule layer by layer to get the gradient of the loss with respect to every weight; the optimizer steps each weight opposite its gradient. That’s it: backprop is just the chain rule organized efficiently, reusing each layer’s intermediate results.',
    },
    {
      id: 'dl-vanishing',
      type: 'mcq',
      prompt: 'Deep sigmoid networks fail to train because…',
      choices: [
        'Gradients vanish: each layer multiplies by sigmoid′ ≤ 0.25, shrinking exponentially',
        'Sigmoids are too expensive to compute',
        'The weights overflow to infinity',
        'Sigmoid outputs cannot be negative, so the loss is wrong',
      ],
      answer: 0,
      explanation:
        'Twenty layers of ×0.25 ≈ nothing reaches the early layers. ReLU (gradient 1 when active), residual connections, and normalization are the fixes: that trio is what made deep learning deep.',
    },
    {
      id: 'dl-nonlinear',
      type: 'flash',
      front: 'Why do networks need nonlinear activations at all?',
      back: 'A stack of linear layers collapses to a single linear layer. W₂(W₁x) = (W₂W₁)x, no matter how deep. The nonlinearity between layers is what lets depth compose simple functions into arbitrarily complex ones.',
    },
    {
      id: 'dl-softmax',
      type: 'fill',
      prompt: 'Softmax turns logits into a probability distribution:',
      code: 'p_i = exp(z_i) / sum(____(z_j) for j in classes)',
      answers: ['exp'],
      distractors: ['log', 'abs', 'sigmoid'],
      explanation:
        'Exponentiate everything, normalize by the total. (Implementations subtract max(z) first for numerical stability: worth mentioning.)',
    },
    {
      id: 'dl-xent-loss',
      type: 'fill',
      prompt: 'Cross-entropy for one example is just the log-prob of the right class:',
      code: 'loss = -np.____(p[correct_class])',
      answers: ['log'],
      distractors: ['exp', 'mean', 'sqrt'],
      explanation:
        '−log(p): confident-and-right → loss near 0; confident-and-wrong → loss explodes. LLM "loss ≈ 2.1" in papers is exactly this, averaged per token.',
    },
    {
      id: 'dl-batchnorm',
      type: 'mcq',
      prompt: 'What does batch/layer normalization mainly buy you?',
      choices: [
        'Stable, faster training: activations keep a consistent scale so larger learning rates work',
        'A smaller model at inference',
        'Guaranteed better test accuracy',
        'It replaces the need for an optimizer',
      ],
      answer: 0,
      explanation:
        'Normalizing activations keeps gradients well-scaled through depth. Transformers use LayerNorm (per-token) rather than BatchNorm: batch statistics don’t suit variable-length sequences.',
    },
    {
      id: 'dl-dropout-inference',
      type: 'mcq',
      prompt: 'What happens to dropout at inference time?',
      choices: [
        'It is turned off: all units active, with activations scaled to compensate',
        'It keeps dropping units for regularization',
        'It only drops the output layer',
        'The dropout rate is doubled',
      ],
      answer: 0,
      explanation:
        'Dropout is train-time noise that prevents co-adaptation. model.eval() vs model.train() in PyTorch toggles exactly this: forgetting it is a classic silent bug.',
    },
    {
      id: 'dl-arch-tour',
      type: 'flash',
      front: 'CNN vs RNN vs Transformer: one sentence each, and what killed the RNN?',
      back: 'CNN: weight-shared local filters; spatial data, still great for images. RNN: processes sequences step by step, carrying hidden state; inherently serial. Transformer: attention connects every position to every other in one shot. Parallel training is what killed the RNN: transformers train on the whole sequence at once on GPUs; RNNs cannot.',
    },
    {
      id: 'dl-param-count',
      type: 'mcq',
      prompt: 'A dense layer maps 100 inputs to 50 outputs. How many parameters?',
      choices: ['5,050', '5,000', '150', '5,150'],
      answer: 0,
      explanation:
        '100×50 weights + 50 biases. Being able to count parameters quickly lets you sanity-check model sizes, and interviewers use it as a filter.',
    },
    {
      id: 'dl-optimizers',
      type: 'flash',
      front: 'SGD → momentum → Adam → AdamW: what does each add?',
      back: 'SGD: step against the gradient. Momentum: accumulate a velocity so consistent directions accelerate and noise cancels. Adam: per-parameter learning rates from gradient first/second moments; fast, forgiving default. AdamW: fixes weight decay to be true decay rather than mixed into the gradient; the default for training transformers.',
    },
    {
      id: 'dl-warmup',
      type: 'mcq',
      prompt: 'Transformer training almost always starts with learning-rate warmup because…',
      choices: [
        'Early steps have chaotic gradients; a big LR then can blow up training irrecoverably',
        'GPUs need time to reach full clock speed',
        'It reduces memory usage',
        'Adam requires it mathematically',
      ],
      answer: 0,
      explanation:
        'Ramp the LR from ~0 over the first few thousand steps, then decay (cosine is common). "Warmup + cosine decay with AdamW" is the stock recipe.',
    },
    {
      id: 'dl-overfit-toolkit',
      type: 'flash',
      front: 'Your deep net overfits. List the toolkit, in the order you’d reach for it.',
      back: 'More/better data and augmentation first (nothing beats data), then regularization: weight decay, dropout, early stopping on validation loss, and a smaller model if all else fails. For fine-tuning LLMs: fewer epochs and lower LR; memorization happens fast.',
    },
    {
      id: 'dl-gpu-batch',
      type: 'fill',
      prompt: 'Gradient accumulation: big effective batches on a small GPU:',
      code: 'loss = loss / accum_steps\nloss.backward()\nif step % accum_steps == 0:\n    optimizer.step()\n    optimizer.____()',
      answers: ['zero_grad'],
      distractors: ['reset', 'flush', 'clear_grad'],
      explanation:
        'Gradients add up across backward() calls by design; you step once per accumulated batch and then zero them. This trick is everywhere in LLM fine-tuning code.',
    },
  ],
};
