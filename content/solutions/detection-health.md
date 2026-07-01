---
title: "Detection Health"
description: "Catch dead rules, noisy rules, drift, failing tests, and missing context before they become blind spots."
weight: 40
stage: "04"
eyebrow: "Monitor"
nav_summary: "Keep detections working after they ship."
hero_image: "/screenshots/silently-broken.png"
hero_alt: "CraftedSignal silently broken detection queue"
quick_points:
  - "One queue for dead rules, drift, failed tests, noise, and missing metadata."
  - "Owner-targeted notifications when deployed rules go silent or change out of band."
  - "Noise budgets and monitoring mode protect analysts before alerts go live."
outcomes:
  - label: "Signal"
    title: "Know when a rule stops working"
    body: "Per-rule health and firing history expose silent failures before an incident does."
  - label: "Control"
    title: "Noise is budgeted"
    body: "Rules that exceed expected volume can be held, tuned, or left in monitoring mode."
  - label: "Audit"
    title: "Drift is visible"
    body: "Out-of-band SIEM edits are hashed, diffed, and queued for review."
docs:
  - title: "Health & Analytics"
    url: "/docs/health-analytics/"
    description: "Coverage, health queues, workload metrics, MTTD, MTTR, and ROI views."
  - title: "Drift Detection"
    url: "/docs/drift/"
    description: "How deployed rules are re-hashed, diffed, and reviewed after out-of-band changes."
  - title: "Noise Budgets"
    url: "/docs/noise-budgets/"
    description: "Daily alert limits by company, team, service, and rule."
  - title: "Git-native Backups"
    url: "/docs/git-backup/"
    description: "Scheduled Git mirrors for rules, versions, tests, and restore points."
---

## The problem

Shipping a rule is not the end of detection engineering. Rules go silent because logs change, fields drift, integrations break, upstream products update, or someone edits the detection directly in the SIEM. Other rules keep firing but become too noisy for analysts to trust.

Traditional dashboards make this hard to see. Noise, rule health, test failures, coverage, direct SIEM edits, and missing metadata often live in different places. By the time a team notices, the first reliable signal may be an incident review.

## How CraftedSignal monitors detections

CraftedSignal keeps health signals attached to the rule lifecycle. Each deployed rule can show recent firing behavior, test status, drift state, noise budget impact, ownership, platform deployment state, and coverage context.

The platform surfaces one operational queue for rules that need attention: dead rules, unexpectedly noisy rules, drifted rules, failing tests, missing ATT&CK mappings, missing owners, and other quality issues. The queue is designed for action, not just observation.

## Noise, drift, and silent failure

Noise budgets set an expected alert volume by company, team, service, or rule. New detections can run in monitoring mode first, producing measurement without paging analysts. If expected volume is too high, the rule can be tuned before it becomes active.

Drift detection compares the running SIEM version to the version CraftedSignal last deployed. If a rule changes outside the controlled workflow, the platform shows the diff and queues it for review. That protects both auditability and operational trust.

Silent rules are handled as a first-class health issue. When a rule that normally fires stops producing signal, the owner can be notified and the SOC can decide whether telemetry changed, the threat disappeared, or coverage broke.

## What leaders get

SOC leaders get a Monday-morning view of the work that matters: exposure, broken detections, noisy detections, uncovered techniques, and workload. The goal is not to count rules. The goal is to know which protections are alive, which need attention, and which risks remain open.
