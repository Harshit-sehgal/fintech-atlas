/**
 * Shared formatting helpers for company data fields.
 *
 * These replace the duplicated `.valuation.split("(")...` and
 * `.headquarters.split(",")...` patterns found across 8+ files, so a single
 * source of truth handles all display transformations.
 */

import type { Company } from "@/data/types";
import { financialValueTypeBySlug } from "@/data/financial-values";

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

type FinancialValueType =
  | "public-market-cap"
  | "private-valuation"
  | "not-disclosed";

/** Editorial classification of what the displayed valuation number represents. */
export function getFinancialValueType(company: Company): FinancialValueType | null {
  return financialValueTypeBySlug[company.slug] ?? null;
}

/** Human label for the valuation concept, or `null` when unclassified. */
export function financialValueTypeLabel(company: Company): string | null {
  switch (getFinancialValueType(company)) {
    case "private-valuation":
      return "Private valuation";
    case "public-market-cap":
      return "Market capitalisation";
    case "not-disclosed":
      return "Not publicly disclosed";
    default:
      return null;
  }
}

/**
 * Short valuation string with its concept appended, e.g.
 * `"65B · Private valuation"` or `"N/A · Not publicly disclosed"`.
 */
export function formatValuationForStats(company: Company): string {
  const label = financialValueTypeLabel(company);
  return label ? `${formatValuationShort(company.valuation)} · ${label}` : formatValuationShort(company.valuation);
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