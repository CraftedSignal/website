---
title: "Drift Detection"
description: "Every deployed rule is re-hashed on a schedule. Any out-of-band change in the SIEM is flagged, diffed, and queued for review."
weight: 9
section: "Operations"
---

## Overview

A detection rule does not stop drifting the moment it deploys. SIEM admins retune it, automation rewrites it, another tool pushes a competing version. Drift detection compares the rule currently running on the SIEM against the version CraftedSignal last deployed. Any divergence surfaces in the dashboard as a drift alert with a side-by-side diff.

---

## How it works

- After every deploy, the platform stores a content hash of the compiled rule.
- A scheduled workflow re-fetches each deployed rule from the SIEM and recomputes the hash.
- On mismatch, the rule is marked `drift_detected`, the remote body is captured, and an audit log entry is written.

The **Drift** pinned filter on the Rules page gives a one-click view of every rule in that state.

---

## What to do with drift

The rule edit page offers three resolutions:

1. **Accept remote** — promote the SIEM's current version into the platform as a new draft, preserving history.
2. **Redeploy local** — push the platform's version back over the top, overwriting whatever is in the SIEM.
3. **Archive** — stop managing the rule from CraftedSignal. Useful when ownership transfers to another team.

---

## Audit trail

Every drift detection, acceptance, and redeploy is logged with user, timestamp, and diff. Exportable for compliance review alongside the standard audit log.

---

## Related

- [Secure Workflows](/docs/secure-workflows/) — approval gates around drift resolution.
- [Deployment](/docs/deployment/) — the deploy path that establishes the baseline.
