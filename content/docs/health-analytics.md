---
title: "Health & Analytics"
description: "Monitor detection health with MITRE ATT&CK coverage heatmaps, noise budgets, signal-to-noise ratios, team workload metrics, MTTR, and ROI tracking dashboards."
weight: 7
section: "Core Concepts"
---

## Overview

CraftedSignal continuously measures the health and effectiveness of your detection program. Dashboards surface problems before they become incidents.

---

## MITRE ATT&CK coverage

See which techniques you detect and where gaps exist:

- **Coverage heatmap**: Visual overlay on the MITRE ATT&CK matrix
- **Gap analysis**: Techniques with no detection coverage
- **Suggestions**: Rules from the TI feed or standard repository that close specific gaps
- **Trend tracking**: How coverage improves over time

Coverage is calculated from the MITRE mappings on each active rule.

---

## Noise & signal metrics

| Metric | What it measures |
|--------|-----------------|
| **Signal-to-noise ratio (SNR)** | True positives / (false positives + epsilon) |
| **Noise budget consumption** | Current alert volume vs. expected volume per rule |
| **False positive rate** | Percentage of alerts marked as false positive |
| **Dead rules** | Rules that haven't fired in a configurable window |
| **Stale rules** | Rules not updated since a threshold date |

### Noise budgets

Each rule can define a noise budget. CraftedSignal tracks consumption and alerts when budgets are breached:

```
Rule: webshell-upload
Budget: 50 alerts/day
Current: 12 alerts/day (24% consumed)
Status: ✓ Healthy
```

When a rule exceeds its budget, it can be automatically paused or flagged for review.

---

## Team workload

Track how work is distributed across your team:

- Alerts per analyst
- Rules authored per engineer
- Approval queue depth
- Mean time to review

These metrics help SOC leaders balance workload and identify bottlenecks.

---

## Performance metrics

| Metric | Description |
|--------|-------------|
| **MTTR** | Mean time to respond to alerts |
| **Query latency** | How long each rule takes to execute on the SIEM |
| **Error rate** | Rules failing or timing out |
| **Data quality** | Are required log sources flowing and complete? |

---

## Detection value scoring

CraftedSignal scores each rule's value to your organization:

- **SNR score**: How clean is the signal?
- **Detection value**: Based on severity, confidence, and MITRE coverage
- **Confidence decay**: Rules with declining accuracy are flagged
- **Portability score**: Risk of semantic drift across platforms

Low-value rules are surfaced for retirement or improvement.

---

## Policies

Define automated policies for rule hygiene:

### Dead rule retirement
```yaml
policy:
  dead_rule_threshold: 90d  # Flag rules that haven't fired in 90 days
  auto_retire: false         # Require human confirmation
```

### Duplicate detection
CraftedSignal identifies rules with overlapping logic and suggests consolidation.

### SLOs
Set detection SLOs for your organization:

```yaml
slos:
  max_query_latency: 30s
  max_noise_per_service: 100/day
  min_data_quality: 99.5%
```

---

## ROI tracking

Measure the business impact of your detection program:

- **Noise saved**: Alerts prevented by tuning and retirement
- **Cost avoided**: Estimated analyst hours saved × hourly cost
- **Coverage improvement**: MITRE techniques gained over time

Export ROI reports for stakeholders and budget discussions.

---

## Flexible grouping

Group rules by any dimension to monitor and control:

- By team (SOC Tier 1, Tier 2, Threat Hunting)
- By service (Web, Identity, Endpoint)
- By environment (Production, Staging, Dev)
- By compliance framework (SOC2, NIS2, PCI-DSS)

Each group gets its own dashboard with independent health metrics.
