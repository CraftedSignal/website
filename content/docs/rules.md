---
title: "Rules"
description: "The rule model, rule sources, lifecycle states, and how detections are structured."
weight: 4
section: "Core Concepts"
---

## Rule model

Every detection in CraftedSignal is a **rule** — a structured object that contains metadata, logic, platform-specific implementations, tests, and context.

### Metadata

| Field | Description |
|-------|-------------|
| `id` | UUID, auto-generated |
| `name` | Human-readable rule name |
| `description` | What the rule detects and why |
| `severity` | Critical, High, Medium, Low, Info |
| `confidence` | How confident the detection is (High, Medium, Low) |
| `status` | Draft, Active, Shadow, Paused, Killed |
| `author` | Who wrote the rule |
| `version` | Auto-incremented on changes |
| `tags` | Freeform labels for grouping |

### MITRE ATT&CK mapping

Every rule maps to one or more MITRE ATT&CK techniques:

```yaml
mitre:
  - tactic: TA0003    # Persistence
    technique: T1505   # Server Software Component
    subtechnique: ".003"  # Web Shell
```

This mapping powers coverage reports and gap analysis.

### Platform implementations

A single rule can have implementations for multiple SIEMs:

```yaml
implementations:
  splunk:
    query: |
      index=web sourcetype=access_combined
      | where uri_path LIKE "%/uploads/%.php"
      | stats count by src_ip, uri_path
    portability_score: 0.85

  sentinel:
    query: |
      W3CIISLog
      | where csUriStem has_any (".php", ".asp", ".jsp")
      | where csUriStem contains "/uploads/"
      | summarize count() by cIP, csUriStem
    portability_score: 0.82
```

Translation diffs show exactly what differs per platform so reviewers can approve with confidence.

---

## Rule sources

### Threat intelligence feed

CraftedSignal includes a curated TI feed that translates trending and novel threats into ready-to-use detection rules. Applicability filtering shows what's relevant to your environment and SIEM.

### AI-generated rules

Describe what you want to detect in natural language. AI generates the rule, tests, and MITRE mapping. You review and approve before anything ships.

Use the web UI to describe what you want to detect. AI generates the rule, tests, and MITRE mapping for review.

### Your own repository

Import your existing rules, use our standard rules repository, or start from scratch. Everything is detections as code — YAML files in a Git repo.

---

## Rule lifecycle

Rules move through defined states:

```
Draft → Active → Shadow → Monitoring → Active (promoted)
                                     → Paused
                                     → Killed
```

| State | Description |
|-------|-------------|
| **Draft** | Being written or reviewed. Not deployed. |
| **Active** | Deployed to production SIEM. Generating alerts. |
| **Shadow** | Dry-run against live data. Measures projected volume without alerting. |
| **Monitoring** | Deployed against live data, tracking volume and noise before full activation. |
| **Paused** | Temporarily disabled. Retains config for re-enabling. |
| **Killed** | Permanently retired. Kept in history for audit. |

---

## Versioning

Every change to a rule creates a new version. CraftedSignal tracks:

- What changed (semantic diff on the rule logic, not just text)
- Who changed it
- When and why
- Approval status

Versions are retained up to a configurable limit (default: 5) for audit and rollback. See [Configuration](/docs/configuration/) to adjust `rules.max_version_history`.

---

## Rule context

Each rule includes context that helps reviewers and analysts:

- **Rationale**: Why this detection exists
- **Assumptions**: What must be true for this rule to work (log sources, data quality)
- **Noise expectations**: Expected false positive rate and known blind spots
- **Linked runbooks**: What analysts should do when the rule fires
- **Required enrichments**: Lookups, threat lists, or data sources the rule depends on

---

## Dependencies

Rules can depend on shared resources:

- **Macros/Saved searches**: Shared logic referenced by multiple rules
- **Lookups**: Threat lists, allowlists, asset inventories
- **Parsers**: Field extraction definitions

CraftedSignal tracks these dependencies and performs impact analysis — when a shared resource changes, you see which rules are affected before deploying.

---

## Cost expectations

Each rule can define cost expectations:

```yaml
cost:
  expected_alerts_per_day: 5
  max_alerts_per_day: 50
  ingestion_projection_gb: 0.1
```

These expectations are validated during shadow evaluation and enforced as noise budgets during deployment.

See [Health & Analytics](/docs/health-analytics/) for noise budget monitoring.
