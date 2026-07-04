import type { Deck } from '../types';

export const finetuning: Deck = {
  id: 'finetuning',
  title: 'Fine-tuning & Training',
  description: 'Own the LoRA story end to end — your Week 10 rebuild, pre-drilled.',
  icon: '🔧',
  color: '#818cf8',
  track: 'AI Engineering',
  cards: [
    {
      id: 'ft-when',
      type: 'flash',
      front: '"Should we fine-tune?" — the decision tree you recite before touching a GPU.',
      back: 'First exhaust: better prompting → few-shot examples → RAG. Fine-tune when the model must LEARN A BEHAVIOR prompts can’t hold: a strict output format at scale, domain style/tone, a specialized skill, or when you need a small cheap model to match a big one on a narrow task (distillation economics). Never fine-tune to inject facts — that’s RAG’s job; facts baked into weights go stale and can’t cite sources.',
    },
    {
      id: 'ft-lora-mechanics',
      type: 'fill',
      prompt: 'LoRA’s core equation — the frozen weight plus a learnable low-rank update:',
      code: 'W_effective = W_frozen + A @ B\n# A: (d × r), B: (r × d), r = ____ typically 8–64',
      answers: ['rank'],
      distractors: ['dim', 'batch', 'heads'],
      explanation:
        'The update lives in a rank-r subspace — under 1% of parameters trained. Higher rank = more capacity, more risk of overfitting your small dataset.',
    },
    {
      id: 'ft-qlora',
      type: 'mcq',
      prompt: 'What does the Q in QLoRA add?',
      choices: [
        'The frozen base is quantized to 4-bit (NF4) — a 7B model fine-tunes on a single consumer GPU',
        'A queue for training batches',
        'Quadratic attention',
        'Quality filtering of data',
      ],
      answer: 0,
      explanation:
        'Adapters train in higher precision atop the 4-bit base; dequantize-on-the-fly during forward passes. This is exactly the lyric_gen_project setup — say "my QLoRA run" not "the QLoRA paper".',
    },
    {
      id: 'ft-data-quality',
      type: 'mcq',
      prompt: '500 meticulously curated training examples vs 50,000 scraped ones — for SFT, which wins?',
      choices: [
        'Usually the 500 — SFT is format/behavior teaching, where quality and consistency dominate volume',
        'Always the 50,000 — scale wins',
        'Neither works under 1M examples',
        'Exactly equal',
      ],
      answer: 0,
      explanation:
        'LIMA-style result: a small pristine set teaches behavior; noisy data teaches noise. Budget your effort on data curation over hyperparameters — the least glamorous, highest-ROI truth in fine-tuning.',
    },
    {
      id: 'ft-format',
      type: 'mcq',
      prompt: 'SFT training data format for a chat model?',
      choices: [
        'Conversations in the model’s own chat template — system/user/assistant turns, loss on assistant tokens',
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
        'LLMs memorize small datasets FAST — more than ~3 epochs usually means overfitting. LoRA tolerates higher LR than full fine-tuning (~1e-5). Val loss diverging from train loss is your stop signal.',
    },
    {
      id: 'ft-catastrophic',
      type: 'mcq',
      prompt: 'After fine-tuning on legal documents, the model got worse at everything else. This is…',
      choices: [
        'Catastrophic forgetting — mitigate with LoRA (frozen base limits damage), mixed general data, and fewer steps',
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
      front: 'The fine-tune workflow that survives scrutiny — where do evals sit?',
      back: 'Before: baseline the un-tuned model on your task eval (maybe prompting already suffices — cheapest win). During: val loss curves for overfitting. After: task eval vs baseline, general-capability spot-check, side-by-side samples. Your own $0.25-eval-cancels-$144-run story is literally this principle — deploy it in every fine-tuning conversation.',
    },
    {
      id: 'ft-merge-serve',
      type: 'mcq',
      prompt: 'Serving a LoRA fine-tune — the two options?',
      choices: [
        'Merge adapters into the base for zero-overhead single-model serving, or keep them separate to hot-swap many adapters on one base',
        'Adapters cannot be served',
        'Retrain the full model for production',
        'Serve A and B as separate models',
      ],
      answer: 0,
      explanation:
        'Multi-adapter serving (one 7B base + per-customer adapters) is the economic magic trick of LoRA at scale — vLLM and friends support it natively.',
    },
    {
      id: 'ft-dpo',
      type: 'mcq',
      prompt: 'DPO vs RLHF for preference tuning?',
      choices: [
        'DPO optimizes preferences directly from (chosen, rejected) pairs — no reward model, no RL loop; simpler and usually sufficient',
        'DPO requires more compute than RLHF',
        'RLHF needs no human data',
        'They are unrelated techniques',
      ],
      answer: 0,
      explanation:
        'RLHF: train a reward model, then PPO against it — powerful, finicky. DPO collapses both stages into a classification-style loss. Your prosody best-of-N preference exhaust is exactly DPO-shaped data — that connection is a strong interview moment.',
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
        'Teacher-student economics: frontier quality at small-model prices for a bounded task. Check the teacher model’s ToS on synthetic-data training — a real-world constraint interviewers respect.',
    },
    {
      id: 'ft-loss-reading',
      type: 'mcq',
      prompt: 'Train loss falls, validation loss rises from epoch 2. You…',
      choices: [
        'Stop at the epoch-2 checkpoint — it is memorizing; more data or stronger regularization if you need more',
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
      front: 'Rehearse: "Tell me about your fine-tuning experience" — the lyric_gen arc in 60 seconds.',
      back: 'Shape it: goal (lyric generation in a controlled style) → method (QLoRA on a small open model — single-GPU economics) → data (curated pairs; quality over volume) → evaluation (the DeBERTa AI-ness classifier at 0.992 test accuracy as an automated judge, plus the spending-gate discipline) → lesson (eval-first: a $0.25 eval killed a $144 run before it wasted the money). End on the Week-10 plan: re-run it by hand to own the training loop line by line.',
    },
  ],
};
