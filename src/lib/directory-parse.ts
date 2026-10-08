/**
 * Shared engine for the research-directory markdown tables
 * (docs/research/*-directory*.md). Both the India and the global
 * research directories are one markdown file of `## CLUSTER`
 * sections, each holding a ten-column table:
 *
 *   Company | Category | Founded | HQ | Founders | Funding |
 *   Valuation/Status | Licences | Website | Description
 *
 * The build generators (scripts/generate-*-directory.ts) and the
 * contract tests share this parser, so the website's directory
 * pages can never drift from the research deliverable.
 */

export interface DirectoryRecord {
  /** URL slug, derived from the company name and guaranteed unique. */
  slug: string;
  name: string;
  category: string;
  founded: string;
  hq: string;
  founders: string;
  funding: string;
  valuationOrStatus: string;
  licences: string;
  website: string;
  description: string;
  /** Research cluster group (the `##` heading, count suffix stripped). */
  cluster: string;
}

const CLUSTER_HEADING_RE = /^##\s+(.+?)\s*$/;
const CLUSTER_COUNT_SUFFIX_RE = /\s*\(\d+\)\s*$/;

export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function parseRowCells(line: string): string[] | null {
  if (!line.startsWith("|") || !line.endsWith("|")) return null;
  const cells = line
    .slice(1, -1)
    .split("|")
    .map((cell) => cell.replace(/\\\|/g, "|").trim());
  if (cells.length !== 10) return null;
  // Table header and separator rows share the ten-cell shape; so does
  // the coverage-stats table only when it has a heading before it — guard both.
  if (cells[0] === "Company" || cells[1] === "---" || cells[1] === "Metric") return null;
  if (cells[0] === "---") return null;
  return cells;
}

/**
 * Parses a research directory markdown into records. Throws on
 * structural problems (rows outside a cluster, duplicate names,
 * empty slugs) so a broken research file fails the build loudly
 * instead of silently dropping data.
 */
export function parseDirectoryTables(
  markdown: string,
  label = "directory",
): DirectoryRecord[] {
  const records: DirectoryRecord[] = [];
  const seenNames = new Set<string>();
  const usedSlugs = new Map<string, number>();

  let cluster = "";
  for (const line of markdown.split("\n")) {
    const heading = line.match(CLUSTER_HEADING_RE);
    if (heading) {
      cluster = heading[1].replace(CLUSTER_COUNT_SUFFIX_RE, "").trim();
      continue;
    }
    const cells = parseRowCells(line);
    if (!cells) continue;
    if (!cluster) {
      throw new Error(`Data row without a cluster heading: "${cells[0]}"`);
    }
    const [name, category, founded, hq, founders, funding, valuationOrStatus, licences, website, description] = cells;
    if (seenNames.has(name)) {
      throw new Error(`Duplicate company name in ${label}: "${name}"`);
    }
    seenNames.add(name);

    const baseSlug = slugify(name) || "company";
    const previous = usedSlugs.get(baseSlug) ?? 0;
    usedSlugs.set(baseSlug, previous + 1);
    const slug = previous === 0 ? baseSlug : `${baseSlug}-${previous + 1}`;

    records.push({
      slug,
      name,
      category,
      founded,
      hq,
      founders,
      funding,
      valuationOrStatus,
      licences,
      website,
      description,
      cluster,
    });
  }
  return records;
}

/** Cluster display names with their record counts, in first-appearance order. */
export function clusterGroups(
  records: DirectoryRecord[],
): Array<{ name: string; count: number }> {
  const groups: Array<{ name: string; count: number }> = [];
  const byName = new Map<string, number>();
  for (const record of records) {
    const index = byName.get(record.cluster);
    if (index === undefined) {
      byName.set(record.cluster, groups.length);
      groups.push({ name: record.cluster, count: 1 });
    } else {
      groups[index].count += 1;
    }
  }
  return groups;
}

/** First-appearance-ordered distinct category labels. */
export function distinctCategories(records: DirectoryRecord[]): string[] {
  return [...new Set(records.map((record) => record.category))];
}
