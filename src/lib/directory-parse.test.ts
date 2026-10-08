import { describe, expect, it } from "vitest";
import {
  clusterGroups,
  distinctCategories,
  parseDirectoryTables,
  slugify,
} from "./directory-parse";

const HEADER =
  "| Company | Category | Founded | HQ | Founders | Funding | Valuation/Status | Licences | Website | Description |";
const SEP =
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |";

function row(name: string, category = "Payments", description = "A company."): string {
  return `| ${name} | ${category} | 2010 | London, UK | n/a | n/a | Private | n/a | x.com | ${description} |`;
}

describe("directory-parse", () => {
  it("parses rows under a cluster heading and strips the count suffix", () => {
    const md = ["## PAYMENTS (2)", HEADER, SEP, row("Alpha"), row("Beta")].join("\n");
    const records = parseDirectoryTables(md, "test");
    expect(records).toHaveLength(2);
    expect(records[0]).toMatchObject({
      name: "Alpha",
      category: "Payments",
      hq: "London, UK",
      cluster: "PAYMENTS",
    });
    expect(records[1].name).toBe("Beta");
  });

  it("unescapes pipes inside cells and ignores non-table lines", () => {
    const md = [
      "## X",
      HEADER,
      SEP,
      "| A \\| B | Cat | n/a | US | n/a | n/a | n/a | n/a | a.com | D |",
      "| too | few |",
      "not a row",
    ].join("\n");
    const records = parseDirectoryTables(md, "test");
    expect(records).toHaveLength(1);
    expect(records[0].name).toBe("A | B");
  });

  it("ignores header, separator, coverage-stats and odd-shape rows", () => {
    const md = [
      "## X",
      HEADER,
      SEP,
      "| Stats | Metric | a | b | c | d | e | f | g | h |",
      "| --- | x | x | x | x | x | x | x | x | x |",
      "| Metric | Value |",
      row("Alpha"),
    ].join("\n");
    expect(parseDirectoryTables(md, "test")).toHaveLength(1);
  });

  it("throws on a data row with no cluster heading", () => {
    const md = [HEADER, SEP, row("Alpha")].join("\n");
    expect(() => parseDirectoryTables(md, "test")).toThrow(/without a cluster heading/);
  });

  it("throws on a duplicate company name", () => {
    const md = ["## X", HEADER, SEP, row("Alpha"), row("Alpha")].join("\n");
    expect(() => parseDirectoryTables(md, "test")).toThrow(/Duplicate company name/);
  });

  it("suffixes colliding slugs and falls back for an empty slug", () => {
    const md = ["## X", HEADER, SEP, row("Same Name"), row("Same-Name"), row("!!!")].join(
      "\n",
    );
    const records = parseDirectoryTables(md, "test");
    expect(records.map((r) => r.slug)).toEqual(["same-name", "same-name-2", "company"]);
  });

  it("slugifies accents and ampersands and caps the length", () => {
    expect(slugify("Café & Co.")).toBe("cafe-and-co");
    expect(slugify("A".repeat(120))).toHaveLength(80);
  });

  it("groups clusters in first-appearance order with counts", () => {
    const md = ["## B", HEADER, SEP, row("A1"), "## A", HEADER, SEP, row("A2"), row("A3")].join(
      "\n",
    );
    expect(clusterGroups(parseDirectoryTables(md, "t"))).toEqual([
      { name: "B", count: 1 },
      { name: "A", count: 2 },
    ]);
  });

  it("lists distinct categories in first-appearance order", () => {
    const md = [
      "## X",
      HEADER,
      SEP,
      row("A1", "Payments"),
      row("A2", "Banking"),
      row("A3", "Payments"),
    ].join("\n");
    expect(distinctCategories(parseDirectoryTables(md, "t"))).toEqual(["Payments", "Banking"]);
  });
});
