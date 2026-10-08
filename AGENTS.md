<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project plan

Before starting any task, read `docs/EXECUTION_PLAN.md` — the single source of
truth for project strategy, the T001–T100 master task backlog, content rules,
page templates, and the ninety-day execution order. Reference task IDs (e.g.
T001) from that file in commits and PRs.

# Extending the site (keep it growing)

The site is built to scale to thousands of companies and many more pages.
Follow these seams rather than hand-composing new layouts:

- **Directory data is generated, not authored in code.** Add rows to
  `docs/research/global-fintech-directory.md` (10-column tables under a
  `## REGION — COUNTRY (n)` heading). `prebuild` runs
  `scripts/generate-global-directory.ts`, which parses it (shared engine:
  `src/lib/directory-parse.ts`) and emits the full records + the compact client
  subset into `src/generated/`. New regions and countries appear automatically;
  do not add per-country bespoke UI.
- **Grouping is a pure helper.** `src/lib/directory-groups.ts` turns any
  "cluster index + ordered cluster names" dataset into the region → country
  tree. Reuse it for future directories instead of re-deriving groups.
- **Collapsible lists use `Disclosure`** (`src/components/ui/disclosure.tsx`) —
  a controlled, `aria-expanded` headless disclosure. Any large, groupable list
  (regions, countries, categories, saved searches) should collapse the same way.
- **The highlighter is a wayfinding device, not decoration.** Use `Highlight`
  (`src/components/ui/highlight.tsx`) to mark the one current thing (counts,
  the active group) and `HighlightedText` to mark search matches. `MarkerRule`
  separates groups.
- **Navigation is one registry.** Add or rename a destination once in
  `src/lib/site-nav.ts`; the header, mobile drawer, bottom bar and footer all
  derive from it. Keep primary nav short; put nuance in `moreNavGroups` with a
  one-line clarifier.
- **Design tokens live in `src/app/globals.css`** (surface/text/accent/border
  roles, 2px radius). Reuse them; do not hard-code colours.
- **Every change must pass the same gates:** `npm run typecheck`,
  `typecheck:scripts`, `lint`, `test:coverage` (≥75% branches), and
  `npm run build` (postbuild: sitemap, security headers, JS budget, titles,
  descriptions, internal links, structured data).
- **Adding a page/route:** create it under `src/app/`, give it a title within
  the 65-char budget and a unique 70–160-char description, add a breadcrumb,
  and register it in `src/lib/site-nav.ts` if it belongs in navigation.
