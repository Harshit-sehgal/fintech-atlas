import { describe, expect, it } from "vitest";
import {
  deriveLicences,
  deriveRadarFacets,
  deriveRegulator,
  deriveSector,
  licencesFromField,
  parseFoundedYear,
  parseFundingUsdM,
  RADAR_LICENCES,
  RADAR_REGULATORS,
  RADAR_SECTORS,
} from "@/lib/radar-facets";

describe("radar facets — sector derivation", () => {
  it("classifies the core payment clusters", () => {
    expect(deriveSector("PAYMENTS CLUSTER")).toBe("payments");
    expect(deriveSector("PAYMENT AGGREGATORS (PA-O / PA-P / PA-CB)")).toBe("payments");
    expect(deriveSector("PPI ISSUERS (non-bank)")).toBe("payments");
    expect(deriveSector("UPI THIRD-PARTY APPS (NPCI TPAP)")).toBe("payments");
    expect(deriveSector("ACCOUNT AGGREGATORS")).toBe("payments");
    expect(deriveSector("SUPERAPPS & ECOSYSTEM WALLETS")).toBe("payments");
  });

  it("classifies cross-border clusters before payments (more specific first)", () => {
    expect(deriveSector("CROSS-BORDER PAYMENTS & FX")).toBe("cross-border");
    expect(deriveSector("MTSS / REMITTANCE OVERSEAS PRINCIPALS")).toBe("cross-border");
    expect(deriveSector("AUTHORISED DEALER-II (FX)")).toBe("cross-border");
  });

  it("classifies lending, wealth, insurance, banking and crypto clusters", () => {
    expect(deriveSector("LENDING & BANKING CLUSTER")).toBe("other");
    expect(deriveSector("NBFC-P2P PLATFORMS")).toBe("lending");
    expect(deriveSector("MICROFINANCE - NBFC-MFIs")).toBe("lending");
    expect(deriveSector("STOCK BROKERS")).toBe("wealth");
    expect(deriveSector("IRDAI GENERAL INSURERS")).toBe("insurance");
    expect(deriveSector("SMALL FINANCE BANKS")).toBe("banking");
    expect(deriveSector("CRYPTO / WEB3 - FIU-REGISTERED VASPs & INFRA")).toBe("crypto");
    expect(deriveSector("EXCHANGES & TRADING PLATFORMS")).toBe("crypto");
  });

  it("falls back to other for genuinely mixed clusters", () => {
    expect(deriveSector("WEALTH, INVESTING, INSURANCE & CRYPTO CLUSTER")).toBe("other");
    expect(deriveSector("GLOBAL PLAYERS SERVING INDIA")).toBe("other");
  });
});

describe("radar facets — regulator derivation", () => {
  it("assigns regulators from cluster names", () => {
    expect(deriveRegulator("PAYMENT AGGREGATORS (PA-O / PA-P / PA-CB)")).toBe("RBI");
    expect(deriveRegulator("IRDAI LIFE INSURERS")).toBe("IRDAI");
    expect(deriveRegulator("IRDAI WEB AGGREGATORS")).toBe("IRDAI");
    expect(deriveRegulator("STOCK BROKERS")).toBe("SEBI");
    expect(deriveRegulator("UPI THIRD-PARTY APPS (NPCI TPAP)")).toBe("NPCI");
    expect(deriveRegulator("CRYPTO / WEB3 - FIU-REGISTERED VASPs & INFRA")).toBe("FIU");
    expect(deriveRegulator("EXCHANGES & TRADING PLATFORMS")).toBe("FIU");
  });

  it("does not over-claim a regulator for SaaS or mixed clusters", () => {
    expect(deriveRegulator("REGTECH & COMPLIANCE")).toBe("mixed");
    expect(deriveRegulator("KYC / ONBOARDING / VERIFICATION")).toBe("mixed");
    expect(deriveRegulator("GLOBAL PLAYERS SERVING INDIA")).toBe("mixed");
  });
});

describe("radar facets — licence derivation", () => {
  it("reads licences from the field text", () => {
    expect(licencesFromField("RBI PA-O + PA-CB-E&I (Dec 2025) + PA-P")).toEqual([
      "PA-CB",
      "PA",
    ]);
    expect(licencesFromField("RBI PA-O, PA-P, PA-CB")).toContain("PA");
    expect(licencesFromField("RBI PA-O, PA-P, PA-CB")).toContain("PA-CB");
    expect(licencesFromField("PPI issuer")).toEqual(["PPI"]);
    expect(licencesFromField("Account Aggregator licence")).toEqual(["AA"]);
  });

  it("combines cluster and field licences without duplicates", () => {
    const result = deriveLicences(
      "PAYMENT AGGREGATORS (PA-O / PA-P / PA-CB)",
      "RBI PA-O",
    );
    expect(result).toEqual(["PA", "PA-CB"]);
  });

  it("pins the licence-taxonomy clusters", () => {
    expect(deriveLicences("PPI ISSUERS (non-bank)", "")).toEqual(["PPI"]);
    expect(deriveLicences("NBFC-P2P PLATFORMS", "")).toEqual(["P2P"]);
    expect(deriveLicences("UPI THIRD-PARTY APPS (NPCI TPAP)", "")).toEqual(["TPAP"]);
  });
});

describe("radar facets — numeric parsing", () => {
  it("parses founded years", () => {
    expect(parseFoundedYear("2014")).toBe(2014);
    expect(parseFoundedYear("2010 (merged 2019)")).toBe(2010);
    expect(parseFoundedYear("n/a")).toBeNull();
  });

  it("parses USD funding into millions", () => {
    expect(parseFundingUsdM("~$741M (12 rounds)")).toBe(741);
    expect(parseFundingUsdM("~$1.24B+ ($350M Jan 2023)")).toBe(1240);
    expect(parseFundingUsdM("~$375K")).toBeCloseTo(0.375);
    expect(parseFundingUsdM("$1.2M (2015)")).toBeCloseTo(1.2);
    expect(parseFundingUsdM("~₹23 Cr (~$2.8M)")).toBeCloseTo(2.8);
  });

  it("returns null for INR-only or missing funding", () => {
    expect(parseFundingUsdM("IPO ₹18,300 Cr (Nov 2021)")).toBeNull();
    expect(parseFundingUsdM("n/a")).toBeNull();
    expect(parseFundingUsdM("Private")).toBeNull();
  });
});

describe("radar facets — derived record", () => {
  it("builds a full facet record from a research row", () => {
    const facets = deriveRadarFacets({
      cluster: "PAYMENT AGGREGATORS (PA-O / PA-P / PA-CB)",
      licences: "RBI PA-O + PA-CB-E&I (Dec 2025)",
      founded: "2014",
      funding: "~$741M (12 rounds)",
    });
    expect(facets.sector).toBe("payments");
    expect(facets.regulator).toBe("RBI");
    expect(facets.licences).toEqual(["PA", "PA-CB"]);
    expect(facets.foundedYear).toBe(2014);
    expect(facets.fundingUsdM).toBe(741);
  });

  it("keeps the taxonomy lists exhaustive and unique", () => {
    expect(new Set(RADAR_SECTORS).size).toBe(RADAR_SECTORS.length);
    expect(new Set(RADAR_REGULATORS).size).toBe(RADAR_REGULATORS.length);
    expect(new Set(RADAR_LICENCES).size).toBe(RADAR_LICENCES.length);
  });
});