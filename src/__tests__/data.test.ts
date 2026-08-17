import { describe, it, expect } from "vitest";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { execSync } from "node:child_process";
import { REAL_LOGOS } from "@/data/logos-index";
import {
  getCompanyBySlug,
  getCategoryBySlug,
  getCompaniesByCategory,
  companies,
  categories,
  glossary,
  categoryGlossaryMap,
} from "@/data";
import { validateCompanyProvenance } from "@/data/provenance";

describe("Data Access Helpers", () => {
  describe("getCompanyBySlug", () => {
    it("returns a company for a valid slug", () => {
      const company = getCompanyBySlug("stripe");
      expect(company).toBeDefined();
      expect(company!.slug).toBe("stripe");
      expect(company!.name).toBe("Stripe");
    });

    it("returns undefined for a nonexistent slug", () => {
      const company = getCompanyBySlug("nonexistent-company-slug");
      expect(company).toBeUndefined();
    });

    it("every company slug in the data resolves to a valid company", () => {
      for (const c of companies) {
        expect(getCompanyBySlug(c.slug)).toBeDefined();
      }
    });
  });

  describe("getCategoryBySlug", () => {
    it("returns a category for a valid slug", () => {
      const category = getCategoryBySlug("payments");
      expect(category).toBeDefined();
      expect(category!.slug).toBe("payments");
    });

    it("returns undefined for a nonexistent slug", () => {
      const category = getCategoryBySlug("nonexistent");
      expect(category).toBeUndefined();
    });
  });

  describe("getCompaniesByCategory", () => {
    it("returns companies for a valid category slug", () => {
      const result = getCompaniesByCategory("payments");
      expect(result.length).toBeGreaterThan(0);
      for (const c of result) {
        expect(c.categories).toContain("payments");
      }
    });

    it("returns empty array for nonexistent category", () => {
      const result = getCompaniesByCategory("nonexistent");
      expect(result).toEqual([]);
    });
  });
});

