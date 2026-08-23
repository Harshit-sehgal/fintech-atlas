import { describe, it, expect, beforeEach } from "vitest";
import {
  COMPARE_ROWS,
  isDivergent,
  keyDifferences,
  rowsByGroup,
  verdictStatements,
  visibleRows,
  verificationNote,
} from "@/lib/compare-view";
import {
  PRESETS,
  SCENARIOS,
  presetsAreValid,
  scenariosAreValid,
} from "@/data/compare-presets";
import {
  DEFAULT_COMPARE_SLUGS,
  MAX_COMPARE,
  parseCompareSlugs,
  readLastCompareSlugs,
  writeLastCompareSlugs,
} from "@/lib/compare";
import { companySummaries } from "@/generated/company-summaries";

const bySlug = (slug: string) => {
  const c = companySummaries.find((x) => x.slug === slug);
  if (!c) throw new Error(`missing fixture company: ${slug}`);
  return c;
};

describe("compare-view row model", () => {
  it("exposes exactly one Decide, Verify and Context group", () => {
    expect(rowsByGroup("decide").map((r) => r.id)).toEqual([
      "pricing-model",
      "advantage",
      "tradeoff",
      "customers",
    ]);
    expect(rowsByGroup("verify").map((r) => r.id)).toEqual(["source"]);
    expect(rowsByGroup("context").length).toBeGreaterThanOrEqual(4);
  });

  it("every row resolves to a non-empty string for every company", () => {
    for (const row of COMPARE_ROWS) {
      for (const c of companySummaries) {
        expect(typeof row.value(c)).toBe("string");
      }
    }
  });
});

describe("difference-first rendering (T106)", () => {
  it("shows every row when a single company is selected", () => {
    const stripe = [bySlug("stripe")];
    expect(visibleRows("decide", stripe).length).toBe(rowsByGroup("decide").length);
    expect(visibleRows("context", stripe).length).toBe(rowsByGroup("context").length);
  });

  it("hides rows where the selections agree once two companies are compared", () => {
    const pair = [bySlug("stripe"), bySlug("paypal")];
    const decide = visibleRows("decide", pair);
    // Every hidden row must genuinely agree; every shown row must diverge.
    for (const row of rowsByGroup("decide")) {
      const shown = decide.some((r) => r.id === row.id);
      expect(shown).toBe(isDivergent(row, pair));
    }
  });

  it("isDivergent is false only when all values match", () => {
    const row = rowsByGroup("decide")[0];
    const a = bySlug("stripe");
    expect(isDivergent(row, [a, { ...bySlug("stripe") }])).toBe(false);
    expect(isDivergent(row, [a, bySlug("wise")])).toBe(true);
  });

  it("keyDifferences returns at most three bullets naming each company", () => {
    const trio = [bySlug("stripe"), bySlug("wise"), bySlug("chime")];
    const bullets = keyDifferences(trio);
    expect(bullets.length).toBeGreaterThan(0);
    expect(bullets.length).toBeLessThanOrEqual(3);
    for (const b of bullets) {
      for (const c of trio) expect(b).toContain(c.name);
    }
  });

  it("keyDifferences is empty for a single selection", () => {
    expect(keyDifferences([bySlug("stripe")])).toEqual([]);
  });
});

describe("honest verdict block (T107)", () => {
  it("gives one hedged line per company and no winner language", () => {
    const lines = verdictStatements([bySlug("stripe"), bySlug("wise")]);
    expect(lines).toHaveLength(2);
    for (const line of lines) {
      expect(line.toLowerCase()).toContain("generally");
      expect(line).not.toMatch(/\bbetter than\b|\bwins\b|\bbeats\b/);
    }
  });

  it("falls back cleanly when strengths or weaknesses are undocumented", () => {
    const stripped = {
      ...bySlug("stripe"),
      primaryStrength: undefined,
      primaryWeakness: undefined,
    };
    const [only] = verdictStatements([stripped, bySlug("wise")]);
    expect(only).toContain("does not yet document enough detail");

    // Strength documented, tradeoff missing — third template branch.
    const halfDocumented = { ...bySlug("stripe"), primaryWeakness: undefined };
    const [half] = verdictStatements([halfDocumented, bySlug("wise")]);
    expect(half).toContain("does not document a specific tradeoff");
  });

  it("is empty unless two or more companies are selected", () => {
    expect(verdictStatements([bySlug("stripe")])).toEqual([]);
  });
});

describe("verification footnote", () => {
  it("mentions the review date and directs to provider pricing", () => {
    const note = verificationNote();
    expect(note).toContain("Q3 2026");
    expect(note.toLowerCase()).toContain("pricing page");
  });
});

describe("scenario router data contract (T105)", () => {
  it("every preset slug resolves to a real company", () => {
    expect(presetsAreValid()).toBe(true);
    expect(PRESETS.length).toBeGreaterThan(0);
  });

  it("every scenario references real slugs and real row ids", () => {
    expect(
      scenariosAreValid(COMPARE_ROWS.map((r) => r.id)),
    ).toBe(true);
    expect(SCENARIOS.map((s) => s.id)).toEqual([
      "freelancer-usd",
      "online-store",
      "enterprise-rails",
    ]);
  });
});

describe("last-comparison storage bridge (T101)", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("round-trips a validated selection", () => {
    writeLastCompareSlugs(["stripe", "wise"]);
    expect(readLastCompareSlugs(companySummaries)).toEqual(["stripe", "wise"]);
  });

  it("drops unknown slugs, de-duplicates and caps at three", () => {
    writeLastCompareSlugs(["stripe", "not-a-company", "stripe", "wise", "paypal", "adyen"]);
    const stored = readLastCompareSlugs(companySummaries);
    expect(stored).toEqual(["stripe", "wise", "paypal"]);
    expect(stored.length).toBeLessThanOrEqual(MAX_COMPARE);
  });

  it("returns empty on corrupted JSON or non-array payloads", () => {
    window.localStorage.setItem("fintech_atlas_compare_last", "{not json");
    expect(readLastCompareSlugs(companySummaries)).toEqual([]);
    window.localStorage.setItem("fintech_atlas_compare_last", JSON.stringify({ a: 1 }));
    expect(readLastCompareSlugs(companySummaries)).toEqual([]);
  });

  it("keeps the legacy URL parser intact alongside the new storage", () => {
    const params = new URLSearchParams("?companies=stripe,paypal");
    expect(parseCompareSlugs(params, companySummaries)).toEqual(["stripe", "paypal"]);
    expect(DEFAULT_COMPARE_SLUGS).toEqual(["stripe", "adyen"]);
  });
});
