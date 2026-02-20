---
title: "Configuration"
description: "Complete YAML configuration reference for CraftedSignal covering HTTP, storage, security, Temporal, AI, email, logging, and production hardening options."
weight: 2
section: "Getting Started"
---

## Overview

CraftedSignal uses a YAML configuration file with environment variable overrides. Pass the config file path when starting the server:

```bash
./craftedsignal -config config.yaml
```

**Priority order** (highest wins):

1. Command-line flags (`-log`, `-config`, `-mode`)
2. Environment variables
3. YAML config file
4. Default values

Environment variables use uppercase names with underscores. List values (like `trusted_origins`) are comma-separated when set via environment variables.

---

## Basic on-prem config

A minimal config to get a self-hosted instance running:

```yaml
# config.yaml — minimal on-prem setup

http:
  port: 8080
  interface: "0.0.0.0"

storage:
  driver: sqlite
  properties:
    path: /data/craftedsignal.db

security:
  master_secret: "a-hexadecimal-representation-of-32-random-bytes"

temporal:
  embedded: true
```

Generate the master secret:

```bash
openssl rand -hex 32
```

Start the server:

```bash
./craftedsignal -config config.yaml
```

Open `http://localhost:8080` and register — the first user claims the instance and becomes the Admin. Registration locks automatically after claiming.

---

## Production config

A hardened config for production deployments with AI, email, TLS, and SSO-ready settings:

```yaml
# config.yaml — production

http:
  port: 8080
  interface: "0.0.0.0"
  trusted_origins:
    - "craftedsignal.internal"

storage:
  driver: postgres
  properties:
    host: "db.internal"
    port: "5432"
    user: "craftedsignal"
    password: "${DB_PASSWORD}"
    dbname: "craftedsignal"
    sslmode: "require"

security:
  master_secret: "${MASTER_SECRET}"
  trusted_proxies:
    - "10.0.0.0/8"

auth:
  disable_registration: true
  require_email_verification: true

temporal:
  embedded: true
  max_concurrent: 20

webauthn:
  rp_id: "craftedsignal.internal"
  rp_display_name: "CraftedSignal"
  rp_origin: "https://craftedsignal.internal"

email:
  host: "smtp.example.com"
  port: 587
  username: "notifications@example.com"
  password: "${EMAIL_PASSWORD}"
  from: "CraftedSignal <notifications@example.com>"

ai:
  enabled: true
  ollama_url: "http://gpu-server:11434"
  ollama_model: "qwen2.5-coder:14b"
  max_concurrent: 5
  timeout_seconds: 1200

rules:
  max_version_history: 10
  stale_review_days: 30

audit_log:
  retention_days: 365

log:
  level: "INFO"
  format: "json"
  file: "/var/log/craftedsignal/app.log"
  error_file: "/var/log/craftedsignal/error.log"

license_key: "${LICENSE_KEY}"
```

You can also use environment variables for secrets:

```bash
export MASTER_SECRET="your-generated-secret"
export DB_PASSWORD="postgres-password"
export EMAIL_PASSWORD="smtp-password"
export LICENSE_KEY="1.eyJ..."
```

---

## Full reference

### HTTP

Controls the HTTP server that serves the web UI and API.

| Key | Env var | Type | Default | Description |
|-----|---------|------|---------|-------------|
| `http.port` | `HTTP_PORT` | int | `8080` | Port the server listens on |
| `http.interface` | `HTTP_INTERFACE` | string | `localhost` | Network interface to bind. Use `0.0.0.0` to listen on all interfaces |
| `http.trusted_origins` | `HTTP_TRUSTED_ORIGINS` | []string | — | Origins allowed for cross-origin requests |

**Trusted origins** protect against CSRF attacks. The server validates the `Sec-Fetch-Site` header on form submissions and rejects cross-origin requests unless the origin is in this list. API routes (`/api/*`) are exempt because they use token-based authentication instead.

In development, `http://localhost:<port>` is always allowed automatically.

---

### Storage

CraftedSignal supports two database backends. The database stores all application state: rules, test results, audit logs, user accounts, and encrypted credentials.

