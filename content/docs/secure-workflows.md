---
title: "Secure Detection Workflows"
description: "Secure detection workflows with mandatory validation, automated SIEM testing, approval gates, atomic rollback, drift detection, and breakglass emergency procedures."
weight: 9
section: "Features"
---

## Overview

CraftedSignal enforces security at every stage of the detection lifecycle — from authoring to deployment. These guardrails are built into the platform, not optional conventions.

---

## Validation before deployment

Rules are validated for syntax, schema compliance, and query correctness before they can reach a SIEM:

- **Offline validation** — `csctl validate` checks rules locally without network access
- **Server-side validation** — the platform validates every rule on push, regardless of how it was submitted (CLI, API, or web UI)
- **Atomic batches** — if any rule in a batch fails validation, the entire batch is rejected. No partial deployments
- **Monitoring mode for new versions** — new or modified rules can deploy in monitoring mode first, executing against live data without generating alerts. Promote to active only after confirming real-world behavior

---

## Automated testing

Positive and negative test cases run against your actual SIEM before every deployment:

- **Positive tests** — inject sample data that should trigger the rule, verify it fires
- **Negative tests** — inject benign data, verify the rule stays silent
- **Tests run by default** — `csctl push` and `csctl sync` run tests automatically. Use `-test=false` to skip (not recommended)
- **Test isolation** — test data is injected with a dedicated source tag (`craftedsignal_test`) and can target a dedicated test index

See [Testing](/docs/testing/) for the full testing model.

---

## Approval workflows

Separation of duties ensures the author of a rule cannot approve their own deployment:

- **Mandatory review** — configurable per workspace. When enabled, all deployments require at least one approval
- **Impact summaries** — approvers see projected alert volume, noise delta, cost impact, and a full diff
- **Min approvers** — require multiple reviewers for high-risk changes
- **Audit trail** — every approval, rejection, and comment is logged permanently

---

## Monitoring deployments

New or modified rules can be deployed in **monitoring mode** — they execute against live data but produce no alerts. This validates real-world behavior before going active:

- Run alongside production rules without generating noise
- Measure alert volume, false positive ratio, and latency on real data
- Promote to active only when confident in the rule's behavior
- Configurable weekly thresholds and error thresholds

See [Deployment & Rollback](/docs/deployment/) for details on monitoring mode.

---

## Atomic rollback

If a deployment fails validation or testing, the entire batch is rolled back automatically:

- **Batch rollback** — all rules in a failed push are reverted, not just the failing one
- **Version history** — every rule version is retained (configurable). Roll back to any previous version from the UI or CLI
- **One-click rollback** — instant rollback from the deployment history in the web UI

---

## Drift detection

Reconciliation workflows compare the rules deployed in your SIEM against the platform's state to detect unauthorized changes:

- Detects rules modified directly in the SIEM (bypassing CraftedSignal)
- Detects rules deleted from the SIEM
- Runs automatically on a schedule
- Surfaces drift in dashboards and notifications

---

## CI/CD integration

The `csctl` CLI and REST API integrate into existing CI/CD pipelines:

```yaml
# .github/workflows/detections.yml
name: Deploy detections
on:
  push:
    branches: [main]
    paths: ["detections/**"]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Validate
        run: csctl validate
      - name: Push and deploy
        run: csctl push -deploy -m "CI deploy ${{ github.sha }}"
        env:
          CSCTL_TOKEN: ${{ secrets.CSCTL_TOKEN }}
          CSCTL_URL: ${{ secrets.CSCTL_URL }}
```

Every push through CI/CD goes through the same validation, testing, and approval pipeline as manual changes. The audit log captures the CI/CD token identity for traceability.

---

## Breakglass

Emergency deployments can bypass approval workflows when time-critical response is needed. Every breakglass action:

- Is logged with reason and identity
- Triggers automatic retroactive review
- Alerts all admins
- Requires post-incident justification
