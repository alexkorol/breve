import type { Deck } from '../types';

export const projLedgerlens: Deck = {
  id: 'proj-ledgerlens',
  title: 'My Project: LedgerLens',
  description: 'Schema-first extraction with provenance — your newest, least-drilled build.',
  icon: '🧾',
  color: '#4f46e5',
  track: 'My Projects',
  cards: [
    {
      id: 'll-pitch',
      type: 'flash',
      front: 'Deliver the LedgerLens 30-second pitch — including what it deliberately is NOT.',
      back: '"A schema-first document extraction workstation. It parses documents, extracts fields into typed Pydantic schemas, attaches verbatim source evidence to every field, validates deterministic business rules, routes uncertain records to a human review queue, and reports before/after extraction quality. Deliberately NOT a chat-with-PDFs app — model output is treated as fallible data to be validated, never as the final product."',
    },
    {
      id: 'll-stance',
      type: 'mcq',
      prompt: 'LedgerLens’s core design stance on LLM output?',
      choices: [
        'Fallible data — nothing counts until Pydantic schemas and deterministic rules validate it',
        'Ground truth once the model is good enough',
        'Advisory text shown directly to the user',
        'Cached and trusted after the first correct run',
      ],
      answer: 0,
      explanation:
        'This one sentence is your systems-maturity thesis: the interesting engineering starts AFTER the model responds.',
    },
    {
      id: 'll-pipeline',
      type: 'flash',
      front: 'Whiteboard the LedgerLens pipeline, stage by stage.',
      back: 'Ingest (id + SHA-256 checksum) → normalize to page text → extraction adapter (heuristic / OpenAI / Anthropic — swappable) → Pydantic schema validation → deterministic business rules incl. the versioned retention table → evidence verification against page text → optional second extractor with field-level disagreement → any uncertainty signal? → accepted record OR review queue → human accepts/edits/rejects → audit log (original + corrected + reviewer + when) → export + eval report. Every stage persists to SQLite; a run is fully reconstructable.',
    },
    {
      id: 'll-provenance',
      type: 'mcq',
      prompt: 'What provenance does every extracted field carry?',
      choices: [
        'Page number, verbatim snippet, and char offsets — re-verified against the page text',
        'Just the model name that produced it',
        'A confidence percentage from the LLM',
        'The prompt that was used',
      ],
      answer: 0,
      explanation:
        'One row per field, each with its evidence. And the pipeline re-checks that the cited snippet actually exists on the cited page — evidence_mismatch is a routing signal when it doesn’t.',
    },
    {
      id: 'll-confidence',
      type: 'mcq',
      prompt: 'Why is LLM self-reported confidence deliberately NOT a review-routing signal?',
      choices: [
        'It isn’t defensible — models are poorly calibrated about themselves; routing uses countable signals instead',
        'It is too expensive to request',
        'The API doesn’t return it',
        'It is used, but only above 90%',
      ],
      answer: 0,
      explanation:
        '"Uncertainty is scored from defensible signals, never a vibe." Schema failures, rule violations, missing evidence, extractor disagreement — things you can count and audit.',
    },
    {
      id: 'll-signals',
      type: 'flash',
      front: 'Name the review-routing signals (there are nine — get at least seven).',
      back: 'schema_error (failed Pydantic), missing_required_field, validation_failure (e.g. subtotal + tax ≠ total, future dates), retention_conflict (extractor tried to set policy), retention_unmapped (doc type not in the rule table), missing_evidence, evidence_mismatch (snippet not on cited page), parser_warning, disagreement (two extractors differ on a field). Structured, countable reasons — never a vibe.',
    },
    {
      id: 'll-policy',
      type: 'mcq',
      prompt: '"Policy is code, not model output" means…',
      choices: [
        'Retention decisions come from a versioned rule table; an extractor inventing one raises retention_conflict',
        'The model is fine-tuned on company policy',
        'Policies are stored in the prompt',
        'Users set policy per document',
      ],
      answer: 0,
      explanation:
        'Compliance-adjacent decisions must be deterministic, versioned, and auditable. The model can propose values; it cannot set policy. Interviewers in document-AI love this boundary.',
    },
    {
      id: 'll-disagreement',
      type: 'mcq',
      prompt: 'What does running a second extraction adapter add?',
      choices: [
        'Field-level disagreement becomes a review signal — two models differing on a value is measurable doubt',
        'Double throughput',
        'Automatic averaging of the two values',
        'A fallback if the first API is down',
      ],
      answer: 0,
      explanation:
        'Cross-extractor disagreement (--extractor openai --cross-extractor anthropic) is ensemble doubt-detection: cheap, defensible, and it needs no ground truth to work.',
    },
    {
      id: 'll-metrics',
      type: 'mcq',
      prompt: 'On the synthetic corpus (9 docs, 51 gold fields), review routing scored…',
      choices: [
        'Precision 1.0 and recall 1.0 — all three deliberately broken docs routed, and only those',
        'Precision 0.5, recall 1.0',
        'Routing was not measured',
        'Precision 1.0, recall 0.33',
      ],
      answer: 0,
      explanation:
        'Field match rate 0.9804, evidence coverage 1.0, review rate 0.3333. The corpus plants an inconsistent total, a missing required field, and an unmapped retention type — the queue caught exactly those.',
    },
    {
      id: 'll-before-after',
      type: 'flash',
      front: 'The one field mismatch in the eval — and why it’s the point of the whole system.',
      back: 'The broken receipt’s PRINTED total disagrees with the human-verified gold value — the document itself lies. The extractor faithfully read the wrong number, rules flagged the inconsistency, a reviewer corrected it, and post_review_normalized_match_rate hit 1.0. The before/after human-correction delta is the product: not "the model is right," but "the system converges on right, visibly."',
    },
    {
      id: 'll-sqlite',
      type: 'mcq',
      prompt: 'Why does every stage persist to SQLite?',
      choices: [
        'Full reconstructability — raw output, parsed record, per-field evidence, every review reason and decision survive',
        'SQLite is faster than files',
        'Cloud databases were too expensive',
        'Only final records are actually stored',
      ],
      answer: 0,
      explanation:
        'Auditability as architecture: you can replay any run, prove why any field has its value, and show who changed what. That answer generalizes to every "how do you build trustworthy AI systems?" question.',
    },
    {
      id: 'll-whiteboard',
      type: 'flash',
      front: 'WHITEBOARD DRILL: "How would you build reliable extraction when the model is sometimes wrong?" Answer with LedgerLens.',
      back: 'Layered defense: typed schemas reject malformed output → deterministic rules catch semantic errors (totals that don’t add up) → mandatory evidence with re-verification catches fabrication → a second extractor catches silent disagreement → everything uncertain routes to humans with structured reasons → corrections feed an audit trail and before/after metrics. The model is one fallible component inside a system engineered to converge on correct.',
    },
  ],
};
