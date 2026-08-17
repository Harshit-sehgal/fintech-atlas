import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseEnrichedDirectory } from "@/lib/india-directory-parse";
import { importDirectory } from "../import-directory";
import { parseRbiSnapshot } from "./parse";
import { matchCompany, normalizeCompanyName } from "./match";
import { ingestSnapshot } from "./ingest";
import { reviewItemsFor } from "./review";
import type { RbiSnapshot } from "./parse";

const snapshotPath = resolve(process.cwd(), "data/regulatory/rbi/payment-aggregators-v1.md");

function loadCompanies() {
  return importDirectory(
    parseEnrichedDirectory(
      readFileSync(resolve(process.cwd(), "docs/research/india-fintech-directory-enriched.md"), "utf8"),
    ),
  ).records.map((r) => r.company);
}

describe("RBI snapshot parse", () => {
  const snapshot: RbiSnapshot = parseRbiSnapshot(
    readFileSync(snapshotPath, "utf8"),
    "payment-aggregators-v1",
  );

  it("reads metadata and entries", () => {
    expect(snapshot.regulator).toBe("RBI");
    expect(snapshot.fetchedOn).toBe("2026-08-15");
    expect(snapshot.entries.length).toBeGreaterThan(40);
  });

  it("entries carry codes, statuses and optional effective dates", () => {
    for (const entry of snapshot.entries) {
      expect(["PA", "PA-CB"]).toContain(entry.code);
      expect(["authorised", "in-principle", "application", "unknown"]).toContain(entry.status);
      if (entry.effectiveDate) expect(entry.effectiveDate).toMatch(/^\d{4}(-\d{2})?$/);
    }
  });

  it("marks the known in-principle licensees", () => {
    const inPrinciple = snapshot.entries
      .filter((e) => e.status === "in-principle")
      .map((e) => e.companyName);
    expect(inPrinciple).toContain("PayPal India");
    expect(inPrinciple).toContain("EximPe");
  });
});

describe("RBI company matching", () => {
  const companies = loadCompanies();

  it("normalizes legal/display suffix noise", () => {
    expect(normalizeCompanyName("Razorpay")).toBe("razorpay");
    expect(normalizeCompanyName("Pay10 Services Private Limited")).toBe("pay10 services");
    expect(normalizeCompanyName("BriskPe (GoBrisk)")).toBe("briskpe");
  });

  it("matches known payment aggregators to canonical companies", () => {
    for (const name of ["Razorpay", "Cashfree Payments", "PayU Payments India", "Pine Labs", "Easebuzz", "Skydo", "PayGlocal", "Xflow", "BriskPe (GoBrisk)", "EximPe", "Amazon Pay India"]) {
      const match = matchCompany(name, companies);
      expect(match.companyId, `should match ${name}`).toBeTruthy();
      expect(match.score).toBeGreaterThanOrEqual(40);
    }
  });

  it("leaves unknown companies unmatched", () => {
    const match = matchCompany("A Company That Does Not Exist", companies);
    expect(match.companyId).toBeUndefined();
  });
});

describe("RBI ingestion pipeline", () => {
  const companies = loadCompanies();
  const snapshot: RbiSnapshot = parseRbiSnapshot(
    readFileSync(snapshotPath, "utf8"),
    "payment-aggregators-v1",
  );

  it("baseline run matches most entries and establishes events", () => {
    const result = ingestSnapshot({ snapshot, companies });
    expect(result.baseline).toBe(true);
    expect(result.entries).toBeGreaterThan(40);
    expect(result.events.length).toBe(result.entries - result.unmatched.length);
    expect(result.events.every((e) => e.type === "LICENSE_ADDED")).toBe(true);
    expect(result.unmatched.length).toBeLessThan(3);
    expect(result.review.length).toBe(result.events.length + result.unmatched.length);
  });

  it("unmatched entries surface in the review queue, not silently", () => {
    const result = ingestSnapshot({ snapshot, companies });
    expect(result.unmatched.every((u) => !u.companyName.includes("Razorpay"))).toBe(true);
    for (const item of result.review) {
      expect(item.state).toBe("pending");
      expect(["add_license", "remove_license", "update_status", "new_company", "unmatched_entry"]).toContain(item.action);
    }
  });

  it("a re-fetch with a licence change produces a status event and review item", () => {
    const before = snapshot.entries.filter((e) => e.companyName !== "EximPe");
    const after = snapshot.entries.map((e) =>
      e.companyName === "EximPe" ? { ...e, status: "authorised" as const } : e,
    );
    const next: RbiSnapshot = { ...snapshot, id: "payment-aggregators-v2", entries: after };
    const result = ingestSnapshot({ snapshot: next, companies, previous: before, detectedOn: "2026-08-18" });

    expect(result.baseline).toBe(false);
    expect(result.events).toContainEqual(
      expect.objectContaining({
        type: "LICENSE_ADDED",
        detail: expect.objectContaining({ code: "PA-CB" }),
      }),
    );
    expect(result.review.some((item) => item.action === "add_license")).toBe(true);
  });

  it("review items capture before/after state for status changes", () => {
    const items = reviewItemsFor(
      "test",
      [
        {
          id: "e1",
          type: "REGULATORY_STATUS_CHANGED" as const,
          companyId: "eximpe",
          happenedOn: "2026-08-18",
          detectedOn: "2026-08-18",
          detail: { code: "PA-CB", before: "in-principle", after: "authorised" },
        },
      ],
      [],
    );
    expect(items[0]).toMatchObject({
      action: "update_status",
      before: { code: "PA-CB", status: "in-principle" },
      after: { code: "PA-CB", status: "authorised" },
    });
  });
});