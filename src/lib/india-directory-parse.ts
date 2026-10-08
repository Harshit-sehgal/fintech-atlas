/**
 * Parser for the enriched India fintech research directory.
 *
 * Single source of truth: docs/research/india-fintech-directory-enriched.md
 * (a set of markdown tables, one per research cluster). The build generator
 * (scripts/generate-india-directory.ts) and the contract test
 * (src/__tests__/india-directory.test.ts) share this parser, so the website's
 * directory pages can never drift from the research deliverable.
 *
 * The markdown layout: a `## CLUSTER NAME (count)` heading, a table header
 * row, a `| --- |` separator, then one data row per company with ten cells:
 * Company | Category | Founded | HQ | Founders | Funding | Valuation/Status
 * | Licences | Website | Description.
 *
 * The table engine itself lives in directory-parse.ts and is shared with
 * the global research directory (global-directory-parse.ts).
 */

import {
  clusterGroups as clusterGroupsEngine,
  distinctCategories as distinctCategoriesEngine,
  parseDirectoryTables,
  type DirectoryRecord,
} from "./directory-parse";

export type IndiaDirectoryRecord = DirectoryRecord;

export function parseEnrichedDirectory(
  markdown: string,
): IndiaDirectoryRecord[] {
  return parseDirectoryTables(markdown, "India directory");
}

export const clusterGroups = clusterGroupsEngine;
export const distinctCategories = distinctCategoriesEngine;
