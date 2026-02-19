---
title: "Platform Guides"
description: "Connect and deploy to Splunk, Microsoft Sentinel, CrowdStrike, and Rapid7 InsightIDR."
weight: 12
section: "Integrations"
---

## Supported platforms

CraftedSignal supports deploying detection rules to multiple SIEMs from a single source of truth.

---

## Splunk

### Connect

Add a Splunk target in **Settings > Targets**:

| Field | Value |
|-------|-------|
| **API URL** | `https://your-splunk:8089` |
| **Auth token** | Splunk REST API token with `saved_search` capability |

### What CraftedSignal manages

- Saved searches (correlation searches)
- Lookup tables referenced by rules
- Macros and field extractions

### Query language

Rules targeting Splunk use SPL:

```spl
index=web sourcetype=access_combined
| where uri_path LIKE "%/uploads/%.php"
| stats count by src_ip, uri_path
| where count > 3
```

---

## Microsoft Sentinel

### Connect

Add a Sentinel target in **Settings > Targets**:

| Field | Value |
|-------|-------|
| **Workspace ID** | Your Log Analytics workspace ID |
| **Tenant ID** | Azure AD tenant ID |
| **Client ID** | App registration client ID |
| **Client Secret** | App registration secret |

The app registration needs `Microsoft Sentinel Contributor` and `Log Analytics Reader` permissions.

### What CraftedSignal manages

- Analytics rules (scheduled and NRT)
- Hunting queries

### Query language

Rules targeting Sentinel use KQL:

```kql
W3CIISLog
| where csUriStem has_any (".php", ".asp", ".jsp")
| where csUriStem contains "/uploads/"
| summarize count() by cIP, csUriStem
| where count_ > 3
```

---

## CrowdStrike

### Connect

Add a CrowdStrike target in **Settings > Targets**:

| Field | Value |
|-------|-------|
| **API URL** | `https://api.crowdstrike.com` (or your regional URL) |
| **Client ID** | API client ID |
| **Client Secret** | API client secret |

The API client needs Custom IOA and Host Group permissions.

### What CraftedSignal manages

- Custom IOA rules
- IOA rule groups

### Query language

Rules targeting CrowdStrike use Custom IOA rule groups, which are defined as pattern-based conditions rather than a query language. CraftedSignal maps rule logic to IOA patterns for deployment.

---

## Rapid7 InsightIDR

### Connect

Add a Rapid7 target in **Settings > Targets**:

| Field | Value |
|-------|-------|
| **API Key** | Rapid7 platform API key |
| **Region** | Your region: `us`, `eu`, `ca`, `ap`, or `au` |
| **Webhook URL** | Custom log event source webhook URL |

Optionally specify a `logset_id` for explicit log set targeting.

### What CraftedSignal manages

- Custom alerts
- Log search queries

### Query language

Rules targeting Rapid7 use LEQL:

```
where(action = FAILED_LOGIN)
groupby(source_address)
calculate(count)
having(count > 10)
```

---

## Multi-platform rules

Write a single rule and deploy to multiple SIEMs. CraftedSignal maintains platform-specific implementations and shows diffs:

```bash
csctl diff -token YOUR_TOKEN
```

Portability scores indicate how well the rule translates. Scores below a threshold trigger a review flag.

---

## Credential security

All SIEM credentials are:

- Encrypted at rest with AES-256 using per-company encryption keys derived from the master secret via HKDF-SHA256
- Rotatable without downtime
- Never logged or exposed in API responses
