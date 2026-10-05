---
title: "Library"
description: "Reusable rule and hunt templates, guides, tests, ATT&CK mapping, runbooks, playbooks, comments, imports, and managed source repositories."
weight: 5
section: "Core Concepts"
---

## Overview

Library is where teams keep reusable detection and hunt content before it becomes active work. It supports:

- **Rule Library**: reusable detection templates imported as production rules.
- **Hunt Library**: reusable hunt hypotheses and queries launched or adapted into hunts.
- **Guides**: reusable response guidance, runbooks, and playbooks linked to library templates or rules.

Entries include query logic, platform type, severity, tags, ATT&CK mapping, data sources, tests, references, and response steps. That makes library source a complete detection package, not just a snippet.

---

## Entry types

Library entries can be written in Sigma or native query languages such as SPL, KQL, LEQL, FQL, and EQL. Sigma entries can be converted into connected target languages before import, while native entries remain useful when teams intentionally keep platform-specific logic.

Each entry can carry:

- Name, description, severity, tags.
- Query type and query body.
- ATT&CK tactics and techniques.
- Data sources and external references.
- Positive and negative tests.
- Runbooks and playbooks.
- Comments for tenant-scoped review discussion.

---

## Git/YAML sync

Local company library content can be exported to Git and imported back from YAML. The sync schema uses `type` to distinguish reusable templates from active rules:

```yaml
version: 1
items:
  - type: rule_template
    id: suspicious-powershell
    name: Suspicious PowerShell
    description: Detects suspicious PowerShell command lines.
    query_type: kql
    query: |
      SecurityEvent
      | where EventID == 4688
      | where CommandLine has_any ("-enc", "IEX")
    severity: high
    tactics: [execution]
    techniques: [T1059.001]
    tags: [windows, powershell]

  - type: hunt_template
    id: lateral-movement-hunt
    name: Lateral movement hunt
    queries:
      - title: Remote service creation
        query_type: spl
        query: |
          index=wineventlog EventCode=7045

  - type: guide
    id: credential-access-response
    name: Credential access response
    body: |
      ## Runbook
      Review identity alerts, recent sign-ins, and privilege changes.
```

Valid `type` values are `rule_template`, `hunt_template`, and `guide`. `type: rule` and `type: detection` are intentionally not valid in library YAML; active production detections stay in detection rule YAML and move through the normal rule lifecycle.

Library export is tenant-local. Managed remote or cloud library sources are not exported into a company's Git snapshot, which avoids copying upstream licensed content across tenants.

API tokens used by CLI or automation need `library:read` to export or read sync status, and `library:sync` to import or apply library YAML.

---

## Managed sources

Admins manage library repositories from the admin area. Sources can be local, company-specific, or remote managed repositories. CraftedSignal caches remote entries per tenant so teams can search, inspect, and import consistently.

The default cloud library can be disabled for customers that only want private content.

---

## Importing content

When a library entry is imported, CraftedSignal creates the destination object with the relevant metadata, tests, ATT&CK mapping, and response steps. Detection templates become rules. Hunt templates become hunts.

Imported content is still reviewable. Teams can edit the generated rule or hunt, run tests, attach it to groups, request approval, and deploy through the normal workflow.

---

## Review flow

Use comments when a template needs discussion before import. Use tags and severity filters to keep large libraries searchable. For response steps, prefer reusable structure but keep environment-specific items out of shared templates unless they are safe for every tenant that can see the entry.

---

## Related docs

- [Rules](/docs/rules/) - production detection objects.
- [Threat Hunting](/docs/hunts/) - hunt workflow promotion.
- [Runbooks & Playbooks](/docs/runbooks-playbooks/) - response steps move with library content.
- [CLI Reference](/docs/cli/) - library YAML and index commands.
