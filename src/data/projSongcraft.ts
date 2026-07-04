import type { Deck } from '../types';

export const projSongcraft: Deck = {
  id: 'proj-songcraft',
  title: 'My Project: SongCraft RAG',
  description: 'Own every layer of your own RAG system — whiteboard it cold.',
  icon: '🎵',
  color: '#7c3aed',
  track: 'My Projects',
  cards: [
    {
      id: 'sc-pitch',
      type: 'flash',
      front: 'Deliver the SongCraft RAG 30-second pitch.',
      back: '"A retrieval-augmented generation system over my songwriting research corpus — 45 PDFs, ~2,400 pages, 7,370 chunks: music-theory papers, Berklee handbooks, NLP papers on lyric generation. Ask a question, it retrieves the top-5 relevant passages and the LLM synthesizes a cited answer. Built as the knowledge layer for my larger lyric-generation pipeline. Stack: LangChain, ChromaDB, FastEmbed local embeddings, OpenRouter for generation."',
    },
    {
      id: 'sc-ingest-order',
      type: 'mcq',
      prompt: 'SongCraft’s ingestion pipeline, in order?',
      choices: [
        'PyPDFLoader → RecursiveCharacterTextSplitter → FastEmbed embeddings → ChromaDB',
        'ChromaDB → PyPDFLoader → FastEmbed → splitter',
        'FastEmbed → PyPDFLoader → ChromaDB → splitter',
        'PyPDFLoader → FastEmbed → splitter → ChromaDB',
      ],
      answer: 0,
      explanation:
        'Load (one Document per page, tagged with source_file) → chunk → embed → store. You must be able to draw this half of the whiteboard without thinking.',
    },
    {
      id: 'sc-chunk-params',
      type: 'fill',
      prompt: 'Your chunking parameters (asked verbatim at TCS-style depth):',
      code: 'RecursiveCharacterTextSplitter(\n    chunk_size=1000,\n    chunk_overlap=____,\n    separators=["\\n\\n", "\\n", ". ", " ", ""])',
      answers: ['200'],
      distractors: ['100', '500', '50'],
      explanation:
        '1000 chars with 200 overlap. The overlap exists so a sentence falling on a chunk boundary survives intact in at least one chunk.',
    },
    {
      id: 'sc-splitter-why',
      type: 'mcq',
      prompt: 'Why RecursiveCharacterTextSplitter over a fixed-size split?',
      choices: [
        'It tries paragraph breaks first, then newlines, sentences, words — preserving semantic units',
        'It is the only splitter LangChain ships',
        'It produces exactly equal chunk sizes',
        'It runs on the GPU',
      ],
      answer: 0,
      explanation:
        'The separators list is a preference order: split at the largest semantic boundary that keeps chunks under the size limit. Fixed-size splits cut sentences mid-thought.',
    },
    {
      id: 'sc-chroma-why',
      type: 'mcq',
      prompt: '"Why ChromaDB and not Pinecone?" — your answer:',
      choices: [
        'Local, serverless, persists to a directory, zero cost — right for this scale; I’d move to managed for production',
        'ChromaDB has better similarity math than Pinecone',
        'Pinecone cannot store PDF text',
        'It was a random choice',
      ],
      answer: 0,
      explanation:
        'The senior-sounding shape: right tool for the scale, plus you know the migration path. At 7,370 vectors, a managed distributed vector DB would be pure overhead.',
    },
    {
      id: 'sc-fastembed',
      type: 'flash',
      front: 'Why FastEmbed with a local ONNX model instead of the OpenAI embeddings API?',
      back: 'Free and offline — ingesting 2,400 pages costs nothing and needs no API key. The model is BAAI/bge-small-en-v1.5, a strong general-purpose embedder producing 384-dimension vectors, running on onnxruntime (which was already a transitive dependency of ChromaDB). Query embedding must use the same model as ingestion — mismatched embedding spaces silently break retrieval.',
    },
    {
      id: 'sc-dims',
      type: 'mcq',
      prompt: 'What dimensionality are your embeddings, and from which model?',
      choices: [
        '384 — BAAI/bge-small-en-v1.5',
        '1536 — text-embedding-3-small',
        '768 — BERT-base',
        '4096 — Llama hidden states',
      ],
      answer: 0,
      explanation:
        'Knowing your own vector dimension cold is exactly the kind of detail that proves ownership under questioning.',
    },
    {
      id: 'sc-openrouter',
      type: 'flash',
      front: 'Why OpenRouter for generation? (This is your model-agnosticism talking point.)',
      back: 'One API key covers GPT, Claude, and Gemini; models swap at runtime via a --model flag. Generation ran on Gemini Flash at a fraction of Claude Sonnet’s price. The line to say: "I built it model-agnostic — the retriever and prompt don’t care which LLM generates the answer, so I can trade cost against quality per query."',
    },
    {
      id: 'sc-lcel',
      type: 'fill',
      prompt: 'Your LCEL chain — the question flows through unchanged via:',
      code: 'chain = (\n  {"context": retriever | format_docs,\n   "question": ____()}\n  | prompt | llm | StrOutputParser()\n)',
      answers: ['RunnablePassthrough'],
      distractors: ['RunnableIdentity', 'PassThrough', 'Identity'],
      explanation:
        'The starting dict runs two branches in parallel: retrieval+formatting feeds "context" while RunnablePassthrough() feeds the raw question into the prompt template.',
    },
    {
      id: 'sc-dedup',
      type: 'mcq',
      prompt: 'Why does ingestion hash every chunk with SHA-256?',
      choices: [
        'Content-hash dedup — re-running ingest or overlapping PDFs would embed duplicates that dominate retrieval',
        'Encryption of copyrighted material',
        'ChromaDB requires SHA-256 IDs',
        'To compress the chunks',
      ],
      answer: 0,
      explanation:
        'The hash is the chunk ID: already present → skip. Catches both re-ingestion and the same passage quoted in two papers. This dedup bug-fix is a banked post story.',
    },
    {
      id: 'sc-ainvoke',
      type: 'mcq',
      prompt: 'Why does the FastAPI layer call `chain.ainvoke()` rather than `chain.invoke()`?',
      choices: [
        'ainvoke is async — a 2–3s LLM call would otherwise block the event loop and every other request',
        'ainvoke retries automatically',
        'invoke is deprecated in LangChain',
        'ainvoke streams by default',
      ],
      answer: 0,
      explanation:
        'This connects your project to the async-endpoint question you got at TCS. One sentence links both: "async endpoint, async chain call, event loop never blocks."',
    },
    {
      id: 'sc-whiteboard',
      type: 'flash',
      front: 'WHITEBOARD DRILL: draw SongCraft cold — both flows. (Answer only after drawing.)',
      back: 'Ingestion: PDFs → PyPDFLoader (page Documents + source metadata) → RecursiveCharacterTextSplitter (1000/200) → SHA-256 dedup → FastEmbed (bge-small, 384-d) → ChromaDB persisted to disk. Query: question → same embedder → Chroma cosine top-k=5 → chunks formatted into prompt → OpenRouter LLM → StrOutputParser → cited answer. Served via FastAPI with ainvoke. If you drew both without peeking, this card is done.',
    },
  ],
};
