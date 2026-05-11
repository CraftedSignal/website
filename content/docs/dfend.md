---
title: "D3FEND Defensive Coverage"
description: "CraftedSignal maps every detection rule to MITRE D3FEND defensive categories automatically, showing where you Detect, Harden, Isolate, Deceive, and Evict threats — and where the hunt proposer can help close gaps."
weight: 9
section: "Features"
---

## Overview

[MITRE D3FEND](https://d3fend.mitre.org) is the defensive counterpart to ATT&CK. Where ATT&CK describes what attackers do, D3FEND describes what defenders can do about it. The platform maintains a static ATT&CK→D3FEND mapping and uses it to automatically classify every detection rule into one or more of five top-level defensive categories.

| Category | What it covers |
|----------|----------------|
| **Detect** | Identify attacker activity in progress |
| **Harden** | Reduce the attack surface before an attack occurs |
| **Isolate** | Limit blast radius and lateral movement |
| **Deceive** | Lure or mislead an attacker |
| **Evict** | Remove an attacker who has already gained a foothold |

No manual tagging is required. When a rule carries MITRE ATT&CK technique IDs the platform derives the applicable D3FEND techniques and rolls them up to these categories automatically.

---

## Auto-derivation and override

When a rule is created or its ATT&CK techniques change, `DeriveDFend()` runs and stores the derived D3FEND technique IDs. The **Defensive coverage (D3FEND)** section on the rule edit page shows those techniques as read-only chips alongside a **Lock** button.

| Mode | Behavior |
|------|----------|
| Auto (default) | D3FEND techniques are re-derived whenever ATT&CK techniques change. |
| Override (locked) | A freeform text field accepts custom D3FEND technique IDs. Auto-derivation is suspended until unlocked. |

Use override when a rule's defensive intent doesn't match the static mapping — for example, a deception honeypot rule mapped to an ATT&CK technique that the mapping doesn't associate with the **Deceive** category.

---

## Rules list

The `/dashboard/rules` list shows D3FEND category badges on each row. A `dfend_category` query parameter filters to rules contributing to a single category, and combines with all other active filters (search, group, tag, platform, status):

```
/dashboard/rules?dfend_category=Harden
```

---

## Attack-path step badges

On the Risk Ops Board's attack-path view, each step row shows a D3FEND badge:

- **Green ✓** — at least one active rule contributes the recommended D3FEND category for this step's ATT&CK technique.
- **Amber !** — the mapping recommends this category but no rule covers it. A **Suggest Hunt** button next to the amber badge creates a hunt proposal pre-seeded with the gap technique and the missing D3FEND category as the `DFendTarget`.

---

## Hunt D3FEND target

Hunts that originate from a D3FEND gap proposal carry a **D3F: \<Category\>** badge in the hunt detail header. The badge records which defensive category the hunt is intended to address, so analysts know whether a hunt is building Detect coverage, Harden coverage, or something else. The `DFendTarget` field carries through to the promoted detection.

---

## Posture page

`/coverage/posture/dfend` shows a horizontal bar per top-level category across all your active rules.

| Column | Meaning |
|--------|---------|
| Rule count | Rules contributing to this defensive category |
| Techniques | ATT&CK techniques covered by those rules that map to this category |
| % | Techniques in this category ÷ total covered techniques across all rules |

The denominator is the union of techniques on your enabled rules — not the full ATT&CK matrix — so the percentages reflect your actual detection estate. A category with zero rules shows a direct link to create a rule.

---

## Hunt proposals from gaps

The hunt proposer includes a `dfend_gap` signal source. For each ATT&CK technique that has at least one active rule but is missing a D3FEND category the static mapping recommends, the proposer emits a gap signal. These appear in `/dashboard/hunts` alongside risk-anchored and ideal-posture proposals.

Gap signals are capped at three per technique to avoid flooding the queue when a technique has many defensive recommendations.

---

## Routes

| Route | Purpose |
|-------|---------|
| `GET /coverage/posture/dfend` | Defensive posture panel by D3FEND category |
| `GET /dashboard/rules?dfend_category=<cat>` | Filter rules to a single D3FEND category |

---

## Related

- [Detection Rules](/docs/rules/) — where D3FEND coverage is stored and overridden per rule.
- [Risks](/docs/risks/) — attack-path step rows show D3FEND coverage/gap badges.
- [Hunts](/docs/hunts/) — hunt proposals include D3FEND gap signals; promoted hunts carry a D3FEND target.
- [Threat Model](/docs/threat-model/) — the attack paths and steps that drive coverage badges.
