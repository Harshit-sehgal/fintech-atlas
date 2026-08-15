# Live Core Web Vitals & SEO Dashboard — FinTech Atlas

> Measured against the production origin `https://harshit-sehgal.github.io/fintech-atlas`
> on **2026-08-15** with Lighthouse 12.6.1 (Chrome headless), performance-only
> category, desktop emulation. Companion: `ISSUES-AND-GAPS.md` R6 / issue #21.

## Gate (T100, lighthouserc.json)

| Metric | Gate |
| --- | --- |
| Performance score | ≥ 0.85 |
| LCP | ≤ 3500 ms |
| TBT | ≤ 250 ms |
| CLS | ≤ 0.1 |

## Live measurements

| Route | Perf | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: |
| `/` (home) | 0.96 | 2.0 s | 78 ms | 0.000 |
| `/companies/` | 0.96 | 1.0 s | 185 ms | 0.000 |
| `/articles/` | 0.98 | 1.0 s | 69 ms | 0.000 |
| `/glossary/` | 0.99 | 2.0 s | 59 ms | 0.000 |
| `/compare/` | 0.99 | 1.0 s | 16 ms | 0.000 |
| `/tools/remittance` | 0.96 | 1.0 s | 15 ms | 0.000 |

**Result: all six gate URLs pass every raised threshold on the live origin.**
Worst case: TBT 185 ms on `/companies/` (remains under the 250 ms gate).

## SEO dashboard (production artifact checks, 2026-08-15)

| Check | Result |
| --- | --- |
| `sitemap.xml` (index) | 200, application/xml |
| `feed.xml` (RSS) | 200, 21,720 B |
| `robots.txt` | 200, 207 B (points at sitemap index) |
| `sw.js` (service worker) | 200, stamped cache version |
| `/.well-known/security.txt` | 200, RFC 9116, expires 2027-01-01 |
| Indexability (noindex) | None rendered (verified at build: titles audit 113 pages) |
| Structured data | 352 JSON-LD blocks across 115 HTML files (postbuild gate) |
| Per-page meta CSP | Injected into 115/115 HTML files (postbuild gate) |
| Internal links | 115 HTML files checked, no broken links/fragments (postbuild gate) |
| Titles | 113 pages ≤ 65 chars, single site-name suffix (postbuild gate) |

## Field data (CrUX) note

Lighthouse lab numbers above are deterministic build-level evidence. Field
(CrUX) data for the Pages origin accrues only once Google indexes the site;
submit `sitemap.xml` in Search Console (see `SEARCH-CONSOLE-SETUP.md`) and
re-check after ~2–4 weeks of traffic. Rerun this dashboard with:

```bash
for url in https://harshit-sehgal.github.io/fintech-atlas/{,companies/,articles/,glossary/,compare/,tools/remittance}; do
  slug=$(echo "$url" | sed 's|https://harshit-sehgal.github.io/fintech-atlas||; s|/$||; s|^$|home|; s|/|_|g')
  npx lighthouse "$url" --chrome-path=/usr/bin/google-chrome \
    --output=json --output-path="/tmp/opencode/lh/$slug.json" --only-categories=performance
done
```