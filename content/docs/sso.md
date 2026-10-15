---
title: "Single Sign-On (SSO)"
description: "Configure OpenID Connect single sign-on for CraftedSignal, including Microsoft Entra ID registration, user assignments, admin consent, and testing."
weight: 9
section: "Administration"
aliases:
  - /docs/oidc-sso/
---

## Overview

CraftedSignal supports OpenID Connect (OIDC) single sign-on. Configure your identity provider, save its credentials in CraftedSignal, then test the login before enforcing SSO.

**Using Microsoft Entra ID?** Follow the numbered [Entra ID setup](#microsoft-entra-id) below. The generic OIDC steps are for other providers.

## Before you start

You need:

- Admin access in CraftedSignal.
- Permission to register applications, assign users, and grant admin consent in your identity provider. For Entra ID, use an Application Administrator or Cloud Application Administrator, or involve your tenant administrator.
- An identity-provider account whose email matches your CraftedSignal admin account, for the first SSO test.
- Access to manage DNS for your login domains if you want to auto-provision users in CraftedSignal Cloud.

The hosted callback (redirect) URL is:

```text
https://app.craftedsignal.io/auth/oidc/callback
```

Use **`app.craftedsignal.io`**, not `craftedsignal.io`. You can copy the deployment-specific **Callback URL** from **Settings > Integrations > Single Sign-On (SSO)**.

For self-hosted or on-prem deployments, use your own browser-visible HTTPS host. CraftedSignal builds the callback URL from `http.public_url`:

```yaml
http:
  public_url: "https://craftedsignal.example.com"
```

If you explicitly configure `http.trusted_origins`, include the same public origin.

## Microsoft Entra ID

### 1. Register the application

1. Open the Microsoft Entra admin center.
2. Go to **Entra ID > App registrations > New registration**.
3. Name the application **CraftedSignal**.
4. Select **Accounts in this organizational directory only** for a single-tenant setup.
5. Under **Redirect URI**, select **Web** and enter `https://app.craftedsignal.io/auth/oidc/callback`, or your self-hosted callback URL.
6. Select **Register**.
7. On the application's **Overview** page, copy the **Application (client) ID** and **Directory (tenant) ID**. You will use both in step 5.

Use the Authorization Code flow. You do not need to enable implicit grant or register a separate enterprise application manually.

### 2. Create a client secret and renewal reminder

1. In the app registration, go to **Certificates & secrets > Client secrets > New client secret**.
2. Enter a recognizable description, such as `CraftedSignal SSO`.
3. Set **Expires** to **24 months (2 years)**, unless your organization's security policy requires a shorter lifetime.
4. Select **Add**, then copy the secret's **Value** immediately. Entra will not show it again. Use the value, **not the Secret ID**, in CraftedSignal.
5. Create a renewal reminder for the app registration secret before it expires, for example **30 days before expiry**. Include the application name, tenant, owner, and renewal date; do not put the secret itself in the reminder.

When renewing, create a new secret, update the **Client Secret** in CraftedSignal, save, and test SSO before removing the old secret. CraftedSignal stores the secret encrypted.

### 3. Configure sign-in permissions

1. In the app registration, open **API permissions**.
2. Select **Add a permission > Microsoft Graph > Delegated permissions**.
3. Make sure **openid**, **email**, and **profile** are added. These are the OIDC scopes used for sign-in; do not select application permissions for this setup.

Admin consent is required when user assignment is required. You can grant it now or complete it during the first test in step 6.

### 4. Require assignment and assign users

1. Go to **Entra ID > Enterprise applications > All applications** and open **CraftedSignal**. Match its **Application ID** to the client ID from step 1 if several apps have the same name.
2. Open **Properties**, set **Assignment required?** to **Yes**, then select **Save**.
3. Open **Users and groups > Add user/group**.
4. Select the users or groups that should be allowed to log in, including the admin who will run the first SSO test, then select **Assign**. Use **Default Access** if prompted for a role and no custom app roles exist.

Group-based assignment requires Microsoft Entra ID P1 or P2 and does not include nested groups. If group assignment is unavailable, assign users individually.

Entra assignment controls access to the application; it does not create a CraftedSignal account or grant a CraftedSignal admin role. Account creation is covered in step 7.

### 5. Save the configuration in CraftedSignal

Open **Settings > Integrations > Single Sign-On (SSO)** and enter:

| CraftedSignal field | Value |
|---------------------|-------|
| Issuer URL | `https://login.microsoftonline.com/<tenant-id>/v2.0`, replacing `<tenant-id>` with the **Directory (tenant) ID** from step 1. |
| Client ID | The **Application (client) ID** from step 1. |
| Client Secret | The secret **Value** from step 2. |
| Enforce SSO | Leave **off** until the first login succeeds. |
| Auto-provision | Leave **off** for the initial admin test. Configure user onboarding in step 7. |
| Default Role | Use **Viewer** for auto-provisioned users unless they need more access. |

Select **Save SSO Settings**. Saving alone does not enable a new SSO configuration.

Use the issuer URL above, not the `/.well-known/openid-configuration` metadata URL. The **Test** button next to the issuer checks discovery; it does not test a complete user login.

### 6. Test login and grant admin consent

1. While signed in to CraftedSignal as the admin from the prerequisites, select **Test & Enable SSO**.
2. Sign in to Entra with the account whose email matches that CraftedSignal admin account.
3. For a **new app without admin consent**, expect an administrator-consent or **Need admin approval** prompt. Because **Assignment required?** is **Yes**, ordinary users cannot consent on their own.
4. Have an Entra administrator open **Enterprise applications > CraftedSignal > Security > Permissions**, review the requested permissions, and select **Grant admin consent**. If the administrator is completing the consent prompt directly, they can approve on behalf of the organization there instead.
5. If the test was interrupted for approval, return to CraftedSignal and select **Test & Enable SSO** again.
6. Confirm the test succeeds and SSO is enabled. A successful test enables SSO automatically.

Do not use a different Entra account for the test: the returned email must match the currently signed-in CraftedSignal admin. Keep **Enforce SSO** off while resolving any failures.

### 7. Set up user onboarding, then enforce SSO

Choose how users get their CraftedSignal accounts:

- **Manage accounts yourself:** leave **Auto-provision** off and add users in CraftedSignal before they sign in. Also assign them to the Entra enterprise application.
- **Create accounts on first login:** add and verify their email domains as described below, enable **Auto-provision**, choose a **Default Role**, and save. Only users allowed by Entra assignment can complete sign-in.

To add a domain, use **Email domains > Add domain** in the SSO settings. Enter only the domain, such as `example.com`, without `@`. Add each domain separately. If a DNS verification record is shown, publish the displayed TXT record, then select **Verify** after DNS has propagated. Confirm the domain shows **Verified**.

Verified domains route people without an existing account to your organization's SSO and allow auto-provisioning. Existing users added to your organization can use SSO regardless of their email domain.

Test a normal user's login from the CraftedSignal login page in a separate browser session. Once both the admin and user logins work, enable **Enforce SSO** and save if you want to block password login for SSO users. Keep a tested admin recovery path during rollout.

### Optional: add an Entra portal tile

Copy the **IdP-Initiated SSO URL** from CraftedSignal's SSO settings and use it as the enterprise application's home or launch URL:

```text
https://app.craftedsignal.io/auth/oidc/launch/<launch-id>
```

Use the complete displayed URL; do not invent a launch ID. For self-hosted deployments, the URL uses your own public host.

## Other OIDC providers

1. Create a confidential **web application** in your identity provider using the **Authorization Code** flow, not implicit grant.
2. Add the **Callback URL** shown in CraftedSignal as an allowed redirect URI.
3. Allow the `openid`, `email`, and `profile` scopes and create a client secret. Set a renewal reminder before expiry.
4. In **Settings > Integrations > Single Sign-On (SSO)**, enter the issuer URL, client ID, and secret. Leave **Enforce SSO** off and select **Save SSO Settings**.
5. Select **Test & Enable SSO** and authenticate with an identity whose email matches your current CraftedSignal admin account. Complete any provider consent or assignment requirements.
6. Add users manually, or verify their email domains and enable **Auto-provision** with a suitable **Default Role**.
7. Test a normal user's login before enabling **Enforce SSO**.

## Troubleshooting

| Symptom | What to check |
|---------|---------------|
| `OIDC discovery failed` | Use the tenant-specific issuer `https://login.microsoftonline.com/<tenant-id>/v2.0`. It must be reachable over HTTPS. Do not paste the metadata URL into **Issuer URL**. |
| `redirect_uri` mismatch | The registered **Web** redirect URI must exactly match the displayed **Callback URL**, including scheme, host, and path. The hosted URL is `https://app.craftedsignal.io/auth/oidc/callback`. |
| **Need admin approval** or consent required | An Entra administrator must review and grant consent under **Enterprise applications > CraftedSignal > Security > Permissions**, then retry the SSO test. |
| User is not assigned to the application | Assign the user under **Enterprise applications > CraftedSignal > Users and groups**. For groups, check direct membership and licensing. |
| SSO test fails after Entra sign-in | Use an assigned Entra account with the same email as the currently signed-in CraftedSignal admin. |
| A new user is not routed to SSO or cannot get an account | Verify their domain in CraftedSignal and enable **Auto-provision**, or add the user manually. Entra assignment alone does not create a CraftedSignal account. |
| Email missing from token | In the app registration, use **Token configuration > Add optional claim > ID > email** and check the user's email attributes in Entra. |
| Login fails after secret expiry or rotation | Enter the current secret **Value**, not its ID, in CraftedSignal, save, and test. Leave **Client Secret** blank on later edits when you are not rotating it. |

## Microsoft references

- [Configure OIDC SSO for custom applications](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/add-application-portal-setup-oidc-sso#configure-oidc-sso-for-custom-non-gallery-applications)
- [Manage application user and group assignments](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/assign-user-or-group-access-portal)
- [Grant tenant-wide admin consent](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/grant-admin-consent)
- [Troubleshoot consent issues](https://learn.microsoft.com/en-us/troubleshoot/entra/entra-id/app-integration/troubleshoot-consent-issues)
