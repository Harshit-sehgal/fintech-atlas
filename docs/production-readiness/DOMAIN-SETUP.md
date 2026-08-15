# Domain & Hosting Setup — FinTech Atlas

> Operator runbook (issue #12). The site is live on GitHub Pages at
> `https://harshit-sehgal.github.io/fintech-atlas` with CI, uptime probes, and
> rollback artifacts. Remaining: a dedicated domain (e.g. `fintech-atlas.com`)
> and optionally a host that applies `_headers`. Buying the domain is an
> operator action; everything else is documented here.

## 1. Current state (verified 2026-08-15)

| Item | Status |
| --- | --- |
| Host | GitHub Pages (`github.io`) — TLS 1.3, HSTS, auto-certificate |
| `SITE_URL` | Set to the Pages origin in the Deploy workflow (build-time) |
| `NEXT_PUBLIC_BASE_PATH` | `/fintech-atlas` (project site) |
| Uptime probes | Live (30-min, `uptime.yml`) |
| Rollback | 9 retained build artifacts + `restore.yml` workflow |

## 2. Buy the domain

- Registrar: any (Namecheap, GoDaddy, Cloudflare Registrar, India: GoDaddy/Net4). No requirement imposed by the site.
- Recommended: **Cloudflare Registrar** (at-cost pricing; pairs with the DNS guidance below).

## 3. Point DNS at GitHub Pages (apex + www)

Apex `fintech-atlas.com`:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

`www` subdomain:

| Type | Name | Value |
| --- | --- | --- |
| CNAME | `www` | `Harshit-sehgal.github.io` |

(If the registrar forces a proxy — Cloudflare orange-cloud — disable it for the
apex A records during GitHub certificate issuance, then re-enable if desired.)

## 4. Configure GitHub Pages for the custom domain

1. Repo → **Settings → Pages** → Custom domain → `fintech-atlas.com` → Save
   (GitHub verifies the DNS and issues its Let's Encrypt certificate).
2. Optional: enable **Enforce HTTPS**.
3. Add `www.fintech-atlas.com` → set `fintech-atlas.com` as the canonical
   (Pages redirects www→apex automatically when configured).

## 5. Update the site

- [ ] `SITE_URL=https://fintech-atlas.com` in the Deploy workflow (`deploy.yml`) — this drives canonical, sitemap, RSS, JSON-LD, and security.txt `Canonical`
- [ ] Remove `NEXT_PUBLIC_BASE_PATH` (custom domain serves at root)
- [ ] Set repo variables `DEPLOYMENT_URL` + `DEPLOY_URL` to `https://fintech-atlas.com` (uptime + verify-live)
- [ ] Re-run `npm run check:deployment` against the live custom domain
- [ ] Re-run the LIVE-CWV dashboard (new origin, real host headers)
- [ ] Update `docs/deployment-providers.md` + this file's status table

## 6. Optional: move to a host that applies `_headers`

GitHub Pages ignores `_headers` (X-Frame-Options, referrer-policy,
permissions-policy are not served — see `LIVE-SECURITY-REVIEW.md`). If wanted:

- **Netlify** or **Cloudflare Pages**: import the repo, set `npm run build` +
  `out/`, keep the same DNS (CNAME apex), and the `_headers` file takes effect.
- Keep the Deploy workflow or switch to the host's CI; do not run both against
  the same domain.

## 7. Post-migration verification checklist

- [ ] `https://fintech-atlas.com` → 200; `http://` redirects to HTTPS
- [ ] `www` redirects to apex (or chosen canonical)
- [ ] `security.txt` Canonical updated to the new origin
- [ ] Search Console: add a **Domain property** via DNS TXT (see `SEARCH-CONSOLE-SETUP.md`) and re-submit the sitemap
- [ ] GSC URL inspection on `/`, `/companies/`, `/articles/` — request indexing
- [ ] Rollback drill still valid (artifacts unchanged; restore workflow unaffected)