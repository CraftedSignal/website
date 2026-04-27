---
title: "Noise Budgets"
description: "Set daily alert budgets per team, service, or rule. Deploys that would blow the budget are held. Monitoring mode proves volume out before alerts reach analysts."
weight: 10
section: "Operations"
---

## Overview

Alert fatigue kills detection programs. A noise budget is a soft daily cap on alert volume scoped to a team, service, or individual rule. When the projected or actual volume breaches the budget, the platform refuses to graduate the rule out of monitoring mode, and flags the offending deployment.

---

## Scopes

| Scope     | Typical use                                                        |
|-----------|--------------------------------------------------------------------|
| Company   | Absolute ceiling across the whole tenant                           |
| Team      | Cap per SOC squad or approval group                                |
| Service   | Budget tied to a business service in the threat model              |
| Rule      | Tight ceiling for a specific high-risk detection                   |

Budgets at a narrower scope override broader ones.

---

## Monitoring mode

A newly deployed rule does not alert on day one. It runs silently for a configurable soak period, projecting the alert volume it would have produced. If that projection stays under budget, the rule graduates to live alerting automatically. If not, it stays in monitoring until you tune it.

---

## When a budget is breached

- Deploy requests that would push projected volume past the budget are blocked with a clear error.
- Live rules exceeding their budget are flagged in the dashboard and the **Silently Broken** queue (inverted case: too loud rather than dead).
- The offending rule is not disabled automatically; the platform surfaces the breach and lets the owner decide.

---

## Related

- [Deployment](/docs/deployment/) — monitoring mode graduation flow.
- [Health Analytics](/docs/health-analytics/) — per-rule trigger counts that drive the budget math.
