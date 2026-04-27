---
title: "Threat Hunting"
description: "Hypothesis-driven hunts that fan out across every connected SIEM. Cluster results, verdict them in batch, and promote winning queries to tested Sigma detections — with a full audit trail of every cluster you've touched."
weight: 6
section: "Core Concepts"
---

## Overview

A hunt is a bounded investigation of a threat hypothesis against one or more connected SIEMs. Unlike alerts, hunts are expected to produce many hits, most of them benign. The platform helps you cluster the hits, verdict them efficiently, and promote the queries that survive into formal detection rules.

Hunts are multi-SIEM by default: a single hypothesis fans out across every SIEM you have connected, and a Sigma-authored query recompiles to each SIEM's dialect at run time. Per-SIEM results are tracked separately so you can see exactly which platforms hit, which failed, and retry only the ones that need it.

---

## When to hunt

Hunt before you rule when:

- A MITRE technique on an accepted [risk](/docs/risks/) has no existing detection.
- A threat brief describes behavior your tooling does not yet cover.
- Post-incident review surfaces a pattern you want to watch for proactively.
- A SOC analyst suspects a class of activity but can't yet describe it as a single query.

The dashboard's **Top Uncovered Techniques** card links directly to a hunt seeded with the technique ID. The Risks page's **Hunt this risk** action does the same, anchored to the underlying attack path.

---

## The lifecycle

1. **Hypothesize** — describe the threat in plain language. Optionally link a business function, an attack path, or a set of MITRE techniques.
2. **Add queries** — write Sigma for portability, or a SIEM-native dialect (SPL, KQL, IOA, LEQL) when you need a feature Sigma doesn't cover.
3. **Run** — every query executes across every selected SIEM in parallel. Each run is recorded with per-SIEM hit counts, errors, and latency.
4. **Cluster** — identical or near-identical hits are grouped so a single verdict covers many rows.
5. **Verdict**:
   - Cluster level: `tp`, `fp`, `ignored`, `untriaged`.
   - Query level: `promising`, `noisy`, `dead`, `untriaged`, `awaiting triage`.
6. **Promote** — a query marked `promising` graduates to a detection rule. The platform pre-selects target SIEMs based on which ones the hunt actually ran against.
7. **Mark** — every verdicted cluster lands in the Marked tab as a ledger for audit and retrospective.

---

## Multi-SIEM hunts

### Default-to-all selection

The New Hunt form pre-checks every active SIEM. The note above the picker reads *"Hunt fans out across every checked SIEM. Defaults to all active."* Single-tenant deployments rarely need to change this; multi-region or multi-platform environments uncheck the SIEMs they want to exclude.

A green dot next to a SIEM in the picker means healthy, yellow means unknown, red means unhealthy. Hunts can still target unhealthy SIEMs — segments will fail and surface in the runs tab.

### Sigma compiles per SIEM at run time

When a query carries a Sigma source, the runner recompiles the YAML for each target SIEM at execution time. The same hypothesis runs as KQL on Sentinel and SPL on Splunk without you maintaining two copies of the logic.

The Add Query form shows a hint based on the hunt's SIEM mix:

- *"Hunt spans Splunk, Sentinel — use Sigma for portability."* (multi-platform)
- *"Targeting Splunk — use native dialect below."* (single-platform)

If a Sigma feature isn't available for a particular SIEM's backend, that segment will fail with an error you can see in the runs tab — the other SIEMs continue normally.

### Per-SIEM run segments

Each hunt run produces one row per target SIEM in the runs tab. A segment shows:

- The SIEM name and a status pill.
- Hit count, when the segment completed.
- An error message and tooltip when the segment failed.

Failed segments render as red chips with a retry button. Clicking retry creates a new run that targets only that SIEM, reusing the original window. Successful segments are left untouched.

### Promote-to-rule platform picker

When you promote a hunt query, the platform picker pre-selects every SIEM type the hunt actually ran on, with a `· used by this hunt` annotation. Override the selection if you want the rule to deploy more broadly than the hunt itself reached.

---

## The Marked tab

The Marked tab is the verdicted-cluster ledger for the hunt. Every cluster you've touched — TP, FP, or ignored — lands here, sorted by most recently marked.

Columns: cluster key, verdict chip (green TP, red FP, grey ignored), hit count, the originating query, and the timestamp of the verdict.

Marked is read-only. To change a verdict, jump back to the Queries tab and click TP/FP/Ignore on the cluster row — the same buttons re-fire the underlying action.

The Queries tab is now a single stacked-card view. Triage and Queries used to be separate; merging them keeps the cluster you're verdicting next to the query that produced it, so you don't combobox-hop while triaging.

---

## Native-citizen hunts

Hunts created in the platform UI (rather than auto-generated from risks or briefs) are first-class. They get an **Edit** tab, a comments timeline, and full presence — multiple analysts can collaborate on the same hunt without overwriting each other.

### Edit tab

Every field is editable from the hunt detail page:

- Title, hypothesis, notes.
- MITRE tactics and techniques (comma-separated; deduplicated on save).
- Linked business function and company attack path (clearable).
- SIEM scope (multi-select; at least one SIEM must remain).
- AI iteration and pre-triage toggles.

The form is partial-tolerant: omitted fields keep their current value. Title is required; nothing else is.

### Comments and @-mentions

The Overview tab includes a comment timeline. Comments are append-only — every entry is stamped with the author and a timestamp, so threads stay legible.

`@FirstName Lastname` resolves to the user and fires a notification with a deep link back to the comment anchor. `@Everyone` notifies every member of the workspace. Mentions reuse the same parser as feedback flows, so notification routing is consistent.

---

## Hunt detail header

The detail page's top strip shows:

- Title (wraps gracefully on long names) and hypothesis below it.
- Created-by name and date.
- A query summary: "X queries (Y promising, Z awaiting triage, A noisy, B dead, C draft)".
- An **outcome pill** in the corner: `Promoted`, `Archived`, `Promising`, `Clear`, `Ongoing`, or `Pending`, derived from the queries' verdicts.

When the hunt is anchored to a [risk](/docs/risks/), a **Covers kill chain** card replaces the generic header. The full attack-path stage chain renders inline with crosshairs on the steps the hunt is investigating and shields on steps already covered by production rules.

When the hunt isn't anchored to a risk but matches one or more global attack paths, a **Covers N attack paths** card lists each match with shared-technique highlighting.

The "What we're hunting for" strip below the header summarizes whichever metadata the hunt has: protected business function, backing services, risk path, matched paths, MITRE techniques. The strip is hidden when there's nothing to show.

---

## AI assist

- **Query generation** from a free-text threat description, safe across the SIEMs the hunt targets.
- **Query refinement** after a run: analyzes the hits and suggests tightening keywords or field conditions to cut noise.
- **Hunt proposals** are generated on a schedule from accepted risks, uncovered-technique gaps, and newly published threat briefs. Risk-anchored proposals are sorted by the underlying risk's priority — see [Risks](/docs/risks/) for the ranking model.

Both query helpers can be disabled per-hunt with the Edit tab's AI toggles, or globally via the [AI configuration](/docs/configuration/).

---

## Related

- [Risks](/docs/risks/) — accepted risks anchor hunts and feed the proposer.
- [Detection Rules](/docs/rules/) — the destination for a promising hunt query.
- [Threat Feed](/docs/threat-feed/) — briefs that seed new hunts.
- [Testing](/docs/testing/) — tests that accompany a promoted rule.
- [Platforms](/docs/platforms/) — Sigma compilation per-SIEM.
