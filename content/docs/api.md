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

