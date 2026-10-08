import { describe, expect, it } from "vitest";
import { groupByCategory, groupDirectory, splitClusterName } from "./directory-groups";

describe("splitClusterName", () => {
  it("splits a region — country cluster", () => {
    expect(splitClusterName("NORTH AMERICA — United States")).toEqual({
      region: "NORTH AMERICA",
      label: "United States",
    });
  });

  it("treats an unsplit name as a GLOBAL cluster", () => {
    expect(splitClusterName("CROSS-BORDER")).toEqual({ region: "GLOBAL", label: "CROSS-BORDER" });
  });
});

describe("groupDirectory", () => {
  const names = ["EUROPE — France", "EUROPE — Germany", "ASIA — Japan"];
  const rows = [
    { slug: "a", cluster: 0 },
    { slug: "b", cluster: 0 },
    { slug: "c", cluster: 2 },
  ];

  it("groups rows into region → cluster preserving first-seen order", () => {
    const regions = groupDirectory(names, rows, (r) => r.cluster);
    expect(regions.map((r) => r.name)).toEqual(["EUROPE", "ASIA"]);
    expect(regions[0].total).toBe(2);
    expect(regions[0].clusters[0].label).toBe("France");
    expect(regions[0].clusters[0].items.map((i) => i.slug)).toEqual(["a", "b"]);
    expect(regions[1].clusters[0].items.map((i) => i.slug)).toEqual(["c"]);
  });

  it("drops empty clusters", () => {
    const regions = groupDirectory(names, rows, (r) => r.cluster);
    const labels = regions[0].clusters.map((c) => c.label);
    expect(labels).toEqual(["France"]); // Germany had no rows
  });

  it("ignores rows whose cluster index is out of range", () => {
    const regions = groupDirectory(names, [{ slug: "x", cluster: 99 }], (r) => r.cluster);
    expect(regions).toEqual([]);
  });
});

describe("groupByCategory", () => {
  it("groups by label, largest first then alphabetical, trimming blanks to Other", () => {
    const rows = [
      { name: "a", cat: "Bank" },
      { name: "b", cat: "Bank" },
      { name: "c", cat: "Payments" },
      { name: "d", cat: "  " },
    ];
    const groups = groupByCategory(rows, (r) => r.cat);
    expect(groups.map((g) => g.name)).toEqual(["Bank", "Other", "Payments"]);
    expect(groups[0].items.map((i) => i.name)).toEqual(["a", "b"]);
  });
});
