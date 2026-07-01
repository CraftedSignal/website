---
title: "Platform Operations"
description: "Run CraftedSignal as SaaS, self-hosted, or air-gapped with multi-tenant controls, APIs, CLI, SSO, and local AI."
weight: 60
stage: "06"
eyebrow: "Operate"
nav_summary: "Deploy the control plane where your SOC needs it."
hero_image: "/screenshots/rule-editor.png"
hero_alt: "CraftedSignal rule editor showing multi-platform detection logic"
quick_points:
  - "SaaS, single-binary self-hosted, worker split, and air-gapped deployment options."
  - "Multi-tenant and white-label controls for MSSP and regulated environments."
  - "REST API, Go SDK, csctl, SSO, passkey MFA, RBAC, audit logs, and optional local AI."
outcomes:
  - label: "Deployment"
    title: "Start SaaS, move later"
    body: "The same product model supports hosted use, self-hosting, and isolated environments."
  - label: "Scale"
    title: "Tenant-aware operations"
    body: "MSSPs can separate customer data, branding, feature toggles, and approval policy."
  - label: "Control"
    title: "AI stays governed"
    body: "AI assists generation, triage, and refinement, but humans approve and local models are supported."
docs:
  - title: "Deployment Guide"
    url: "/docs/deployment/"
    description: "Supported platforms, deployment state, rollback, and operational behavior."
  - title: "Air-gapped Mode"
    url: "/docs/airgapped/"
    description: "Outbound restrictions, private address rules, and isolated operation."
  - title: "AI Assistance"
    url: "/docs/ai/"
    description: "Optional AI with local Ollama support, audit trails, and human approvals."
  - title: "API Reference"
    url: "/docs/api/"
    description: "REST API for CI/CD, automation, dashboards, testing, and deployment."
  - title: "Security"
    url: "/docs/security/"
    description: "Data boundaries, encryption, credentials, audit logs, SSO, and supply chain."
  - title: "Roles & Permissions"
    url: "/docs/roles-permissions/"
    description: "RBAC, separation of duties, instance claiming, SSO, and passkey MFA."
---

## The problem

Detection engineering has to run in very different environments. Some teams want SaaS because they need speed. Some need self-hosting because their SIEMs, credentials, or policies require it. Some regulated customers need air-gapped operation. MSSPs need multiple tenants, customer-specific toggles, and sometimes white-label surfaces.

If the deployment model is too rigid, the detection program bends around the tool. CraftedSignal is designed so the operating model stays the same while the hosting model changes.

## Deployment models

SaaS is the fastest path: create a tenant, connect SIEMs, import rules, and start testing. Self-hosted deployments use a single binary with configuration, migrations, and local storage options. Larger environments can split server and worker roles so background jobs scale separately.

Air-gapped mode blocks outbound network access except private and loopback targets. That lets the platform reach internal SIEMs, internal mail, internal model endpoints, or an internal feed mirror without unexpected internet dials.

## Multi-tenant and white-label operation

MSSP and MDR teams can keep customer data separated by tenant. Feature toggles can differ by customer: AI on for one, off for another; threat feed enabled for one, mirrored manually for another; different approval policy by severity or customer contract.

White-label branding supports customer-facing surfaces without changing the underlying workflow. The important part is that rules, risks, hunts, approvals, and audit trails stay tenant-scoped.

## APIs, CLI, SDK, and automation

CraftedSignal exposes a web UI for operators, `csctl` for detections-as-code workflows, a REST API for automation, and a Go SDK for deeper integration. Teams can wire validation into CI, sync rules to Git, build reporting, or connect existing ticket and workflow systems.

## AI on your terms

AI can generate, refine, translate, and triage detection content, but it does not auto-deploy. Suggestions are reviewable and audit-logged. For privacy-sensitive deployments, local model support through Ollama keeps customer data inside your infrastructure, and AI can be disabled entirely when policy requires it.
