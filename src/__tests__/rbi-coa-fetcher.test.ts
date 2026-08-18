import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  filterPaRows,
  parseCoaPaymentAggregators,
  renderCoaMarkdown,
} from "../../scripts/fetch-rbi-coa";

const fixture = () => readFileSync(resolve(__dirname, "fixtures/rbi-coa-page.html"), "utf8");

describe("RBI CoA holder fetcher", () => {
  it("parses the Payment Aggregators section including rowspan continuation rows", () => {
    const rows = parseCoaPaymentAggregators(fixture());
    const onePay = rows.find((r) => r.name.includes("1Pay"));
    expect(onePay?.systems).toEqual(["PA- O- '1Pay'", "PA-P"]);
    expect(onePay?.date).toBe("14.05.2024");
  });

  it("keeps former names as provenance on the legal name", () => {
    const rows = parseCoaPaymentAggregators(fixture());
    const razorpay = rows.find((r) => r.name.includes("Razorpay"));
    expect(razorpay?.name).toContain("(formerly Razorpay Software Private Limited)");
  });

  it("filters to PA lines only (PA-O / PA-P / PA-CB)", () => {
    const rows = filterPaRows(parseCoaPaymentAggregators(fixture()));
    expect(rows).toHaveLength(3);
    expect(rows.every((r) => r.systems.some((s) => /PA-/.test(s)))).toBe(true);
  });

  it("stops at the cancelled-CoA section (D/E/F)", () => {
    const html = fixture() + '<p class="head">E. Entities whose CoA cancelled as per regulatory requirement.</p>';
    const rows = parseCoaPaymentAggregators(html);
    expect(rows).toHaveLength(3);
  });

  it("renders canonical markdown with authorised status + CoA issue date", () => {
    const rows = filterPaRows(parseCoaPaymentAggregators(fixture()));
    const md = renderCoaMarkdown("payment-aggregators-coa-2026-08-18", "https://rbi.org.in/Scripts/PublicationsView.aspx?id=12043", "2026-08-18", rows);
    expect(md).toContain("- Regulator: RBI");
    expect(md).toContain("| Wise Payments India Private Limited | PA-CB | authorised | 12.03.2026 |");
    expect(md).toContain("| 1Pay Mobileware Private Limited | PA-P | authorised | 14.05.2024 |");
  });
});