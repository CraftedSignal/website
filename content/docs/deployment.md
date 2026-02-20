---
title: "Deployment & Rollback"
description: "Deploy detection rules to Splunk, Sentinel, CrowdStrike, and Rapid7 with approval workflows, dry-run previews, atomic rollback, and drift detection."
weight: 6
section: "Core Concepts"
---

## Overview

CraftedSignal treats rule deployment like software releases. Every change goes through validation, testing, approval, and monitoring with rollback always available.

---

## Supported platforms

| Platform | Protocol | Features |
|----------|----------|----------|
| **Splunk** | REST API | Deploy, rollback, drift detection, saved searches |
| **Microsoft Sentinel** | Azure API | Deploy, rollback, analytics rules, hunting queries |
| **CrowdStrike** | Falcon API | Deploy, rollback, custom IOA rules |
| **Rapid7 InsightIDR** | REST API | Deploy, rollback, custom alerts, log search queries |

---

## Deployment flow

```
Author → Validate → Test → Approve → Deploy → Monitor
                                                  ↓
                                             Rollback (if needed)
```

### 1. Validate and test

Push rules to the platform. Tests run automatically by default:

```bash
csctl push -token YOUR_TOKEN -m "Add webshell detection"
```

Tests include positive and negative cases run against your SIEM. Use `-force-sync` to continue even if validation fails (not recommended).

### 2. Preview with dry-run

See exactly what will change before applying:

```bash
csctl push -token YOUR_TOKEN -dry-run
```

### 3. Deploy to SIEM

Push and deploy in one step:

```bash
csctl push -token YOUR_TOKEN -deploy -m "Deploy webshell detection"
```

Deployments enforce separation of duties — the author cannot approve their own rule changes through the approval workflow in the web UI.

### 4. Atomic operations

By default, pushes are atomic — if any rule fails validation or testing, all changes are rolled back:

```bash
csctl push -token YOUR_TOKEN -deploy -atomic=true  # default
```

---

## Safety controls

### Monitoring deployments

Deploy rules in monitoring mode first. Rules run against live data and track alert volume, noise, and performance — giving you visibility into impact before the rule is fully active.

Monitor key metrics in the web UI:
- Alert volume vs. expected noise budget
- Query latency and error rate
- False positive indicators

Promote to active or roll back based on observed behavior.

### Approval workflows

Configure rules to require approval before deployment. Reviewers see:
- What changed (diff)
- Projected alert volume
- Cost and noise impact
- MITRE coverage changes

Approvals are managed in the web UI with full audit trail.

See [Roles & Permissions](/docs/roles-permissions/) for the approval permission matrix.

### Noise budgets

Each rule can define expected alert volume. CraftedSignal tracks consumption and flags rules that exceed their budget for review or automatic pausing.

### Change windows

Restrict deployments to approved time windows to reduce risk during critical periods.

---

## Rollback

Every deployment can be rolled back from the web UI. Rollback:

- Reverts the rule to its previous version on the SIEM
- Logs the action with full audit trail
- Notifies the team
- Retains the failed version for investigation

---

## Drift detection

CraftedSignal periodically checks that what's deployed on your SIEM matches what's in CraftedSignal. If someone edits a rule directly on the SIEM (out-of-band change), you get an alert.

Check drift from the CLI:

```bash
csctl diff -token YOUR_TOKEN
```

This prevents configuration drift and ensures CraftedSignal remains the source of truth.

---

## Filtering

Push, pull, and diff support filtering by name, ID, or group:

```bash
# Push only rules matching a pattern
csctl push -token YOUR_TOKEN -filter "webshell*"

# Push only rules in a specific group
csctl push -token YOUR_TOKEN -group "endpoint"

# Pull a specific group
csctl pull -token YOUR_TOKEN -group "network"
```

---

## Multi-platform deployment

Deploy the same rule to multiple SIEMs. CraftedSignal maintains platform-specific implementations and shows translation diffs so you can verify each implementation:

```bash
csctl diff -token YOUR_TOKEN
```
