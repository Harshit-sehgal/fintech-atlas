import { describe, expect, it } from "vitest";
import type { IndiaDirectoryRecord } from "@/lib/india-directory-parse";
import {
  categoryId,
  collectCategoryIds,
  coverageStats,
  importDirectory,
  importDirectoryRecord,
  mapCompanyStatus,
} from "./import-directory";

const rec = (over: Partial<IndiaDirectoryRecord> = {}): IndiaDirectoryRecord => ({
  slug: "acme",
  name: "Acme Ltd",
  category: "Payments",
  founded: "2010",
  hq: "Mumbai",
  founders: "A, B",
  funding: "$10M",
  valuationOrStatus: "Private",
  licences: "RBI PA",
  website: "https://www.acme.com/",
  description: "A fintech.",
  cluster: "PAYMENTS",
  ...over,
});

describe("categoryId / collectCategoryIds", () => {
  it("normalises labels into slug ids and dedupes variants", () => {
    expect(categoryId("Payments & Wallets!")).toBe("payments-and-wallets");
    const map = collectCategoryIds(["A B", "a-b", "A  B"]);
    expect(map.size).toBe(1);
    expect([...map.values()][0]).toBe("A B");
  });
});

describe("mapCompanyStatus", () => {
  it("detects lifecycle markers and defaults to operating", () => {
    expect(mapCompanyStatus("Acquired by X")).toBe("acquired");
    expect(mapCompanyStatus("Merged with Y")).toBe("merged");
    expect(mapCompanyStatus("Shut down in 2020")).toBe("shut-down");
    expect(mapCompanyStatus("Private, $1B valuation")).toBe("operating");
  });
});

describe("importDirectoryRecord", () => {
  it("normalises the website and derives evidence rows", () => {
    const record = importDirectoryRecord(rec());
    expect(record.company.website).toBe("acme.com");
    expect(record.company.foundedYear).toBe(2010);
    expect(record.funding).toHaveLength(1);
    expect(record.evidence.some((e) => e.fieldName === "website")).toBe(true);
    expect(record.evidence.some((e) => e.fieldName.startsWith("licence."))).toBe(true);
  });

  it("handles empty website and unparseable funding", () => {
    const record = importDirectoryRecord(rec({ website: "", funding: "n/a" }));
    expect(record.company.website).toBeUndefined();
    expect(record.funding).toEqual([]);
    expect(record.evidence.some((e) => e.fieldName === "fundingUsdM")).toBe(false);
  });

  it("leaves foundedYear undefined for unparseable input", () => {
    const record = importDirectoryRecord(rec({ founded: "unknown" }));
    expect(record.company.foundedYear).toBeUndefined();
  });
});

describe("importDirectory / coverageStats", () => {
  it("imports records and summarises coverage", () => {
    const snapshot = importDirectory([rec(), rec({ slug: "beta", website: "", funding: "n/a" })]);
    expect(snapshot.records).toHaveLength(2);
    const stats = coverageStats(snapshot);
    expect(stats.companies).toBe(2);
    expect(stats.websites).toBe(1);
    expect(stats.funding).toBe(1);
    expect(stats.evidenceRows).toBeGreaterThan(0);
  });
});
