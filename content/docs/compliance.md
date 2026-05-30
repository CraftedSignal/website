---
title: "Compliance"
description: "How CraftedSignal helps you meet NIS2, DORA, GDPR, and SOC 2 obligations, and how the platform itself is built for SOC 2 and the EU Cyber Resilience Act."
weight: 14
section: "Information"
---

CraftedSignal supports compliance in two directions: it gives you the governance and evidence to meet the regulations you are subject to, and the product itself is built and operated to recognized security standards.

---

## How CraftedSignal helps your compliance

### NIS2

For organizations subject to NIS2:

- Detection governance framework with evidence generation
- Incident response support through detection audit trails
- Configurable retention and reporting for regulatory requirements

### DORA

For financial entities and their ICT providers subject to DORA:

- ICT change and incident audit trails for operational-resilience reporting
- Detection testing and validation evidence, with positive and negative test cases
- Exportable records to support the ICT third-party risk register and audits

### GDPR

CraftedSignal processes rules and metadata (as a data processor). No customer PII or log data is ingested.

- Data minimization by design
- Purpose limitation (detection management only)
- Right to erasure supported
- Data residency options (EU, US)
- DPIA and RoPA templates available

### SOC 2

Change management, access control, and monitoring controls are enforced by the platform, with immutable audit logging and separation of duties. These map to the SOC 2 trust criteria your own auditors assess.

---

## How we meet it ourselves

### SOC 2 Type II

CraftedSignal is designed with SOC 2 controls built in:

- Change management (approval workflows, separation of duties)
- Access control (RBAC, SSO, MFA, audit logging)
- Monitoring (health dashboards, alerting, drift detection)

### EU Cyber Resilience Act (CRA)

The self-hosted and air-gapped builds are products with digital elements placed on the EU market, so the CRA applies to them. Several CRA building blocks are already in place:

- Software Bill of Materials (SBOM) published with each release
- Signed CLI binaries and Docker images
- Automated dependency vulnerability scanning in CI
- Secure defaults: optional AI, outbound-only agents, no inbound ports

The remaining secure-by-design, vulnerability-handling, and conformity-assessment obligations are being addressed ahead of the regulation's deadlines: vulnerability and incident reporting from September 2026, and full obligations including CE marking from December 2027.

See [Supply chain security](/docs/security/#supply-chain-security) for the underlying controls.

---

## Deployment and data residency

- Self-hosted, regional SaaS, or air-gapped deployment
- EU and US data residency options
- No customer logs or telemetry ingested; your data stays in your SIEM

See [Security](/docs/security/) for the full architecture and [Deployment](/docs/deployment/) for options.
