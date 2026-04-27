---
title: "Git-native Backups"
description: "Push every rule, version, and test to your Git repository on a schedule. Restore from any point, audit offline, or migrate environments without touching the SIEM."
weight: 11
section: "Operations"
---

## Overview

Detection content is source code. Git-native backups keep a full, committed mirror of your rule library in a repository you control — nothing proprietary, nothing locked behind the platform. Restores are plain `git checkout` operations. Offline audits are plain `git log`.

---

## What gets backed up

- Detection rules, including tests, metadata, MITRE mappings, and scenario bindings.
- Rule version history.
- Group membership and approval workflow configuration.
- Threat model services, data assets, attack paths, and TRS snapshots.
- SIEM configuration (without credentials — those stay encrypted in the platform).

Each object is written as a YAML file under a stable path. A `manifest.json` at the repo root records the schema version and last sync time.

---

## Sync modes

- **Scheduled** — a Temporal workflow pushes a commit every N minutes (configurable per company). Incremental, so only changed files touch the tree.
- **On event** — optionally, every save, deploy, or approval can push its own commit for a granular history.
- **Manual** — `csctl git-backup push` from the CLI for ad-hoc exports.

---

## Restore

1. `git checkout <sha>` in your working copy of the backup repo.
2. `csctl git-backup restore --rule <id>` to pull a single rule back, or `--all` to replay the whole tree.
3. Restored rules land as new drafts. Review, test, and deploy normally; nothing hits the SIEM without approval.

---

## Air-gapped

Point the backup at a file-based remote, SMB share, or internal GitLab / Gitea. No outbound SaaS required. See [Air-gapped mode](/docs/airgapped/).

---

## Related

- [Detections as Code](/docs/cli/) — the same YAML schema, edited with `csctl` instead of the UI.
- [Secure Workflows](/docs/secure-workflows/) — approvals on restore.
