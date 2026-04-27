---
title: "Threat Actors"
description: "A normalized catalog of threat groups linked to briefs, risks, detections, and hunts. Seeded from MITRE ATT&CK and grown automatically by an LLM that adjudicates names from incoming intel."
weight: 8
section: "Core Concepts"
---

## Overview

The threat-actor catalog is the platform's source of truth for "who" — the groups behind a TTP, a brief, or an active campaign. Every brief that names an actor in free-text gets normalized against the catalog so the same group resolves to the same canonical entry across briefs, risks, hunts, and detections.

You don't manage the catalog by hand. It's seeded from MITRE ATT&CK and grown automatically as new intel arrives. The benefit is downstream: every place an actor name is captured, you can pivot to every other place it appears.

---

## What's in the catalog

Each entry has:

| Field | Description |
|-------|-------------|
| `canonical_name` | The primary name (e.g., `APT29`). Unique across the catalog. |
| `aliases` | Every known alternate name (e.g., `Cozy Bear`, `Midnight Blizzard`). |
| `source` | `mitre`, `feed_inferred`, or `user_created`. |
| `verified` | `true` for MITRE seed; `false` for entries the LLM created. |
| `motivation` | `nation_state`, `criminal`, `hacktivist`, or `unknown`. |
| `origin_country` | Two-letter country code where known. |
| `mitre_group_id` | The G-number (e.g., `G0016`) for MITRE-tracked groups. |
| `first_seen_year` | Earliest public reporting. |

Aliases are globally unique — the same alias string cannot resolve to two actors. The canonical name is itself stored as an alias, so name lookup and alias lookup are one operation.

---

## MITRE seed

Twelve well-known groups ship pre-seeded:

- APT29 (G0016, RU, nation-state) and aliases `Cozy Bear`, `NOBELIUM`, `Midnight Blizzard`
- APT28 (G0007, RU, nation-state)
- APT41 (G0096, CN, nation-state)
- APT1 (G0006, CN, nation-state)
- APT34 (G0057, IR, nation-state)
- APT33 (G0064, IR, nation-state)
- Lazarus Group (G0032, KP, nation-state)
- Sandworm Team (G0034, RU, nation-state)
- Turla (G0010, RU, nation-state)
- FIN7 (G0046, criminal)
- Wizard Spider (G0102, criminal)
- TA505 (G0092, criminal)

These are all marked `source = mitre`, `verified = true`. Subsequent MITRE updates can add new groups via migration; the seed is intentionally minimal so the catalog stays curated.

---

## How the catalog grows

When a threat brief lands with a free-text actor name (`tb_threat_actor`), the feed-to-risk bridge runs **MatchOrAdjudicate**:

1. **Exact match** against the alias table. If the name (or one of its known aliases) is already in the catalog, the brief is linked to that actor immediately. Done.
2. **LLM adjudication** if no exact match exists *and* AI is configured. The LLM sees the unknown name plus the full catalog and returns one of three decisions:
   - **Alias** — the unknown name is a synonym for an existing actor. The platform adds it to the alias table so future briefs match exactly.
   - **Create** — the name is a new actor not in the catalog. The platform creates a new entry with `source = feed_inferred`, `verified = false`, and adds both the canonical name and the original input as aliases.
   - **Skip** — the string isn't a threat actor (a malware family, a campaign code, an artifact). No catalog change.

The LLM returns a confidence score and a reason with each decision; both are recorded in the LLM usage log.

If AI is disabled at the company or instance level, MatchOrAdjudicate degrades silently to exact-match only. The catalog still works — it just stops growing automatically.

---

## Edges

Once an actor is resolved, the platform links it to other entities through four edge tables. All edges are idempotent.

| Edge | What it means |
|------|---------------|
| **Brief → Actor** | This threat brief discusses this actor. |
| **Risk → Actor** | This company attack path represents this actor's TTPs. |
| **Detection → Actor** | This rule is designed to catch this actor's activity. |
| **Hunt → Actor** | This hunt is investigating this actor. |

Brief-to-actor edges are written automatically by the feed-to-risk bridge. The other three are reserved for analyst-driven workflows or future automation.

---

## Verification

`verified = true` means the entry is authoritative. MITRE-seeded actors are verified by default; LLM-inferred actors are not.

Unverified actors still participate in matching, edges, and pivots — they're not second-class. The flag exists so that future tooling can surface "review queue" workflows where analysts confirm the LLM's create decisions before they're trusted in audit reports.

There is no UI today for promoting unverified actors to verified, or for editing the catalog. That's intentional — the catalog is meant to be a side effect of intel, not a screen analysts manage.

---

## Where you see actors

The catalog itself doesn't have a dedicated browse page yet. Actors surface where they're useful:

- **Threat brief detail** — the actor name renders next to the brief title; a hover reveals the canonical entry.
- **Risk drawer** — the lifecycle timeline cites the actor when a brief-driven candidate created the risk.
- **Hunt overview** — the "What we're hunting for" strip lists matched actors when global attack paths overlap with the hunt.

The pivots between briefs, risks, hunts, and detections via shared actor IDs are what make the catalog valuable. Even without a dedicated UI, the linkage is there in the database and in cross-page context.

---

## AI off-switch

The LLM adjudication path is gated by the global AI service. Disable AI in [configuration](/docs/configuration/) and:

- The catalog stops growing automatically.
- `Match` (exact + alias) keeps working.
- New brief actors that don't match the catalog go unlinked. The brief still ingests; only the edge is missing.

This is the design point for air-gapped or AI-restricted deployments. See [Air-gapped Mode](/docs/airgapped/) for the full constraint.

---

## Related

- [Threat Feed](/docs/threat-feed/) — where actor names enter the system.
- [Risks](/docs/risks/) — what the bridge produces from those actors.
- [AI Assistance](/docs/ai/) — how to enable or disable the adjudication LLM.
