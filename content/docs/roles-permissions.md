---
title: "Roles & Permissions"
description: "RBAC model with separation of duties — Admin, User, and Viewer roles."
weight: 10
section: "Administration"
---

## Overview

CraftedSignal uses role-based access control (RBAC) to enforce separation of duties. Every user has exactly one role.

---

## Instance claiming (self-hosted)

When you deploy a self-hosted CraftedSignal instance, the first user to register **claims the instance**. This user becomes the Admin and a workspace is created automatically.

After claiming, registration is permanently locked — no one else can sign up. All additional users must be invited by the Admin. This prevents unauthorized access to your on-prem instance.

The claiming flow:

1. Deploy CraftedSignal with your license key
2. Open the web UI and register with your email and company name
3. You become the Admin of the newly created workspace
4. Registration closes — invite your team from **Settings > Users**

On SaaS, registration stays open and each signup creates a new workspace.

---

## Role hierarchy

| Role | Description |
|------|-------------|
| **Admin** | User management, SSO/OIDC configuration, audit logs, company settings. |
| **User** | Create, edit, test, and deploy rules. Full write access to detection content. |
| **Viewer** | Read-only access to dashboards, rules, tests, and deployments. |

---

## Permission matrix

| Action | Admin | User | Viewer |
|--------|-------|------|--------|
| View dashboards & rules | Yes | Yes | Yes |
| Create / edit rules | Yes | Yes | No |
| Run tests | Yes | Yes | No |
| Deploy rules | Yes | Yes | No |
| Approve deployments | Yes | Yes | If added as approver |
| Manage API keys | Yes | No | No |
| View audit logs | Yes | No | No |
| Manage users | Yes | No | No |
| Configure SSO/OIDC | Yes | No | No |
| Company settings | Yes | No | No |

---

## Separation of duties

CraftedSignal enforces that the author of a rule cannot approve their own deployment. This is enforced at the platform level — not a convention, a hard constraint.

Typical workflow:
1. **User** authors a rule and submits for review
2. A different **User** or **Admin** reviews and approves
3. The rule deploys to the SIEM

---

## Default role

New users are assigned the **User** role by default. Admins can change roles at any time.

---

## SSO & authentication

CraftedSignal supports:

- **SSO**: OIDC providers (Okta, Azure AD, Google Workspace, etc.)
- **Passkey MFA**: WebAuthn/FIDO2 passkeys for passwordless authentication
- **IdP-managed MFA**: Enforce MFA through your identity provider

Configure SSO in **Settings > Authentication** in the web UI.

---

## Registration control

After initial setup, disable open registration to restrict access. New users must then be invited by an Admin.
