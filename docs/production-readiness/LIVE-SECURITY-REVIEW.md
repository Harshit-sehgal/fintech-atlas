# Live-Host Security Review — FinTech Atlas

> Reviewed **2026-08-15** against the production origin
> `https://harshit-sehgal.github.io/fintech-atlas` (GitHub Pages, Fastly edge).
> Complements the in-code review in `SECURITY_REVIEW.md` and issue #17.
> An independent penetration test remains operator work (enrollment + legal).

## Transport & TLS

| Check | Result |
| --- | --- |
| Protocol | HTTP/2, TLS 1.3 (GitHub/Fastly edge, certificate auto-issued) |
| HSTS | `strict-transport-security: max-age=31556952` (1 year) ✓ |
| HTTP → HTTPS | Pages serves HTTPS only; HTTP requests redirect (301) ✓ |
| Certificate | Let's Encrypt chain issued for `harshit-sehgal.github.io` (host-managed, auto-renewal) ✓ |

## Host response headers

| Header | Served? | Note |
| --- | --- | --- |
| `content-security-policy` (HTTP) | No | Pages ignores `_headers`; CSP ships per-page as `<meta>` (verified in every HTML document, 115/115 at build) |
| `x-frame-options` | No | `DENY` configured in `_headers` but **Pages does not apply it** — the site has no framed pages and no auth surface; a custom domain (Netlify/Vercel/Cloudflare) applies `_headers` properly. Residual clickjacking risk: low (static informational content). Tracked for the custom-domain host |
| `referrer-policy` / `permissions-policy` | No | Same `_headers` limitation; recommended on custom domain |
| `strict-transport-security` | Yes | Host-provided ✓ |

## Application surface

| Check | Result |
| --- | --- |
| Per-page meta CSP | ✓ `default-src 'self'`, script-src self + per-page SHA-256 hashes, `connect-src 'self'`, `form-action` restricted; no `frame-ancestors` (CSP3 ignores it in `<meta>`; see ISSUES-AND-GAPS row 111) |
| CSP bypass probes | No external script/connect destinations in the policy; inline scripts hash-allowlisted per page |
| `.git/config` | 404 ✓ |
| `.env`, `.env.local`, `wp-config.php`, `config.php`, `.htaccess`, `server-status` | 404 ✓ (static host — no server-side execution surface) |
| Directory listing | None (Pages serves `index.html` per directory) ✓ |
| Unknown routes | 404 ✓ |
| Secret scan (repo) | GitHub secret scanning + push protection enabled (E17) ✓ |
| Dependency audit | `npm audit --production` = 0 (R3) ✓ |
| `security.txt` | `/.well-known/security.txt` 200, RFC 9116, Contact = GitHub issues inbox ✓ |
| XSS surface | No user-generated content; query strings parsed defensively (URL/localStorage hydrates validated against allowlists in tool clients) |
| Injection surface | No database, no forms that post to the origin (booking form opens a GitHub issue draft — the site's only public inbox) |

## Residual items (operator)

1. **Custom domain + host that applies `_headers`** (fixes X-Frame-Options, referrer/permissions policy) — see `DOMAIN-SETUP.md`.
2. **Independent penetration test** by a professional (issue #17) — no engagement yet.
3. **Jurisdiction-specific legal review** (issue #17) — no engagement yet.
4. GitHub Pages origin is shared-infrastructure (github.io); security.txt + HSTS are the practical mitigations available there.

## Verdict

No critical or high-severity live-host findings on the Pages origin for this
static, zero-backend surface. The documented gaps are the `_headers`-not-applied
headers (mitigated by per-page meta CSP) and the outstanding professional
penetration test.