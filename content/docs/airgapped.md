---
title: "Air-gapped Mode"
description: "Run the platform with all outbound network access blocked, including DNS. For regulated and isolated environments where the platform must not reach the internet."
weight: 12
section: "Operations"
---

## Overview

Air-gapped mode blocks every outbound network call the platform could make: DNS lookups, HTTP requests, TLS dials. Only loopback and private address space (RFC1918, ULA, link-local) are permitted. Once enabled, the platform can reach your internal SIEMs, internal LLM (Ollama, self-hosted compatible endpoint), and internal threat feed mirror — and nothing else.

---

## Enabling it

Pass `--airgapped` on the command line:

```bash
craftedsignal --config /etc/craftedsignal/config.yml --airgapped
```

On startup the log emits:

```
WARN airgap mode enabled — DNS and public outbound are blocked; use IP literals for SIEM/AI/feed endpoints
```

---

## What the mode enforces

- **DNS lookups** fail with `airgap: outbound network access blocked`. Every destination in your configuration must be an IP literal — not a hostname.
- **HTTP clients using `http.DefaultTransport`** have their dialer rewired to reject anything outside loopback / RFC1918 / ULA / link-local.
- **Dials to `0.0.0.0/0` public space** are refused regardless of transport.

Loopback and private space are allowed because an air-gapped operator is expected to reach internal services over private IPs.

---

## Configuration checklist

Before enabling the flag:

- SIEM endpoints must be IPs: `https://10.20.30.40:8089` instead of `https://splunk.internal`.
- AI provider must be internal: `OLLAMA_HOST=http://10.20.30.50:11434`.
- Threat feed must be an internal mirror. Bundles can be uploaded manually via the dashboard or `csctl feed import`.
- OIDC issuer (if used) must point at an internal IdP on private IP.
- NTP, TLS trust roots, and any other system services are out of scope for the flag — configure the host accordingly.

---

## Operational implications

- Update bundles (rule content, threat feed) must be copied in manually.
- `csctl` will refuse outbound calls too when the environment sets `CRAFTEDSIGNAL_AIRGAPPED=1`.
- Any library or SDK that builds its own raw TCP socket (bypassing `http.DefaultTransport`) is out of scope. Pair the flag with an OS-level network namespace or outbound-deny firewall for defence in depth.

---

## Related

- [Deployment](/docs/deployment/) — single-binary on-prem install guide.
- [Threat Feed](/docs/threat-feed/) — manual bundle upload.
- [AI](/docs/ai/) — self-hosted Ollama configuration.
