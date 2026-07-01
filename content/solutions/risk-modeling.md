---
title: "Risk Modeling"
description: "Turn business services, crown-jewel data, and attack paths into detection priorities your SOC can defend."
weight: 10
stage: "01"
eyebrow: "Risk"
nav_summary: "Model what matters before writing another rule."
hero_image: "/screenshots/coverage-depth.png"
hero_alt: "CraftedSignal coverage view showing exposure and detection depth"
quick_points:
  - "Business services and data assets become first-class SOC inputs."
  - "ATT&CK techniques are weighted by exposure, not counted equally."
  - "Risks flow into hunts, detections, reports, and audit trails."
outcomes:
  - label: "Decision"
    title: "Which gap matters next"
    body: "Prioritize detections by business exposure instead of rule count, vendor heatmaps, or the loudest alert queue."
  - label: "Context"
    title: "One model for SOC and risk"
    body: "Services, data, attack paths, residual risk, and mitigation state live in the same platform analysts use."
  - label: "Proof"
    title: "Reports write themselves"
    body: "Coverage, accepted gaps, hunts, and rule changes are tied back to the risks they reduce."
docs:
  - title: "Threat Model"
    url: "/docs/threat-model/"
    description: "How services, data assets, and attack paths become weighted exposure."
  - title: "Risk Ops Board"
    url: "/docs/risks/"
    description: "Risk states, lifecycle transitions, coverage, and audit history."
  - title: "D3FEND Coverage"
    url: "/docs/dfend/"
    description: "How active detections map to defensive techniques and posture."
---

## The problem

Most SOC planning starts too far downstream. Teams know how many rules they have, which ATT&CK cells are colored, and which SIEM alerts are noisy. They often do not know which business service those rules protect, which data asset is still exposed, or why one missing detection should outrank the next.

That creates a familiar operating gap: risk teams talk about crown jewels and attack paths, while detection engineers talk about queries, fields, and false positives. Audits then become spreadsheet exercises because the system of record for detection work is not connected to the system of record for business exposure.

## How CraftedSignal models risk

CraftedSignal starts with the business context the SOC is defending. You declare services, data assets, and attack paths. Each path maps to attacker techniques and the platform weights those techniques by exposure. A technique on a crown-jewel path is treated differently from the same technique on a low-value path.

Coverage is tracked across the layers where detection actually happens: endpoint, network, identity, cloud, and email. That prevents a generic "covered" answer when only one telemetry layer has a rule and the real attack path still has gaps.

## From model to work queue

Accepted attack paths become operational risks. Each risk has a state, owner, priority, coverage, and timeline. Analysts can hunt it, accept residual risk, escalate it, schedule re-hunts, or link it to rules that reduce the exposure.

The important shift is that risk is not a PDF attached to a ticket. It is a live object that can create hunts, explain why a rule exists, and show whether the detection program is closing the right gaps.

## What the SOC gets

Detection engineers get a ranked backlog that explains why a rule matters. SOC leaders get coverage reporting that separates real risk reduction from activity metrics. CISOs get an answer to "are we protected against this path?" that points to active detections, known blind spots, and the work in progress.

The model also gives threat intelligence a place to land. When a new brief arrives, CraftedSignal can score it against the services, technologies, and paths already modeled instead of treating every advisory as equal.