| Key | Env var | Type | Default | Description |
|-----|---------|------|---------|-------------|
| `storage.driver` | `STORAGE_DRIVER` | string | — | Database driver: `sqlite` or `postgres` |
| `storage.properties` | `STORAGE_PROPERTIES` | map | — | Driver-specific connection settings |

#### SQLite

Good for single-server deployments. No external database to manage. Uses WAL mode for concurrent read/write access.

```yaml
storage:
  driver: sqlite
  properties:
    path: /data/craftedsignal.db
```

#### PostgreSQL

Use PostgreSQL when you need horizontal scaling (separate server and worker processes) or when you already run a managed PostgreSQL instance.

```yaml
storage:
  driver: postgres
  properties:
    host: "db.internal"
    port: "5432"
    user: "craftedsignal"
    password: "secret"
    dbname: "craftedsignal"
    sslmode: "require"           # default: require
    max_open_conns: "50"         # default: 50
    max_idle_conns: "25"         # default: 25
```

You can also pass the full DSN instead:

```yaml
storage:
  driver: postgres
  properties:
    dsn: "postgres://user:pass@host:5432/dbname?sslmode=require"
```

---

### Security

The `master_secret` is the most critical configuration value. It is used to derive multiple cryptographic keys via HKDF-SHA256 with context-specific labels:

- **Session encryption** — PASETO tokens for browser sessions
- **CSRF protection** — anti-forgery tokens
- **Credential encryption** — derives a master credential key that wraps per-company tenant keys. Each company's SIEM credentials are encrypted with their own AES-256-GCM key. See [Security > Per-company encryption keys](/docs/security/#per-company-encryption-keys)
- **Settings encryption** — sensitive platform settings

If you lose or change the master secret, all encrypted data (SIEM credentials, SSO config) becomes unreadable and must be re-entered. Back it up securely.

| Key | Env var | Type | Default | Description |
|-----|---------|------|---------|-------------|
| `security.master_secret` | `MASTER_SECRET` | string | — | **Required.** Base key for all derived encryption keys. Generate with `openssl rand -hex 32` |
| `security.tls_cert_path` | `SECURITY_TLS_CERT_PATH` | string | — | Path to TLS certificate file (PEM) |
| `security.tls_key_path` | `SECURITY_TLS_KEY_PATH` | string | — | Path to TLS private key file (PEM) |
| `security.tls_skip_verify` | `SECURITY_TLS_SKIP_VERIFY` | bool | `false` | Skip TLS certificate verification on outbound connections to SIEMs |
| `security.trusted_proxies` | `SECURITY_TRUSTED_PROXIES` | []string | — | CIDR ranges of trusted reverse proxies |

#### TLS

You have two options for HTTPS:

