---
title: "API Reference"
description: "CraftedSignal REST API reference for CI/CD integration: lint, test, deploy, rollback, approval workflows, health metrics, and rate limits by pricing tier."
weight: 11
section: "Integrations"
---

## Overview

The CraftedSignal API lets you integrate detection workflows into your existing CI/CD pipelines, automation tools, and dashboards.

Base URL: `https://your-instance.craftedsignal.io/api/v1`

---

## Authentication

All requests require a scoped API token:

```bash
curl -H "Authorization: Bearer cs_token_..." \
  https://your-instance.craftedsignal.io/api/v1/rules
```

Tokens are scoped to specific environments and tenants. Create tokens in **Settings > API Keys**.

Every request is logged with the token identity for audit.

---

## CI/CD endpoints

### Lint

Validate rule syntax, fields, and performance:

```
POST /api/v1/rules/lint
```

```json
{
  "rule": "...",
  "target": "splunk"
}
```

Response includes findings, capability flags, and portability score.

### Test

Run positive/negative tests against your SIEM:

```
POST /api/v1/rules/test
```

```json
{
  "rule_id": "...",
  "target": "splunk",
  "fixtures": ["..."]
}
```

Response includes pass/fail per test, coverage, and quality analysis.

### Replay

Run a rule against historical data:

```
POST /api/v1/rules/replay
```

Returns alert volume, noise estimate, latency, and cost projection over the replay window.

### Shadow eval

Dry-run against live data:

```
POST /api/v1/rules/shadow
```

Returns projected alert volume, latency, and cost without generating actual alerts.

### Deploy

Deploy a rule to a target SIEM:

```
POST /api/v1/rules/deploy
```

```json
{
  "rule_id": "...",
  "target": "splunk",
  "approval_required": true,
  "noise_budget": { "max_alerts_per_day": 50 }
}
```

### Rollback

Rollback a deployed rule:

```
POST /api/v1/rules/rollback
```

```json
{
  "rule_id": "...",
  "target": "splunk",
  "reason": "Noise budget exceeded"
}
```

---

## Sync endpoints

### Sync status

```
GET /api/v1/detections/sync-status
```

Returns rule IDs, titles, groups, hashes, versions, and update timestamps for conflict detection.

### Import or sync rules

```
POST /api/v1/detections/import
```

```json
{
  "mode": "sync",
  "message": "Sync detections from Git",
  "atomic": true,
  "rules": [
    {
      "title": "Suspicious PowerShell",
      "platform": "splunk",
      "query": "index=windows EventCode=4104",
      "enabled": true,
      "tests": {
        "positive": [{ "name": "Encoded command", "data": [{ "EventCode": 4104 }] }]
      },
      "operational_guidance": "## Runbook\n\n### Alert intent\nReview suspicious PowerShell activity.\n"
    }
  ]
}
```

Rule sync includes metadata, query, groups, tests, and runbook/playbook Markdown. The `operational_guidance` field name is kept for API and YAML compatibility; the visible product concept is runbooks and playbooks.

### Diff a rule

```
POST /api/v1/detections/{id}/diff
```

Returns field-level changes between incoming YAML and the current platform rule, including response-step changes.

---

## Library sync endpoints

Library sync endpoints handle tenant-local library content for Git and automation. They export local company templates and guides only; managed remote or cloud library sources are not copied into the export.

Tokens need:

- `library:read` for export and sync status.
- `library:sync` for import or apply.

### Export local library

```
GET /api/v1/library/export
GET /api/v1/library/export?format=json
```

The default response is YAML:

```yaml
version: 1
items:
  - type: rule_template
    id: suspicious-powershell
    name: Suspicious PowerShell
    query_type: kql
    query: |
      SecurityEvent
      | where EventID == 4688

  - type: hunt_template
    id: lateral-movement-hunt
    name: Lateral movement hunt
    queries:
      - title: Remote service creation
        query_type: spl
        query: |
          index=wineventlog EventCode=7045

  - type: guide
    id: credential-access-response
    name: Credential access response
    body: |
      ## Runbook
      Review identity alerts and privilege changes.
```

Valid item `type` values are `rule_template`, `hunt_template`, and `guide`. `type: rule` and `type: detection` are intentionally rejected in library sync because active production detections use the detections sync endpoints.

### Library sync status

```
GET /api/v1/library/sync-status
```

Returns each local library item with `type`, `id`, `name`, `hash`, `revision`, and `updated_at` for conflict detection.

### Import or apply library items

```
POST /api/v1/library/import
```

```json
{
  "message": "Sync library from Git",
  "atomic": true,
  "items": [
    {
      "type": "rule_template",
      "id": "suspicious-powershell",
      "name": "Suspicious PowerShell",
      "query_type": "kql",
      "query": "SecurityEvent\n| where EventID == 4688\n",
      "severity": "high",
      "tactics": ["execution"],
      "techniques": ["T1059.001"]
    }
  ]
}
```

`atomic` defaults to `true`. The API rejects imports larger than 10 MiB or 5,000 items, and returns per-item results with created, updated, unchanged, and error counts.

---

## Simulation endpoints

Simulation tokens should include `simulations:read` and `simulations:write`.

```
POST /api/v1/simulations/scenarios/sync
POST /api/v1/simulations/runs
GET /api/v1/simulations/runs
GET /api/v1/simulations/runs/{id}
DELETE /api/v1/simulations/runs/{id}
GET /api/v1/simulations/coverage
GET /api/v1/simulations/gaps
POST /api/v1/simulations/verify/{id}
GET /api/v1/simulations/verify/{id}
```

The CLI uses these endpoints to sync adapter scenario catalogs, report live runs, trigger detection correlation, and fetch coverage gaps.

---

## Approval endpoints

### Submit for approval

```
POST /api/v1/approvals
```

Includes impact summary: affected targets, projected alerts, cost, noise delta, and diff.

### Review and decide

```
POST /api/v1/approvals/{id}/decision
```

```json
{
  "decision": "approve",  // or "reject", "request_changes"
  "comment": "Looks good, noise projection acceptable"
}
```

---

## Health endpoints

### Rule health

```
GET /api/v1/health/rules/{id}
```

Returns SNR, latency, error rate, noise budget consumption, and data quality status.

### Dashboard metrics

```
GET /api/v1/health/dashboard
```

Returns MITRE coverage, noise ratio, team workload, MTTR, and detection value scores.

### ROI

```
GET /api/v1/health/roi
```

Returns noise saved, cost avoided, and coverage deltas.

---

## Notifications

CraftedSignal can send notifications to Slack via webhook for key events like approvals, deployments, and rollbacks. Configure in **Settings**.

---

## Rate limits

| Tier | Requests/day |
|------|-------------|
| Free | 10,000 |
| Professional | 100,000 |
| Enterprise | 1,000,000 |
| Unlimited | No limit |

Rate limit headers are included in every response:

```
X-RateLimit-Limit: 10000
X-RateLimit-Remaining: 9847
X-RateLimit-Reset: 1708300800
```

Exceeded limits return `429 Too Many Requests`. Resource limits return `403 Forbidden`.
