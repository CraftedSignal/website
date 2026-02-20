---
title: "Pricing & Limits"
description: "Compare CraftedSignal pricing tiers: Free, Professional, Enterprise, and Unlimited. See rule limits, SIEM connections, API quotas, and self-hosted licensing."
weight: 14
section: "Getting Started"
---

## Plans

### Free

Get started with the full platform at no cost.

| Limit | Value |
|-------|-------|
| Detection rules | 100 (50 enabled) |
| SIEM connections | 1 |
| API keys | 1 |
| API requests/day | 10,000 |
| Users | 1 |
| Storage | 100 MB |

The free tier includes all core features: rule editing, testing, deployment, rollback, MITRE coverage, noise tracking, and AI assistance.

### Professional

For small teams scaling their detection program.

| Limit | Value |
|-------|-------|
| Detection rules | 500 (250 enabled) |
| SIEM connections | 3 |
| API keys | 5 |
| API requests/day | 50,000 |
| Users | 10 |
| Storage | 1 GB |

- Priority support

### Enterprise

For organizations with compliance and governance requirements.

| Limit | Value |
|-------|-------|
| Detection rules | 2,000 (1,000 enabled) |
| SIEM connections | 10 |
| API keys | 25 |
| API requests/day | 200,000 |
| Users | 50 |
| Storage | 10 GB |

- SSO/OIDC integration
- Advanced RBAC and approval workflows
- Extended audit log retention
- Data residency options (EU, US)
- Dedicated support

### Unlimited

For large teams and MSSPs.

- No resource limits on rules, SIEMs, users, or API requests
- Multi-tenant support
- Custom integrations
- SLA-backed support

Contact [founders@craftedsignal.io](mailto:founders@craftedsignal.io) for Unlimited pricing.

---

## Self-hosted licensing

Self-hosted deployments use a license key:

```yaml
# config.yaml
license_key: "1.eyJ..."
```

Or via environment variable:

```bash
export LICENSE_KEY="1.eyJ..."
```

License keys are signed tokens that encode your tier and limits. Quotas are enforced at the API level — they cannot be bypassed.

---

## Quota enforcement

When you hit a resource limit, the API returns:

- `429 Too Many Requests` — rate limit exceeded (try again later)
- `403 Forbidden` — resource limit reached (upgrade required)

Rate limit headers are included in every response:

```
X-RateLimit-Limit: 10000
X-RateLimit-Remaining: 9847
X-RateLimit-Reset: 1708300800
```

---

## Upgrade

Upgrade anytime from **Settings > Billing** (SaaS) or by requesting a new license key (self-hosted).

Contact [hello@craftedsignal.io](mailto:hello@craftedsignal.io) for Enterprise and Unlimited pricing.
