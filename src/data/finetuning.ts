import type { Deck } from '../types';

export const finetuning: Deck = {
  id: 'finetuning',
  title: 'Fine-tuning & Training',
  description: 'LoRA, QLoRA, data quality, and preference tuning, end to end.',
  icon: '🔧',
  color: '#818cf8',
  track: 'AI Engineering',
  cards: [
    {
      id: 'ft-when',
      type: 'flash',
      front: '"Should we fine-tune?": the decision tree you recite before touching a GPU.',
      back: 'First exhaust: better prompting → few-shot examples → RAG. Fine-tune when the model must LEARN A BEHAVIOR prompts can’t hold: a strict output format at scale, domain style/tone, a specialized skill, or when you need a small cheap model to match a big one on a narrow task (distillation economics). Never fine-tune to inject facts: that’s RAG’s job; facts baked into weights go stale and can’t cite sources.',
    },
    {
      id: 'ft-lora-mechanics',
      type: 'fill',
      prompt: 'LoRA’s core equation: the frozen weight plus a learnable low-rank update:',
      code: 'W_effective = W_frozen + A @ B\n# A: (d × r), B: (r × d), r = ____ typically 8–64',
      answers: ['rank'],
      distractors: ['dim', 'batch', 'heads'],
      explanation:
        'The update lives in a rank-r subspace: under 1% of parameters trained. Higher rank = more capacity, more risk of overfitting your small dataset.',
    },
    {
      id: 'ft-qlora',
      type: 'mcq',
      prompt: 'What does the Q in QLoRA add?',
      choices: [
        'The frozen base is quantized to 4-bit (NF4): a 7B model fine-tunes on a single consumer GPU',
        'A queue for training batches',
        'Quadratic attention',
        'Quality filtering of data',
      ],
      answer: 0,
      explanation:
        'Adapters train in higher precision atop the 4-bit base; weights dequantize on the fly during forward passes. This is what makes single-GPU fine-tuning of 7B models practical.',
    },
    {
      id: 'ft-data-quality',
      type: 'mcq',
      prompt: '500 meticulously curated training examples vs 50,000 scraped ones: for SFT, which wins?',
      choices: [
        'Usually the 500. SFT is format/behavior teaching, where quality and consistency dominate volume',
        'Always the 50,000: scale wins',
        'Neither works under 1M examples',
        'Exactly equal',
      ],
      answer: 0,
      explanation:
        'LIMA-style result: a small pristine set teaches behavior; noisy data teaches noise. Data curation has higher ROI than hyperparameter tuning.',
    },
    {
      id: 'ft-format',
      type: 'mcq',
      prompt: 'SFT training data format for a chat model?',
      choices: [
        'Conversations in the model’s own chat template: system/user/assistant turns, loss on assistant tokens',
        'Raw text paragraphs',
        'Question–answer CSV columns',
        'Just the desired outputs',
      ],
      answer: 0,
      explanation:
        'Mismatch between training format and the model’s chat template is the silent killer of fine-tunes. Mask the loss so the model learns to produce answers, not to imitate questions.',
    },
    {
      id: 'ft-epochs-lr',
      type: 'mcq',
      prompt: 'Starting hyperparameters for a LoRA SFT run?',
      choices: [
        '1–3 epochs, LR ~1e-4 to 2e-4 (LoRA) with warmup + cosine decay, watching val loss for memorization',
        '50 epochs, LR 0.01',
        'One epoch at LR 1e-7',
        'Whatever the defaults are, untouched',
      ],
      answer: 0,
      explanation:
        'LLMs memorize small datasets FAST: more than ~3 epochs usually means overfitting. LoRA tolerates higher LR than full fine-tuning (~1e-5). Val loss diverging from train loss is your stop signal.',
    },
    {
      id: 'ft-catastrophic',
      type: 'mcq',
      prompt: 'After fine-tuning on legal documents, the model got worse at everything else. This is…',
      choices: [
        'Catastrophic forgetting: mitigate with LoRA (frozen base limits damage), mixed general data, and fewer steps',
        'Data leakage',
        'A tokenizer mismatch',
        'Expected and unfixable',
      ],
      answer: 0,
      explanation:
        'Full fine-tuning overwrites shared weights; LoRA’s frozen base is inherent protection (remove the adapter, original model returns). Always eval on GENERAL benchmarks too, not just your task.',
    },
    {
      id: 'ft-eval-before',
      type: 'flash',
      front: 'The fine-tune workflow that survives scrutiny, where do evals sit?',
      back: 'Before training: baseline the un-tuned model on your task eval; maybe prompting already suffices, which is the cheapest win. During: watch validation loss curves for overfitting. After: task eval versus the baseline, a general-capability spot-check, and side-by-side samples. A cheap eval run before an expensive training run regularly pays for itself by cancelling runs that were never going to work.',
    },
    {
      id: 'ft-merge-serve',
      type: 'mcq',
      prompt: 'Serving a LoRA fine-tune: the two options?',
      choices: [
        'Merge adapters into the base for zero-overhead single-model serving, or keep them separate to hot-swap many adapters on one base',
        'Adapters cannot be served',
        'Retrain the full model for production',
        'Serve A and B as separate models',
      ],
      answer: 0,
      explanation:
        'Multi-adapter serving (one 7B base + per-customer adapters) is the economic magic trick of LoRA at scale: vLLM and friends support it natively.',
    },
    {
      id: 'ft-dpo',
      type: 'mcq',
      prompt: 'DPO vs RLHF for preference tuning?',
      choices: [
        'DPO optimizes preferences directly from (chosen, rejected) pairs, no reward model, no RL loop; simpler and usually sufficient',
        'DPO requires more compute than RLHF',
        'RLHF needs no human data',
        'They are unrelated techniques',
      ],
      answer: 0,
      explanation:
        'RLHF: train a reward model, then PPO against it; powerful but finicky. DPO collapses both stages into a classification-style loss. Any best-of-N selection data you already collect is DPO-shaped preference data.',
    },
    {
      id: 'ft-distill',
      type: 'mcq',
      prompt: 'What is distillation in the LLM era, practically?',
      choices: [
        'Generate training data with a strong model, fine-tune a small cheap model on it for the narrow task',
        'Compressing weights with gzip',
        'Removing layers at random',
        'A synonym for quantization',
      ],
      answer: 0,
      explanation:
        'Teacher-student economics: frontier quality at small-model prices for a bounded task. Check the teacher model’s ToS on synthetic-data training: a real-world constraint interviewers respect.',
    },
    {
      id: 'ft-loss-reading',
      type: 'mcq',
      prompt: 'Train loss falls, validation loss rises from epoch 2. You…',
      choices: [
        'Stop at the epoch-2 checkpoint: it is memorizing; more data or stronger regularization if you need more',
        'Train longer to push through',
        'Raise the learning rate',
        'Ignore val loss; train loss is what matters',
      ],
      answer: 0,
      explanation:
        'The universal overfitting signature, arriving absurdly fast on small SFT sets. Checkpoint-per-epoch + early stopping is the cheap insurance.',
    },
    {
      id: 'ft-story',
      type: 'flash',
      front: 'Rehearse: "Tell me about your fine-tuning experience" using your strongest project, in 60 seconds.',
      back: 'Shape the answer in five beats: the goal (what behavior the model had to learn and why prompting wasn’t enough), the method (e.g. QLoRA on a small open model and why that fit the budget), the data (where it came from, how it was curated: quality over volume), the evaluation (what you measured against the un-tuned baseline, ideally with an automated judge), and the lesson (what you would do differently). Concrete numbers: dataset size, eval scores, cost; make the story credible.',
    },
    {
      id: 'ft-order-workflow',
      type: 'order',
      prompt: 'Order the steps of a defensible fine-tuning project.',
      items: [
        'Baseline the un-tuned model on a task eval',
        'Curate and format the training data',
        'Train, watching validation loss',
        'Evaluate against the baseline + general spot-check',
        'Merge or hot-swap the adapter for serving',
      ],
      explanation:
        'The baseline comes first: without it you can’t prove the fine-tune helped, and sometimes it shows you don’t need one.',
    },
    {
      id: 'ft-tf-facts',
      type: 'tf',
      prompt: 'Fine-tuning is the right tool for keeping a model’s knowledge of your product docs up to date.',
      answer: false,
      explanation:
        'Facts belong in retrieval: they go stale in weights and can’t cite sources. Fine-tune for behavior, format, and style.',
    },
  ],
};
