---
title: "CLI Reference"
description: "Complete reference for csctl — the CraftedSignal command-line interface for detection-as-code workflows."
weight: 3
section: "Getting Started"
---

## Overview

`csctl` is the CraftedSignal CLI for managing detection rules as code. It connects your local YAML files to the CraftedSignal platform for validation, testing, deployment, and sync.

---

## Installation

Download `csctl` from your CraftedSignal account under **Settings > Downloads**, or use the platform URL directly:

```bash
# macOS / Linux
chmod +x csctl && mv csctl /usr/local/bin/
```

Verify:

```bash
csctl version
```

---

## Configuration

### Config file

`csctl` looks for `.csctl.yaml` starting from the current directory and searching upward to the filesystem root.

```yaml
# .csctl.yaml
url: https://app.craftedsignal.io
defaults:
  path: detections/
  platform: splunk
```

Initialize a project with a config file and example rule:

```bash
csctl init
```

### Environment variables

| Variable | Description |
|----------|-------------|
| `CSCTL_URL` | Platform URL |
| `CSCTL_TOKEN` | API token (recommended over config file) |
| `CSCTL_INSECURE` | Skip TLS verification (`true`/`false`) |
| `CSCTL_PATH` | Default detections path |
| `CSCTL_PLATFORM` | Default platform (`splunk`, `sentinel`, `crowdstrike`, `rapid7`) |

### Global flags

These flags work with every command:

| Flag | Default | Description |
|------|---------|-------------|
| `-config` | — | Path to `.csctl.yaml` |
| `-url` | `https://app.craftedsignal.io` | Platform URL |
| `-insecure` | `false` | Skip TLS certificate verification |
| `-log` | `info` | Log level: `debug`, `info`, `warn`, `error` |
| `-path` | `detections/` | Path to detections folder |

**Priority:** flags > env vars > config file > defaults.

---

## Commands

### init

Create a new detections project with example rule and config file.

```bash
csctl init
csctl init -from-platform    # Bootstrap from existing platform rules
```

| Flag | Description |
|------|-------------|
| `-from-platform` | Pull existing rules from platform instead of creating examples |
| `-token` | API token |

Creates:

```
detections/
├── endpoint/
│   └── example-detection.yaml
├── network/
├── cloud/
└── .csctl.yaml
```

---

### auth

Verify API credentials and display authenticated user info.

```bash
csctl auth
csctl auth -token YOUR_TOKEN
```

Output:

```
Authenticated to https://app.craftedsignal.io
  Company:  Acme Corp
  API Key:  My API Key
  Scopes:   detection:read, detection:write
```

---

### validate

Check local YAML files for syntax and schema errors. Runs entirely offline — no API token needed.

```bash
csctl validate
csctl validate /path/to/rules
```

Exit codes: `0` = valid, `1` = errors found.

---

### diff

Show what would change between local files and the platform.

```bash
csctl diff
csctl diff -filter "brute*"
csctl diff -group network
```

| Flag | Description |
|------|-------------|
| `-token` | API token |
| `-filter` | Filter rules by name or ID (supports `*` wildcard) |
| `-group` | Filter by group |

Output symbols:

| Symbol | Meaning |
|--------|---------|
| `+` | New rule (local only) |
| `~` | Modified |
| `!` | Conflict (both sides changed) |

---

### push

Upload local rules to the platform. Tests run automatically by default.

```bash
# Push all rules
csctl push -token YOUR_TOKEN

# Push with comment
csctl push -token YOUR_TOKEN -m "Add webshell detection"

# Push and deploy to SIEM
csctl push -token YOUR_TOKEN -deploy

# Preview without applying
csctl push -token YOUR_TOKEN -dry-run

# Push specific rules
csctl push -token YOUR_TOKEN -filter "brute*"
csctl push -token YOUR_TOKEN -group endpoint
```

| Flag | Default | Description |
|------|---------|-------------|
| `-token` | — | API token |
| `-m` | — | Version comment |
| `-dry-run` | `false` | Preview changes without applying |
| `-deploy` | `false` | Deploy rules to SIEM after push |
| `-test` | `true` | Run tests before pushing |
| `-filter` | — | Filter by name or ID (`*` wildcard) |
| `-group` | — | Filter by group |
| `-atomic` | `true` | Roll back all changes if any rule fails |
| `-force-sync` | `false` | Continue even if validation or tests fail |
| `-force-deploy` | `false` | Deploy even if tests fail (implies `-deploy`) |

---

### pull

Download rules from the platform to local YAML files.

```bash
csctl pull -token YOUR_TOKEN
csctl pull -token YOUR_TOKEN -group endpoint-threats
csctl pull -token YOUR_TOKEN -filter lateral
```

| Flag | Description |
|------|-------------|
| `-token` | API token |
| `-group` | Pull specific group only |
| `-filter` | Filter by name or ID (`*` wildcard) |

---

### sync

