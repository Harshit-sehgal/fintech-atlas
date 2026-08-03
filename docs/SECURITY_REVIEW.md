# Security Review — FinTech Atlas

> Code-based security self-review of the static export (addresses R5 for the
> current architecture). Complements [SECURITY_AUDIT_TRIAGE.md](./SECURITY_AUDIT_TRIAGE.md).
> This is an engineering review, not a substitute for a professional penetration
> test or jurisdiction-specific legal review, which remain recommended before a
> targeted external-facing launch.

## Scope & architecture

Fully static Next.js 16 export (`output: "export"`) — no application server,
no database, no accounts, no runtime secrets. The deployable surface is
pre-rendered HTML/CSS/JS plus the generated `_headers` (CSP/HSTS). This keeps
the attack surface small; the review focuses on dependency integrity,
supply-chain hygiene, CSP, secrets, and client-side data handling.

## Findings

### 1. Dependency audit — PASS (production)
`npm audit --omit=dev --audit-level=high` → **0 vulnerabilities** in shipped
dependencies. The 5 advisories present in `npm audit` (1 high) are all
transitive **devDependencies** under `@lhci/cli` (Lighthouse CI tooling) —
never shipped, only run by the operator at CI time on trusted input. Not
exploitable in this architecture. Tracked in the audit triage policy.

### 2. Secrets hygiene — PASS
Grep + GitHub secret scanning over `src/`, `scripts/`, `.github/`, `e2e/`
found **no committed secrets** (all matches were false positives: comments,
content text, config definitions). No `.env*` files are committed
(`.env.example` only), and `deploy.yml` uses environment-only `id-token`.

### 3. Content-Security-Policy — PASS (verified live)
`out/_headers` ships a strict CSP: `default-src 'self'`, hashed inline scripts,
`object-src 'none'`, `frame-ancestors 'none'`, `base-uri 'self'`, `form-action
'self'`. Verified that:
- Inline scripts are hash-allowlisted (no `'unsafe-inline'` for scripts).
- `connect-src`/`form-action` auto-permit **only** configured providers
  (Plausible origin when `NEXT_PUBLIC_ANALYTICS_DOMAIN` is set; newsletter
  origin when `NEXT_PUBLIC_NEWSLETTER_FORM_ACTION` is set); defaults to `'self'`
  otherwise (locked down).
- Other security headers present: `Strict-Transport-Security`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy`,
  `Permissions-Policy`, `Cross-Origin-Opener-Policy`, `X-Frame-Options: DENY`.

### 4. Third-party trust & integrity
- Outbound links open with `noopener noreferrer`; commercial links add
  `rel="sponsored"` (never used to track or manipulate users).
- No advertising networks, tracking pixels, or cross-site trackers. Analytics
  is opt-in via a cookieless provider and only renders when configured.
- Repository has CodeQL, dependency-review, secret-scanning, and Dependabot
  workflows wired; CI fails on production high/critical advisories.

## Residual risk & recommendations

- **Professional pentest** for a targeted public launch (E8).
- **Host-level verification** that `_headers` (incl. HSTS) are applied and
  `security.txt` is served after deploying to the live host (E9).
- Enable **GitHub repo settings**: push-protection for secret scanning (E17).
- Re-run this review after any significant dependency or feature change.

## Sign-off

Security review performed on the static export, 2026-08-03. All production
findings addressable in-code are resolved; residual items are professional or
host-level and documented above.
