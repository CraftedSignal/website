---
title: "Privacy Policy"
description: "How CraftedSignal handles your data."
layout: "legal"
---

**Effective date:** February 20, 2026

This Privacy Policy describes how CraftedSignal ("we", "us", "our") collects, uses, and protects your information when you use our platform and website.

---

## 1. What we collect

### Account data
- Email address, name, and organization (provided at sign-up)
- Authentication credentials (hashed, never stored in plain text)

### Usage data
- Feature usage, API request counts, and error logs
- Browser type, IP address, and access timestamps for the website and platform

### Detection content
- Rules, tests, configurations, and metadata you create in the platform

### Payment data
- Billing information is processed by our payment provider. We do not store credit card numbers.

## 2. What we do NOT collect

- **No SIEM logs.** CraftedSignal agents are outbound-only. We never ingest, store, or process your security event data.
- **No telemetry from self-hosted instances** unless you explicitly opt in.

## 3. How we use your data

| Purpose | Data used |
|---------|-----------|
| Operate the Service | Account data, detection content |
| Improve the platform | Aggregated, anonymized usage data |
| Communicate with you | Email address |
| Billing | Payment data |
| Security and abuse prevention | IP addresses, access logs |

## 4. AI and your data

**We never train AI models on your data.** AI features (rule generation, autofix, analysis) process your input in real-time and do not retain it for training.

When using CraftedSignal-hosted AI, your prompts are sent to our inference endpoint and discarded after the response is generated.

When using self-hosted AI via Ollama, all AI processing happens on your infrastructure. No data leaves your network.

You can disable AI features entirely. See [AI Assistance](/docs/ai/) for details.

## 5. Data storage and security

- All data is encrypted at rest (AES-256) and in transit (TLS 1.2+)
- Per-workspace encryption keys for tenant isolation
- Audit logs are immutable and retained per your plan settings
- Infrastructure hosted in the EU (Netherlands) with optional US region

See [Security & Compliance](/docs/security/) for the full security posture.

## 6. Self-hosted deployments

When you self-host CraftedSignal, all data stays on your infrastructure. We have no access to your instance, data, or network. The only outbound connection is an optional license validation check.

## 7. Data retention

- **Account data** — retained while your account is active, deleted within 30 days of account closure
- **Detection content** — retained while your account is active, available for export for 30 days after closure
- **Usage data** — aggregated data retained for up to 24 months
- **Access logs** — retained for 90 days

## 8. Your rights

Under GDPR and applicable data protection laws, you have the right to:

- **Access** your personal data
- **Rectify** inaccurate data
- **Delete** your data ("right to be forgotten")
- **Export** your data in a portable format
- **Object** to processing based on legitimate interest
- **Restrict** processing under certain conditions

To exercise these rights, contact [privacy@craftedsignal.io](mailto:privacy@craftedsignal.io). We respond within 30 days.

## 9. Cookies

The CraftedSignal website uses only essential cookies for session management. We do not use tracking cookies, analytics scripts, or advertising pixels.

## 10. Third-party services

We use a minimal set of third-party services:

| Service | Purpose | Data shared |
|---------|---------|-------------|
| Payment provider | Billing | Payment information |
| Email provider | Transactional email | Email address |

We do not sell or share your data with third parties for marketing purposes.

## 11. Data transfers

Your data is processed in the EU. If data is transferred outside the EU, we ensure appropriate safeguards (Standard Contractual Clauses or adequacy decisions) are in place.

## 12. Children

The Service is not intended for use by individuals under 16. We do not knowingly collect data from children.

## 13. Changes to this policy

We may update this policy from time to time. Material changes will be communicated via the Service or email at least 30 days in advance. The effective date at the top of this page indicates the latest revision.

## 14. Contact

Questions about this policy? Contact our data protection team at [privacy@craftedsignal.io](mailto:privacy@craftedsignal.io).

Data Protection Officer: [dpo@craftedsignal.io](mailto:dpo@craftedsignal.io)