**Option 1 — Reverse proxy (recommended).** Run CraftedSignal on plain HTTP behind nginx, Caddy, or a cloud load balancer that handles TLS termination. This is the standard approach and gives you automatic certificate renewal (e.g., via Caddy or Let's Encrypt).

**Option 2 — Built-in TLS.** Set `tls_cert_path` and `tls_key_path` to serve HTTPS directly. CraftedSignal enforces TLS 1.2+ with TLS 1.3 support. Use this only if you cannot run a reverse proxy.

The `tls_skip_verify` flag only affects **outbound** connections to your SIEMs — useful in lab environments with self-signed certificates. It does not affect inbound TLS.

#### Trusted proxies

When CraftedSignal runs behind a reverse proxy, it needs to know which IPs are proxies to correctly extract the real client IP from `X-Forwarded-For` headers. This affects:

- **Rate limiting** — without trusted proxies configured, all requests appear to come from the proxy IP
- **Audit logging** — audit logs record the proxy IP instead of the actual user IP

Only `X-Forwarded-For` and `X-Real-IP` headers from IPs in this list are trusted.

---

### Auth

Controls user registration and email verification.

| Key | Env var | Type | Default | Description |
|-----|---------|------|---------|-------------|
| `auth.disable_registration` | `AUTH_DISABLE_REGISTRATION` | bool | `false` | Block new user registration entirely |
| `auth.require_email_verification` | `AUTH_REQUIRE_EMAIL_VERIFICATION` | bool | `false` | Require email verification before account activation |

On self-hosted instances, the first user to register claims the instance and becomes the Admin. After claiming, registration locks automatically — additional users must be invited by an Admin. The `disable_registration` flag is an additional safeguard that can be set to `true` after initial setup if you want to explicitly block any registration path.

User passwords are salted and hashed with Argon2id (3 iterations, 64 MB memory, 4 threads, 32-byte key, 16-byte salt).

---

### Temporal

CraftedSignal uses [Temporal](https://temporal.io) as its workflow orchestration engine. All background work runs as Temporal workflows — durable, retryable, and observable. This includes:

- **Deployments and rollbacks** — pushing rules to SIEMs, rolling back on failure
- **Testing** — executing positive/negative test cases against live SIEMs
- **SIEM health checks** — periodic connectivity and metrics collection (every 5 minutes)
- **SIEM metrics extraction** — rule performance, trigger counts, false positive ratios (every 30 minutes)
- **SIEM sync** — importing rules from SIEMs into the platform (every 2 hours)
- **AI tasks** — rule generation, analysis, test generation, recommendations (on a separate task queue)
- **Threat feed sync** — checking for and downloading new threat intelligence (configurable interval)
- **Library updates** — syncing detection rule repositories
- **Email delivery** — verification emails, password resets, notification digests
- **Audit log cleanup** — pruning entries beyond the retention period (daily)
- **License monitoring** — checking license expiration (hourly)
- **Reporting snapshots** — MITRE coverage, true-positive rates, alert ratios (hourly)
- **Reconciliation** — comparing deployed rules against database state for drift detection

| Key | Env var | Type | Default | Description |
|-----|---------|------|---------|-------------|
| `temporal.embedded` | `TEMPORAL_EMBEDDED` | bool | `false` | Run Temporal server in-process alongside CraftedSignal |
| `temporal.address` | `TEMPORAL_ADDRESS` | string | `localhost:7233` | Address of external Temporal server (ignored when embedded) |
| `temporal.namespace` | `TEMPORAL_NAMESPACE` | string | `default` | Temporal namespace |
| `temporal.task_queue` | `TEMPORAL_TASK_QUEUE` | string | `craftedsignal` | Name of the main task queue |
| `temporal.max_concurrent` | `TEMPORAL_MAX_CONCURRENT` | int | `10` | Max concurrent background activities on the main worker |

#### Embedded vs. external Temporal

**Embedded mode** (`embedded: true`) runs the Temporal server inside the CraftedSignal process. No additional infrastructure to manage. This is the recommended option for most self-hosted deployments — it keeps the deployment simple (one binary, one process).

**External Temporal** (`embedded: false`) connects to a separately deployed Temporal cluster. Use this when:

- You already run Temporal for other services and want to share the infrastructure
- You need independent scaling of the workflow engine
- You want Temporal's Web UI for workflow visibility and debugging

When using external Temporal, point `temporal.address` at your Temporal frontend service (e.g., `temporal.internal:7233`).

#### Scaling with max_concurrent

The `max_concurrent` setting controls how many background activities can execute simultaneously on a single worker process. Increase this if you have many SIEMs or high deployment volume:

- **10** (default) — sufficient for small teams with 1–3 SIEMs
- **20–30** — medium deployments with multiple SIEMs and active teams
- **50+** — large deployments with many SIEMs, frequent deployments, and heavy AI usage

AI tasks run on a separate task queue (`<task_queue>_ai`) so they don't block deployments or health checks.

---

### WebAuthn (Passkeys)

CraftedSignal supports passwordless authentication via WebAuthn/FIDO2 passkeys. Users can register hardware security keys or platform authenticators (Touch ID, Windows Hello, Face ID) as their primary login method.

| Key | Env var | Type | Default | Description |
|-----|---------|------|---------|-------------|
| `webauthn.rp_id` | `WEBAUTHN_RP_ID` | string | `localhost` | Relying party ID — must match the domain users access CraftedSignal on |
| `webauthn.rp_display_name` | `WEBAUTHN_RP_DISPLAY_NAME` | string | `CraftedSignal` | Name shown in the browser's passkey prompt |
| `webauthn.rp_origin` | `WEBAUTHN_RP_ORIGIN` | string | Auto-derived | Full origin URL (`https://your-domain.com`). Auto-derived from `http.interface` and `http.port` if not set |

The `rp_id` must exactly match the domain in the user's browser. If users access CraftedSignal at `https://craftedsignal.internal`, set `rp_id: "craftedsignal.internal"`. A mismatch causes passkey registration and authentication to fail silently.

---

### Email

SMTP configuration for outbound email. CraftedSignal sends:

- **Email verification** — link sent on registration when `require_email_verification` is enabled
- **Password resets** — link sent from the "Forgot password" flow
- **Notifications** — deployment status, SIEM health changes, test failures, drift detection alerts
- **Digest emails** — daily or weekly summaries of platform activity

Email is optional. Without SMTP configured, email verification cannot be enforced and notifications are limited to Slack webhooks and the in-app notification center.

| Key | Env var | Type | Default | Description |
|-----|---------|------|---------|-------------|
| `email.host` | `EMAIL_HOST` | string | — | SMTP server hostname |
| `email.port` | `EMAIL_PORT` | int | — | SMTP server port (typically 587 for STARTTLS, 465 for SSL) |
| `email.username` | `EMAIL_USERNAME` | string | — | SMTP authentication username |
| `email.password` | `EMAIL_PASSWORD` | string | — | SMTP authentication password |
| `email.from` | `EMAIL_FROM` | string | — | Sender address (e.g., `CraftedSignal <noreply@example.com>`) |

All emails are sent asynchronously via Temporal workflows with automatic retries, so a temporary SMTP outage won't block the application.

---

### AI

CraftedSignal's AI features use LLMs for rule generation, analysis, test case creation, and recommendations. The AI engine connects to any OpenAI-compatible API endpoint — typically a local [Ollama](https://ollama.ai) instance for on-prem deployments.

| Key | Env var | Type | Default | Description |
|-----|---------|------|---------|-------------|
| `ai.enabled` | `AI_ENABLED` | bool | `false` | Enable AI features |
| `ai.ollama_url` | `AI_OLLAMA_URL` | string | `http://localhost:11434` | Ollama or OpenAI-compatible API endpoint |
| `ai.ollama_model` | `AI_OLLAMA_MODEL` | string | `qwen2.5-coder:14b` | Primary model for code-heavy tasks (rule generation, fixing broken rules) |
| `ai.ollama_test_gen_model` | `AI_OLLAMA_TEST_GEN_MODEL` | string | Same as primary | Model specifically for test case generation |
| `ai.api_key` | `AI_API_KEY` | string | — | API key (required for non-Ollama endpoints) |
| `ai.max_tokens` | `AI_MAX_TOKENS` | int | `16384` | Max output tokens per request |
| `ai.timeout_seconds` | `AI_TIMEOUT_SECONDS` | int | `1200` | Request timeout in seconds (20 minutes default — large models can be slow) |
| `ai.max_concurrent` | `AI_MAX_CONCURRENT` | int | `3` | Max simultaneous AI requests |
| `ai.task_queue` | `AI_TASK_QUEUE` | string | `<task_queue>_ai` | Temporal task queue for AI jobs |

#### Dual-model routing

You can configure a secondary LLM provider for language-oriented tasks, letting the primary model focus on code generation:

| Key | Env var | Type | Default | Description |
|-----|---------|------|---------|-------------|
| `ai.secondary_url` | `AI_SECONDARY_URL` | string | — | Secondary LLM endpoint |
| `ai.secondary_model` | `AI_SECONDARY_MODEL` | string | — | Secondary model name |
| `ai.secondary_api_key` | `AI_SECONDARY_API_KEY` | string | — | Secondary API key |
| `ai.secondary_max_tokens` | `AI_SECONDARY_MAX_TOKENS` | int | `8192` | Secondary max tokens |

When configured, tasks are routed automatically:

- **Primary model** — rule generation (code-heavy, needs a strong code model)
- **Secondary model** — test generation, rule analysis, recommendations, summaries, feedback triage, overlap analysis

This lets you use a powerful but expensive code model (e.g., `qwen2.5-coder:14b` on GPU) for generation while routing language tasks to a faster, cheaper model (e.g., Llama 3 on Groq or Together AI).

If no secondary is configured, all tasks use the primary model.

#### Self-improvement

| Key | Env var | Type | Default | Description |
|-----|---------|------|---------|-------------|
| `ai.outcome_tracking` | `AI_OUTCOME_TRACKING` | bool | `true` | Track whether AI suggestions are accepted or rejected |
| `ai.self_improvement` | `AI_SELF_IMPROVEMENT` | bool | `false` | Enable AI self-improvement feedback loop |

Outcome tracking records which AI suggestions users accept, modify, or reject. Self-improvement uses this data to detect patterns and propose improvements to AI prompts. Self-improvement is a SaaS-only feature.

---

### Rules

Controls rule versioning and review lifecycle.

| Key | Env var | Type | Default | Description |
|-----|---------|------|---------|-------------|
| `rules.max_version_history` | `RULES_MAX_VERSION_HISTORY` | int | `5` | Number of historical rule versions to retain. Older versions are pruned automatically |
| `rules.stale_review_days` | `RULES_STALE_REVIEW_DAYS` | int | `30` | Days without review before a rule is flagged as stale. Stale rules appear on dashboards and in reports |

---

### Testing

| Key | Env var | Type | Default | Description |
|-----|---------|------|---------|-------------|
| `testing.test_index` | `TESTING_TEST_INDEX` | string | `main` | Splunk index for test data injection |

When testing detection rules, CraftedSignal injects sample log events into your SIEM and runs the detection query to verify it matches (positive tests) or doesn't match (negative tests). For Splunk, test data is sent via HEC (HTTP Event Collector) to this index. Use a dedicated test index (e.g., `craftedsignal_test`) to avoid polluting production data.

---

### Audit log

| Key | Env var | Type | Default | Description |
|-----|---------|------|---------|-------------|
| `audit_log.retention_days` | `AUDITLOG_RETENTION_DAYS` | int | `90` | Days to retain audit log entries. A daily Temporal workflow prunes entries older than this |

Audit logs capture every significant action: rule changes, deployments, rollbacks, approvals, logins, settings changes, and AI interactions. They can be exported from **Settings > Audit Logs** in the web UI.

For compliance-sensitive deployments (SOC 2, NIS2), set this to 365 or higher.

---

### Library

The library provides shared detection rule templates that users can import and customize.

| Key | Env var | Type | Default | Description |
|-----|---------|------|---------|-------------|
| `library.disabled` | `LIBRARY_DISABLED` | bool | `false` | Disable the library feature entirely |
| `library.repositories` | `LIBRARY_REPOSITORIES` | []string | `[craftedsignal/library]` | Git repository URLs containing rule templates |

CraftedSignal periodically syncs library indexes from configured repositories. Each repository contains a signed `library.index.yaml` with detection templates including queries, test cases, MITRE mappings, and metadata.

You can add your own internal repositories alongside the default CraftedSignal library.

---

### Threat feed

The threat feed delivers ready-to-use detection rules for trending and novel threats, including MITRE ATT&CK mappings, IOCs, and test cases.

| Key | Env var | Type | Default | Description |
|-----|---------|------|---------|-------------|
| `threat_feed.disabled` | `THREAT_FEED_DISABLED` | bool | `false` | Disable threat feed syncing |
| `threat_feed.sync_interval_min` | `THREAT_FEED_SYNC_INTERVAL_MIN` | int | `30` | Minutes between checks for new feed updates |

The sync workflow checks for new feed bundles, downloads and decrypts them using your license key, and imports threat indicators. After a successful sync, an AI relevance scoring pass ranks threats by applicability to your environment.

The threat feed is a licensed feature — it requires `threat_feed` in your license's feature list.

---

### Log

Controls application logging output.

| Key | Env var | Type | Default | Description |
|-----|---------|------|---------|-------------|
| `log.level` | `LOG_LEVEL` | string | `INFO` | Minimum log level: `DEBUG`, `INFO`, `WARN`, `ERROR` |
| `log.format` | `LOG_FORMAT` | string | `text` | Output format: `text` (human-readable) or `json` (structured, for log aggregation) |
| `log.include_source` | `LOG_INCLUDE_SOURCE` | bool | `false` | Include source file and line number in log entries |
| `log.file` | `LOG_FILE` | string | — | Write logs to file instead of stdout |
| `log.error_file` | `LOG_ERROR_FILE` | string | — | Write ERROR-level logs to a separate file |
| `log.error_format` | `LOG_ERROR_FORMAT` | string | Same as `log.format` | Format for the error log file |

For production, use `json` format and pipe to your log aggregation system. For development, use `text` for readability.

When `log.file` is set, logs are written to the file **instead of** stdout. To write to both, use a tool like `tee` or configure your process manager to capture stdout.

---

### License

| Key | Env var | Type | Default | Description |
|-----|---------|------|---------|-------------|
| `license_key` | `LICENSE_KEY` | string | — | License key for self-hosted deployments |

License keys are signed tokens that encode your tier, quotas, and enabled features. The key is verified against an embedded public key on startup.

**Enforced limits** include: max detections, max enabled detections, max SIEMs, max users, max API keys, API requests per day, and storage.

**Feature flags** in the license control access to: API, export, SSO, audit logs, threat feed, and custom integrations.

Without a license key, the instance runs on the free tier.

---

### Recaptcha

| Key | Env var | Type | Default | Description |
|-----|---------|------|---------|-------------|
| `recaptcha.site_key` | `RECAPTCHA_SITE_KEY` | string | — | Google reCAPTCHA v3 site key |

When configured, reCAPTCHA is added to the registration and login pages to protect against automated attacks. The server adjusts its Content-Security-Policy to allow Google's reCAPTCHA scripts.

Optional — only needed for public-facing instances. Not needed for internal deployments behind a VPN.

---

## Command-line flags

| Flag | Description |
|------|-------------|
| `-config` | Path to YAML config file |
| `-log` | Override log level |
| `-log-file` | Override log file path |
| `-error-log-file` | Override error log file path |
| `-error-log-format` | Override error log format |
| `-mode` | Run mode: `all`, `server`, or `worker` |
| `-version` | Print version and exit |

---

## Run modes

The `-mode` flag controls which components run in the process. This is how CraftedSignal scales horizontally.

### `all` (default)

Runs the HTTP server **and** all Temporal workers in a single process. This is the simplest deployment — one binary, one process, everything included.

```bash
./craftedsignal -config config.yaml
# or explicitly:
./craftedsignal -config config.yaml -mode all
```

Use this for most self-hosted deployments, especially with SQLite.

### `server`

Runs only the HTTP server (web UI and API). No background workers. The server handles incoming requests but cannot execute deployments, run tests, or perform any background work.

```bash
./craftedsignal -config config.yaml -mode server
```

### `worker`

Runs only the Temporal workers. No HTTP server. The worker picks up background jobs from the Temporal task queue and executes them.

```bash
./craftedsignal -config config.yaml -mode worker
```

### Scaling with split modes

In high-availability deployments, split the server and worker roles across multiple processes or hosts:

```
                  ┌─── Load Balancer ───┐
                  │                     │
          ┌───────┴───────┐    ┌───────┴───────┐
          │  mode=server  │    │  mode=server  │
          │  (HTTP API)   │    │  (HTTP API)   │
          └───────┬───────┘    └───────┬───────┘
                  │                     │
                  └──── PostgreSQL ─────┘
                  │                     │
          ┌───────┴───────┐    ┌───────┴───────┐
          │  mode=worker  │    │  mode=worker  │
          │  (background) │    │  (background) │
          └───────────────┘    └───────────────┘
```

This requires:

- **PostgreSQL** as the storage driver (SQLite doesn't support concurrent access from multiple processes)
- **External Temporal** or a shared embedded instance (each process needs access to the same Temporal backend)

Benefits:

- Scale HTTP capacity independently of background processing
- A burst of deployments doesn't slow down the web UI
- Workers can run on different hardware (e.g., GPU nodes for AI tasks)
