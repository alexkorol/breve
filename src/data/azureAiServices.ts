import type { Deck } from '../types';

export const azureAiServices: Deck = {
  id: 'azure-ai-services',
  title: 'Azure AI Services',
  description: 'The service-picker round: which Azure AI tool for which job.',
  icon: '🔷',
  color: '#60a5fa',
  track: 'Credentials',
  cards: [
    {
      id: 'az-service-picker',
      type: 'flash',
      front: 'The Azure AI service map: recite what each major service is FOR.',
      back: 'Foundry (was AI Studio): build/deploy genAI apps and agents; the hub.\nAzure OpenAI in Foundry Models: hosted GPT-family models.\nAI Search: retrieval (vector + keyword + semantic ranking), the RAG backbone.\nDocument Intelligence: forms/PDF extraction.\nAI Language: NER, sentiment, custom text classification.\nAI Vision: image analysis and OCR.\nContent Understanding: multimodal document/media pipelines.\nContent Safety: moderation filters.\nExam questions are mostly "which service?": this map answers them.',
    },
    {
      id: 'az-search-rag',
      type: 'mcq',
      prompt: 'The standard Azure RAG retrieval layer is…',
      choices: [
        'Azure AI Search: vector, keyword, and hybrid search with semantic reranking, integrated into Foundry "add your data"',
        'Azure SQL full-text search',
        'Blob storage prefix queries',
        'Cosmos DB change feed',
      ],
      answer: 0,
      explanation:
        'AI Search is the answer to nearly every Azure retrieval question: integrated vectorization, hybrid + semantic ranker, and index-time enrichment skills.',
    },
    {
      id: 'az-doc-intel',
      type: 'mcq',
      prompt: 'Extract fields from thousands of invoices on Azure, which service and mode?',
      choices: [
        'Document Intelligence: prebuilt invoice model first, custom-trained model if your layout defies it',
        'AI Vision OCR + regex',
        'Azure OpenAI with screenshots only',
        'Manual entry via Logic Apps',
      ],
      answer: 0,
      explanation:
        'Prebuilt models (invoice, receipt, ID) ship trained; custom models fine-tune on as few as ~5 labeled samples when your layout defies the prebuilts.',
    },
    {
      id: 'az-content-safety',
      type: 'mcq',
      prompt: 'Azure OpenAI content filtering: what should you know for the exam?',
      choices: [
        'Filters run on BOTH prompt and completion, per category (hate/sexual/violence/self-harm) with configurable severity, plus prompt-shield for jailbreaks',
        'Filtering is optional and off by default',
        'Only outputs are filtered',
        'Filters block all creative writing',
      ],
      answer: 0,
      explanation:
        'Filter hits surface as specific finish reasons/errors your app must handle gracefully: a favorite scenario question. Custom severity config requires justification for some tiers.',
    },
    {
      id: 'az-auth-patterns',
      type: 'mcq',
      prompt: 'Exam-grade auth ranking for calling Azure AI services from an app?',
      choices: [
        'Managed identity + RBAC role > Entra service principal + Key Vault secret > raw API keys in config',
        'API keys are the recommended production pattern',
        'Anonymous access with IP restrictions',
        'Shared SAS tokens in the frontend',
      ],
      answer: 0,
      explanation:
        '"No secrets to leak" beats "secrets stored well" beats "secrets in appsettings". Any exam answer containing a hardcoded key is wrong on sight.',
    },
    {
      id: 'az-quota',
      type: 'fill',
      prompt: 'Azure OpenAI throughput is provisioned in:',
      code: 'quota unit = ____ per minute (TPM),\nrate limits also expressed as RPM',
      answers: ['tokens'],
      distractors: ['requests', 'characters', 'threads'],
      explanation:
        'TPM quota is assigned per deployment from a regional pool; 429s mean backoff or a Provisioned Throughput (PTU) reservation for guaranteed capacity.',
    },
    {
      id: 'az-agent-service',
      type: 'mcq',
      prompt: 'Foundry Agent Service: what does it manage for you versus DIY agent loops?',
      choices: [
        'Hosted agent runtime: threads/state, tool orchestration (code interpreter, search, functions), tracing; you supply instructions and tools',
        'Nothing; it is only documentation',
        'It trains custom agent models',
        'It replaces the need for evaluation',
      ],
      answer: 0,
      explanation:
        'The managed counterpart to a hand-rolled LangGraph loop: same concepts (state, tools, routing), platform-hosted. Exam scenarios test "when managed service vs custom code": answer: compliance/speed vs control.',
    },
    {
      id: 'az-eval-foundry',
      type: 'mcq',
      prompt: 'Foundry evaluation runs measure genAI quality with metrics like…',
      choices: [
        'Groundedness, relevance, coherence, fluency, plus safety evaluations: run against datasets pre-deployment and as regressions',
        'Only token counts',
        'GPU utilization',
        'Azure Monitor CPU metrics',
      ],
      answer: 0,
      explanation:
        'AI-assisted metrics (an LLM judge under the hood) plus traditional ones. Wiring evals into CI/CD before promotion is the pattern the exam rewards.',
    },
    {
      id: 'az-language-custom',
      type: 'mcq',
      prompt: 'Classify support tickets into your 12 custom categories, which service tier?',
      choices: [
        'AI Language custom text classification: label examples, train, deploy an endpoint; no GPU management',
        'Fine-tune GPT-4 immediately',
        'Prebuilt sentiment analysis',
        'Azure Functions with keyword lists',
      ],
      answer: 0,
      explanation:
        'The decision rule: prebuilt if it fits → custom AI Language/Vision training for narrow classifiers → LLM when labels are scarce or the task needs reasoning. Cost ascends in that order too.',
    },
    {
      id: 'az-monitor-ai',
      type: 'mcq',
      prompt: 'Tracing a misbehaving Foundry agent in production: the tooling?',
      choices: [
        'Foundry tracing + Application Insights: per-run traces of model calls, tool invocations, and token usage',
        'print() statements',
        'RDP into the model server',
        'Support tickets to Microsoft',
      ],
      answer: 0,
      explanation:
        'OpenTelemetry-based tracing shows each step of the agent loop: thoughts, tool calls, and cost, linked per run.',
    },
    {
      id: 'az-regions-data',
      type: 'mcq',
      prompt: 'Customer requires EU data residency for an Azure OpenAI app. Key controls?',
      choices: [
        'Deploy in EU regions with a Data Zone/regional deployment type; data isn’t used to train models; private endpoints for network isolation',
        'Impossible on Azure',
        'Just promise it contractually',
        'Only on-prem satisfies residency',
      ],
      answer: 0,
      explanation:
        'Deployment types (Global/Data Zone/Regional) trade quota flexibility against processing-location guarantees: a compliance scenario the exam and real sales calls both love.',
    },
    {
      id: 'az-applied-skills',
      type: 'flash',
      front: 'Azure credential ladder for an AI engineer: what stacks, in what order?',
      back: 'AI-103 (Azure AI Apps & Agents Developer) is the core credential. Microsoft Applied Skills badges: the Foundry generative chat app and Foundry agents labs; are fast public proof you can earn during exam prep, and each produces a portfolio artifact. Broader certs like the MLOps Engineer Associate or AZ-104 are worth adding only when job postings you care about ask for them. A badge is most valuable when it maps to a project you can talk about.',
    },
  ],
};
