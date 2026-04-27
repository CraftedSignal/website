---
title: "AI Assistance"
description: "AI-assisted detection engineering: rule generation, translation linting, health insights, and autofix. Self-hosted via Ollama with full data privacy and human approval."
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

AI-generated rules are created in the web UI. Describe the threat, select your target platform, and the AI produces a complete rule with tests and MITRE mapping for you to review before pushing.

### Translation linting

When a rule is translated across platforms (e.g., SPL to KQL), AI highlights semantic differences that could affect detection accuracy.

### Health insights

AI analyzes rule performance and suggests improvements:

- Tuning recommendations for noisy rules
- Query optimization suggestions
- Coverage gap recommendations from threat intel

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

The log table is queryable per-company per-time-window for cost analytics and audit. Surfaces in the **AI Quality** screen for owners (`/dashboard/ai-quality`), where you can see per-activity volume, cost, and the prompt → response history for spot-checking the model.

Cost is best-effort: providers that don't return native cost data (e.g., self-hosted Ollama) record token counts and a $0 estimate. Token counts are always recorded.

---

## Guardrails

### Human approval required

AI suggestions are **never auto-deployed**. Every AI-generated or modified rule requires explicit human approval before it reaches your SIEM.

### Explainability

Every AI suggestion includes:

- The prompt that was used
- The diff between current and suggested rule
- A confidence score
- Reasoning for the suggestion

### Data minimization

- No raw logs leave your boundary
- PII is redacted before processing
- AI sees only rule logic and metadata, never customer telemetry

### Safety checks

AI-generated rules go through the same validation pipeline as human-written rules: lint, test, shadow eval, approval.

---

## Self-hosted AI

Run AI features entirely on your infrastructure using Ollama:

```yaml
ai:
  enabled: true
  ollama_url: "http://localhost:11434"
  ollama_model: "qwen2.5-coder:14b"
```

When self-hosted, no data leaves your network. CraftedSignal never sends rule data to external AI services unless you explicitly configure it. See [Configuration](/docs/configuration/) for all AI settings.

---

## Disable AI

If your security policy prohibits AI, disable it entirely:

```yaml
ai:
  enabled: false
```

All AI features are removed from the UI and CLI. The platform works fully without AI — it's an enhancement, not a dependency.

---

## Data policy

- CraftedSignal **never trains on your data**
- AI interactions are logged in the immutable audit trail
- You control which AI model is used and where it runs
