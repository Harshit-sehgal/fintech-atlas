import { describe, expect, it } from "vitest";
import {
  getCompanyForGlobalProfile,
  getCompanyForResearchProfile,
  getCompanyName,
  getResearchProfileForCompany,
  getResearchProfileName,
} from "./company-directory-links";

describe("company ↔ research directory bridges", () => {
  it("maps a curated company to its India research profile", () => {
    expect(getResearchProfileForCompany("stripe")).toBe("stripe-india");
    expect(getResearchProfileForCompany("not-a-company")).toBeNull();
  });

  it("inverts the India mapping", () => {
    expect(getCompanyForResearchProfile("stripe-india")).toBe("stripe");
    expect(getCompanyForResearchProfile("not-a-profile")).toBeNull();
  });

  it("bridges a global research slug to a curated profile only on exact match", () => {
    expect(getCompanyForGlobalProfile("stripe")).toBe("stripe");
    expect(getCompanyForGlobalProfile("definitely-not-curated")).toBeNull();
  });

  it("resolves display names with an empty-string fallback", () => {
    expect(getCompanyName("stripe")).toBe("Stripe");
    expect(getCompanyName("nope")).toBe("");
    expect(getResearchProfileName("stripe-india")).toBe("Stripe India");
    expect(getResearchProfileName("nope")).toBe("");
  });
});
