import type { Deck } from '../types';

export const credAi103: Deck = {
  id: 'cred-ai103',
  title: 'AI-103: Azure AI Apps',
  description: 'Azure AI Apps & Agents Developer Associate, scenario by scenario.',
  icon: '☁️',
  color: '#0078d4',
  track: 'Credentials',
  cards: [
    {
      id: 'a103-what',
      type: 'flash',
      front: 'What does AI-103 certify, and how does it relate to AI-102?',
      back: 'Microsoft Certified: Azure AI Apps and Agents Developer Associate; designing, developing, and deploying Azure AI solutions using Python and Microsoft Foundry. It’s the successor path to AI-102, which retired on June 30, 2026: the older cert covered the classic Azure AI services, while AI-103 centers on building apps and agents on top of Foundry.',
    },
    {
      id: 'a103-foundry-map',
      type: 'order',
      prompt: 'Arrange the Foundry deployment map, from workspace to production oversight.',
      items: [
        'Project: your workspace',
        'Hub/resource: the Azure backing (quota, networking, keys)',
        'Model deployment: a catalog model under a deployment name',
        'Endpoint: the URL your app calls',
        'Auth: API key or Entra ID / managed identity',
        'Evaluation and monitoring: eval runs, traces, token usage',
      ],
      explanation:
        'Every AI-103 scenario question lives somewhere on this map.',
    },
    {
      id: 'a103-before-call',
      type: 'mcq',
      prompt: 'What must exist before your Python app can call a model on Azure?',
      choices: [
        'A Foundry project with a model deployed from the catalog to an endpoint, plus credentials for it',
        'Just an Azure subscription ID: model access is enabled tenant-wide the moment the subscription exists',
        'A fine-tuned model: catalog base models cannot be called until at least one tuning job has run',
        'A Kubernetes cluster running the model, since Foundry only orchestrates compute you provision yourself',
      ],
      answer: 0,
      explanation:
        'Subscription → Foundry project/resource → deploy a catalog model under a deployment name → call the endpoint with key or Entra auth. The deployment name (not the model name) is what your code references.',
    },
    {
      id: 'a103-model-choice',
      type: 'mcq',
      prompt: 'Cost, latency, and quality conflict when picking a model. The exam-grade approach?',
      choices: [
        'Define eval criteria first, test candidate models against them, pick the cheapest that passes',
        'Always deploy the largest model available: retries on bad output cost more than the bigger model does',
        'Always pick the cheapest and accept the quality: cost is the only criterion you can measure objectively',
        'Let each end user choose a model',
      ],
      answer: 0,
      explanation:
        'Measure, don’t vibe: your evals define "good enough," then cost decides among the passing models. Bonus point: route easy traffic to the small model and escalate hard cases.',
    },
    {
      id: 'a103-managed-identity',
      type: 'fill',
      prompt: 'Production auth on Azure: avoid keys in config:',
      code: 'from azure.identity import DefaultAzureCredential\ncred = DefaultAzureCredential()  # uses managed ____ in production',
      answers: ['identity'],
      distractors: ['secret', 'token', 'principal'],
      explanation:
        'Managed identity gives the app an Azure AD identity with no stored secret to leak or rotate. "Managed identity over API keys" is a reliable exam answer and a reliable interview answer.',
    },
    {
      id: 'a103-logging',
      type: 'flash',
      front: '"What would you log for a production AI app besides the final answer?"',
      back: 'Prompt/template version, model + deployment name, retrieved context (what the model saw), tool calls and results, token counts and cost per request, latency, a request/trace ID linking it all, content-filter triggers, and user feedback signals. Without these you cannot debug, cannot control spend, and cannot prove what happened: the difference between a prototype and a deployable app.',
    },
    {
      id: 'a103-tool-safety',
      type: 'mcq',
      prompt: 'What makes a tool safe enough for an agent to call?',
      choices: [
        'Constrained input/output schemas, least privilege, blocked-action list, audit logging, human approval for consequential actions',
        'A large model that rarely makes mistakes: model-level alignment makes tool-level guardrails redundant',
        'Read-only access to everything: an agent that can only read cannot cause harm, so no schemas, logging, or approval steps are needed',
        'A rate limit alone',
      ],
      answer: 0,
      explanation:
        'A concrete pattern: an agent that can read data and draft output but cannot send, purchase, or delete; capability boundaries as design, not hope.',
    },
    {
      id: 'a103-retrieve-vs-memory',
      type: 'mcq',
      prompt: 'When should an agent retrieve knowledge instead of relying on model memory?',
      choices: [
        'When the data is fresh, private, or must be verifiable/citable',
        'Always: model memory should never be used, since weights are frozen at training time and every answer from them is unverifiable',
        'Only when the context window is full and older turns must be paged out to a store',
        'When latency doesn’t matter',
      ],
      answer: 0,
      explanation:
        'Model weights hold general knowledge with a cutoff; retrieval grounds answers in current, private, checkable sources. Azure calls this "knowledge connections."',
    },
    {
      id: 'a103-eval-metrics',
      type: 'flash',
      front: 'The four evaluation dimensions Foundry’s genAI evals center on: define each.',
      back: 'Groundedness: is the answer supported by the provided context, or invented? Relevance: does it address the question asked? Safety: free of harmful/policy-violating content? Task success/quality: did it accomplish what the user needed? Automate all four over an eval dataset and run them as regression checks whenever the prompt or model changes.',
    },
    {
      id: 'a103-eval-leakage',
      type: 'mcq',
      prompt: 'How do you keep evaluation data from leaking into production prompts?',
      choices: [
        'Keep eval sets in separate storage, never source few-shot examples from them, and audit prompt content',
        'Encrypt the eval set at rest: ciphertext cannot appear in a prompt, so encryption is the leakage control',
        'Use the eval set only on Fridays',
        'Leakage only matters for fine-tuning, not prompts: prompts are stateless, so few-shot reuse of eval rows changes nothing',
      ],
      answer: 0,
      explanation:
        'The moment an eval example becomes a few-shot example, that eval row measures memorization. Same contamination logic as public benchmarks, at app scale.',
    },
    {
      id: 'a103-responsible',
      type: 'flash',
      front: 'Responsible AI in Foundry: the concrete mechanisms to name.',
      back: 'Content filters on input and output (severity-configurable, per-category), safety evaluations run like quality evals, red-teaming before launch, groundedness checks against retrieval, human oversight for consequential decisions, and monitoring for filter hits in production. Exam answers favor "configure the platform mechanism" over "write a stern system prompt."',
    },
    {
      id: 'a103-ocr-review',
      type: 'mcq',
      prompt: 'When is automated content understanding enough, and when do you add human review?',
      choices: [
        'Automate high-volume structured extraction; route low-confidence, ambiguous, or high-stakes items to humans',
        'Humans review everything, always: model confidence scores are too unreliable to route on, so no item may skip review',
        'Automation is always enough once measured accuracy exceeds 90%; past that threshold review adds no value',
        'Human review is only for images',
      ],
      answer: 0,
      explanation:
        'Routing on measurable uncertainty signals (low OCR confidence, missing fields, value conflicts) is the standard human-in-the-loop pattern for document pipelines.',
    },
    {
      id: 'a103-deploy-checklist',
      type: 'flash',
      front: 'Recite the deployment-readiness checklist for an Azure AI app.',
      back: 'Identity: managed identity, least-privilege RBAC. Secrets: Key Vault, none in code or config. Logging/tracing: request IDs, token/cost tracking, content-filter hits. Cost limits: quotas and alerts before the bill surprises you. Evaluation: regression evals wired into CI. Rollback: previous prompt/model deployment ready to restore. Monitoring: latency, error rates, drift. Six words to remember: identity, secrets, logging, cost, evals, rollback.',
    },
  ],
};
