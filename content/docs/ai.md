---
title: "AI Assistance"
description: "AI-assisted detection engineering: rule generation, runbook and playbook drafts, translation linting, health insights, and autofix. Self-hosted via Ollama with full data privacy and human approval."
weight: 8
section: "Features"
---

## Overview

CraftedSignal uses AI to assist detection engineers — never to auto-deploy or make autonomous decisions. AI is optional, transparent, and can be disabled entirely.

---

## What AI does

### Rule generation

Describe what you want to detect. AI generates:

- The detection rule (SPL, KQL, or FalconQL)
- Positive and negative test cases
- MITRE ATT&CK mapping
- Context (rationale, assumptions, noise expectations)
- Runbook and playbook draft, when response content is enabled

AI-generated rules are created in the web UI. Describe the threat, select your target platform, and the AI produces a complete rule with tests, MITRE mapping, and optional response steps for you to review before pushing.

### Runbook and playbook drafts

AI can draft Markdown response steps for a rule. The draft uses this structure:

- **Runbook**: alert intent, triage steps, evidence to collect, false-positive checks, and escalation criteria.
- **Playbook**: containment, eradication and recovery, communications and handoff, and follow-up detection work.

Drafts are grounded in the rule logic, platform, data sources, fields, severity, MITRE mapping, tags, tests, and company context. They remain suggestions until a human reviews and saves them.

Existing runbooks and playbooks can also inform later AI refinement of the rule, tests, escalation criteria, and follow-up detection work. The goal is to keep the rule and response steps aligned in both directions.

### Translation linting

When a rule is translated across platforms (e.g., SPL to KQL), AI highlights semantic differences that could affect detection accuracy.

### Health insights

AI analyzes rule performance and suggests improvements:

- Tuning Backlog items for noisy rules
- Query optimization suggestions
- Coverage gap Backlog items from threat intel
- Missing runbook and playbook Backlog items for rules that do not yet explain the analyst response
- Stale runbook and playbook Backlog items when rule or hunt context changes

### Autofix

AI can suggest fixes for rules that fail validation or testing. You review and approve the suggestion before it's applied.

### Threat actor adjudication

When the threat feed ingests a brief that names an actor not in the catalog, AI normalizes the name against the existing [threat-actor catalog](/docs/threat-actors/). It returns one of three structured decisions: **alias** an existing actor, **create** a new entry, or **skip** when the string isn't a threat actor. The decision and confidence score are recorded in the LLM usage log.

When AI is disabled, the catalog stops growing — exact-match still works, unmatched actor names just stay unlinked.

### Hunt outcome and digest summaries

After a hunt completes, AI summarizes the evidence into a human-readable paragraph stored on the risk's lifecycle timeline. Campaign closes and the threat-feed digest are summarized the same way. These summaries are advisory; the underlying clusters, verdicts, and briefs are the source of truth.

---

## Usage tracking

Every AI call is logged with model, input/output token counts, cached-token counts, cost estimate, and the activity that triggered it. Tracked activities include:

- `actor_adjudication` — name normalization in the feed bridge.
- `novel_chain_extraction` — attack-chain analysis from briefs.
- `hunt_outcome_summary` — post-hunt evidence narrative.
- `campaign_close_summary` — campaign-level wrap-up.
- `digest_narrative` — feed digest copy.

The log table is queryable per-company per-time-window for cost analytics and audit. Surfaces in the **AI Quality** screen for owners (`/ai-quality`), where you can see per-activity volume, cost, and the prompt → response history for spot-checking the model.

Cost is best-effort: providers that don't return native cost data (e.g., self-hosted Ollama) record token counts and a $0 estimate. Token counts are always recorded.

---

## Guardrails

### Human approval required

AI suggestions are **never auto-deployed**. Every AI-generated or modified rule requires explicit human approval before it reaches your SIEM.

### Explainability

Every AI suggestion includes:

- The prompt that was used
- The diff between current and suggested rule
- The suggested runbook/playbook draft, when one is generated
- A confidence score
- Reasoning for the suggestion

### Data minimization

- Raw SIEM log streams are not sent to hosted AI by default
- PII redaction is applied before hosted AI processing where applicable
- AI prompts use rule logic, metadata and explicit workflow context rather than raw customer telemetry streams

### Safety checks

AI-generated rules go through the same validation pipeline as human-written rules: lint, test, shadow eval, approval. AI-generated runbooks and playbooks remain editable Markdown and should be reviewed against the rule before analysts use them.

---

## Provider options

CraftedSignal uses one shared platform-level AI provider configuration today. Per-company bring-your-own-AI routing is not configured yet.

CraftedSignal SaaS defaults to Vertex AI in Google Cloud. The AI workload runs in the same Google Cloud location as the CraftedSignal application workloads. Prompts and responses are not used for model training.

Supported provider values:

| Provider | Use for |
| --- | --- |
| `openai` | Generic OpenAI-compatible endpoints, including Ollama and compatible hosted gateways |
| `openai_api`, `chatgpt` | OpenAI public API |
| `azure_openai`, `microsoft` | Azure OpenAI / Microsoft Foundry OpenAI-compatible endpoints |
| `anthropic`, `claude` | Anthropic Claude via Messages API |
| `github` | Existing GitHub Models compatibility |

Microsoft 365 Copilot is not supported as shared AI backend. Copilot depends on Microsoft 365 and Graph delegated context, so it would be separate per-tenant connector if supported later.

Run AI features entirely on your infrastructure using Ollama or another internal OpenAI-compatible endpoint:

```yaml
ai:
  enabled: true
  provider: openai
  url: "http://localhost:11434"
  model: "qwen2.5-coder:14b"
  test_gen_model: "qwen3:14b"
```

For hosted providers, configure provider, model, and API key:

```yaml
ai:
  enabled: true
  provider: anthropic
  model: "claude-sonnet-4-5"
  api_key: "${ANTHROPIC_API_KEY}"
```

Primary model handles query and rule authoring: rule generation, Sigma/query rewrite, and fixing broken rules. `test_gen_model` or secondary provider handles reasoning and language tasks: rule analysis, test cases, summaries, response guidance, field mapping, threat-model suggestions, ideal posture planning, and feedback triage.

When self-hosted, no data leaves your network. CraftedSignal never sends rule data to external AI services unless you explicitly configure it. Production SaaS rejects private, loopback, link-local, and metadata-style AI provider URLs to prevent SSRF. See [Configuration](/docs/configuration/) for all AI settings.

---

## Disable AI

If your security policy prohibits AI, disable it entirely:

```yaml
ai:
  enabled: false
```

All AI features are removed from the UI and CLI. The platform works fully without AI — it's an enhancement, not a dependency. Runbooks and playbooks can still be written and reviewed manually.

---

## Data policy

- CraftedSignal **never trains on your data**
- AI interactions are logged in the immutable audit trail
- You control which AI model is used and where it runs

See [Runbooks & Playbooks](/docs/runbooks-playbooks/) for sync behavior, response content structure, and the review checklist.
