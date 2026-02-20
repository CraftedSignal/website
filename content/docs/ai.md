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
