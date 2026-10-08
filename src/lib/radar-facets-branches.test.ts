import { describe, expect, it } from "vitest";
import {
  deriveRadarFacets,
  deriveSector,
  parseFoundedYear,
  parseFundingUsdM,
} from "./radar-facets";

describe("parseFundingUsdM branches", () => {
  it("parses B/K/M suffixes and the default (unitless) millions", () => {
    expect(parseFundingUsdM("~$1.24B+")).toBe(1240);
    expect(parseFundingUsdM("~$375K")).toBe(0.375);
    expect(parseFundingUsdM("~$741M (12 rounds)")).toBe(741);
    expect(parseFundingUsdM("$500")).toBe(500);
  });

  it("returns null for no USD amount and for a non-numeric match", () => {
    expect(parseFundingUsdM("IPO ₹18,300 Cr")).toBeNull();
    expect(parseFundingUsdM("$...")).toBeNull();
  });
});

describe("parseFoundedYear / deriveRadarFacets", () => {
  it("extracts a 4-digit year or null", () => {
    expect(parseFoundedYear("2016")).toBe(2016);
    expect(parseFoundedYear("unknown")).toBeNull();
  });

  it("derives facets from a research record", () => {
    const facets = deriveRadarFacets({
      cluster: "PAYMENTS",
      licences: "RBI PA",
      founded: "2015",
      funding: "$10M",
    });
    expect(facets.foundedYear).toBe(2015);
    expect(facets.fundingUsdM).toBe(10);
    expect(deriveSector("PAYMENTS")).toBe("payments");
  });
});
