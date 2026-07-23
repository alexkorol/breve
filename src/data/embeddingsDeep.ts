import type { Deck } from '../types';

export const embeddingsDeep: Deck = {
  id: 'embeddings-deep',
  title: 'Embeddings & Retrieval Deep',
  description: 'Past the basics: hybrid search, rerankers, and why retrieval fails.',
  icon: '🧭',
  color: '#4ade80',
  track: 'AI Engineering',
  cards: [
    {
      id: 'ed-how-made',
      type: 'mcq',
      prompt: 'Where does a sentence embedding actually come from?',
      choices: [
        'A transformer encoder’s token outputs pooled (mean/CLS) into one vector, trained contrastively so similar texts land close',
        'Static word2vec vectors looked up per token and averaged together, which is why word order and surrounding context never change the embedding',
        'A locality-sensitive hash of the characters, so similar spellings get similar vectors',
        'The LLM’s final answer tokens',
      ],
      answer: 0,
      explanation:
        'Contrastive training (pull positives together, push negatives apart) is what makes the geometry MEAN something. bge, E5, OpenAI embeddings: all this recipe at different scales.',
    },
    {
      id: 'ed-asymmetric',
      type: 'mcq',
      prompt: 'Why do models like E5 prefix inputs with "query:" vs "passage:"?',
      choices: [
        'Asymmetric search: short questions and long answers live in different distributions; the prefix tells the model which side it’s embedding',
        'The prefixes are prompt-style instructions the encoder interprets freely, so any descriptive label ("text:", "input:") works just as well',
        'To count tokens',
        'For language detection',
      ],
      answer: 0,
      explanation:
        'Skipping the required prefix silently degrades retrieval: check your embedding model’s card. bge similarly recommends a query instruction. Silent-degradation bugs are the theme of retrieval.',
    },
    {
      id: 'ed-normalize',
      type: 'fill',
      prompt: 'Cosine similarity via plain dot product requires:',
      code: 'emb = emb / np.linalg.____(emb)   # then cos = a @ b',
      answers: ['norm'],
      distractors: ['abs', 'mean', 'sum'],
      explanation:
        'Unit-normalized vectors make dot product == cosine. Most APIs pre-normalize, but verify, because mixing normalized and unnormalized vectors silently breaks rankings.',
    },
    {
      id: 'ed-bm25',
      type: 'mcq',
      prompt: 'When does old-school BM25 keyword search beat your embedding model?',
      choices: [
        'Exact identifiers: error codes, SKUs, function names, rare jargon the embedder never learned',
        'Never: embedding vectors preserve token identity, so lexical matching is a strict subset of semantic search',
        'Only on tiny corpora, where nearest-neighbor search lacks enough data to be meaningful',
        'When documents are short',
      ],
      answer: 0,
      explanation:
        'Embeddings blur "ERR_CONN_RESET" into generic error-space; BM25 matches it exactly. This is WHY hybrid search exists: neither side dominates.',
    },
    {
      id: 'ed-hybrid',
      type: 'flash',
      front: 'Hybrid search: the architecture and how the two result lists merge.',
      back: 'Run BM25 and vector search in parallel, then fuse. Standard fusion: Reciprocal Rank Fusion; score each doc by Σ 1/(k + rank) across both lists (k ≈ 60); no score normalization needed, which is the whole trick since BM25 and cosine scores aren’t comparable. Hybrid + reranker is the "just works" retrieval stack of 2026: the default answer to "how would you improve my RAG?"',
    },
    {
      id: 'ed-reranker',
      type: 'mcq',
      prompt: 'Bi-encoder retrieval vs cross-encoder reranking?',
      choices: [
        'Bi-encoder embeds query and docs separately (fast, indexable); cross-encoder reads them TOGETHER for accuracy, so retrieve top-100 fast, rerank top-100 well',
        'Cross-encoders are faster since they score in one forward pass, so use them for first-stage retrieval and keep the bi-encoder for final reranking of the top few',
        'Bi-encoders are more accurate because each text gets a dedicated forward pass',
        'They are the same model used twice',
      ],
      answer: 0,
      explanation:
        'The funnel: cheap-and-broad then expensive-and-narrow. A reranker is typically the single biggest retrieval-quality upgrade per hour of work.',
    },
    {
      id: 'ed-recall-at-k',
      type: 'fill',
      prompt: 'The retrieval metric that answers "did the gold chunk make it into the context?"',
      code: 'metric = ____@k   # e.g. did it appear in the top 5?',
      answers: ['recall'],
      distractors: ['precision', 'accuracy', 'F1'],
      explanation:
        'Recall@k gates everything downstream: the generator can’t cite what retrieval never fetched. Evaluate retrieval SEPARATELY from generation; most "bad RAG answers" are recall failures.',
    },
    {
      id: 'ed-eval-retrieval',
      type: 'flash',
      front: 'Build a retrieval eval set for your RAG app with no labeling budget: how?',
      back: 'Synthetic Q&A generation: for a sample of chunks, have an LLM write a question each chunk answers; (question, gold-chunk) pairs for free. Measure recall@k and MRR over them; spot-check quality by hand. Now chunking changes, embedding-model swaps, and hybrid weights are MEASURED. Also the honest caveat: synthetic questions are easier than real user questions; keep a small human-written set as the anchor.',
    },
    {
      id: 'ed-chunk-fails',
      type: 'mcq',
      prompt: 'Retrieval keeps returning the right DOCUMENT but the wrong SECTION. Prime suspect?',
      choices: [
        'Chunking: sections split mid-thought or lack heading context; add headers to chunk text and align boundaries to structure',
        'Index corruption: the ANN graph holds stale pointers, so document vectors resolve to neighboring sections; rebuild the index',
        'Cosine similarity is broken',
        'top-k is too small',
      ],
      answer: 0,
      explanation:
        'Prepending the section path ("Ch 3 > Error Handling > …") to each chunk is the highest-ROI chunking upgrade: context travels with the chunk.',
    },
    {
      id: 'ed-query-transform',
      type: 'mcq',
      prompt: 'User asks "why did it break again like last week?": retrieval returns junk. The fix family?',
      choices: [
        'Query transformation: rewrite with an LLM (resolve references, add context), or HyDE: embed a hypothetical answer instead of the question',
        'A larger embedding model: higher-dimensional vectors carry the world knowledge needed to resolve pronouns and temporal references on their own',
        'More chunks',
        'Lower temperature',
      ],
      answer: 0,
      explanation:
        'Conversational queries are underspecified; the embedder can’t resolve "it" and "last week". Rewrite-then-retrieve is standard in chat RAG, and agentic RAG makes the model do it itself.',
    },
    {
      id: 'ed-dims-tradeoff',
      type: 'mcq',
      prompt: 'Embedding dimensions (384 vs 1536 vs 3072): what actually trades?',
      choices: [
        'Storage, search latency, and cost scale with dims; quality gains flatten: small models often suffice for narrow domains',
        'Bigger is always meaningfully better: retrieval quality scales linearly with dimensions the way model quality scales with parameters',
        'Dimensions only affect training cost; at query time every model searches the same projected space',
        'All models use 768',
      ],
      answer: 0,
      explanation:
        'Matryoshka embeddings let you truncate one model to multiple sizes. A small model at 384 dims is often a defensible cost/quality point for a narrow domain: know why yours is.',
    },
    {
      id: 'ed-tf-bm25',
      type: 'tf',
      prompt: 'A good embedding model makes BM25 keyword search obsolete.',
      answer: false,
      explanation:
        'BM25 still wins on exact identifiers: error codes, SKUs, rare jargon. That’s why hybrid search exists.',
    },
    {
      id: 'ed-drift',
      type: 'mcq',
      prompt: 'You upgrade the embedding model. What MUST happen to the vector store?',
      choices: [
        'Re-embed the entire corpus: old and new vectors live in incompatible spaces',
        'Nothing: embedding spaces are aligned across model versions, so old vectors stay comparable',
        'Only new documents need the new model; cosine similarity normalizes away differences between spaces',
        'Normalize the old vectors again',
      ],
      answer: 0,
      explanation:
        'Mixed-space corpora fail SILENTLY: similarity scores are garbage but code runs fine. Version the embedding model in index metadata and alarm on mismatch. Rhymes with your judge-versioning card.',
    },
    {
      id: 'ed-metadata-filter',
      type: 'flash',
      front: 'Metadata filtering in retrieval: what is it, and what is the trap?',
      back: 'Structured labels per chunk (doc type, department, language, date, permissions, version) filter ELIGIBILITY before any semantic scoring: the bouncer at the door; vector search only ranks who got in. Wins: relevance, speed, enforced permissions, freshness. The trap: over-filtering silently removes relevant chunks before ranking ever sees them. Start broad, measure what gets excluded, tighten gradually.',
    },
    {
      id: 'ed-mrr',
      type: 'mcq',
      prompt: 'System A puts the first relevant result at rank 1 for half of queries and rank 4 for the rest. What does MRR measure here?',
      choices: [
        'How early the FIRST relevant result appears: mean of 1/rank, so (1/1 + 1/4)/2 = 0.625',
        'The fraction of retrieved results in the top K that are relevant, averaged over queries (precision@K)',
        'The fraction of all relevant chunks retrieved',
        'Average rank of every relevant result: here (1 + 4)/2 = 2.5, lower being better',
      ],
      answer: 0,
      explanation:
        'Mean Reciprocal Rank rewards putting one right answer near the top: rank 1 scores 1.0, rank 4 scores 0.25. The metric trio: recall@K = coverage, precision@K = purity, MRR = how early.',
    },
    {
      id: 'ed-multilingual',
      type: 'mcq',
      prompt: 'The corpus spans five languages. Translate everything to English before indexing?',
      choices: [
        'No: use multilingual embeddings to retrieve across languages, translate only returned results, and validate on your actual data',
        'Yes: embedding models are monolingual by construction, since contrastive training pairs are drawn from a single language at a time',
        'Yes: translation is cheaper than multilingual models',
        'No: keep separate per-language indexes and query them all',
      ],
      answer: 0,
      explanation:
        'Multilingual embedding models map meaning across languages into one space, so pre-translating the corpus is wasted cost. The senior caveat: multilingual quality varies by language pair; build a small eval set (queries in one language, gold chunks in another), track recall@K, and error-analyze weak pairs.',
    },
  ],
};
