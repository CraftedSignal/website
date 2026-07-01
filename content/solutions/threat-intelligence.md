---
title: "Threat Intelligence"
description: "Convert threat briefs, IOCs, Sigma rules, and pentest findings into relevant hunts and detections."
weight: 20
stage: "02"
eyebrow: "Threat"
nav_summary: "Make intelligence actionable for your own stack."
hero_image: "/screenshots/dashboard.png"
hero_alt: "CraftedSignal dashboard showing risk and coverage context"
quick_points:
  - "Curated briefs include rules, tests, IOCs, ATT&CK mappings, and affected products."
  - "Relevance is calculated against your modeled business and technology context."
  - "Briefs can be adopted, hunted, watchlisted, dismissed, or mirrored for air-gapped use."
outcomes:
  - label: "Triage"
    title: "Less feed noise"
    body: "Threat intel is filtered by what you run and what your business model says is exposed."
  - label: "Action"
    title: "Briefs become work"
    body: "A relevant brief can create a hunt, suggest a rule, connect to a risk, or enter a watchlist."
  - label: "Reuse"
    title: "Community content stays portable"
    body: "Open Sigma, SPL, and KQL content can be deduplicated, tested, and adapted to local telemetry."
docs:
  - title: "Threat Feed"
    url: "/docs/threat-feed/"
    description: "Brief structure, scoring, rule adoption, IOCs, and air-gapped bundles."
  - title: "Threat Actors"
    url: "/docs/threat-actors/"
    description: "Normalized actor catalog and pivoting across briefs, hunts, risks, and rules."
  - title: "Air-gapped Mode"
    url: "/docs/airgapped/"
    description: "How isolated deployments handle signed bundles and outbound restrictions."
---

## The problem

Threat intelligence is easy to collect and hard to operationalize. Feeds deliver a constant stream of campaigns, indicators, techniques, vendor advisories, and ready-made detections. Most teams still have to answer the same questions manually: does this apply to us, can our telemetry see it, do we already detect it, and should we hunt before we deploy a rule?

Pentest and red-team findings create the same problem in another form. The finding is valuable, but it often stays trapped in a report. The SOC needs a bridge from "this path worked" to "we hunted for it, wrote a rule, tested it, deployed it, and measured it."

## How CraftedSignal handles intelligence

CraftedSignal treats a threat brief as a package of usable detection context. A brief can include narrative, affected vendors and products, IOCs, MITRE ATT&CK techniques, suggested Sigma rules, suggested hunts, tests, and actor metadata.

The platform scores every brief against your context. Modeled services, data assets, attack paths, operating systems, vendors, products, and existing rules all influence whether the item is urgent, useful, or noise.

## From brief to detection work

Analysts can adopt suggested rules, start a hunt, link the brief to an existing risk, watchlist it, or dismiss it with a recorded reason. A threat that is relevant but not ready for a permanent rule can become a hunt first. A threat that maps to a critical path can raise priority on an existing risk.

This keeps the feed connected to the rest of the control plane. Intelligence is not a separate inbox; it becomes backlog, hunts, rules, and coverage evidence.

## Public and private sources

CraftedSignal supports curated platform briefs and a public derivative feed at `feed.craftedsignal.io`. The community library can bring open detection content into the workflow, where it is deduplicated and tested before it becomes production coverage.

For regulated or isolated environments, signed bundles can be mirrored into an internal deployment. The same relevance and adoption workflow still applies, but outbound internet access is not required.
