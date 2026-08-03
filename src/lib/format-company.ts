/**
 * Shared formatting helpers for company data fields.
 *
 * These replace the duplicated `.valuation.split("(")...` and
 * `.headquarters.split(",")...` patterns found across 8+ files, so a single
 * source of truth handles all display transformations.
 */

import type { Company } from "@/data/types";

/**
 * Return the short form of a valuation string.
 *
 * "Private ($45B)" → "Private"
 * "$3.2B (2025)"   → "$3.2B"
 */
export function formatValuationShort(valuation: string): string {
  return valuation.split("(")[0].trim();
}

/**
 * Return the structured numeric valuation in US dollars for sorting, or `null`
 * when the company has no comparable value (subsidiary / product / acquired
 * unit). The directory sorts by this number instead of parsing the display
 * string at runtime (audit #37).
 */
export function getValuationAmountUsd(company: Company): number | null {
  return company.valuationAmountUsd ?? null;
}

/**
 * Return the city from a headquarters string.
 *
 * "San Francisco, CA, USA" → "San Francisco"
 * "London, UK"              → "London"
 */
export function formatHeadquartersCity(headquarters: string): string {
  return headquarters.split(",")[0].trim();
}