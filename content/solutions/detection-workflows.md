---
title: "Detection Workflows"
description: "Write, test, approve, deploy, and roll back detections with the same discipline teams expect from software delivery."
weight: 50
stage: "05"
eyebrow: "Verify"
nav_summary: "Make every rule change reviewable and reversible."
hero_image: "/screenshots/approval-diff.png"
hero_alt: "CraftedSignal approval diff and projected impact screen"
quick_points:
  - "Author in Sigma or native SIEM language with per-rule control."
  - "Run positive and negative tests against live Splunk, Sentinel, CrowdStrike, and Rapid7."
  - "Use approvals, impact previews, audit logs, Git sync, and one-click rollback."
outcomes:
  - label: "Quality"
    title: "Rules are tested before production"
    body: "Validation and live SIEM tests catch syntax, translation, and signal problems early."
  - label: "Governance"
    title: "Approvals match severity"
    body: "Junior changes, critical rules, and high-impact deploys can require the right reviewers."
  - label: "Recovery"
    title: "Rollback is built in"
    body: "Every deploy is versioned, audited, and reversible without manual SIEM archaeology."
docs:
  - title: "Rules"
    url: "/docs/rules/"
    description: "Rule metadata, implementations, tests, lifecycle states, and versioning."
  - title: "Testing"
    url: "/docs/testing/"
    description: "Positive, negative, enrichment, and live SIEM tests."
  - title: "Deployment & Rollback"
    url: "/docs/deployment/"
    description: "Dry-run previews, deployment state, rollback, and supported platforms."
  - title: "CLI Reference"
    url: "/docs/cli/"
    description: "csctl push, pull, sync, validate, diff, and CI/CD integration."
  - title: "Secure Detection Workflows"
    url: "/docs/secure-workflows/"
    description: "Validation gates, approval gates, monitoring mode, rollback, and breakglass."
---

## The problem

Many detection changes still move like manual production edits. A rule is copied into a SIEM, adjusted until it runs, and trusted because someone experienced looked at it. Cross-SIEM work adds another layer of risk: the same logic has to survive different query languages, field mappings, and platform limits.

That makes every change feel like a gamble. Junior engineers wait on senior reviewers, seniors cannot preview the full impact, and rollback depends on whether someone saved the previous version.

## How CraftedSignal changes the workflow

CraftedSignal treats detection content as governed code. Engineers can author in Sigma or keep a rule in a native SIEM language when that is the better fit. The platform compiles, validates, and shows translation diffs so reviewers know what will actually ship to each platform.

Rules can carry generated or manually written tests. Positive tests confirm known-bad behavior fires. Negative tests confirm expected benign behavior stays quiet. Tests run against live SIEMs, because the real question is not whether the YAML parses; it is whether the rule works against the data shape you actually have.

## Approval and impact preview

Before deployment, reviewers can see the rule change, compiled output, severity, layer, tenant, expected hit count, and recent impact. Critical rules can require stricter approval. Stale requests can escalate automatically so work does not disappear in a queue.

Every decision is audit-logged. The record shows who changed the rule, who approved it, what tests ran, what shipped, and what happened after deployment.

## Deployment and rollback

Deployments are versioned. If a change goes wrong, rollback uses the previous known-good version rather than a human trying to reconstruct history from a SIEM screen. Drift detection later verifies the deployed version is still the one CraftedSignal expects.

For teams that prefer detections-as-code, `csctl` supports push, pull, bidirectional sync, validation, and CI/CD integration. That means local repositories, GitHub Actions, and platform review can all work together instead of competing for ownership.
