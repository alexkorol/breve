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
      front: 'Prefill vs decode: the two phases of LLM inference and their opposite bottlenecks.',
      back: 'Prefill processes the whole prompt in parallel: compute-bound, sets time-to-first-token. Decode generates one token at a time, each step reading ALL weights and the KV cache: memory-bandwidth-bound, sets tokens/second. This split explains everything downstream: why long prompts hurt TTFT, why batch decoding is nearly free, why quantization speeds up decode.',
    },
    {
      id: 'io-kv-size',
      type: 'mcq',
      prompt: 'What dominates GPU memory during long-context serving?',
      choices: [
        'The KV cache: it grows linearly with context length × batch size, rivaling the weights themselves',
        'The model weights: parameter count scales with the context window, so long-context checkpoints load more layers per token',
        'Python overhead',
        'Log buffers',
      ],
      answer: 0,
      explanation:
        'A 7B model’s weights are fixed (~14GB fp16), but KV for a 128k context can exceed them. GQA/MQA shrink KV by sharing heads: why every modern architecture uses them.',
    },
    {
      id: 'io-paged-attention',
      type: 'mcq',
      prompt: 'vLLM’s PagedAttention: the core idea?',
      choices: [
        'KV cache in non-contiguous pages, like OS virtual memory: eliminating fragmentation so batches pack tighter',
        'KV blocks offloaded to CPU RAM and swapped onto the GPU page by page, the way an operating system swaps memory to disk',
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
        'Finished sequences exit and new ones join mid-flight, no waiting for the longest generation in the batch',
        'It pads every sequence in the batch to a common length so the GPU runs one perfectly uniform matmul at full occupancy',
        'It skips short requests',
        'It requires no scheduler',
      ],
      answer: 0,
      explanation:
        'Static batching leaves the GPU idle while one long generation finishes. Continuous batching is THE serving-throughput unlock: standard in vLLM, TGI, TensorRT-LLM.',
    },
    {
      id: 'io-speculative',
      type: 'mcq',
      prompt: 'Speculative decoding: how can a small model speed up a big one without changing outputs?',
      choices: [
        'The draft model proposes k tokens; the big model verifies them in ONE parallel pass: accepted tokens are provably identical to what it would have produced',
        'The small model generates the full response and the big model rewrites only the sentences it disagrees with, so most of the output is drafted entirely by the cheap model',
        'It caches common answers',
        'It lowers precision temporarily',
      ],
      answer: 0,
      explanation:
        'Verification is parallel (prefill-like), generation is serial, so trading serial steps for parallel checks wins when the draft acceptance rate is decent. Exact-output guarantee is the interview-worthy detail.',
    },
    {
      id: 'io-quant-serving',
      type: 'mcq',
      prompt: 'Why does int4 quantization speed up DECODE specifically?',
      choices: [
        'Decode is memory-bandwidth-bound: smaller weights mean fewer bytes read per token',
        'int4 tensor cores execute four times more operations per cycle, so the win comes from faster arithmetic in the matmuls',
        'int4 math is more accurate',
        'It shrinks the vocabulary',
      ],
      answer: 0,
      explanation:
        'Every decode step streams all weights through the GPU; 4× smaller weights ≈ up to 4× faster streaming. Compute-bound prefill benefits far less: the two-phase model predicts this.',
    },
    {
      id: 'io-metrics',
      type: 'fill',
      prompt: 'The two latency metrics every LLM service dashboards:',
      code: 'TTFT = time to first ____\nTPS  = tokens per second (decode rate)',
      answers: ['token'],
      distractors: ['request', 'byte', 'response'],
      explanation:
        'TTFT is perceived responsiveness (streaming makes it the number users feel); TPS is how fast the answer unrolls. Optimize them separately: they have different bottlenecks.',
    },
    {
      id: 'io-prompt-caching',
      type: 'mcq',
      prompt: 'Provider prompt caching: what exactly is cached and what does it save?',
      choices: [
        'The KV cache of a stable prompt PREFIX: repeat requests skip recomputing it: much cheaper tokens and faster TTFT',
        'Full completions keyed by a hash of the entire prompt: an identical request returns the stored answer with zero model compute',
        'The model weights per customer',
        'Embeddings of the prompt',
      ],
      answer: 0,
      explanation:
        'Why prompt STRUCTURE matters: stable content (system prompt, docs, tools) first, volatile content last. One reorder can cut costs dramatically: architecture decision disguised as formatting.',
    },
    {
      id: 'io-routing',
      type: 'mcq',
      prompt: 'The biggest single cost lever in a production LLM product?',
      choices: [
        'Model routing: send the easy 80% to a model 10× cheaper, escalate the hard 20%',
        'Shorter variable names in prompts',
        'Turning off logging',
        'Batching user requests into overnight offline jobs so every call qualifies for bulk batch-API pricing',
      ],
      answer: 0,
      explanation:
        'A classifier (or heuristics, or cascade-with-fallback) decides difficulty. A model-agnostic gateway layer is what makes routing cheap to add later.',
    },
    {
      id: 'io-streaming-sse',
      type: 'mcq',
      prompt: 'Why does streaming matter even when total generation time is unchanged?',
      choices: [
        'Perceived latency collapses: users read at ~5 tokens/s while the model generates faster; TTFT becomes the only wait',
        'It reduces server cost: tokens leave GPU memory as they are produced, so KV cache pages can be freed incrementally mid-generation',
        'It improves output quality',
        'It avoids rate limits',
      ],
      answer: 0,
      explanation:
        'The full answer might take 15s; the first sentence takes 1s. In FastAPI this is SSE via StreamingResponse.',
    },
    {
      id: 'io-local-vs-api',
      type: 'flash',
      front: '"Should we self-host an open model or use an API?": the grown-up tradeoff answer.',
      back: 'API wins on frontier quality, zero ops, instant scaling: pay per token. Self-hosting wins on data control, latency floor, and cost ONLY at sustained high utilization (idle GPUs bleed money). Practical middle: API for the product, small self-hosted/local models for high-volume narrow tasks (classification, embedding, drafts). Decision inputs: volume, privacy requirements, task difficulty, team ops capacity.',
    },
    {
      id: 'io-retries',
      type: 'mcq',
      prompt: 'Production LLM API calls fail intermittently (429s, timeouts). The resilient client pattern?',
      choices: [
        'Exponential backoff with jitter, a retry budget, timeouts per call, and a fallback model/response path',
        'Retry immediately in a tight loop: a 429 means capacity just freed up, so the fastest client back in line wins the slot',
        'One attempt; fail the request',
        'Cache every possible response',
      ],
      answer: 0,
      explanation:
        'Bounded concurrency (a semaphore) plus backoff is the standard batch-client design. Fallback answers ("try again shortly") beat hanging spinners.',
    },
    {
      id: 'io-kv-math',
      type: 'flash',
      front: 'Estimate KV cache size per token for a transformer. What terms go into the formula?',
      back: 'Per token: 2 (K and V) × layers × kv_heads × head_dim × bytes per element.\nExample, Llama-2-7B in fp16: 2 × 32 × 32 × 128 × 2 ≈ 0.5 MB per token.\nSo a 128k-token context needs ~64GB of KV: more than the ~14GB of weights.\nThe formula shows the levers: GQA/MQA shrink kv_heads, KV quantization shrinks bytes, and batch size multiplies the whole thing.',
    },
    {
      id: 'io-quant-tradeoffs',
      type: 'mcq',
      prompt: 'Weight-only quantization (GPTQ/AWQ int4) vs weight-and-activation quantization (int8 W8A8): the key difference?',
      choices: [
        'Weight-only shrinks memory traffic but still computes in fp16; W8A8 also uses integer tensor cores for compute, but activation outliers make it harder to do without quality loss',
        'Weight-only is more accurate because its weights are calibrated offline, while W8A8 must requantize the weights at request time, recomputing scale factors for every incoming batch and losing precision each time',
        'W8A8 only works on CPUs',
        'They are the same technique with different names',
      ],
      answer: 0,
      explanation:
        'Weight-only int4 dequantizes on the fly: ideal for bandwidth-bound decode, usually near-lossless on large models. W8A8 (SmoothQuant-style) targets compute-bound prefill and large batches; activations have outlier channels, so it needs calibration tricks. Perplexity cost grows as bits drop: 8-bit is near-free, 4-bit weights are mild, aggressive activation or sub-4-bit quant is where quality visibly degrades.',
    },
    {
      id: 'io-tensor-pipeline',
      type: 'mcq',
      prompt: 'The model does not fit on one GPU. Tensor parallelism vs pipeline parallelism?',
      choices: [
        'TP splits each layer\'s matrices across GPUs (all-reduce every layer, needs NVLink-class interconnect, cuts per-token latency); PP splits layers into sequential stages (only activations cross, tolerates slow links, adds bubble overhead)',
        'They are interchangeable; pick whichever is easier to configure',
        'PP is always faster because it communicates less',
        'TP shards the training data so each GPU sees different batches, PP shards the optimizer state across ranks (ZeRO/FSDP-style); both are training-only techniques and neither applies at inference, since serving has no gradients or optimizer state to distribute',
      ],
      answer: 0,
      explanation:
        'The standard deployment: TP within a node (fast interconnect), PP across nodes (slow interconnect). For inference, TP helps latency because every GPU works on the same token; PP helps fit but each token still traverses all stages serially.',
    },
    {
      id: 'io-spec-acceptance',
      type: 'tf',
      prompt: 'Speculative decoding always speeds up generation, regardless of the draft model\'s acceptance rate.',
      answer: false,
      explanation:
        'Low acceptance means the draft work plus verification passes are wasted and it can be SLOWER than plain decoding. It wins when the draft aligns with the target (same family/tokenizer, predictable text like code or boilerplate). Gains also shrink at high batch sizes, where the GPU is no longer idle during decode.',
    },
    {
      id: 'io-constrained-decoding',
      type: 'mcq',
      prompt: 'Constrained decoding for structured output (JSON schema, grammars): how does it work and what does it cost?',
      choices: [
        'A state machine masks the logits each step so only grammar-valid tokens can be sampled: syntax validity is guaranteed, at the cost of per-step mask overhead and possible quality loss when the schema fights the model\'s natural phrasing',
        'The model is fine-tuned on JSON before every request',
        'The model samples freely, a validator parses the result, and invalid outputs are silently resampled at higher temperature until one parses: validity is only probabilistic, but the model\'s natural phrasing is never disturbed, which is why providers brand it "JSON mode"',
        'It truncates the output at the first closing brace',
      ],
      answer: 0,
      explanation:
        'This is how "JSON mode" and tools like Outlines/XGrammar work. Guaranteed-parseable beats retry loops for reliability and cost. The subtle risk: hard constraints can force low-probability continuations, so keep schemas loose where content quality matters.',
    },
    {
      id: 'io-batch-roofline',
      type: 'flash',
      front: 'Why does increasing batch size raise decode throughput almost for free, and what eventually stops it?',
      back: 'Decode reads all weights once per step no matter how many sequences are in the batch, so extra sequences amortize the same memory traffic: tokens/s scales nearly linearly at small batches.\nThree things end the free lunch:\n1. KV cache memory: each sequence adds its own KV, and the GPU runs out.\n2. Arithmetic intensity rises with batch until the workload turns compute-bound.\n3. Per-token latency for each user creeps up as steps get heavier.\nServing is choosing a point on this throughput vs latency curve, not maximizing one number.',
    },
    {
      id: 'io-request-lifecycle',
      type: 'order',
      prompt: 'Order the life of one request inside a continuous-batching server (vLLM-style):',
      items: [
        'Request arrives and is tokenized',
        'Scheduler admits it into the running batch when KV pages are available',
        'Prefill computes the prompt\'s KV cache and emits the first token (TTFT)',
        'Decode steps interleave with every other in-flight request',
        'Generation finishes; its KV pages are freed for waiting requests',
      ],
      explanation:
        'The scheduler plus paged KV is the whole trick: admission is gated by free KV pages, and freeing pages promptly is what keeps new requests flowing in mid-flight.',
    },
  ],
};