describe("Data Integrity", () => {
  describe("companies", () => {
    it("has at least 10 companies", () => {
      expect(companies.length).toBeGreaterThanOrEqual(10);
    });

    it("every company has a unique slug", () => {
      const slugs = companies.map((c) => c.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    });

    it("every company has required fields", () => {
      for (const c of companies) {
        expect(c.slug).toBeTruthy();
        expect(c.name).toBeTruthy();
        expect(c.oneLiner).toBeTruthy();
        expect(c.accent).toBeTruthy();
        expect(c.founded).toBeGreaterThan(0);
        expect(c.employees).toBeTruthy();
        expect(c.headquarters).toBeTruthy();
        expect(Array.isArray(c.categories)).toBe(true);
        expect(c.categories.length).toBeGreaterThan(0);
        expect(Array.isArray(c.strengths)).toBe(true);
        expect(c.strengths.length).toBeGreaterThan(0);
        expect(Array.isArray(c.weaknesses)).toBe(true);
        expect(c.weaknesses.length).toBeGreaterThan(0);
        expect(typeof c.userReviews.rating).toBe("number");
        expect(c.userReviews.rating).toBeGreaterThanOrEqual(1);
        expect(c.userReviews.rating).toBeLessThanOrEqual(5);
        expect(Array.isArray(c.sources)).toBe(true);
        expect(c.sources.length).toBeGreaterThan(0);
      }
    });

    it("stores a numeric valuation amount for every comparable valuation and none for subsidiaries", () => {
      for (const c of companies) {
        const display = c.valuation;
        const looksComparable =
          /^\$\s*[\d,.]+\s*(T|B|M)\b/i.test(display);
        const isSubsidiary =
          /N\/A|part of|Part of|Acquired by/i.test(display);

        if (c.valuationAmountUsd !== undefined) {
          expect(c.valuationAmountUsd).toBeGreaterThan(0);
        }

        // A clean numeric valuation must have a stored amount so the directory
        // can sort by number rather than parsing display text (audit #37).
        if (looksComparable) {
          expect(c.valuationAmountUsd, `${c.slug} should store a numeric valuation`).toBeGreaterThan(0);
        }
        // Subsidiaries/products of a parent are intentionally not comparable.
        if (isSubsidiary) {
          expect(c.valuationAmountUsd, `${c.slug} is a subsidiary and should have no independent valuation`).toBeUndefined();
        }
      }
    });

    it("every company has valid structured provenance when provided", () => {
      for (const company of companies) {
        expect(
          validateCompanyProvenance(company),
          `${company.slug} has invalid structured provenance`,
        ).toEqual([]);
      }
    });

    it("every company references only valid category slugs", () => {
      const categorySlugs = new Set(categories.map((cat) => cat.slug));
      for (const c of companies) {
        for (const catSlug of c.categories) {
          expect(categorySlugs.has(catSlug)).toBe(true);
        }
      }
    });
  });

  describe("categories", () => {
    it("has categories", () => {
      expect(categories.length).toBeGreaterThan(0);
    });

    it("every category has a unique slug", () => {
      const slugs = categories.map((c) => c.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    });

    it("every category has required fields", () => {
      for (const cat of categories) {
        expect(cat.slug).toBeTruthy();
        expect(cat.name).toBeTruthy();
        expect(cat.accent).toBeTruthy();
        expect(cat.short).toBeTruthy();
        expect(cat.icon).toBeTruthy();
      }
    });
  });

  describe("glossary", () => {
    it("has glossary entries", () => {
      expect(glossary.length).toBeGreaterThan(0);
    });

    it("every glossary entry has a unique slug", () => {
      const slugs = glossary.map((g) => g.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    });

    it("every glossary entry has required fields", () => {
      for (const g of glossary) {
        expect(g.slug).toBeTruthy();
        expect(g.term).toBeTruthy();
        expect(g.short).toBeTruthy();
        expect(g.long).toBeTruthy();
        expect(Array.isArray(g.related)).toBe(true);
      }
    });

    it("every glossary `related` slug points to an existing term", () => {
      const slugs = new Set(glossary.map((g) => g.slug));
      for (const g of glossary) {
        for (const r of g.related) {
          expect(slugs.has(r)).toBe(true);
        }
      }
    });

    it("every categoryGlossaryMap key is a real category slug", () => {
      // The map powers the "Key Domain Terminology" section on each category
      // page; a key that isn't a category slug is dead config (the section
      // would never render) or a typo (the category page wouldn't get the
      // expected terms).
      const categorySlugs = new Set(categories.map((c) => c.slug));
      for (const key of Object.keys(categoryGlossaryMap)) {
        expect(categorySlugs.has(key), `categoryGlossaryMap key "${key}" is not a category slug`).toBe(true);
      }
    });

    it("every categoryGlossaryMap value points to an existing glossary term", () => {
      // A dangling term ref here renders an empty/broken card on the category
      // page. Caught at CI time so edits to glossary slugs stay in sync with
      // the categorized directory.
      const glossarySlugs = new Set(glossary.map((g) => g.slug));
      for (const [cat, terms] of Object.entries(categoryGlossaryMap)) {
        for (const term of terms) {
          expect(
            glossarySlugs.has(term),
            `categoryGlossaryMap["${cat}"] references missing glossary term "${term}"`
          ).toBe(true);
        }
      }
    });
  });

  describe("logo assets", () => {
    it("every REAL_LOGOS entry corresponds to an existing company", () => {
      // Orphaned logo-index entries (referencing companies that were removed
      // from the dataset) are a recurring source of dead assets. This guards
      // against regressions: if a company is dropped, its logo entry must go too.
      const companySlugs = new Set(companies.map((c) => c.slug));
      for (const logoSlug of Object.keys(REAL_LOGOS)) {
        expect(companySlugs.has(logoSlug)).toBe(true);
      }
    });

    it("every REAL_LOGOS entry points to an existing company's own slug", () => {
      // A REAL_LOGOS key must match the company's slug, not just any company
      // (an SVG fetched for slug X should be used by company X, not company Y).
      for (const logoSlug of Object.keys(REAL_LOGOS)) {
        const company = getCompanyBySlug(logoSlug);
        expect(company).toBeDefined();
        expect(company!.logo).toBe(logoSlug);
      }
    });
  });

  describe("inline logo shape dark-mode legibility", () => {
    // The catalog tile in dark mode is `--surface-raised: #15151c` (near-black).
    // A mark whose `color` is also near-black collapses to invisibility unless
    // it carries a contrasting `bg` (branded surface) or the SVG paths draw
    // their own bright fill/stroke. This regression-guard rejects any new
    // near-black inline mark that lacks both mitigations.
    // (Added after zip + column were found rendering invisibly in dark mode.)
    it("no near-black inline mark is rendered on the default dark tile", async () => {
      const { logoShapes } = await import("@/components/ui/company-logo");
      const nearBlackMax = 0x2e; // #2D2D2D and darker
      const isNearBlack = (hex: string) => {
        const m = /^#([0-9a-f]{6})$/i.exec(hex);
        if (!m) return false;
        const r = parseInt(m[1].slice(0, 2), 16);
        const g = parseInt(m[1].slice(2, 4), 16);
        const b = parseInt(m[1].slice(4, 6), 16);
        return r <= nearBlackMax && g <= nearBlackMax && b <= nearBlackMax;
      };
      // Bright, explicitly-coloured draw inside the SVG (yellow, cyan, teal,
      // white…) rescues a near-black `color` even without a `bg`.
      const hasBrightInterior = (svg: string) =>
        /#(fff|ffffff|FFCB05|FFD700|38BDF8|5EEAD4|0BE1C1|9FE870|FFD600|FF9900)/i.test(svg);

      for (const [slug, shape] of Object.entries(logoShapes)) {
        if (!isNearBlack(shape.color)) continue;
        const ok = !!shape.bg || hasBrightInterior(shape.svg);
        // Surface the offending slug so a future regression names the brand,
        // not just "expected false to be true".
        expect(ok, `near-black inline mark "${slug}" is invisible on the dark tile`).toBe(true);
      }
    });

    it("every company has a unique name", () => {
      // Duplicate company names (e.g. a stale entry re-added under a different
      // slug — found "Root Insurance" at both `root` and `root-insurance`)
      // silently confuse users. This guard catches it at CI time.
      const seen = new Map<string, string>();
      for (const c of companies) {
        const prev = seen.get(c.name);
        expect(prev, `duplicate name "${c.name}" (slug: "${prev}" and "${c.slug}")`).toBeUndefined();
        seen.set(c.name, c.slug);
      }
    });
  });

  describe("public asset integrity", () => {
    it("no orphaned static assets in public/ — every file is referenced in the codebase or configuration", () => {
      // Orphaned assets (files in public/ that nothing references) bloat the
      // static export and drift away from their intended purpose. This guard
      // catches them at CI time — if you remove a reference to a public file,
      // this test reminds you to remove the file too.
      //
      // Previously caught:
      //  - favicon.svg (2026-08-02 iter 10) — layout.tsx uses globe.svg for icons
      //  - tradingview.svg + western-union.svg (iter 5) — companies removed from dataset
      //
      // Public files that are intentionally unreferenced (consumed only by
      // browser convention, not by source-code import) are allowlisted.
      const ALLOW_UNREFERENCED = new Set([
        "robots.txt",                 // consumed by crawlers, not source code
        ".well-known/security.txt",   // consumed by security researchers/hosts
      ]);

      const IGNORE_BUILD_ARTIFACTS = new Set([
        "sitemap.xml",
        "sitemap-0.xml",
      ]);

      const publicDir = resolve(process.cwd(), "public");

      const publicFiles = readdirSync(publicDir, { recursive: true }) as string[];

      for (const file of publicFiles) {
        if (IGNORE_BUILD_ARTIFACTS.has(file)) continue;
        if (ALLOW_UNREFERENCED.has(file)) continue;

        const basename = file.split("/").pop()!;

        // Logo SVGs in public/logos/ are referenced by slug in logos-index.ts,
        // not by their filenames (e.g. "adp.svg" is referenced as "adp").
        // For these we check against REAL_LOGOS keys.
        if (file.startsWith("logos/") && file.endsWith(".svg")) {
          const slug = basename.replace(/\.svg$/, "");
          const isMissing = !Object.keys(REAL_LOGOS).includes(slug);
          expect(!isMissing, `orphaned public/ asset: "${file}" — no matching slug "${slug}" in REAL_LOGOS`).toBe(true);
          continue;
        }

        // For non-logo files, grep for the exact basename in src/.
        try {
          execSync(`grep -rq "${basename}" src/`, { cwd: process.cwd(), stdio: "pipe" });
        } catch {
          // grep returns 1 if no match found — the asset is orphaned.
          expect(file, `orphaned public/ asset: "${file}" is not referenced anywhere in src/`).toBe("REFERENCED");
        }
      }
    });
  });

  describe("source-tree hygiene — no stale backup/temp files in src/", () => {
    // Editor detritus and partial-edit backups (*.backup, *.backup2,
    // *.tmp, *.tmp2, *.orig, *.bak, *~, *.swp) accumulate during long
    // refactors and never get cleaned up. They bloat the tree, confuse
    // grep, and (when they sit next to a data module) can shadow the real
    // file in some tooling. This guard fails the build the moment one
    // lands in src/, forcing a cleanup at PR time.
    //
    // Previously caught:
    //  - 2026-08-03: companies.tmp2 + companies.ts.backup2 (8 KB + 17 KB
    //    stale partial-JSON dumps left over from a data reconstruction).
    it("no editor backup, temp, or swap files under src/", () => {
      const STALE = /\.(backup\d*|tmp\d*|orig|bak|swp)$|[~~]$/;
      const srcDir = resolve(process.cwd(), "src");
      const offenders: string[] = [];
      const walk = (dir: string) => {
        for (const entry of readdirSync(dir, { withFileTypes: true })) {
          const full = resolve(dir, entry.name);
          if (entry.isDirectory()) walk(full);
          else if (STALE.test(entry.name)) offenders.push(full.replace(srcDir + "/", ""));
        }
      };
      walk(srcDir);
      expect(offenders, `stale backup/temp files in src/: ${offenders.join(", ")}`).toEqual([]);
    });
  });

  describe("semantic text-colour theme-awareness", () => {
    // Tailwind's static-shade text utilities (text-emerald-400, text-amber-300,
    // text-emerald-500, text-red-400, text-indigo-400, ...) are hardcoded oklch
    // values tuned for a single surface. On the opposite theme's --surface
    // (#f4f4f5 light / #13131a dark) they collapse to 1.2-3:1 contrast -- a
    // WCAG-AA failure (normal text needs 4.5:1). The fix (iter 11 + iter 13)
    // replaced them with theme-aware text-success-text / text-warning-text /
    // text-danger-text / text-[var(--accent)], wired in @theme inline to
    // per-theme AA-passing shades. This guard stops the static shades from
    // creeping back. Decorative *fill* tints (bg-emerald-500/10-style) are
    // allowed -- the defect class is text/glyph contrast, not tints.
    //
    // Previously caught:
    //  - iter 11: ~22 hardcoded text-*-400 usages across home, about, compare,
    //    companies, glossary, categories, bookmarks, calculator, remittance,
    //    and command-palette -- all failed WCAG-AA in light mode.
    //  - iter 13: text-amber-300 (1.2:1, virtually invisible in light) on the
    //    bookmark button in companies/[id]/client.tsx, and text-emerald-500
    //    (2.3:1) on the tools-page feature checkmark -- both failed AA in light.

    it("no hardcoded Tailwind static-shade text colours in components (use text-*-text / var(--accent))", () => {
      // Match any text-COLOR-SHADE token where COLOR is a Tailwind named hue
      // and SHADE is a 2- or 3-digit numeric shade. Covers every Tailwind
      // colour that has numeric shades (excludes white/black/inherit which
      // have none). Patterns all start with `text-` so a matching fill
      // (bg-emerald-400) cannot false-positive; the semantic tokens
      // (text-success-text, text-warning-text, text-danger-text) have no
      // numeric shade suffix and so do not match.
      const HUES = [
        "emerald", "green", "lime", "amber", "yellow",
        "red", "rose", "orange", "blue", "sky", "indigo",
        "purple", "violet", "fuchsia", "pink", "cyan", "teal",
        "slate", "gray", "zinc", "neutral", "stone",
      ];
      const pattern = HUES.map((h) => `text-${h}-[0-9]{2,3}`).join("|");
      let matches = "";
      try {
        // Exclude tests (the hue list above would match inside this file).
        matches = execSync(
          `grep -rnE --include='*.tsx' --include='*.ts' --exclude-dir='__tests__' "${pattern}" src/`,
          { cwd: process.cwd(), stdio: ["pipe", "pipe", "pipe"] }
        ).toString();
      } catch {
        // grep exits 1 when nothing matches -> the guard passes.
      }

      const offenders = matches.trim().split("\n").filter(Boolean);

      expect(
        offenders,
        `Hardcoded Tailwind static-shade text colours found (fail WCAG-AA in ` +
          `the opposing theme). Use text-success-text / text-warning-text / ` +
          `text-danger-text / text-[var(--accent)] instead:\n${offenders.join("\n")}`
      ).toEqual([]);
    });
  });

  describe("per-page OpenGraph metadata", () => {
    // Next.js shallowly replaces the inherited root `openGraph` object when a
    // page sets its own — it does NOT merge the page's `title`/`description`
    // into the inherited `og:title`/`og:description`. So a route `page.tsx`
    // that exports `title`+`description` but no `openGraph` renders with the      // *homepage's* og:title/og:url on its social card (observed before the page-level metadata fix:
    // every per-company/category page showed "FinTech Atlas — Understand the
    // companies reshaping finance" with og:url="/"). Each route page must
    // therefore own an `openGraph` block with its own title/description/url.
    //
    // Previously caught (iter 12): 13 route pages (about, bookmarks,
    // categories, categories/[id], companies, companies/[id], compare, glossary,
    // home, tools, tools/calculator, tools/matchmaker, tools/remittance) all
    // rendered the homepage OG card. Fixed by adding page-level openGraph +
    // a shared-image fragment (src/lib/shared-metadata.ts).
    it("every route page exports a page-level openGraph block (no silent root inheritance)", () => {
      // Find every page.tsx under src/app (route pages only — exclude layouts,
      // client components, loading/error boundaries).
      const pages = execSync("find src/app \\( -name 'page.tsx' -o -name 'not-found.tsx' \\)", {
        cwd: process.cwd(),
        stdio: ["pipe", "pipe", "pipe"],
      })
        .toString()
        .trim()
        .split("\n")
        .filter(Boolean);

      const offenders: string[] = [];
      for (const page of pages) {
        const body = execSync(`cat "${page}"`, {
          cwd: process.cwd(),
          stdio: ["pipe", "pipe", "pipe"],
        }).toString();
        // Every page must (a) export metadata/generateMetadata and (b) own an
        // `openGraph` block. This can be either an inline `openGraph:` field or
        // a `pageMetadata({...})` call (the shared helper always sets
        // openGraph with its own `url:` pinned to the page). `url:` is required
        // so og:url pins to the page, not the homepage.
        const usesPageMetadata = /pageMetadata\(/.test(body);
        if (!/openGraph\s*:/.test(body) && !usesPageMetadata) {
          offenders.push(`${page}: missing openGraph block (renders homepage OG card)`);
        } else if (page.endsWith("not-found.tsx")) {
          // 404 responses are explicitly noindex and intentionally omit OG URL
          // and canonical metadata, so they cannot be mistaken for a content page.
          continue;
        } else if (!/url\s*:/.test(body) && !usesPageMetadata) {
          offenders.push(`${page}: openGraph block has no url: (og:url falls back to homepage)`);
        }
      }

      expect(
        offenders,
        `Route pages without a page-level openGraph block render the homepage's ` +
          `OG card (og:title/og:url/og:description all wrong for per-page shares):\n` +
          offenders.join("\n")
      ).toEqual([]);
    });

    it("root layout twitter block omits title/description (would override per-page cards)", () => {
      // The fix for the per-page OG defect relies on the root NOT pinning
      // twitter:title / twitter:description, so X's crawler falls back to each
      // page's own og:title / og:description. A root-level twitter.title would
      // shallow-override every share back to the homepage's title — the same
      // footgun as the openGraph case. Guard the invariant.
      const layout = execSync(`cat "src/app/layout.tsx"`, {
        cwd: process.cwd(),
        stdio: ["pipe", "pipe", "pipe"],
      }).toString();

      // Isolate the twitter block so we don't false-match `title:`/`description:`
      // belonging to the `openGraph` or root `title`/`description` siblings.
      const twitterBlock = layout.match(/twitter:\s*\{([\s\S]*?)\n\s*\},/);
      expect(twitterBlock, "src/app/layout.tsx: missing twitter metadata block").toBeTruthy();
      const block = twitterBlock![1];

      expect(
        /\btitle\s*:/.test(block),
        "src/app/layout.tsx: twitter.title present — removes per-page share titles. " +
          "Remove it so X falls back to each page's og:title."
      ).toBe(false);
      expect(
        /\bdescription\s*:/.test(block),
        "src/app/layout.tsx: twitter.description present — removes per-page share descriptions. " +
          "Remove it so X falls back to each page's og:description."
      ).toBe(false);
    });

    it("no metadata description contains a hardcoded numeric count (would go stale)", () => {
      // Descriptions like "Profiles of 12 major FinTech companies" go stale
      // instantly when the underlying entity list grows (there are 41
      // companies, not 12). A general-purpose brand description should avoid
      // embedding counts; counts belong in template strings sourced from data.
      //
      // Previously caught (iter 13): companies/layout.tsx had "12" (corrected
      // to no-count wording).
      const layoutAndPages = execSync(
        "find src/app -name 'layout.tsx' -o -name 'page.tsx'",
        { cwd: process.cwd(), stdio: ["pipe", "pipe", "pipe"] }
      )
        .toString()
        .trim()
        .split("\n")
        .filter(Boolean);

      const offenders: string[] = [];
      for (const file of layoutAndPages) {
        // Find description: lines; a standalone digit on the line's content
        // after the colon is suspicious but OK if it's e.g. "10%" (false positive
        // too aggressive) — instead look for a \d+\s+ modifier (N+<unit>) or
        // \d+-word. A description with "over 100" or "leading …" or "dozens" is
        // fine; "12 major" is not.
        const body = execSync(`cat "${file}"`, {
          cwd: process.cwd(),
          stdio: ["pipe", "pipe", "pipe"],
        }).toString();
        // Match description: lines that contain a digit followed by a space and
        // a noun phrase—word (e.g. "12 major", "50 companies", "24 terms").
        const countLines = [...body.matchAll(/description\s*:\s*"([^"]*\d+[^"]*)"/g)];
        for (const m of countLines) {
          const text = m[1];
          // Exempt ephemeral/contextual numbers: "Q3 2026", ranges like
          // "$10k" / "$100k+", and percentage ranges like "4–9%". Also exempt
          // single digits used as qualifiers ("4 quick questions").
          if (text.startsWith("Q") || /\$\d+[kK]/.test(text) || /\d+[–\-]\d+%/.test(text)) continue;
          // A count pattern: one\d followed by a noun spacer (e.g. "12 major")
          if (/\d\w*\s+\w+\s/.test(text) || /\b\d+\s+\b/.test(text)) {
            offenders.push(`${file}: description="${text.substring(0, 70)}"`);
          }
        }
      }

      expect(
        offenders,
        `Metadata descriptions with hardcoded numeric counts found (go stale when data changes). ` +
          `Use a qualitative description without embedded counts:\n${offenders.join("\n")}`
      ).toEqual([]);
    });
  });

  describe("structured-data (JSON-LD) URL canonicalization", () => {
    // Google's ItemList/Carousel docs require the `url` of each ListItem to be
    // the canonical URL of the item's detail page. The site uses
    // `trailingSlash: true` (next.config.ts), so canonical company URLs end
    // with a trailing slash (matching the page's <link rel="canonical"> and
    // the sitemap <loc>). A structured-data URL without the trailing slash is
    // a DIFFERENT URL per Google's canonicalization, so the rich-result
    // signals wouldn't bind to the canonical page — flagged in Search Console.
    //
    // Previously caught (iter 14): src/components/SEO/StructuredData.tsx
    // emitted `${SITE_URL}/companies/${slug}` (no trailing slash) while every
    // other URL form in the codebase + sitemap uses the trailing slash.

    it("Item ListItem URLs end with a trailing slash (match canonical form)", () => {
      const src = execSync(`cat "src/components/SEO/StructuredData.tsx"`, {
        cwd: process.cwd(),
        stdio: ["pipe", "pipe", "pipe"],
      }).toString();

      // The ItemList delegates route formatting to the shared helper. This is
      // intentionally source-level: the schema is a module constant and is not
      // rendered in this unit-test environment.
      expect(src).toContain("canonicalUrl(`/companies/${company.slug}`)");
      expect(src).not.toMatch(/url:\s*`[^`]*\/companies\/\$\{company\.slug\}`/);
    });
  });
});