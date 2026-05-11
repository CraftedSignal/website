---
title: "D3FEND Defensive Coverage"
description: "MITRE D3FEND integration: how CraftedSignal maps your active detections to defensive techniques across the Detect, Harden, Isolate, Deceive, and Evict categories — and how gaps feed the hunt proposer."
weight: 9
section: "Core Concepts"
---

## Overview

MITRE D3FEND is a knowledge graph of defensive cybersecurity techniques. Where ATT&CK catalogs what attackers do, D3FEND maps what defenders can do about it. CraftedSignal uses a static ATT&CK → D3FEND mapping to automatically classify your active detection rules by their defensive posture — without requiring any extra configuration.

Every rule that maps to at least one ATT&CK technique gets D3FEND categories derived automatically. The categories propagate through the platform: rule listings, attack-path step rows, hunt detail pages, and the dedicated posture report at `/coverage/posture/dfend`.

---

## Categories

D3FEND organizes defensive techniques into five top-level categories:

| Category | Meaning | Example techniques |
|----------|---------|-------------------|
| **Detect** | Identify attacker activity through analysis | Process Spawn Analysis, Credential Analysis, Network Traffic Analysis |
| **Harden** | Reduce the attack surface or raise the cost of exploitation | Application Hardening, Credential Hardening, Backup Verification |
| **Isolate** | Segment or contain a threat | Network Isolation, Process Isolation |
| **Deceive** | Misdirect or delay attackers | Honey Token, Decoy User Credential |
| **Evict** | Remove attacker presence or access | Account Locking, Process Termination |

A rule contributing to, say, `T1078 Valid Accounts` will be mapped to Detect (Credential Analysis, User Behavior Analysis), Harden (Credential Hardening), and Deceive (Decoy User Credential). Multiple categories per rule are normal.

---

## How mapping works

The mapping is static and ships with the platform binary. When a rule is created, updated, deployed, or removed, `DeriveDFend()` recomputes the rule's D3FEND technique IDs from its ATT&CK technique list. The result is stored in `det_dfend_techniques` alongside the rule and does not require network access or an AI call.

The computation:

1. For each ATT&CK technique on the rule, look up the D3FEND techniques in the embedded mapping.
2. Deduplicate across all techniques on the rule.
3. Persist the derived list; the top-level categories (`det_dfend_categories`) are derived from the technique IDs.

Sub-techniques fall back to their parent (e.g., `T1059.001` maps via `T1059`). Techniques not in the mapping produce no D3FEND output — the rule still works, it just won't appear in category coverage.

---

## Override

The mapping is automatic by default. On the rule edit page, the **Defensive Coverage** section lets you switch to manual mode:

- **Unlocked** (default): D3FEND techniques derive automatically from the rule's ATT&CK techniques. The badge shows the computed categories.
- **Locked** (override): You supply the D3FEND technique IDs directly. Automatic derivation is suppressed for that rule. Use this when the static mapping doesn't reflect the rule's actual defensive goal — for example, a detection that implements a Deceive technique not yet in the mapping.

The lock state persists across rule edits. Unlocking reverts to auto-derivation on the next save.

---

## Where D3FEND appears

### Rules list

Each rule row on `/dashboard/rules` shows the D3FEND categories it contributes to as color-coded badges:

| Badge color | Category |
|-------------|----------|
| Blue | Detect |
| Orange | Harden |
| Purple | Isolate |
| Yellow | Deceive |
| Red | Evict |

Filter the list to a single category using the `dfend_category` query parameter (e.g., `?dfend_category=Harden`). The filter is preserved across pagination and sort changes.

### Attack-path step rows

Each step on a company attack path shows coverage and gap badges derived from the rules linked to that step:

- A **covered** badge appears when at least one active rule addresses the step's technique with a D3FEND category.
- A **gap** badge appears for categories that the D3FEND mapping says *should* cover the technique but no active rule does.
- A **Suggest Hunt** button appears next to gap badges — clicking it pre-fills a hunt proposal for that technique and defensive category.

### Hunt detail

When a hunt is seeded by a D3FEND gap signal (via the hunt proposer), the detail header shows a **D3FEND target** badge identifying which defensive category the hunt is expected to close. This badge propagates from the hypothesis through to the promoted rule.

---

## Posture page

`/coverage/posture/dfend` shows a horizontal bar for each of the five categories:

- **Rule count** — how many of your active rules contribute to that category.
- **Technique coverage** — the share of your company's covered ATT&CK techniques that have at least one rule addressing this category (technique count ÷ total covered techniques × 100%).
- A quick-add link when a category has zero coverage.

Coverage is computed from active rules only. Disabled, paused, killed, and draft rules do not contribute. Percentages reflect coverage of *your actively-detected techniques*, not the full ATT&CK matrix.

---

## D3FEND gaps and the hunt proposer

The hunt proposer's **IdealPostureSource** emits `dfend_gap` signals for techniques where your existing coverage is partial — for example, where a technique has Detect coverage but no Harden coverage. Each signal becomes a hunt proposal in the **Suggested Hunts** list, labeled with the gap category.

Up to three gap signals are emitted per technique per proposer run to avoid flooding the proposal queue. Gap proposals are ranked alongside other signal types and respect the hunt proposer's overall priority ordering.

---

## Related

- [Detection Rules](/docs/rules/) — where ATT&CK technique mappings and the D3FEND override live.
- [Threat Hunting](/docs/hunts/) — how gap signals become hunt proposals.
- [Risks](/docs/risks/) — attack-path steps that show D3FEND coverage badges.
- [Health & Analytics](/docs/health-analytics/) — broader coverage metrics.
