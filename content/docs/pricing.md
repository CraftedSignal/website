---
title: "Pricing & Limits"
description: "Free tier, Professional, Enterprise, and Unlimited plans with feature comparison."
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

- Higher limits on rules, SIEMs, users, and API requests
- Priority support

### Enterprise

For organizations with compliance and governance requirements.

- SSO/OIDC integration
- Advanced RBAC and approval workflows
- Extended audit log retention
- Data residency options
- Dedicated support

### Unlimited

For large teams and MSSPs.

- No resource limits
- Multi-tenant support
- Custom integrations
- SLA-backed support

---

## Self-hosted licensing

Self-hosted deployments use a license key:

```yaml
# config.yml
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
