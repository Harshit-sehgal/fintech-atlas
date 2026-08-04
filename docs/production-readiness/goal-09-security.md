# Goal 09 — Security

**Status:** 🟢/🟡 Small static surface; host-level hardening + audit remain

**Objective:** HTTPS, secure cookies, CSRF/XSS/SQLi protection, input validation, rate limiting, secrets management, encryption.

## Requirements
- [ ] HTTPS (host-level; verify on the production domain)
- [ ] Secure cookies (N/A until accounts/backend exist)
- [ ] CSRF protection (N/A for the current static/no-cookie architecture)
- [x] XSS protection baseline (React escaping, strict CSP, and static output)
- [ ] SQL injection prevention (N/A — no database)
- [x] Input validation (client calculators/forms plus provenance/config gates)
- [ ] Rate limiting (N/A until server-side endpoints exist)
- [x] Secrets management baseline (environment-only configuration; no committed secrets)
- [ ] Encryption at rest (N/A — no server-side persistence)

## Definition of Done
- [x] Production dependency vulnerabilities are triaged; `npm audit --production --audit-level=high` passes with 0 vulnerabilities.
- [ ] Penetration test findings are resolved or explicitly accepted (external test pending).
- [x] Security headers are configured in the generated static-host artifact; live host application remains to verify.
- [x] Secrets are not stored in source control; provenance and CI security gates pass.

## Status vs. this codebase
- **Favorable position:** a static export has no DB, no server-side sessions, and
  no SQL — so SQLi and most CSRF surfaces are structurally absent. The
  production dependency audit passes with 0 vulnerabilities; secrets are kept
  out of source (`.env.example` is committed, real envs are git-ignored).
- **Current position:** HTTPS and security headers (CSP, HSTS, X-Content-Type-
  Options, Referrer-Policy) are configured at the **hosting layer**, not in the
  app — document them for the host (Netlify/Vercel/Cloudflare headers). The
  generated `_headers` artifact includes HSTS, and
  `public/.well-known/security.txt` provides the private GitHub reporting path.
  Cookies are client-only today, so secure-cookie controls are N/A until
  Goals 01/05/06 add a backend.
