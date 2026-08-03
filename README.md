# FinTech Atlas

A clear, plain-language guide to the FinTech industry — what each company does, how they differ, how they make money, and what the available editorial evidence suggests.

Built from public reference material and editorial summaries. Source URLs and effective dates are being migrated into the audited data model.

## Overview

FinTech Atlas is a Next.js 16 static-export website that serves as both an educational directory and an interactive decision suite. It catalogs **41 real-world FinTech companies** across **12 industry categories** with a **24-term glossary** and **4 interactive tools**.

### Features

| Section | Description |
|---|---|
| **Company Directory** | 41 company profiles with product details, pricing, editorial sentiment summaries, strengths & weaknesses |
| **Industry Categories** | 12 categories (Payments, Neobanks, Investing, Cross-Border, BNPL, Infrastructure, etc.) |
| **Glossary** | 24 financial technology terms with definitions, synonyms, and cross-references |
| **Compare Tool** | Side-by-side comparison matrix for up to 3 companies |
| **Fee Calculator** | Payment gateway fee estimator (Stripe, PayPal, Square, Adyen) |
| **FX Remittance** | Cross-border remittance cost calculator (Wise, Revolut, PayPal, Bank) |
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
│   ├── data/              # 41 companies, 12 categories, 24 glossary terms
│   └── lib/               # Theme, bookmarks, toast contexts
├── public/logos/          # 37 real SVG logos
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
| `SITE_URL` | No | `https://fintech-atlas.example.com` | Canonical site URL for sitemap and SEO. **Set this to your production URL** before deploying, or the sitemap/robots will point at the placeholder. |

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
- No tracking, analytics, or data collection — your data stays on your device
- Read the published [Privacy Notice](src/app/privacy/page.tsx) and [Terms of Use](src/app/terms/page.tsx)
- Deployment and incident recovery procedures are documented in [`docs/incident-runbook.md`](docs/incident-runbook.md)