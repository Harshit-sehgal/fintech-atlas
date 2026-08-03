import { describe, it, expect } from "vitest";
import {
  PROVIDER_FEE_CONFIGS,
  DEFAULT_MONTHLY_REVENUE,
  DEFAULT_AVG_ORDER_VALUE,
  DEFAULT_INTL_PERCENT,
  DEFAULT_IN_PERSON_PERCENT,
} from "@/data/fee-calculator-config";
import { CURRENCIES, REMITTANCE_PROVIDERS, DEFAULT_CURRENCY, DEFAULT_SEND_AMOUNT } from "@/data/remittance-config";
import { QUESTIONS, SCORE_WEIGHTS } from "@/data/matchmaker-config";
import { SITE_URL, assetPath, normalizeSiteUrl } from "@/lib/site-config";

describe("Fee Calculator Config", () => {
  it("has fee providers defined", () => {
    expect(PROVIDER_FEE_CONFIGS.length).toBeGreaterThan(0);
  });

  it("every provider has required fields", () => {
    for (const p of PROVIDER_FEE_CONFIGS) {
      expect(p.slug).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(["USD", "INR"]).toContain(p.currency);
      expect(typeof p.online.domPct).toBe("number");
      expect(typeof p.online.domFixed).toBe("number");
      expect(typeof p.online.intlSurcharge).toBe("number");
      expect(typeof p.online.intlFixed).toBe("number");
      expect(p.online.domPct).toBeGreaterThanOrEqual(0);
      expect(p.online.domFixed).toBeGreaterThanOrEqual(0);
      expect(p.online.intlSurcharge).toBeGreaterThanOrEqual(0);
      expect(p.online.intlFixed).toBeGreaterThanOrEqual(0);
      if (p.gstPercent !== undefined) {
        expect(p.gstPercent).toBeGreaterThanOrEqual(0);
        expect(p.gstPercent).toBeLessThanOrEqual(100);
      }
    }
  });

  it("has sensible default values", () => {
    expect(DEFAULT_MONTHLY_REVENUE).toBeGreaterThan(0);
    expect(DEFAULT_AVG_ORDER_VALUE).toBeGreaterThan(0);
    expect(DEFAULT_INTL_PERCENT).toBeGreaterThanOrEqual(0);
    expect(DEFAULT_INTL_PERCENT).toBeLessThanOrEqual(100);
    expect(DEFAULT_IN_PERSON_PERCENT).toBeGreaterThanOrEqual(0);
  });
});

describe("Remittance Config", () => {
  it("has currencies defined", () => {
    expect(CURRENCIES.length).toBeGreaterThan(0);
  });

  it("every currency has required fields and an explicit snapshot source", () => {
    for (const c of CURRENCIES) {
      expect(c.code).toBeTruthy();
      expect(c.symbol).toBeTruthy();
      expect(c.name).toBeTruthy();
      expect(c.rate).toBeGreaterThan(0);
      expect(c.source).toBeTruthy();
      expect(typeof c.sourceUrl).toBe("string");
    }
  });

  it("DEFAULT_CURRENCY exists in CURRENCIES", () => {
    expect(CURRENCIES.some((c) => c.code === DEFAULT_CURRENCY)).toBe(true);
  });

  it("DEFAULT_SEND_AMOUNT is positive", () => {
    expect(DEFAULT_SEND_AMOUNT).toBeGreaterThan(0);
  });

  it("has remittance providers defined", () => {
    expect(REMITTANCE_PROVIDERS.length).toBeGreaterThan(0);
  });

  it("every remittance provider has required fields", () => {
    for (const p of REMITTANCE_PROVIDERS) {
      expect(p.slug).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(["pct", "fixed", "pct_plus_fixed"]).toContain(p.feeModel);
      expect(typeof p.fxMargin).toBe("number");
      expect(p.speed).toBeTruthy();
    }
  });
});

describe("Matchmaker Config", () => {
  it("has questions defined", () => {
    expect(QUESTIONS.length).toBeGreaterThan(0);
  });

  it("every question has required fields", () => {
    for (const q of QUESTIONS) {
      expect(q.id).toBeTruthy();
      expect(q.title).toBeTruthy();
      expect(q.description).toBeTruthy();
      expect(Array.isArray(q.options)).toBe(true);
      expect(q.options.length).toBeGreaterThan(0);
      for (const opt of q.options) {
        expect(opt.id).toBeTruthy();
        expect(opt.title).toBeTruthy();
        expect(opt.description).toBeTruthy();
      }
    }
  });

  it("score weights are defined for each question", () => {
    for (const q of QUESTIONS) {
      expect(SCORE_WEIGHTS[q.id]).toBeDefined();
    }
  });

  it("every option id in each question has score entries", () => {
    for (const q of QUESTIONS) {
      const weights = SCORE_WEIGHTS[q.id];
      for (const opt of q.options) {
        expect(weights[opt.id]).toBeDefined();
      }
    }
  });

  it("entries without weights are empty objects (intentional fallthrough, not typos)", () => {
    // Empty-weight options (e.g. priority.all_in_one, scale.early) are a known
    // degenerate case surfaced with a "no strong match" notice in the UI.
    // Catch accidental drift: an entry that is neither empty nor a valid slug→points map.
    for (const q of QUESTIONS) {
      const weights = SCORE_WEIGHTS[q.id];
      for (const opt of q.options) {
        const entry = weights[opt.id];
        const keys = Object.keys(entry);
        for (const k of keys) {
          expect(typeof (entry as Record<string, unknown>)[k]).toBe("number");
          expect((entry as Record<string, number>)[k]).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });
});

describe("Site Config", () => {
  it("builds root-relative public asset paths by default", () => {
    expect(assetPath("/manifest.json")).toBe("/manifest.json");
    expect(assetPath("logos/stripe.svg")).toBe("/logos/stripe.svg");
  });

  it("SITE_URL is a valid string", () => {
    expect(typeof SITE_URL).toBe("string");
    expect(SITE_URL.length).toBeGreaterThan(0);
  });

  it("SITE_URL is a valid URL", () => {
    expect(() => new URL(SITE_URL)).not.toThrow();
  });

  it("requires a bounded rate snapshot age", async () => {
    const config = await import("@/data/remittance-config");
    expect(config.MAX_RATE_AGE_DAYS).toBeGreaterThan(0);
    expect(Number.isNaN(Date.parse(config.RATES_AS_OF))).toBe(false);
  });

  it("normalizes configured URLs to one canonical origin", () => {
    expect(normalizeSiteUrl("  https://example.com///  ")).toBe("https://example.com");
    expect(normalizeSiteUrl("https://example.com")).toBe("https://example.com");
  });
});