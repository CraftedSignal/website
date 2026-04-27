# Product Screenshots

Drop PNG or WebP files here. The screenshot gallery partial
(`layouts/partials/sections/screenshots.html`) and the per-persona pages link
to these paths. If a file is missing the gallery degrades gracefully — the
caption still renders but the image slot is hidden.

Recommended dimensions: 1600x1000 (16:10). Dark theme preferred.

## Expected files

| Filename                          | Section                          | Persona  |
|-----------------------------------|----------------------------------|----------|
| `dashboard.png`                   | Risk-driven cascade dashboard    | CISO     |
| `silently-broken.png`             | Silently broken rules hero KPI   | SOC Lead |
| `exposure-heatmap.png`            | Exposure % with uncovered techniques | CISO |
| `coverage-depth.png`              | Per-technique × per-layer heatmap | CISO    |
| `rule-editor.png`                 | Sigma rule editor with live translation | Engineer |
| `rule-diff.png`                   | Side-by-side deploy diff modal   | Engineer |
| `hunt-triage.png`                 | Hunt clusters + verdict workflow | Engineer |
| `hunt-promote.png`                | Promote hunt query to rule       | Engineer |
| `approval-diff.png`               | Approval detail with query diff + impact | Manager |
| `command-palette.png`             | Cmd+K palette                    | Power user |
| `threat-feed.png`                 | Threat brief adoption            | Analyst  |
| `threat-model-wizard.png`         | Threat modeling wizard           | Architect|
| `sigma-conversion.png`            | One Sigma rule → multiple SIEM dialects | Engineer |

## Capture tips

- Use the login `demo@craftedsignal.io` seed data (has silently-broken
  scenarios, uncovered techniques, and a couple of active hunts).
- Set viewport to 1600x1000 so the images render crisp on retina without
  resizing blur.
- Redact any private hostnames/IPs from the rule editor screenshot.
