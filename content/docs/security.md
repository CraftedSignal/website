---
title: "Security & Compliance"
description: "Data boundaries, audit logs, encryption, SSO, and compliance posture (SOC2, NIS2, GDPR)."
weight: 13
section: "Security"
---

## Overview

CraftedSignal is a **control plane** — it manages rules, tests, approvals, and metadata. It does not ingest, store, or process your log data or telemetry. Your data stays in your SIEM.

---

## Data boundaries

| Data type | Where it lives |
|-----------|---------------|
| Log data / telemetry | Your SIEM (never leaves) |
| Detection rules & tests | CraftedSignal |
| Approval decisions | CraftedSignal |
| Audit logs | CraftedSignal (exportable) |
| User credentials | CraftedSignal (salted and hashed with Argon2id) |
| SIEM credentials | CraftedSignal (encrypted at rest with AES-256) |
| Health metrics | CraftedSignal (derived from SIEM APIs, not raw logs) |

Agents that connect to your SIEM are **outbound-only** — they initiate connections from your network to your SIEM. No inbound ports required.

---

## Encryption

- **At rest**: All credentials and sensitive data encrypted with AES-256
- **In transit**: TLS 1.2+ for all connections
- **Per-company encryption keys**: Each company's SIEM credentials are wrapped with a dedicated encryption key derived from the master secret via HKDF-SHA256. One company's key cannot decrypt another company's credentials

---

## Audit logging

Every action is logged in an immutable audit trail:

- Rule created, edited, deleted
- Tests run and results
- Deployments and rollbacks
- Approvals and rejections
- User login/logout
- Settings changes
- AI interactions

Audit logs are tamper-evident and can be exported to your SIEM or GRC system from **Settings > Audit Logs**.

---

## Identity & access

- **SSO**: OIDC providers (Okta, Azure AD, Google Workspace, etc.)
- **MFA**: Passkeys (WebAuthn/FIDO2) or IdP-managed MFA
- **RBAC**: Admin, User, Viewer roles with separation of duties

See [Roles & Permissions](/docs/roles-permissions/) for the full permission matrix.

---

## How CraftedSignal is secured

### Application security

- **CSRF protection** — all form submissions are protected using `Sec-Fetch-Site` header validation with configurable trusted origins
- **Rate limiting** — API and authentication endpoints are rate-limited per client IP. Trusted proxy configuration ensures correct IP extraction behind load balancers
- **Input validation** — all API inputs are validated server-side. Rule queries are parsed and validated for syntax before storage
- **Session management** — sessions use PASETO v2 tokens with encryption keys derived from the master secret via HKDF-SHA256. Sessions are server-side and revocable
- **Password storage** — user passwords are salted and hashed with Argon2id (3 iterations, 64 MB memory, 4 threads)
- **Credential encryption** — SIEM credentials, OIDC secrets, and webhook URLs are encrypted at rest with AES-256. Encryption keys are derived from your master secret, never stored directly
- **Content Security Policy** — strict CSP headers restrict script sources, frame embedding, and resource loading

### Secure detection workflows

CraftedSignal enforces security at every stage of the detection lifecycle — validation, testing, approval, deployment, and rollback. See [Secure Detection Workflows](/docs/secure-workflows/) for the full model.

---

## Supply chain security

- **Signed artifacts**: CLI binaries and Docker images are signed
- **SBOM**: Software Bill of Materials published with each release
- **Dependency scanning**: Automated vulnerability scanning in CI
- **Rule attestation**: Rules from the TI feed include provenance and attestation metadata

---

## Compliance

### SOC 2 Type II

CraftedSignal is designed with SOC 2 controls built in:

- Change management (approval workflows, separation of duties)
- Access control (RBAC, SSO, MFA, audit logging)
- Monitoring (health dashboards, alerting, drift detection)

### NIS2

For organizations subject to NIS2:

- Detection governance framework with evidence generation
- Incident response support through detection audit trails
- Configurable retention and reporting for regulatory requirements

### GDPR

CraftedSignal processes rules and metadata (as a data processor). No customer PII or log data is ingested.

- Data minimization by design
- Purpose limitation (detection management only)
- Right to erasure supported
- Data residency options (EU, US)
- DPIA and RoPA templates available

---

## Self-hosted deployment

For maximum control, deploy CraftedSignal on your own infrastructure:

- Single binary, no external dependencies (SQLite + embedded Temporal)
- AI via local Ollama instance — no data leaves your network
- All the same features as SaaS
- You manage upgrades, backups, and availability

