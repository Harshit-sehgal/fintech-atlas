# Goal 09 — Security

**Status:** 🟢/🟡 Small static surface; host-level hardening + audit remain

**Objective:** HTTPS, secure cookies, CSRF/XSS/SQLi protection, input validation, rate limiting, secrets management, encryption.

## Requirements
- [ ] HTTPS
- [ ] Secure cookies
- [ ] CSRF protection (where applicable)
- [ ] XSS protection
- [ ] SQL injection prevention
- [ ] Input validation
- [ ] Rate limiting
- [ ] Secrets management
- [ ] Encryption

## Definition of Done
- [ ] Dependency vulnerabilities are triaged according to policy.
- [ ] Penetration test findings are resolved or explicitly accepted.
- [ ] Security headers are configured.
- [ ] Secrets are not stored in source control.

## Status vs. this codebase
- **Favorable position:** a static export has no DB, no server-side sessions, and
  no SQL — so SQLi and most CSRF surfaces are structurally absent. `npm audit`
  should be run/triaged; secrets are already kept out of source (`.env.example`
  is committed, real envs are git-ignored).
- **Current position:** HTTPS and security headers (CSP, HSTS, X-Content-Type-
  Options, Referrer-Policy) are configured at the **hosting layer**, not in the
  app — document them for the host (Netlify/Vercel/Cloudflare headers). The
  generated `_headers` artifact includes HSTS, and
  `public/.well-known/security.txt` provides the private GitHub reporting path.
  Cookies are client-only today, so secure-cookie controls are N/A until
  Goals 01/05/06 add a backend.
