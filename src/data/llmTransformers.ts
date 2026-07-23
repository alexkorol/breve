import type { Deck } from '../types';

export const llmTransformers: Deck = {
  id: 'llm-transformers',
  title: 'Transformers & LLMs',
  description: 'Attention, tokenizers, and the pretrain→SFT→RLHF pipeline.',
  icon: '🤖',
  color: '#06b6d4',
  track: 'AI Engineering',
  cards: [
    {
      id: 'llm-attention',
      type: 'flash',
      front: 'Explain self-attention in one breath.',
      back: 'Each token emits a query, a key, and a value vector. A token’s query is dotted against every key to score relevance; softmax turns the scores into weights; the output is the weighted sum of the values. Every token gathers information from every other token, in parallel: that’s the whole trick.',
    },
    {
      id: 'llm-attn-formula',
      type: 'fill',
      prompt: 'The attention formula every AI interview expects on demand:',
      code: 'Attention(Q, K, V) = softmax(Q @ K.T / sqrt(____)) @ V',
      answers: ['d_k'],
      distractors: ['n', 'd_model', 'h'],
      explanation:
        'd_k is the key dimension. This formula is the "reverse a linked list" of ML interviews: expect to produce it on demand.',
    },
    {
      id: 'llm-sqrt-dk',
      type: 'mcq',
      prompt: 'Why divide by √d_k in attention?',
      choices: [
        'Large dot products would saturate softmax into near one-hot, killing gradients',
        'To keep the attention matrix well-conditioned for the inverse taken in the backward pass',
        'To normalize the value vectors to unit length so heads concatenate on a common scale',
        'To halve the memory usage',
      ],
      answer: 0,
      explanation:
        'Dot products grow with dimension (variance ≈ d_k); scaling keeps softmax in its soft, trainable regime. A one-hot softmax barely propagates gradients to the losing keys.',
    },
    {
      id: 'llm-multihead',
      type: 'mcq',
      prompt: 'Why multiple attention heads instead of one big one?',
      choices: [
        'Each head can learn a different relationship type in its own subspace',
        'More heads reduce total parameter count: splitting d_model across heads shrinks the projections',
        'Softmax only works up to 64 dimensions, so attention must be computed in chunks',
        'They exist purely for GPU parallelism',
      ],
      answer: 0,
      explanation:
        'One head might track syntax, another coreference, another positional patterns. Heads run in parallel subspaces and concatenate: richer than a single averaged view.',
    },
    {
      id: 'llm-positional',
      type: 'flash',
      front: 'Why do transformers need positional encodings, and what’s used today?',
      back: 'Attention is a weighted sum over an unordered set: permute the tokens and nothing changes. Positional information must be injected. Original: fixed sinusoids added to embeddings. Modern LLMs mostly use RoPE: rotating Q and K by position so attention scores depend on relative distance, which also extrapolates better to longer contexts.',
    },
    {
      id: 'llm-causal-mask',
      type: 'mcq',
      prompt: 'The causal mask in a decoder-only LLM exists so that…',
      choices: [
        'Each position can only attend to earlier positions, no peeking at the future it must predict',
        'Attention runs faster on GPUs: masking zeroes half the score matrix, so those entries are skipped',
        'The model cannot see padding tokens: the triangular mask is how batched sequences of different lengths ignore padding',
        'Beam search stays deterministic',
      ],
      answer: 0,
      explanation:
        'Training predicts every next token in parallel; without the triangular mask the answer would be visible in the input and the model would learn to copy, not predict.',
    },
    {
      id: 'llm-pretrain-objective',
      type: 'flash',
      front: 'What is the pretraining objective of a GPT-style LLM, and why does it work so well?',
      back: 'Next-token prediction over huge text corpora: cross-entropy on "guess the next token", trillions of times. It works because predicting text well forces compressed internal models of grammar, facts, code, and reasoning: the label is free, the supervision is the entire internet.',
    },
    {
      id: 'llm-tokenizer',
      type: 'mcq',
      prompt: 'Why do LLMs stumble on "how many r’s are in strawberry?"',
      choices: [
        'They see BPE tokens, not letters: "strawberry" may be 2–3 opaque chunks',
        'They cannot count: counting is not differentiable, so gradient descent never teaches it',
        'The training data lacks fruit',
        'Attention weights scale with word length, so short words get too little attention to inspect',
      ],
      answer: 0,
      explanation:
        'Byte-pair encoding merges frequent character sequences into single tokens; character-level structure is invisible. Tokenization also explains weird pricing, context limits, and multilingual inefficiency.',
    },
    {
      id: 'llm-training-pipeline',
      type: 'flash',
      front: 'The three-stage LLM training pipeline: name each stage and what it contributes.',
      back: '1. Pretraining: next-token prediction on web-scale text → raw capability.\n2. SFT (supervised fine-tuning): curated instruction–response pairs → follows instructions, chat format.\n3. Preference tuning (RLHF or the simpler DPO): learn from human A-vs-B preferences → helpful, honest, harmless behavior.\nCapability comes from stage 1; behavior from stages 2–3.',
    },
    {
      id: 'llm-temperature',
      type: 'mcq',
      prompt: 'Temperature 0 vs temperature 1 at sampling time?',
      choices: [
        'T=0 always picks the top token (near-deterministic); T=1 samples the full distribution',
        'T=0 disables the model’s safety filters, since alignment tuning only applies to sampled decoding',
        'T=1 doubles response length',
        'Temperature scales the weight matrices before the forward pass, trading determinism for creativity',
      ],
      answer: 0,
      explanation:
        'Temperature rescales logits before softmax. Low T for extraction and code, higher T for brainstorming. (top_p trims the tail: tune one, not both.)',
    },
    {
      id: 'llm-tf-temp0',
      type: 'tf',
      prompt: 'Temperature 0 guarantees bit-identical outputs for the same prompt, every time.',
      answer: false,
      explanation:
        'T=0 is greedy decoding, but floating-point non-determinism and infra differences still cause occasional variation: don’t promise exact reproducibility.',
    },
    {
      id: 'llm-order-pipeline',
      type: 'order',
      prompt: 'Order the LLM training pipeline stages.',
      items: [
        'Pretraining: next-token prediction at web scale',
        'SFT on instruction–response pairs',
        'Preference tuning (RLHF or DPO)',
        'Deployment with system prompts and guardrails',
      ],
      explanation:
        'Capability first, then instruction-following behavior, then preference alignment: deployment-time prompting sits on top of all three.',
    },
    {
      id: 'llm-kv-cache',
      type: 'flash',
      front: 'What is the KV cache, and why is long context expensive?',
      back: 'During generation each new token needs attention against all previous keys/values, so you cache them instead of recomputing. Cost of context: KV memory grows linearly with length (it dominates GPU memory at inference), and prefill attention is quadratic. This is why long prompts cost real money and why prompt caching exists.',
    },
    {
      id: 'llm-lora',
      type: 'mcq',
      prompt: 'LoRA fine-tunes a large model by…',
      choices: [
        'Freezing base weights and training tiny low-rank matrices added to them',
        'Retraining only the embedding table, since task knowledge lives in the token representations',
        'Distilling the base model into a smaller student, then fine-tuning the student on the task',
        'Pruning inactive neurons then retraining',
      ],
      answer: 0,
      explanation:
        'ΔW = A·B where A and B are rank-8-ish: under 1% of parameters, so a consumer GPU can fine-tune a 7B model (QLoRA: on a 4-bit-quantized base). The adapters merge into the base at inference.',
    },
    {
      id: 'llm-quantization',
      type: 'flash',
      front: 'Quantization: what it is and what you trade.',
      back: 'Store weights in fewer bits: fp16 → int8 → int4; shrinking memory ~2–4× and speeding up memory-bound inference. Cost: small quality loss, usually negligible at int8, noticeable but often acceptable at int4. This is what makes local LLMs on laptops possible (GGUF, bitsandbytes).',
    },
    {
      id: 'llm-hallucination',
      type: 'mcq',
      prompt: 'Root cause of hallucination in LLMs?',
      choices: [
        'The objective rewards plausible continuations, not verified truth',
        'Insufficient GPU memory at inference: evicted KV-cache entries force the model to guess dropped context',
        'Bugs in the attention implementation: precision loss in long contexts misroutes attention heads',
        'Adversarial users',
      ],
      answer: 0,
      explanation:
        'A fluent guess and a fact score the same if both are likely text. Mitigations: grounding via RAG, citations, tool use, "say I don’t know" training, verification passes; reduce but don’t eliminate it. Engineering around this is half the job.',
    },
  ],
};