Bidirectional sync between local files and the platform. Fails on conflicts unless you specify a resolution strategy.

```bash
# Sync — fails if conflicts exist
csctl sync -token YOUR_TOKEN

# Keep local changes on conflict
csctl sync -token YOUR_TOKEN -resolve=local

# Keep platform changes on conflict
csctl sync -token YOUR_TOKEN -resolve=remote
```

| Flag | Default | Description |
|------|---------|-------------|
| `-token` | — | API token |
| `-resolve` | — | Conflict resolution: `local` or `remote` |
| `-m` | — | Version comment for pushed changes |
| `-filter` | — | Filter by name or ID |
| `-group` | — | Filter by group |
| `-atomic` | `true` | Roll back if any rule fails |
| `-test` | `true` | Run tests before syncing |
| `-deploy` | `false` | Deploy after sync |
| `-force-sync` | `false` | Continue despite validation or test failures |
| `-force-deploy` | `false` | Deploy despite failures |

Exit codes: `0` = success, `1` = error, `2` = conflicts detected.

---

### library

Manage detection rule library indexes.

#### Generate index

```bash
csctl library index generate -path ./queries -name "My Library"
```

| Flag | Default | Description |
|------|---------|-------------|
| `-path` | `.` | Directory containing rule files |
| `-output` | `library.index.yaml` | Output file |
| `-name` | `Library` | Repository name |
| `-url` | — | Repository URL |
| `-maintainer` | — | Maintainer name |

#### Sign index

```bash
csctl library index sign -key signing.key -input library.index.yaml
```

| Flag | Default | Description |
|------|---------|-------------|
| `-key` | — | **Required.** Path to Ed25519 private key |
| `-input` | `library.index.yaml` | Index file to sign |
| `-output` | Same as input | Signed output file |
| `-key-id` | — | Key identifier |

#### Verify signature

```bash
csctl library index verify -pubkey signing.pub -input library.index.yaml
```

| Flag | Default | Description |
|------|---------|-------------|
| `-pubkey` | — | **Required.** Path to Ed25519 public key |
| `-input` | `library.index.yaml` | Index file to verify |

#### Generate key pair

```bash
csctl library index keygen -output signing
# Creates: signing.key (private) and signing.pub (public)
```

---

### version

```bash
csctl version
# csctl v1.2.3
```

---

## Detection rule format

Rules are YAML files stored in your detections directory:

```yaml
title: "Brute Force Login Attempts"
platform: splunk
enabled: true
kind: scheduled
severity: high
frequency: 5m
period: 15m
description: "Detects repeated failed login attempts from a single source."

query: |
  index=main sourcetype=auth action=failure
  | stats count by src_ip
  | where count > 10

tactics:
  - credential-access
techniques:
  - T1110.001

tags:
  - authentication
  - brute-force
groups:
  - endpoint

tests:
  positive:
    - name: "Multiple failed logins"
      data:
        - { src_ip: "10.0.0.1", action: "failure", sourcetype: "auth" }
        - { src_ip: "10.0.0.1", action: "failure", sourcetype: "auth" }
  negative:
    - name: "Successful login"
      data:
        - { src_ip: "10.0.0.1", action: "success", sourcetype: "auth" }
```

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Rule name |
| `platform` | Yes | `splunk`, `sentinel`, `crowdstrike`, or `rapid7` |
| `enabled` | Yes | Whether the rule is active |
| `id` | No | UUID assigned on first push — leave empty for new rules |
| `kind` | No | `scheduled` (default), `realtime`, or `correlation` |
| `query` | No | Detection query in platform-native syntax |
| `severity` | No | `low`, `medium`, `high`, `critical` |
| `frequency` | No | Run interval (e.g., `5m`, `1h`) |
| `period` | No | Search window (e.g., `15m`, `24h`) |
| `tactics` | No | MITRE ATT&CK tactics |
| `techniques` | No | MITRE ATT&CK technique IDs |
| `tags` | No | Custom labels |
| `groups` | No | Logical groups for filtering |
| `tests` | No | Positive and negative test cases |

---

## Lock file

`csctl` creates a `.csctl.lock.json` in your working directory to track sync state. This file maps rule IDs to local file paths, hashes, and platform versions. Commit it to version control.

---

## Exit codes

| Code | Meaning |
|------|---------|
| `0` | Success |
| `1` | Error (validation failure, API error, test failure) |
| `2` | Conflicts detected (sync only) |

---

## CI/CD example

```yaml
# .github/workflows/detections.yml
name: Deploy detections
on:
  push:
    branches: [main]
    paths: ["detections/**"]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Validate
        run: csctl validate

      - name: Push and deploy
        run: csctl push -deploy -m "CI deploy ${{ github.sha }}"
        env:
          CSCTL_TOKEN: ${{ secrets.CSCTL_TOKEN }}
          CSCTL_URL: ${{ secrets.CSCTL_URL }}
```
