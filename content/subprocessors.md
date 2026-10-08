---
title: "Subprocessors"
description: "Third-party subprocessors used for Crafted Signal hosted services and public website operations."
layout: "legal"
---

**Last updated:** October 8, 2026

This page lists the third-party processors and subprocessors that may process personal data for the Crafted Signal hosted service, public website, notifications, security operations, and support operations. It is the public subprocessor overview referenced by the [Free License Data Processing Terms](/terms/#free-license-data-processing-terms).

Customer-controlled SIEMs, identity providers, webhook destinations, or other integrations configured by a customer are governed by the customer's own relationship with those third parties and are not listed here as Crafted Signal subprocessors.

| Subprocessor | Purpose | Personal data that may be processed | Location / notes |
| --- | --- | --- | --- |
| Google Cloud / Google Workspace | Hosted application infrastructure, Cloud SQL database, Kubernetes hosting, storage, backups, encryption key management, secrets management, logging, monitoring, abuse prevention, reCAPTCHA Enterprise, Gemini / Vertex AI processing where AI features are enabled, and transactional email through Gmail API. | Account data, authentication metadata, audit and activity metadata, Your Content, derived SIEM evidence, technical logs, IP addresses, email addresses, email content and metadata, and AI prompts/responses when AI features are used. | Primary hosted infrastructure is in the EU. Google may process data globally for support, security, and service operations under its data processing terms. |
| GitHub | Source control, CI/CD, release automation, and public website hosting. | Public website visitor technical metadata, build/deployment metadata, and issue or support content submitted through GitHub-managed channels. Crafted Signal customer content is not intentionally stored in GitHub. | GitHub-hosted services may process data globally. |
| Anthropic / Claude | AI-assisted code review, development, and security review workflows. | Source code, pull request metadata, issue or support content, operational context, and limited personal data included in those materials. Crafted Signal customer content is not intentionally sent to Anthropic. | Used for development and review operations, not as the hosted application's primary AI provider. |
| 1Password | Internal credential and secrets management. | Business contact details, user/account metadata, credentials, secure notes, and operational secrets stored by Crafted Signal personnel. Crafted Signal customer content is not intentionally stored in 1Password. | Used for internal operations and access management. |
| Cloudflare | DNS management and domain security configuration for Crafted Signal domains. | DNS query metadata, domain administration metadata, and limited technical metadata related to requests for Crafted Signal domains. Cloudflare is not configured as a reverse proxy for the hosted application record. | Cloudflare may process data globally for DNS and security operations. |
| Slack Technologies / Salesforce | Internal operational alerts and incident response collaboration. | Alert metadata, service health information, limited log excerpts, and contact details where needed for support or incident handling. | Used for internal operations. Customer content is not intentionally sent to Slack, but operational alerts may contain limited contextual metadata. |

## Conditional or Customer-Selected Providers

Some deployment types or customer-selected integrations may use additional processors. For example, self-hosted or private-cloud deployments may be configured to use a customer-selected SMTP relay, AWS SES, Mailgun, OpenAI-compatible AI endpoint, SIEM, identity provider, or notification destination. Those providers are not subprocessors for the hosted Free License unless Crafted Signal engages them for the hosted service.

## Change Notice

We will post intended additions or replacements on this page at least fifteen (15) days before engagement where required by the Free License Data Processing Terms.
