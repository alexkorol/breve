import type { Deck } from '../types';

export const inferenceOpt: Deck = {
  id: 'inference-opt',
  title: 'LLM Inference & Serving',
  description: 'Why generation is slow, what a token costs, and the levers that matter.',
  icon: '⚙️',
  color: '#fbbf24',
  track: 'AI Engineering',
  cards: [
    {
      id: 'io-two-phases',
      type: 'flash',
      front: 'Prefill vs decode — the two phases of LLM inference and their opposite bottlenecks.',
      back: 'Prefill processes the whole prompt in parallel — compute-bound, sets time-to-first-token. Decode generates one token at a time, each step reading ALL weights and the KV cache — memory-bandwidth-bound, sets tokens/second. This split explains everything downstream: why long prompts hurt TTFT, why batch decoding is nearly free, why quantization speeds up decode.',
    },
    {
      id: 'io-kv-size',
      type: 'mcq',
      prompt: 'What dominates GPU memory during long-context serving?',
      choices: [
        'The KV cache — it grows linearly with context length × batch size, rivaling the weights themselves',
        'The model weights only',
        'Python overhead',
        'Log buffers',
      ],
      answer: 0,
      explanation:
        'A 7B model’s weights are fixed (~14GB fp16), but KV for a 128k context can exceed them. GQA/MQA shrink KV by sharing heads — why every modern architecture uses them.',
    },
    {
      id: 'io-paged-attention',
      type: 'mcq',
      prompt: 'vLLM’s PagedAttention — the core idea?',
      choices: [
        'KV cache in non-contiguous pages, like OS virtual memory — eliminating fragmentation so batches pack tighter',
        'Attention computed on the CPU',
        'Skipping attention for old tokens',
        'A new model architecture',
      ],
      answer: 0,
      explanation:
        'Naive contiguous KV allocation wastes memory on reserved-but-unused space; paging reclaims it → more concurrent requests per GPU → the throughput numbers vLLM is famous for.',
    },
    {
      id: 'io-continuous-batching',
      type: 'mcq',
      prompt: 'Continuous (in-flight) batching beats static batching because…',
      choices: [
        'Finished sequences exit and new ones join mid-flight — no waiting for the longest generation in the batch',
        'It uses bigger batches only',
        'It skips short requests',
        'It requires no scheduler',
      ],
      answer: 0,
      explanation:
        'Static batching leaves the GPU idle while one long generation finishes. Continuous batching is THE serving-throughput unlock — standard in vLLM, TGI, TensorRT-LLM.',
    },
    {
      id: 'io-speculative',
      type: 'mcq',
      prompt: 'Speculative decoding — how can a small model speed up a big one without changing outputs?',
      choices: [
        'The draft model proposes k tokens; the big model verifies them in ONE parallel pass — accepted tokens are provably identical to what it would have produced',
        'The small model answers easy queries entirely',
        'It caches common answers',
        'It lowers precision temporarily',
      ],
      answer: 0,
      explanation:
        'Verification is parallel (prefill-like), generation is serial — so trading serial steps for parallel checks wins when the draft acceptance rate is decent. Exact-output guarantee is the interview-worthy detail.',
    },
    {
      id: 'io-quant-serving',
      type: 'mcq',
      prompt: 'Why does int4 quantization speed up DECODE specifically?',
      choices: [
        'Decode is memory-bandwidth-bound — smaller weights mean fewer bytes read per token',
        'It reduces the number of layers',
        'int4 math is more accurate',
        'It shrinks the vocabulary',
      ],
      answer: 0,
      explanation:
        'Every decode step streams all weights through the GPU; 4× smaller weights ≈ up to 4× faster streaming. Compute-bound prefill benefits far less — the two-phase model predicts this.',
    },
    {
      id: 'io-metrics',
      type: 'fill',
      prompt: 'The two latency metrics every LLM service dashboards:',
      code: 'TTFT = time to first ____\nTPS  = tokens per second (decode rate)',
      answers: ['token'],
      distractors: ['request', 'byte', 'response'],
      explanation:
        'TTFT is perceived responsiveness (streaming makes it the number users feel); TPS is how fast the answer unrolls. Optimize them separately — they have different bottlenecks.',
    },
    {
      id: 'io-prompt-caching',
      type: 'mcq',
      prompt: 'Provider prompt caching — what exactly is cached and what does it save?',
      choices: [
        'The KV cache of a stable prompt PREFIX — repeat requests skip recomputing it: much cheaper tokens and faster TTFT',
        'Full responses keyed by user',
        'The model weights per customer',
        'Embeddings of the prompt',
      ],
      answer: 0,
      explanation:
        'Why prompt STRUCTURE matters: stable content (system prompt, docs, tools) first, volatile content last. One reorder can cut costs dramatically — architecture decision disguised as formatting.',
    },
    {
      id: 'io-routing',
      type: 'mcq',
      prompt: 'The biggest single cost lever in a production LLM product?',
      choices: [
        'Model routing — send the easy 80% to a model 10× cheaper, escalate the hard 20%',
        'Shorter variable names in prompts',
        'Turning off logging',
        'Batching user requests overnight',
      ],
      answer: 0,
      explanation:
        'A classifier (or heuristics, or cascade-with-fallback) decides difficulty. Your OpenRouter model-agnostic design is the enabling architecture — connect the two in interviews.',
    },
    {
      id: 'io-streaming-sse',
      type: 'mcq',
      prompt: 'Why does streaming matter even when total generation time is unchanged?',
      choices: [
        'Perceived latency collapses — users read at ~5 tokens/s while the model generates faster; TTFT becomes the only wait',
        'It reduces server cost',
        'It improves output quality',
        'It avoids rate limits',
      ],
      answer: 0,
      explanation:
        'The full answer might take 15s; the first sentence takes 1s. SSE via FastAPI’s StreamingResponse — the serving detail that ties this deck to your FastAPI one.',
    },
    {
      id: 'io-local-vs-api',
      type: 'flash',
      front: '"Should we self-host an open model or use an API?" — the grown-up tradeoff answer.',
      back: 'API wins on frontier quality, zero ops, instant scaling — pay per token. Self-hosting wins on data control, latency floor, and cost ONLY at sustained high utilization (idle GPUs bleed money). Practical middle: API for the product, small self-hosted/local models for high-volume narrow tasks (classification, embedding, drafts). Decision inputs: volume, privacy requirements, task difficulty, team ops capacity.',
    },
    {
      id: 'io-retries',
      type: 'mcq',
      prompt: 'Production LLM API calls fail intermittently (429s, timeouts). The resilient client pattern?',
      choices: [
        'Exponential backoff with jitter, a retry budget, timeouts per call, and a fallback model/response path',
        'Retry instantly in a tight loop',
        'One attempt; fail the request',
        'Cache every possible response',
      ],
      answer: 0,
      explanation:
        'Bounded concurrency + backoff is exactly your prosody-judge batch design — the same semaphore logic, productionized. Fallback answers ("try again shortly") beat hanging spinners.',
    },
  ],
};
