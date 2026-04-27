---
title: "Threat Modeling & Risk Scoring"
description: "Model business services, declare attack paths, and score every MITRE technique by the exposure it represents to your organization. Accepted paths become tracked risks with a full lifecycle."
weight: 7
section: "Core Concepts"
---

## Overview

CraftedSignal's threat model is the bridge between the business and detection engineering. You declare what you run, what data matters, and how an attacker would reach it. The platform then weights every MITRE ATT&CK technique on those paths by your real exposure, not a generic heatmap.

The output is a single number — **Exposure** — that is drillable to the specific techniques driving it, and in turn to the [risks](/docs/risks/), hunts, and rules that close the gap.

---

## What you declare

### Services
Business functions (payment processing, employee auth, data warehouse). Pick from a service catalog or describe your own. Each service has a criticality and a set of data classes.

### Data assets
PII, credentials, intellectual property, compliance-regulated data. Each class has a criticality that propagates through the attack paths it sits on.

### Attack paths
Ordered MITRE technique sequences leading to a data asset. Generated three ways:

- **Templates** for common chains (initial access → execution → persistence → exfiltration).
- **Graph-based** AI generation using your service catalog and ATT&CK.
- **Manual** when you need to model something specific.

Accept or reject each path. Rejected paths are remembered so the AI does not propose them again. Critical-severity paths and high-severity-with-high-likelihood paths are **auto-accepted** so the most extreme exposures land in the hunt queue immediately — see [Risks](/docs/risks/) for the lifecycle every accepted path enters.

---

## The Threat Risk Score (TRS)

Per technique:

```
TRS = ThreatWeight × DetectionEffectiveness × DataSourceScore
```

- **Threat weight** blends MITRE prevalence, industry profile (finance vs healthcare vs SaaS), and relevance to any live threat briefs.
- **Detection effectiveness** folds in rule quality, test status, rule health, and depth (multiple rules covering the same technique improve the score).
- **Data source score** checks that at least one connected SIEM actually ingests the logs the technique needs.

Aggregated to **Exposure %** on the dashboard. Drills to the **Top Uncovered Techniques** card with direct *Hunt* and *Rules* actions per gap.

---

## From paths to risks

Every accepted attack path is automatically a tracked **risk** at `/dashboard/threat-model/risks`. The Risks page is the operating board for the threat model: each row carries a state (suggested, accepted, hunting, evidence_gathered, mitigated, active_threat, residual_accepted), a 0–100 priority score, a coverage percentage, and the full lifecycle audit log.

This is where you triage and act on the model:

- **Hunt this risk** spins up a new hunt anchored to the underlying attack path and transitions the risk to `hunting`.
- **Accept residual** records the risk as acknowledged but not actioned, with an analyst-supplied note.
- **Mark as active threat** escalates a risk that surfaced ongoing exploitation.
- **Schedule re-hunt** re-fires the loop on a mitigated risk when fresh intel suggests a variant.

The mechanics — state transitions, priority math, coverage edges, candidates from the threat feed, and the drawer's lifecycle timeline — live on the [Risks](/docs/risks/) page.

---

## Candidates from the threat feed

When the threat feed surfaces a brief that matches your industry, an affected product, or an existing attack path, the bridge generates a **risk candidate**. Candidates queue at `/dashboard/threat-model/candidates`. Accepting one creates a new accepted risk with the brief's proposed severity, likelihood, and MITRE techniques. Dismissing one drops the candidate without affecting your live risks.

This means the threat model is not a one-time exercise — briefs continuously propose new attack paths against your declared business surface, and every candidate is one click away from being a tracked risk.

---

## Automated follow-through

- **Hunt proposals** are generated for high-weight, low-coverage techniques and for accepted risks that need a re-hunt. Risk-anchored proposals are ranked by the underlying risk's priority.
- **Briefs** that describe threats to your industry bump the weight of the techniques they use and may produce risk candidates.
- **Re-hunts** are scheduled 90 days after a risk reaches `mitigated`, so coverage stays fresh without human prompting.
- **Detection edges** auto-link rules to risks whenever a rule's MITRE techniques overlap with a path's steps. The edges drive coverage and priority recompute.

---

## The dashboard

The threat model surfaces on the **Risk** tab of `/dashboard`:

- **Risk Exposure** — the threat-weighted gap (inverse of detection coverage).
- **Top Uncovered Techniques** — the techniques driving exposure, with one-click *Hunt* / *Rule* actions.
- **Accepted attack paths** — every path-as-risk with state, priority, and coverage at a glance.
- **Remediation** — recommended hunts and rules for the highest-priority gaps.

The **Intelligence** tab next to it surfaces the feed-side of the same model: KEV-flagged briefs, recent CVEs, top briefs by priority. Both tabs share the underlying index, so any change you make on one (adopting a rule, accepting a candidate, dismissing a brief) updates the other immediately.

---

## Related

- [Risks](/docs/risks/) — the lifecycle every accepted path enters.
- [Threat Feed](/docs/threat-feed/) — input that re-weights the model and surfaces candidates.
- [Threat Actors](/docs/threat-actors/) — the catalog the bridge enriches briefs against.
- [Hunts](/docs/hunts/) — action on technique gaps.
- [Rules](/docs/rules/) — the ultimate closure for an accepted threat.
