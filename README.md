# FinTech Atlas

A clear, plain-language guide to the FinTech industry — what each company does, how they differ, how they make money, and what the available editorial evidence suggests.

Built from public reference material and editorial summaries. Source URLs and effective dates are being migrated into the audited data model.

## Overview

FinTech Atlas is a Next.js 16 static-export website that serves as both an educational directory and an interactive decision suite. It catalogs **42 real-world FinTech companies** across **12 industry categories**, a **29-term glossary**, **37 articles** focused on international payments for India, and **6 interactive tools**.

### Features

| Section | Description |
|---|---|
| **Company Directory** | 42 company profiles with product details, pricing, editorial sentiment summaries, strengths & weaknesses |
| **Industry Categories** | 12 categories (Payments, Neobanks, Investing, Cross-Border, BNPL, Infrastructure, etc.) |
| **Glossary** | 29 financial technology terms with definitions, synonyms, and cross-references |
| **Compare Tool** | Side-by-side comparison matrix for up to 3 companies |
| **Fee Calculator** | Payment gateway fee estimator (Stripe, PayPal, Square, Adyen, Razorpay, Cashfree) |
| **Razorpay Fee Calculator** | India-specific Razorpay fee estimator with published rates and GST |
| **FX Remittance** | Cross-border remittance cost calculator (Wise, Revolut, PayPal, Bank) |
| **FX Markup Calculator** | Exchange-rate markup % and INR/USD loss for both directions |
| **Matchmaker Quiz** | 4-step quiz with weighted scoring to find the right FinTech tools |
| **Articles** | 34 India-focused guides (freelancer payouts, USD receipt, gateway fees, remittance corridors) with RSS feed |
| **India Hub** | One-page entry point comparing Razorpay, Cashfree, Wise, Payoneer and PayPal for INR |
| **Services** | Commercial offerings: gateway-selection report sample and implementation checklist |
| **Bookmarks** | LocalStorage-backed bookmarking for companies and glossary terms |
| **⌘K Search** | Command palette search across companies, categories, glossary, and tools |
| **Dark/Light Theme** | System-aware theme toggle with dark, light, and system modes |

## Architecture

```
fintech-website/
├── src/
│   ├── app/               # Next.js App Router pages & layouts
│   │   ├── about/         # Mission, methodology, FAQ, feedback
│   │   ├── affiliate-disclosure/
│   │   ├── articles/[slug]  # 34 India-focused guides
│   │   ├── bookmarks/     # Saved companies & glossary terms
│   │   ├── categories/    # 12 industry categories + drill-down
│   │   ├── changelog/     # Site changelog (RSS)
│   │   ├── companies/     # Full directory + individual profiles
│   │   ├── compare/       # Side-by-side comparison matrix
│   │   ├── glossary/      # A-Z glossary with search
│   │   ├── india/         # India payments entry point
│   │   ├── services/      # Report sample + implementation checklist
│   │   ├── tools/         # Fee, Razorpay, remittance, markup calculators + matchmaker
│   │   ├── layout.tsx     # Root layout (providers, metadata, SEO)
│   │   ├── error.tsx      # Error boundary
│   │   └── globals.css    # Design system (Tailwind v4 CSS variables & theming)
│   ├── components/
│   │   ├── home/          # Hero section with animated terminal
│   │   ├── layout/        # Site header (glass), footer
│   │   ├── legal/         # Privacy/terms shared components
│   │   ├── SEO/           # JSON-LD structured data, schemas, analytics
│   │   └── ui/            # Reusable UI components (command palette, count-up, etc.)
│   ├── data/              # 42 companies, 12 categories, 29 glossary terms, 37 articles, tool configs, provenance records
│   ├── generated/         # Client-safe article summaries (build-generated)
│   ├── lib/               # Site config, canonical URLs, calculators, matchmaker, remittance, theme, bookmarks, focus-trap, analytics
│   ├── __tests__/         # Cross-cutting integration tests (data integrity, deployment, heading hierarchy)
│   └── test/              # Shared test utilities
├── e2e/                   # Playwright specs (app, accessibility, keyboard)
├── public/logos/          # Official SVG logos for the catalog
├── docs/                  # EXECUTION_PLAN.md (project plan & T-task backlog), ADRs, production-readiness goals, security reviews, incident runbook
├── scripts/               # ~20 build-gate scripts (sitemap, RSS, security headers, performance budget, data freshness, provenance)
└── .github/workflows/     # CI, CodeQL, dependency-review, Lighthouse CI, GitHub Pages deploy, uptime monitoring
```

### Tech Stack

- **Next.js 16.2** (App Router) — output as fully static export (`output: "export"`)
- **React 19.2** with TypeScript 5 (strict mode)
- **Tailwind CSS v4** with CSS variables-based design system
- **Framer Motion** for animations and transitions
- **Vitest + Testing Library** for unit/integration tests, **Playwright + axe-core** for e2e and accessibility
- **Static export output** — deploy `out/` to any static host

