import { describe, it, expect } from "vitest";
import { PRESETS, presetsAreValid } from "@/data/compare-presets";
import { companies } from "@/data";
import { getCompanyBySlug } from "@/data";

describe("compare presets (#34)", () => {
  it("every preset slug resolves to a real company", () => {
    expect(presetsAreValid()).toBe(true);
  });

  it("every preset slug individually resolves", () => {
    for (const preset of PRESETS) {
      for (const slug of preset.slugs) {
        expect(getCompanyBySlug(slug), `preset "${preset.name}" references unknown slug "${slug}"`).toBeDefined();
      }
    }
  });

  it("no preset exceeds the 3-company compare limit", () => {
    for (const preset of PRESETS) {
      expect(preset.slugs.length).toBeLessThanOrEqual(3);
    }
  });

  it("no preset slug duplicates the same company", () => {
    for (const preset of PRESETS) {
      expect(new Set(preset.slugs).size, preset.name).toBe(preset.slugs.length);
    }
  });

  it("referenced slugs are a subset of the company list", () => {
    const known = new Set(companies.map((c) => c.slug));
    for (const preset of PRESETS) {
      for (const slug of preset.slugs) expect(known.has(slug)).toBe(true);
    }
  });
});
