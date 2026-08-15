# Search Console & Bing Submission — FinTech Atlas

> Operator runbook (issue #14). The site artifacts are ready; what remains is
> submitting them from a Google/Bing account the operator controls. Estimated
> time: 30–45 minutes. Field (CrUX) data starts accruing after indexing.

## 1. What is already in place (verified 2026-08-15)

| Artifact | Status |
| --- | --- |
| `sitemap.xml` (index) | Live, 200, references 110 URLs (postbuild gate) |
| `robots.txt` | Live, 200, points at the sitemap index |
| Titles | 113 pages ≤ 65 chars, single suffix (postbuild gate) |
| Structured data | 352 JSON-LD blocks across 115 files (Article, BreadcrumbList, WebSite, Organization) |
| Canonical base | `SITE_URL` = live Pages origin (deploy workflow) |
| noindex | None rendered |

## 2. Google Search Console

1. Open https://search.google.com/search-console → **Add property** → **URL prefix**.
2. Enter `https://harshit-sehgal.github.io/fintech-atlas`.
3. Verification method: **HTML tag** is simplest — the site has no DNS control
   on `github.io` and no host header application. Add the meta tag to
   `src/app/layout.tsx` `<head>` (temporary, then remove after verification) or
   use **Domain property** verification only if DNS access to `github.io` exists
   (it does not — use URL-prefix + HTML tag).
4. After verifying: **Sitemaps** → submit `https://harshit-sehgal.github.io/fintech-atlas/sitemap.xml`.
5. Optional: enable **URL inspection** on `/`, `/companies/`, `/articles/`, and
   request indexing for each after the sitemap is processed.

## 3. Bing Webmaster Tools

1. Open https://www.bing.com/webmasters → **Import from GSC** (fastest, reuses
   the Google verification) or add site manually with the same HTML-tag method.
2. Submit the same `sitemap.xml`.
3. Bing Site Explorer accepts `github.io` subpaths with HTML-tag verification.

## 4. Post-submission checklist (2–4 weeks later)

- [ ] CrUX field data appears in GSC **Core Web Vitals** report (compare against
      `docs/production-readiness/LIVE-CWV-REPORT.md` lab numbers)
- [ ] Indexed URL count grows; watch for coverage errors (none expected — no
      noindex, all routes prerendered)
- [ ] Track **Rich results** (Article JSON-LD) — validate with the Rich Results
      Test before re-submitting any template changes

## 5. Automate the re-check

When a dedicated domain is live (see `DOMAIN-SETUP.md`), re-verify that domain
as a **Domain property** (DNS TXT) so subdomain/path variants are covered, then
re-submit its sitemap. The uptime workflow already watches the live origin and
files issues on outage; add a monthly reminder (GitHub Actions schedule or
calendar) to review GSC Index Coverage.