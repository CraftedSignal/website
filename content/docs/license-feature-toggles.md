---
title: "License Feature Toggles"
description: "Use CraftedSignal license feature claims to enable or disable platform capabilities in self-hosted and SaaS deployments."
weight: 15
section: "Administration"
---

License keys can carry platform feature entitlements as well as quota limits. Admins still control organization-level availability in **Admin > Features**, but a feature can only be enabled when the active license includes that entitlement.

Older licenses that do not include `platform_feature_toggles` keep legacy behavior for normal platform toggles. New licenses should include `platform_feature_toggles`; when present, the license feature list is authoritative.

## License behavior

1. The license generator writes feature keys into the signed PASETO token.
2. The platform verifies the token at startup or when a new license key is applied.
3. **Admin > Features** shows licensed toggles as editable and unlicensed toggles as locked.
4. Feature updates are also clamped server-side, so a forged form post cannot enable an unlicensed feature.

`threat_feed` remains explicitly licensed even for legacy tokens because the feed service depends on licensed feed content.

## Feature keys

| Key | Capability |
|-----|------------|
| `platform_feature_toggles` | Makes the feature claim authoritative for Admin > Features |
| `ai` | Assisted work master switch |
| `rule_generation` | Rule drafting |
| `test_generation` | Test drafting |
| `rule_suggestions` | Rule suggestions |
| `brief_customization` | Threat brief ranking context |
| `sigma_auto_translation` | Sigma translation drafts |
| `library` | Rule and hunt library |
| `cloud_library` | CraftedSignal-managed cloud libraries |
| `library.approvals_required` | Library approval workflow |
| `dashboards` | Dashboard, Backlog, report, and overview pages |
| `siem_integrations` | SIEM connection, deployment, testing, and live execution surfaces |
| `rules` | Detection rule pages |
| `groups` | Detection group pages |
| `response_guidance` | Response guidance panels and editors |
| `feedback` | Feedback and discussion |
| `threat_feed` | Curated threat intelligence feed |
| `maturity` | Rule monitoring mode |
| `auto_graduation` | Automatic monitoring graduation |
| `simulations` | Attack simulations |
| `hunts` | Threat hunting |
| `hunts.threat_model` | Threat model, threat paths, and risk register |
| `error_reporting` | Remote error reporting |
| `bug_reporting` | Manual bug reports |
| `accounts.mssp` | MSSP account management |

## Generate a license

Use tier presets for normal licenses:

```bash
licensing generate -private-key "$LICENSE_PRIVATE_KEY" \
  -tier enterprise \
  -company "Acme SOC" \
  -type onprem \
  -duration "1y"
```

Use `features` in `licenses.yaml` when a customer needs a custom entitlement set:

```yaml
customers:
  - name: "Acme SOC"
    tier: pro
    type: onprem
    duration: "1y"
    features:
      - platform_feature_toggles
      - ai
      - library
      - rules
      - siem_integrations
      - threat_feed
      - hunts
      - hunts.threat_model
```

The token still carries quota fields such as detections, users, SIEMs, API keys, and AI tokens. See [Pricing & Limits](/docs/pricing/) for quota behavior.
