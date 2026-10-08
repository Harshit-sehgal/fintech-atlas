/**
 * Parser for the global fintech research directory.
 *
 * Single source of truth: docs/research/global-fintech-directory.md
 * (markdown tables, one per region/category cluster). The build
 * generator (scripts/generate-global-directory.ts) and the contract
 * test (src/__tests__/global-directory.test.ts) share this parser,
 * so the website's directory pages can never drift from the research
 * deliverable. Shares the table engine with the India directory
 * (directory-parse.ts) so both research files parse identically.
 *
 * The markdown layout matches the India file: a `## CLUSTER NAME
 * (count)` heading, a table header row, a `| --- |` separator, then
 * one data row per company with ten cells: Company | Category |
 * Founded | HQ | Founders | Funding | Valuation/Status | Regulatory |
 * Website | Description.
 */

import {
  clusterGroups as clusterGroupsEngine,
  distinctCategories as distinctCategoriesEngine,
  parseDirectoryTables,
  type DirectoryRecord,
} from "./directory-parse";

export type GlobalDirectoryRecord = DirectoryRecord;

export function parseGlobalDirectory(
  markdown: string,
): GlobalDirectoryRecord[] {
  return parseDirectoryTables(markdown, "global directory");
}

export const clusterGroups = clusterGroupsEngine;
export const distinctCategories = distinctCategoriesEngine;
