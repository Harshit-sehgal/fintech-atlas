import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Guards the page-level heading hierarchy: every top-level route page must have
 * exactly one <h1>. SectionHeading defaults to <h2>, so pages that use it as
 * their PRIMARY title must pass `headingLevel={1}` (the Hero on the home page
 * provides its own <h1>, and the dynamic [id] pages author their own).
 *
 * Added after an audit found ~10 pages rendering their primary title as <h2>
 * with no <h1> anywhere — a WCAG heading-order defect and an SEO gap.
 */
const PAGES_WITHOUT_OWN_H1: { file: string; title: string }[] = [
  { file: "src/app/about/client.tsx", title: "About & Methodology" },
  { file: "src/app/bookmarks/bookmarks-client.tsx", title: "Saved Items & Bookmarks" },
  { file: "src/app/compare/compare-client.tsx", title: "Compare FinTech Companies" },
  { file: "src/app/glossary/page.tsx", title: "FinTech Glossary & Terminology" },
  { file: "src/app/companies/client.tsx", title: "FinTech Companies Directory" },
  { file: "src/app/categories/page.tsx", title: "Categories" },
  { file: "src/app/tools/page.tsx", title: "FinTech Tools & Calculators" },
  { file: "src/app/tools/calculator/calculator-client.tsx", title: "Payment Gateway Fee Calculator" },
  { file: "src/app/tools/matchmaker/matchmaker-client.tsx", title: "FinTech Matchmaker Quiz" },
  { file: "src/app/tools/remittance/remittance-client.tsx", title: "Cross-Border Money Transfer Calculator" },
];

describe("heading hierarchy regression guard", () => {
  for (const { file, title } of PAGES_WITHOUT_OWN_H1) {
    it(`${file}: primary SectionHeading uses headingLevel={1} (title "${title}")`, () => {
      const src = readFileSync(resolve(process.cwd(), file), "utf8");
      // The page's SectionHeading must opt into an <h1>. Match the prop on the
      // SectionHeading that renders this title, so a future edit that drops it
      // fails here with the file + title named.
      const sectionHeadingBlock = src.match(
        new RegExp(`<SectionHeading[\\s\\S]*?title="${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[\\s\\S]*?/>`),
      );
      expect(sectionHeadingBlock, `SectionHeading for "${title}" not found in ${file}`).not.toBeNull();
      expect(sectionHeadingBlock![0]).toContain("headingLevel={1}");
    });
  }

  it("SectionHeading defaults to <h2> (headingLevel prop is optional, defaults via the component)", () => {
    const src = readFileSync(
      resolve(process.cwd(), "src/components/ui/section-heading.tsx"),
      "utf8",
    );
    // The component must keep accepting the prop and default to 2.
    expect(src).toContain("headingLevel?: 1 | 2");
    expect(src).toContain("headingLevel = 2");
    // It must render a dynamic tag (not a hard-coded <h2>) so the prop takes effect.
    expect(src).toMatch(/HeadingTag\s*=/);
  });
});