> **ESLint version note:** `eslint` is intentionally pinned to `^9`. ESLint 10 removed
> an API that `eslint-config-next`'s bundled plugins (`eslint-plugin-react`, etc.) still
> depend on, so lint crashes on ESLint 10. Revisit this once `eslint-config-next`
> ships support for ESLint 10.

## Getting Started

### Prerequisites

- Node.js 20+
- npm (or yarn/pnpm/bun)

### Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:3000
```

### Build

```bash
npm run build
# → outputs to out/ (fully self-contained static site)
```

`prebuild`/`postbuild` run the quality gates automatically: data-freshness and rate-snapshot checks, generated summary regeneration, sitemap/RSS generation, security headers, performance budget, structured-data validation, internal-link and title checks, and service-worker versioning.

### Test

```bash
npm run lint          # ESLint
npm run typecheck     # tsc --noEmit
npm test              # Vitest unit/integration (run with -w to watch)
npm run test:coverage # coverage report
npm run test:e2e      # Playwright e2e + accessibility specs (chromium only; install first via npm run test:e2e:install)
npm run lhci          # Lighthouse CI gate against local static artifact (requires out/ built)
```

CI runs lint, typecheck, Vitest, and the Lighthouse gate on every push; the deploy workflow builds and publishes `out/` to GitHub Pages.

### Fetch Company Logos

```bash
npm run logos:fetch
```

The logo manifest lives in `scripts/logos-manifest.ts`. Update that manifest when
adding a verified Simple Icons slug, then run `npm run logos:fetch` to download
real SVGs and regenerate `src/data/logos-index.ts`.

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `SITE_URL` | No* | `https://fintech-atlas.com` | Canonical site URL for sitemap, SEO, and security.txt. **Required for production builds** (placeholder is rejected). Postbuild scripts resolve this from the env or `.env.local` via `scripts/lib/site-url.mjs`. |
| `NEXT_PUBLIC_ANALYTICS_DOMAIN` | No | unset | Optional cookieless Plausible-compatible analytics site id. When unset, no analytics script loads. |
| `NEXT_PUBLIC_WAITLIST_ENDPOINT` | No | unset | Optional third-party form endpoint for a Pro/partner waitlist. When unset, waitlist UI stays hidden. |
| `NEXT_PUBLIC_NEWSLETTER_FORM_ACTION` | No | unset | Optional newsletter provider form endpoint. When unset, email intent stays on-device and nothing is sent. |
| `NEXT_PUBLIC_BASE_PATH` | No | unset | Optional GitHub Pages project-site prefix such as `/fintech-atlas`; omit for root/custom-domain hosting. |

\* Development may use the placeholder; production builds refuse `example.com`.

Copy `.env.example` to `.env.local` and adjust as needed. The template is committed so fresh checkouts have a documented starting point.

## Deploy

The project emits a fully static `out/` directory. Serve it with any static host:

```bash
# Quick local test
npx serve out

# Or with Python
python -m http.server -d out 8080
```

Works with: **Netlify**, **Vercel**, **Cloudflare Pages**, **GitHub Pages**, **S3 + CloudFront**, or any static file server.

The repo includes a GitHub Pages deploy workflow (with build archiving and a documented rollback drill) and a scheduled uptime probe that files GitHub issues if the live site goes down. See [`docs/incident-runbook.md`](docs/incident-runbook.md) and [`docs/deployment-providers.md`](docs/deployment-providers.md).

## Methods & Disclaimers

- Company records are educational summaries; legacy source labels are being migrated to linked references and effective dates
- Displayed fees and FX outputs are illustrative assumptions and may vary by route, region, payment method, volume, or contract
- Bookmarks and private notes are stored locally in your browser only
- No accounts or server-side data collection — interactive state stays on your device
- Optional cookieless analytics may be enabled by the site operator (`NEXT_PUBLIC_ANALYTICS_DOMAIN`); disabled by default
- Read the published [Privacy Notice](./src/app/privacy/page.tsx) and [Terms of Use](./src/app/terms/page.tsx)
- Deployment and incident recovery procedures are documented in [`docs/incident-runbook.md`](docs/incident-runbook.md)
- The static build also emits `feed.xml` for article subscribers and a small production-only service worker with an offline fallback
- Provider-specific static hosting notes: [`docs/deployment-providers.md`](docs/deployment-providers.md)
- Architecture decisions (deferred backend goals): [`docs/adr/`](docs/adr/)
- India fintech market research: [`docs/research/india-fintech-directory.md`](docs/research/india-fintech-directory.md) (1,386-company master directory) and [`docs/research/india-fintech-directory-enriched.md`](docs/research/india-fintech-directory-enriched.md) (same companies with founders, funding, valuation, licences, and websites)