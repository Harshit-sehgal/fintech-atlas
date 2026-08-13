# FinTech Atlas

A clear, plain-language guide to the FinTech industry — what each company does, how they differ, how they make money, and what the available editorial evidence suggests.

Built from public reference material and editorial summaries. Source URLs and effective dates are being migrated into the audited data model.

## Overview

FinTech Atlas is a Next.js 16 static-export website that serves as both an educational directory and an interactive decision suite. It catalogs **42 real-world FinTech companies** across **12 industry categories** with a **29-term glossary** and **6 interactive tools**.

### Features

| Section | Description |
|---|---|
| **Company Directory** | 42 company profiles with product details, pricing, editorial sentiment summaries, strengths & weaknesses |
| **Industry Categories** | 12 categories (Payments, Neobanks, Investing, Cross-Border, BNPL, Infrastructure, etc.) |
| **Glossary** | 29 financial technology terms with definitions, synonyms, and cross-references |
| **Compare Tool** | Side-by-side comparison matrix for up to 3 companies |
| **Fee Calculator** | Payment gateway fee estimator (Stripe, PayPal, Square, Adyen) |
| **Razorpay Fee Calculator** | India-specific Razorpay fee estimator with published rates and GST |
| **FX Remittance** | Cross-border remittance cost calculator (Wise, Revolut, PayPal, Bank) |
| **FX Markup Calculator** | Exchange-rate markup % and INR/USD loss for both directions |
| **Matchmaker Quiz** | 4-step quiz with weighted scoring to find the right FinTech tools |
| **Bookmarks** | LocalStorage-backed bookmarking for companies and glossary terms |
| **⌘K Search** | Command palette search across companies, categories, glossary, and tools |
| **Dark/Light Theme** | System-aware theme toggle with dark, light, and system modes |

## Architecture

```
fintech-website/
├── src/
│   ├── app/               # Next.js App Router pages & layouts
│   │   ├── about/         # Mission, methodology, FAQ, feedback
│   │   ├── bookmarks/     # Saved companies & glossary terms
│   │   ├── categories/    # 12 industry categories + drill-down
│   │   ├── companies/     # Full directory + individual profiles
│   │   ├── compare/       # Side-by-side comparison matrix
│   │   ├── glossary/      # A-Z glossary with search
│   │   ├── tools/         # Calculator, matchmaker, remittance
│   │   ├── layout.tsx     # Root layout (providers, metadata, SEO)
│   │   └── globals.css    # Design system (Tailwind v4 CSS variables & theming)
│   ├── components/
│   │   ├── home/          # Hero section with animated terminal
│   │   ├── layout/        # Site header (glass), footer
│   │   ├── SEO/           # JSON-LD structured data
│   │   └── ui/            # Reusable UI components
│   ├── data/              # 42 companies, 12 categories, 29 glossary terms
│   └── lib/               # Theme, bookmarks, toast contexts
├── public/logos/          # Official SVG logos for the catalog
├── docs/                  # Production-readiness checklists and incident runbook
└── scripts/               # Logo fetching & manifest generation
```

### Tech Stack

- **Next.js 16.2** (App Router) — output as fully static export (`output: "export"`)
- **React 19.2** with TypeScript 5 (strict mode)
- **Tailwind CSS v4** with CSS variables-based design system
- **Framer Motion** for animations and transitions
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