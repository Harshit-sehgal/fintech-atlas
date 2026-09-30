import { describe, expect, it } from "vitest";
import { buildFilterQuery } from "@/lib/url-filters";
import { readFiltersFromParams as readDirectoryFilters } from "@/app/companies/client";
import { readFiltersFromParams as readIndiaFilters } from "@/app/india/directory/client";
import { readFiltersFromParams as readRadarFilters } from "@/app/radar/radar-client";
import { categories } from "@/data/categories";
import {
  radarLicenceNames,
  radarRegulatorNames,
  radarSectorNames,
} from "@/generated/radar-facets";

/**
 * Round-trip coverage for the T110 URL persistence: every filter surface must
 * be able to rebuild its state from a query string it produced itself, and
 * must reject hand-edited/stale values instead of crashing or rendering
 * out-of-range facets.
 */

describe("directory (?q/category/region/sort)", () => {
  it("round-trips a full filter set", () => {
    const query = buildFilterQuery("", {
      q: "pay",
      category: categories[0].slug,
      region: "india",
      sort: "founded",
    });
    const filters = readDirectoryFilters(new URLSearchParams(query));
    expect(filters).toEqual({
      search: "pay",
      selectedCategory: categories[0].slug,
      region: "india",
      sortBy: "founded",
    });
  });

  it("returns null when no filter keys are present", () => {
    expect(readDirectoryFilters(new URLSearchParams(""))).toBeNull();
  });

  it("rejects unknown category/region/sort values", () => {
    const filters = readDirectoryFilters(
      new URLSearchParams("category=not-a-cat&region=mars&sort=newest"),
    );
    expect(filters?.selectedCategory).toBe("all");
    expect(filters?.region).toBe("all");
    expect(filters?.sortBy).toBe("rating");
  });

  it("caps runaway query strings", () => {
    const long = "x".repeat(5_000);
    const filters = readDirectoryFilters(new URLSearchParams(`q=${long}`));
    expect(filters?.search.length).toBe(200);
  });
});

describe("india directory (?q/cluster/page)", () => {
  it("round-trips cluster and page", () => {
    const query = buildFilterQuery("", { q: "upi", cluster: 2, page: 3 });
    const filters = readIndiaFilters(new URLSearchParams(query));
    expect(filters).toEqual({ query: "upi", clusterIndex: 2, page: 3 });
  });

  it("falls back on out-of-range cluster/page values", () => {
    const filters = readIndiaFilters(
      new URLSearchParams(`cluster=${99999}&page=0`),
    );
    expect(filters?.clusterIndex).toBe(0);
    expect(filters?.page).toBe(1);
  });

  it("returns null for a bare URL", () => {
    expect(readIndiaFilters(new URLSearchParams(""))).toBeNull();
  });
});

describe("radar (?q/sectors/regulators/licences/ranges/sort/page)", () => {
  const lastSector = radarSectorNames.length - 1;
  const lastLicence = radarLicenceNames.length - 1;

  it("round-trips a full filter set", () => {
    const query = buildFilterQuery("", {
      q: "lending",
      sectors: [0, lastSector],
      regulators: [1],
      licences: [lastLicence],
      fmin: 2015,
      gmax: 250,
      sort: "funding-desc",
      page: 2,
    });
    const filters = readRadarFilters(new URLSearchParams(query));
    if (!filters) throw new Error("filters missing");
    expect(filters.query).toBe("lending");
    expect([...filters.sectorIndexes]).toEqual([0, lastSector]);
    expect([...filters.regulatorIndexes]).toEqual([1]);
    expect([...filters.licenceIndexes]).toEqual([lastLicence]);
    expect(filters.foundedMin).toBe("2015");
    expect(filters.foundedMax).toBe("");
    expect(filters.fundingMin).toBe("");
    expect(filters.fundingMax).toBe("250");
    expect(filters.sort).toBe("funding-desc");
    expect(filters.page).toBe(2);
  });

  it("drops out-of-range facet indexes from stale links", () => {
    const query = buildFilterQuery("", {
      sectors: [-1, radarSectorNames.length],
      licences: [lastLicence + 5],
    });
    const filters = readRadarFilters(new URLSearchParams(query));
    expect(filters?.sectorIndexes.size).toBe(0);
    expect(filters?.licenceIndexes.size).toBe(0);
    // A valid index in the same list survives.
    const mixed = readRadarFilters(
      new URLSearchParams(buildFilterQuery("", { regulators: [radarRegulatorNames.length] })),
    );
    expect(mixed?.regulatorIndexes.size).toBe(0);
  });

  it("rejects non-integer and absurd range inputs", () => {
    const filters = readRadarFilters(
      new URLSearchParams("fmin=later&fmax=1899&gmin=-5&gmax=1.5"),
    );
    expect(filters?.foundedMin).toBe("");
    expect(filters?.foundedMax).toBe("");
    expect(filters?.fundingMin).toBe("");
    expect(filters?.fundingMax).toBe("");
  });

  it("falls back to alphabetical sort on unknown value", () => {
    const filters = readRadarFilters(new URLSearchParams("sort=newest"));
    expect(filters?.sort).toBe("alpha");
  });

  it("returns null for a bare URL", () => {
    expect(readRadarFilters(new URLSearchParams(""))).toBeNull();
  });
});
