---
title: "Threat Feed"
description: "Curated threat briefs with Sigma rules, IOCs, MITRE mappings, and affected vendor/product/OS metadata. Briefs are scored against your context, surface as risk candidates, and can be adopted, hunted, watchlisted, or dismissed per-tenant."
weight: 8
section: "Core Concepts"
---

## Overview

The threat feed delivers curated briefs to the platform as signed bundles. Each brief carries a narrative, a set of Sigma rules, IOCs, MITRE ATT&CK mappings, and metadata about the vendors, products, and operating systems it affects. The platform indexes and scores every brief against your company context so you triage what matters first.

Regulated and air-gapped deployments can upload bundles manually; SaaS deployments receive them automatically over a signed channel.

---

## What a brief contains

- **Narrative** — what the threat does, who is behind it, how it spreads.
- **Suggested rules** — Sigma YAML, normalized and deduplicated against your existing library.
- **IOCs** — domains, IPs, hashes, user agents, with suggested hunting queries pre-generated.
- **MITRE mapping** — tactics, techniques, sub-techniques. Feeds the threat-model weight.
- **Threat actor** — free-text actor name on the brief, normalized against the [threat-actor catalog](/docs/threat-actors/) on ingest.
- **Affected vendors / products / OS** — structured lists. Briefs render vendor, product, and OS chips when these fields are populated, so you can scan a feed and immediately see which entries hit your stack.
- **CVE enrichment** — CVSS, EPSS, and CISA KEV flags ride alongside each brief in a shared metadata index.

---

## Segmented bundles

Bundles are delivered as **monthly segments** under a single manifest, not as one monolithic file. Each release contains:

- A `manifest.json` index listing every monthly segment with its checksum, brief count, and last-modified date.
- One segment file per month with that period's briefs and digests.
- A shared CVE metadata file referenced by every segment, refreshed whenever EPSS/KEV data changes.

The platform downloads the manifest, fetches the segments and CVE metadata in parallel, and merges them into a single state. Incremental updates only touch the segments that changed — old segments are reused from cache. SaaS tenants get this automatically; air-gapped operators sync the manifest and segments together.

The bundle format is backward-compatible with the legacy single-file `bundle.json`, but new releases use segments by default.

---

## Relevance scoring

Every brief gets a **relevance score** (0–100) per company. The score blends:

- Industry profile match (finance, healthcare, SaaS, regulated EU, etc.).
- Affected vendor / product / OS overlap with what you actually run.
- MITRE technique overlap with your accepted attack paths.
- Threat actor overlap with actors already pinned to your hunts or detections.
- Watchlist matches — keywords or asset names you've explicitly flagged.

Scores ≥75 (or any watchlist match flagged critical) trigger a **risk candidate** — the brief is queued in [Risks → Candidates](/docs/risks/#candidates) for analyst review. Lower-scored briefs still surface in the feed, just not as candidates.

---

## The adoption flow

1. **Review** — narrative, affected vendors/products/OS, MITRE coverage of the brief, and the suggested rules.
2. **Adopt** a rule in one click: creates a detection in your library linked back to the brief.
3. **Hunt the IOCs** using auto-generated queries against your connected SIEMs.
4. **Watchlist** the brief for periodic re-check if it isn't actionable right now.
5. **Dismiss** with a reason — the relevance model learns from the dismissal.

Adoption decisions are per-tenant. The same brief can be adopted by one company and dismissed by another without affecting either.

---

## Per-brief dismiss

The dismiss button at `/dashboard/threat-feed/<slug>` records a per-company acknowledgement: the brief still exists in the feed, but it disappears from your active queue and your dashboard's *Unactioned briefs* counter. Re-open the brief any time to **un-dismiss** — the acknowledgement is reset and the brief flows back into triage.

Dismissals are tenant-scoped. A SaaS instance with multiple companies tracks one dismissal record per (company, brief) pair. The bridge that converts briefs to risk candidates does not re-create candidates for already-dismissed briefs unless the relevance score crosses the threshold again on re-scoring.

---

## The dashboard's intelligence tab

The Intelligence tab on `/dashboard` is the operations view of the feed. Cards include:

- **Actively exploited** — briefs flagged as KEV (CISA Known Exploited Vulnerabilities).
- **Unactioned briefs (30d)** — relevance ≥75 that haven't been adopted, hunted, watchlisted, or dismissed.
- **TI-sourced open risks** — risks that originated from a feed candidate and are still open.
- **IOCs in scope** and **watchlist hits**.
- **Recently exploited software** — the last five briefs naming KEV CVEs, with threat actor and CVSS chips.
- **Recent high/critical CVEs** — distinct CVE IDs (CVSS ≥7) from the last 30 days, linking back to the originating brief.
- **Top briefs** — the highest-priority briefs from the last 30 days.

These cards are wired to the same indexes that drive the feed page, so dismissing a brief or adopting a rule updates the dashboard immediately.

---

## Air-gapped delivery

Upload a signed bundle via the dashboard or `csctl feed import`. The bundle is sealed with your tenant's public key and will not decrypt outside the environment it was issued for. Segmented bundles work the same way: upload the manifest plus the segments together, and the platform reconstructs the feed locally without any outbound traffic.

See [Air-gapped Mode](/docs/airgapped/) for the full constraint envelope.

---

## Related

- [Threat Model](/docs/threat-model/) — briefs re-weight your risk score.
- [Risks](/docs/risks/) — high-relevance briefs surface as risk candidates here.
- [Threat Actors](/docs/threat-actors/) — how brief actor strings are normalized into the catalog.
- [Hunts](/docs/hunts/) — IOC queries seed new hunts.
- [Rules](/docs/rules/) — adopt a brief's detection into your library.
