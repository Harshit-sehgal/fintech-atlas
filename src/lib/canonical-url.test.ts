import { describe, it, expect } from "vitest";
import { canonicalUrl } from "@/lib/canonical-url";
import { SITE_URL } from "@/lib/site-config";

describe("canonicalUrl", () => {
  it("returns the bare SITE_URL for the homepage", () => {
    expect(canonicalUrl("/")).toBe(SITE_URL);
    expect(canonicalUrl("")).toBe(SITE_URL);
  });

  it("applies the trailing-slash policy to every other route", () => {
    expect(canonicalUrl("/about")).toBe(`${SITE_URL}/about/`);
    expect(canonicalUrl("/companies")).toBe(`${SITE_URL}/companies/`);
    expect(canonicalUrl("/about/")).toBe(`${SITE_URL}/about/`);
    expect(canonicalUrl("//about//")).toBe(`${SITE_URL}/about/`);
    expect(canonicalUrl("/companies/stripe")).toBe(`${SITE_URL}/companies/stripe/`);
  });
});
