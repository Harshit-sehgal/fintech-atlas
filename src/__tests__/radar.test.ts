import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseEnrichedDirectory } from "@/lib/india-directory-parse";
import {
  deriveRadarFacets,
  RADAR_LICENCES,
  RADAR_REGULATORS,
  RADAR_SECTORS,
} from "@/lib/radar-facets";
import { indiaDirectorySummaries } from "@/generated/india-directory-summaries";
import {
  radarFacetCount,
  radarFoundedYears,
  radarFundingUsdM,
  radarLicenceMasks,
  radarLicenceNames,
  radarRegulatorIndexes,
  radarRegulatorNames,
  radarSectorIndexes,
  radarSectorNames,
} from "@/generated/radar-facets";

const markdownPath = resolve(
  process.cwd(),
  "docs/research/india-fintech-directory-enriched.md",
);

/**
 * Contract: the generated radar-facet module must mirror the enriched research
 * markdown, positionally aligned with the client summaries (same parse order),
 * and derive its values through the same deterministic rules the unit tests
 * exercise. Any drift here means the generator or a stale generated file is
 * out of sync with the directory page.
 */
describe("radar facets (generated from research markdown)", () => {
  const records = parseEnrichedDirectory(readFileSync(markdownPath, "utf8"));
  const freshFacets = records.map((record) => deriveRadarFacets(record));

  it("covers the full directory and stays aligned with the summaries", () => {
    expect(radarFacetCount).toBe(1386);
    expect(radarFacetCount).toBe(indiaDirectorySummaries.length);
    expect(radarSectorIndexes).toHaveLength(radarFacetCount);
    expect(radarRegulatorIndexes).toHaveLength(radarFacetCount);
    expect(radarLicenceMasks).toHaveLength(radarFacetCount);
    expect(radarFoundedYears).toHaveLength(radarFacetCount);
    expect(radarFundingUsdM).toHaveLength(radarFacetCount);
  });

  it("derives every record through the shared facet rules", () => {
    for (let i = 0; i < radarFacetCount; i += 1) {
      const fresh = freshFacets[i];
      expect(radarSectorIndexes[i], `sector mismatch at ${records[i].name}`).toBe(
        RADAR_SECTORS.indexOf(fresh.sector),
      );
      expect(
        radarRegulatorIndexes[i],
        `regulator mismatch at ${records[i].name}`,
      ).toBe(RADAR_REGULATORS.indexOf(fresh.regulator));
      expect(radarLicenceMasks[i], `licence mismatch at ${records[i].name}`).toBe(
        fresh.licences.reduce(
          (mask, licence) => mask | (1 << RADAR_LICENCES.indexOf(licence)),
          0,
        ),
      );
      expect(radarFoundedYears[i], `founded mismatch at ${records[i].name}`).toBe(
        fresh.foundedYear ?? -1,
      );
      expect(radarFundingUsdM[i], `funding mismatch at ${records[i].name}`).toBe(
        fresh.fundingUsdM ?? -1,
      );
    }
  });

  it("keeps every index inside the pooled label arrays", () => {
    for (let i = 0; i < radarFacetCount; i += 1) {
      expect(radarSectorIndexes[i]).toBeGreaterThanOrEqual(0);
      expect(radarSectorIndexes[i]).toBeLessThan(radarSectorNames.length);
      expect(radarRegulatorIndexes[i]).toBeGreaterThanOrEqual(0);
      expect(radarRegulatorIndexes[i]).toBeLessThan(radarRegulatorNames.length);
    }
  });

  it("encodes licence masks within the licence taxonomy", () => {
    const validBits = RADAR_LICENCES.reduce(
      (mask, _, index) => mask | (1 << index),
      0,
    );
    for (let i = 0; i < radarFacetCount; i += 1) {
      const mask = radarLicenceMasks[i];
      expect(mask).toBeGreaterThanOrEqual(0);
      expect(mask & ~validBits, `mask out of taxonomy at ${records[i].name}`).toBe(0);
    }
  });

  it("samples a known company through the full pipeline", () => {
    const razorpayIndex = indiaDirectorySummaries.findIndex(
      (summary) => summary.slug === "razorpay",
    );
    expect(razorpayIndex).toBeGreaterThanOrEqual(0);
    expect(radarSectorNames[radarSectorIndexes[razorpayIndex]]).toBe("Payments");
    expect(radarRegulatorNames[radarRegulatorIndexes[razorpayIndex]]).toBe("RBI");
    expect(radarFoundedYears[razorpayIndex]).toBe(2014);
    expect(radarFundingUsdM[razorpayIndex]).toBe(741);
    expect(radarLicenceMasks[razorpayIndex]).not.toBe(0);
  });

  it("pools unique display labels with no duplicates", () => {
    expect(new Set(radarSectorNames).size).toBe(radarSectorNames.length);
    expect(new Set(radarRegulatorNames).size).toBe(radarRegulatorNames.length);
    expect(new Set(radarLicenceNames).size).toBe(radarLicenceNames.length);
  });
});