# Security Policy

FinTech Atlas is a static, client-side informational site. It stores no
passwords, no accounts, and no server-side data; the attack surface is small.

## Reporting a Vulnerability

Please do **not** open a public issue for security problems. Report privately so
issues can be triaged before disclosure.

- **GitHub private reporting:** https://github.com/Harshit-sehgal/fintech-atlas/security/advisories/new

Include, if possible:

- The affected URL / component
- Steps to reproduce
- Screenshots or a minimal reproduction
- Impact you believe the issue has

## What we ask

- Do not exfiltrate or modify live data.
- Give us a reasonable window (e.g. 90 days) to respond before public disclosure.
- This is an educational reference site — it does not show live account data.

## Scope

In scope: the web app source, its static build (`out/`), and build tooling.

Out of scope: third-party hosting defaults (CDN/header config is the operator's
responsibility), and the accuracy of third-party data the site references.

## Vulnerability handling

1. Maintainer acknowledges within 48–72h.
2. Issue is triaged and fixed against the priority list in the audit.
3. A fix is released and the reporter is credited (if they wish).
