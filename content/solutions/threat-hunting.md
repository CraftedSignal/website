---
title: "Threat Hunting"
description: "Run hypothesis-driven hunts across SIEMs, cluster the hits, verdict the result, and promote what works."
weight: 30
stage: "03"
eyebrow: "Hunt"
nav_summary: "Prove whether the threat is already present."
hero_image: "/screenshots/hunt-triage.png"
hero_alt: "CraftedSignal hunt triage screen showing clustered SIEM results"
quick_points:
  - "Create hunts from risks, threat briefs, pentest findings, or analyst prompts."
  - "Run one hypothesis across multiple SIEMs and preserve per-platform result state."
  - "Verdict clusters, keep notes, and promote winning queries to tested rules."
outcomes:
  - label: "Speed"
    title: "Hunts become routine"
    body: "Analysts work clustered evidence instead of manually paging through raw SIEM rows."
  - label: "Consistency"
    title: "Verdicts are recorded"
    body: "True positive, false positive, and inconclusive decisions stay attached to the hunt."
  - label: "Handoff"
    title: "Good hunts become rules"
    body: "A useful query can be promoted into a governed detection workflow with tests and review."
docs:
  - title: "Threat Hunting"
    url: "/docs/hunts/"
    description: "Hunt lifecycle, clustering, verdicts, promotion, and multi-SIEM behavior."
  - title: "Testing"
    url: "/docs/testing/"
    description: "How promoted rules get positive and negative tests against live SIEMs."
  - title: "Rules"
    url: "/docs/rules/"
    description: "Rule structure, metadata, lifecycle states, tests, and ATT&CK mappings."
---

## The problem

SOC teams often know what they should look for but cannot afford the manual effort. A hunt starts as a hypothesis, becomes a set of SIEM queries, returns too many rows, and then depends on whichever analyst has time to interpret the result. The final answer is rarely captured in a way that improves the detection program.

That means the same investigation is repeated later, and a good query does not always become a production rule. The organization stays busy but does not necessarily become more covered.

## How CraftedSignal structures hunts

A hunt is a bounded investigation against one or more connected SIEMs. It can start from a threat brief, a modeled risk, a pentest finding, or an analyst prompt. CraftedSignal compiles the query for the target platforms, tracks each SIEM result separately, and records retries or failures without losing the overall hunt state.

Results are clustered so analysts can verdict patterns instead of individual rows. A cluster might represent repeated behavior from the same host, user, process lineage, domain, or detection pattern. Notes stay attached to the cluster and the hunt timeline.

## Verdicts that matter later

Each cluster can be marked true positive, false positive, or inconclusive. That decision is not just a comment. It becomes evidence for whether the hypothesis was real, whether a rule should exist, and whether the risk it came from is still open.

When a query produces useful signal, CraftedSignal can promote it into a detection rule. The workflow then moves into authoring, testing, approval, deployment, and monitoring. A hunt is no longer a dead-end investigation; it is one way the detection library grows.

## Where hunts fit in the loop

Hunts are the bridge between "we might be exposed" and "we have proven coverage." They are useful before writing a rule, after a pentest, when a new threat brief lands, or when a rule has gone silent and the team needs to know whether the behavior still exists.

For managers, the value is repeatability. The hunt has a source, owner, verdicts, related risks, and a promotion path. For analysts, the value is less raw-row work and fewer manual handoffs.
