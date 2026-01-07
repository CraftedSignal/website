import hljs from 'highlight.js/lib/core';
import yaml from 'highlight.js/lib/languages/yaml';

hljs.registerLanguage('yaml', yaml);

document.addEventListener('DOMContentLoaded', () => {
  // Rules workspace interactions
  (function () {
    const rules = {
      'encoded-powershell': {
        title: 'Encoded PowerShell (KQL/SPL)',
        context: 'Shadow eval',
        language: 'yaml',
        content: `title: Encoded PowerShell Execution
id: crafted-encoded-powershell
status: testing
description: Detects PowerShell with encoded commands run on endpoints, tuned for Sentinel + Splunk.
references:
  - https://attack.mitre.org/techniques/T1059/001/
logsource:
  category: process_creation
  product: windows
detection:
  selection:
    Image|endswith:
      - "\\powershell.exe"
      - "\\pwsh.exe"
    CommandLine|contains:
      - "-enc "
      - "-encodedcommand"
    CommandLine|contains|all:
      - "FromBase64String"
      - "System.Text.Encoding"
  condition: selection
fields:
  - Computer
  - User
  - CommandLine
  - ParentCommandLine
falsepositives:
  - Script runners with benign payloads
level: high
tags:
  - attack.execution
  - attack.t1059.001
  - crafted.signal.shadow`,
      },
      'webshell-upload': {
        title: 'Webshell Upload Detected',
        context: 'Production',
        language: 'yaml',
        content: `title: Webshell Upload Detected
id: crafted-webshell-upload
status: production
description: Detects suspicious webshell upload patterns on IIS/Apache logs and WAF telemetry.
logsource:
  category: webserver
  product: apache
detection:
  selection_uri|contains:
    - "cmd="
    - "shell.aspx"
    - "webshell.php"
    - "upload.php"
  selection_method:
    cs-method: POST
  selection_status:
    sc-status:
      - 200
      - 201
  condition: selection_uri and selection_method and selection_status
fields:
  - c-ip
  - cs-username
  - cs-method
  - c-uri
  - sc-status
  - user-agent
level: critical
tags:
  - attack.persistence
  - attack.t1505.003
  - crafted.signal.production`,
      },
      kerberoasting: {
        title: 'Suspicious Kerberoasting via Rubeus',
        context: 'Testing',
        language: 'yaml',
        content: `title: Suspicious Kerberoasting via Rubeus
id: crafted-kerberoasting
status: testing
description: Detects Rubeus or similar kerberos service ticket requests often used for kerberoasting.
logsource:
  product: windows
  service: security
detection:
  selection_eventid:
    EventID:
      - 4769
  selection_account:
    ServiceName|contains:
      - "$"
  selection_ticket:
    TicketEncryptionType:
      - 0x17
      - 0x12
    TransitedServices: "-"
  condition: selection_eventid and selection_account and selection_ticket
falsepositives:
  - Rare service accounts with constrained delegation
level: medium
tags:
  - attack.credential_access
  - attack.t1558.003
  - crafted.signal.testing`,
      },
    };

    const editor = document.getElementById('rule-editor');
    const highlighted = document.getElementById('rules-highlighted');
    const highlightWrapper = highlighted?.parentElement;
    const saveButton = document.getElementById('save-rule');
    const copyButton = document.getElementById('copy-rule');
    const statusBadge = document.getElementById('save-status');
    const titleEl = document.getElementById('active-rule-title');
    const contextBadge = document.getElementById('rule-context');
    const loadButtons = Array.from(document.querySelectorAll('[data-rule-id]'));

    if (!editor || !highlighted) return;

    const storageKey = (id) => `craftedsignal.rule.${id}`;
    const statusToneClasses = {
      muted: 'text-muted border-stroke bg-base/70',
      ok: 'text-accent border-accent/40 bg-accent/10',
      warn: 'text-accent2 border-accent2/40 bg-accent2/10',
    };

    let activeRule = 'encoded-powershell';

    const setStatus = (text, tone = 'muted') => {
      const toneClasses = statusToneClasses[tone] || statusToneClasses.muted;
      statusBadge.className = `text-xs font-semibold px-3 py-1 rounded-lg border ${toneClasses}`;
      statusBadge.textContent = text;
    };

    const syncHighlight = () => {
      highlighted.textContent = editor.value || '';
      if (hljs?.highlightElement) {
        hljs.highlightElement(highlighted);
      }
      if (highlightWrapper) {
        highlightWrapper.scrollTop = editor.scrollTop;
        highlightWrapper.scrollLeft = editor.scrollLeft;
      }
    };

    const markActiveButton = (ruleId) => {
      loadButtons.forEach((btn) => {
        const active = btn.dataset.ruleId === ruleId;
        btn.classList.toggle('ring-1', active);
        btn.classList.toggle('ring-accent/50', active);
      });
    };

    const loadRule = (ruleId) => {
      const rule = rules[ruleId];
      if (!rule) return;
      activeRule = ruleId;
      if (titleEl) titleEl.textContent = rule.title;
      if (contextBadge) contextBadge.textContent = rule.context;
      const stored = localStorage.getItem(storageKey(ruleId));
      editor.value = stored || rule.content;
      highlighted.className = `language-${rule.language || 'yaml'}`;
      markActiveButton(ruleId);
      syncHighlight();
      setStatus(stored ? 'Loaded saved copy' : 'Loaded template', 'muted');
    };

    editor.addEventListener('input', () => {
      syncHighlight();
      setStatus('Unsaved changes', 'warn');
    });

    editor.addEventListener('scroll', () => {
      if (highlightWrapper) {
        highlightWrapper.scrollTop = editor.scrollTop;
        highlightWrapper.scrollLeft = editor.scrollLeft;
      }
    });

    saveButton?.addEventListener('click', () => {
      localStorage.setItem(storageKey(activeRule), editor.value);
      setStatus('Saved locally', 'ok');
    });

    copyButton?.addEventListener('click', async () => {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(editor.value);
        } else {
          const temp = document.createElement('textarea');
          temp.value = editor.value;
          document.body.appendChild(temp);
          temp.select();
          document.execCommand('copy');
          temp.remove();
        }
        setStatus('Copied to clipboard', 'ok');
      } catch (err) {
        setStatus('Copy unavailable', 'warn');
      }
    });

    loadButtons.forEach((btn) => {
      btn.addEventListener('click', () => loadRule(btn.dataset.ruleId));
    });

    loadRule(activeRule);
  })();

  // Auto-slide "Problems we kill" scroller
  (function () {
    const slider = document.getElementById('problems-slider');
    if (!slider) return;
    const cards = Array.from(slider.children);
    const gapVal = parseFloat(getComputedStyle(slider).gap || '0') || 0;
    const cardWidth = cards[0]?.getBoundingClientRect().width || 240;
    const step = cardWidth + gapVal;
    let idx = 0;
    slider.scrollLeft = 0;
    setInterval(() => {
      const max = slider.scrollWidth - slider.clientWidth;
      idx = (idx + 1) % cards.length;
      let target = idx * step;
      if (target > max) {
        idx = 0;
        target = 0;
      }
      slider.scrollTo({ left: target, behavior: 'smooth' });
    }, 2400);
  })();
});
