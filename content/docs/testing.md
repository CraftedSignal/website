---
title: "Testing"
description: "Test detection rules with positive, negative, and enrichment tests run against your live SIEM. Covers validation, CI/CD pipelines, and continuous monitoring."
weight: 5
section: "Core Concepts"
---

## Overview

Every rule in CraftedSignal should have tests. Tests validate that your detection fires when it should (positive) and stays silent when it shouldn't (negative). Tests run against your actual SIEM — no synthetic environments.

---

## Test types

### Positive tests

Confirm the rule triggers on known-bad activity:

```yaml
tests:
  - name: "Webshell upload detected"
    type: positive
    fixture:
      src_ip: "10.0.0.5"
      uri_path: "/uploads/cmd.php"
      method: "POST"
    expect: alert
```

### Negative tests

Confirm the rule does **not** trigger on legitimate activity:

```yaml
  - name: "Normal PHP upload ignored"
    type: negative
    fixture:
      src_ip: "10.0.0.5"
      uri_path: "/uploads/report.pdf"
      method: "POST"
    expect: no_alert
```

### Enrichment tests

Validate that lookups, threat lists, and field extractions work correctly with the rule logic:

```yaml
  - name: "Threat list enrichment resolves known-bad IP"
    type: enrichment
    fixture:
      src_ip: "203.0.113.50"
    expect:
      enrichment:
        threat_list: "known_c2_ips"
        matched: true
```

---

## Running tests

### From the CLI

Tests run automatically when you push rules:

```bash
# Push with tests (default behavior)
csctl push -token YOUR_TOKEN -test=true

# Push and deploy — tests run first
csctl push -token YOUR_TOKEN -deploy

# Skip tests (not recommended)
csctl push -token YOUR_TOKEN -test=false
```

If tests fail, the push is blocked. Use `-force-sync` to override (use with caution).

### From the web UI

Navigate to a rule and click **Run Tests**. Results show pass/fail with details inline.

### In CI/CD

Tests run automatically as part of the pipeline:

```
Validate → Test → Approve → Deploy → Monitor
```

If any stage fails, the pipeline stops and the rule is not promoted.

See [CLI Reference](/docs/cli/) for CI/CD pipeline examples.

---

## Validation

Before tests hit your SIEM, CraftedSignal runs local validation:

```bash
csctl validate
```

| Check | What it does |
|-------|--------------|
| **Syntax** | Validates rule YAML structure and query syntax |
| **Fields** | Confirms referenced fields exist in your SIEM schema |
| **Performance** | Flags expensive patterns (unbounded wildcards, missing time constraints) |
| **Portability** | Scores how well the rule translates across platforms |

Validation also runs automatically during `csctl push` and `csctl sync`.

---

## Monitoring deployment

After tests pass, deploy rules in monitoring mode. Rules run against live data and track:

- **Volume**: How many alerts the rule produces
- **Latency**: How long the query takes to execute
- **Cost**: Estimated SIEM cost
- **Noise**: Percentage of alerts that look like false positives

Monitoring lets you understand real-world impact before fully activating a rule.

---

## Continuous validation

After deployment, CraftedSignal continuously monitors:

- **Schema drift**: Are the fields this rule depends on still present?
- **Broken rules**: Is the rule erroring or timing out?
- **Noise budget**: Is the rule exceeding its expected alert volume?
- **Data quality**: Are required log sources still flowing?

If any check fails, you get an alert and the rule can be automatically paused.

---

## Quality analysis

After tests run, CraftedSignal provides improvement suggestions:

- Add missing negative tests for common false positive patterns
- Optimize expensive queries
- Improve MITRE mapping accuracy
- Increase portability score by removing platform-specific idioms
