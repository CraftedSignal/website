---
title: "Security"
description: "CraftedSignal security architecture: data boundaries, AES-256 encryption with per-tenant keys, hardened GCP infrastructure, audit logging, SSO/MFA and supply-chain security."
weight: 13
section: "Security"
---

## Overview

CraftedSignal is a **control plane** — it manages rules, tests, approvals, evidence, health metrics and metadata. It queries connected SIEMs to validate detections and compute statistics, but it does not ingest or persist raw log streams as a data lake. Raw telemetry storage stays in your SIEM.

---

## Data boundaries

| Data type | Where it lives |
|-----------|---------------|
| Raw log data / telemetry streams | Your SIEM |
| SIEM query execution | Your SIEM APIs via outbound-only agents |
| Derived SIEM results and statistics | CraftedSignal (counts, verdicts, timings, health metrics and evidence) |
| Detection rules & tests | CraftedSignal |
| Approval decisions | CraftedSignal |
| Audit logs | CraftedSignal (exportable) |
| User credentials | CraftedSignal (salted and hashed with Argon2id) |
| SIEM credentials | CraftedSignal (AES-256-GCM, per-company keys) |

Agents that connect to your SIEM are **outbound-only** — they initiate connections from your network to your SIEM, run configured SIEM operations and queries, and return only the outputs needed for testing, health checks and evidence. No inbound ports required.

---

## Encryption

- **At rest**: All credentials and sensitive data encrypted with AES-256-GCM
- **In transit**: TLS 1.2+ for all connections

### Per-company encryption keys

SIEM credentials are encrypted with **per-company (tenant) keys**, not the master secret directly. This ensures one company's key cannot decrypt another company's credentials.

**Key hierarchy:**

1. **Master secret** — configured in your deployment (`master_secret` in config). Never used directly for data encryption.
2. **Master credential key** — derived from the master secret via HKDF-SHA256 with purpose `"credentials"`. Used only to wrap/unwrap tenant keys.
3. **Tenant key** — a random 256-bit AES key, unique per company. Stored encrypted (wrapped) in the database using the master credential key. Used to encrypt and decrypt that company's SIEM credentials.

```
master_secret
  └─ HKDF-SHA256 ("credentials") ──► master credential key
                                        └─ AES-256-GCM wrap ──► tenant key (per company)
                                                                   └─ AES-256-GCM ──► SIEM credentials
```

**How it works:**

- When a company first connects a SIEM, a random tenant key is generated and stored (wrapped) alongside the company record
- On encrypt/decrypt, the tenant key is unwrapped in memory, used and discarded
- Each encryption operation uses a unique random salt and nonce (PBKDF2 key derivation + AES-256-GCM)
- If a company doesn't yet have a tenant key (e.g. after upgrading from an older version), one is generated lazily on first credential access

**Tenant isolation guarantees:**

- Compromising one company's wrapped key is useless without the master credential key
- The master credential key is derived in memory and never persisted
- Database access alone cannot decrypt any credentials
- Rotating the master secret re-derives the master credential key — a migration path is provided to re-wrap all tenant keys

---

## SaaS infrastructure controls

CraftedSignal's managed GCP deployment is built as a private application substrate, not a broad public data plane:

- **Private runtime** — GKE nodes use private networking and Cloud SQL has no public IPv4 endpoint.
- **CMEK by default** — Cloud SQL, GKE secrets, Secret Manager, Artifact Registry and storage encryption are configured with Cloud KMS keys.
- **Brokered application KEK** — GCP deployments include a dedicated `platform-kek` for wrapping tenant data-encryption keys. The key-broker identity receives KEK access by default; direct runtime service account access is opt-in.
- **Signed and attested images** — production workloads deploy by digest. Binary Authorization can require KMS-backed attestations before GKE admits an image.
- **Manual release gates** — current production deploys run through manually triggered GitHub Actions workflows with environment approval, image digest pinning and attestation creation before rollout.
- **Customer-key path** — sovereign GCP deployments can use Confidential Space Workload Identity Federation so customer-owned KMS keys trust only stable attested workloads.
- **Independent assurance** — third-party penetration testing and major-change security reviews are part of the security program, with findings tracked through remediation.

---

## Cloud sovereignty

Teams with sovereignty requirements can choose the operating model that matches their risk boundary:

- **Secured SaaS** — use the managed CraftedSignal service with private GCP networking, regional KMS/CMEK, signed releases, Binary Authorization attestations and audit evidence.
- **Customer-controlled keys** — keep the key hierarchy under customer governance. Application-level encryption uses tenant data-encryption keys wrapped by a platform KEK, and sovereign GCP deployments can bind key access to Confidential Space attestation.
- **Encrypted memory options** — for supported GCP deployments, Confidential Computing options such as Confidential GKE Nodes or Confidential VM/Confidential Space can encrypt workload memory while data is in use.
- **Private deployment** — run CraftedSignal on-premises or in a private cloud when policy requires customer-owned infrastructure, private network boundaries or fully isolated operation.

The practical result is that customers do not have to move raw logs into CraftedSignal to get detection governance. They can keep telemetry storage in their SIEM, keep key control aligned to internal policy, and choose SaaS, self-hosted, private-cloud or air-gapped deployment.

See [Cloud Sovereignty](/docs/cloud-sovereignty/) for the detailed operating models, customer KMS path, Confidential Space boundary and air-gapped architecture.

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

- **SSO**: OIDC providers (Okta, Microsoft Entra ID, Google Workspace, etc.). See [Single-Sign On (SSO)](/docs/oidc-sso/) for setup steps.
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
- **Credential encryption** — SIEM credentials are encrypted at rest with AES-256-GCM using [per-company encryption keys](#per-company-encryption-keys). OIDC secrets and webhook URLs are encrypted with keys derived from the master secret
- **Content Security Policy** — strict CSP headers restrict script sources, frame embedding and resource loading

### Secure detection workflows

CraftedSignal enforces security at every stage of the detection lifecycle — validation, testing, approval, deployment and rollback. See [Secure Detection Workflows](/docs/secure-workflows/) for the full model.

---

## Supply chain security

- **Signed artifacts**: CLI binaries and Docker images are signed
- **Digest-pinned deploys**: Kubernetes releases use immutable image digests, not mutable tags
- **Binary Authorization**: GCP deployments can block images without a trusted KMS-backed attestation
- **SBOM**: Software Bill of Materials published with each release
- **Dependency scanning**: Automated vulnerability scanning in CI
- **Independent penetration testing**: third-party penetration testing and major-change security reviews are tracked through remediation
- **Rule attestation**: Rules from the TI feed include provenance and attestation metadata

---

## Compliance

CraftedSignal helps teams produce detection governance evidence for NIS2, DORA, GDPR and internal audit workflows. See the [Trust](/trust/) page for the full breakdown.

---

## Self-hosted deployment

For maximum control, deploy CraftedSignal on your own infrastructure:

- Single binary, no external dependencies (SQLite + embedded Temporal)
- AI via local Ollama instance — no data leaves your network
- All the same features as SaaS
- You manage upgrades, backups and availability
