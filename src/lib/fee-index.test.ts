import { describe, it, expect } from "vitest";
import { articles } from "@/data/articles";
import { REMITTANCE_PROVIDERS } from "@/data/remittance-config";

/**
 * The Quarterly India Cross-Border Payment Fee Index (and the worked examples
 * in the receiving-$500 article) must never drift from the fee models the
 * Cross-Border FX Estimator runs. These tests recompute every published ₹
 * figure from the same configs and fail if an edit touches either side
 * without the other.
 */

const INR_RATE = 83.5; // matches remittance-config CURRENCIES INR snapshot

function netInr(amountUsd: number, feePct: number, feeFixed: number, fxMargin: number): string {
  const fee = amountUsd * feePct + feeFixed;
  const inr = (amountUsd - fee) * INR_RATE * (1 - fxMargin / 100);
  return "≈ ₹" + Math.round(inr).toLocaleString("en-IN");
}
function providerConfig(slug: string) {
  const p = REMITTANCE_PROVIDERS.find((c) => c.slug === slug);
  if (!p) throw new Error(`missing remittance provider ${slug}`);
  return p;
}

function articleBodyText(slug: string): string {
  const article = articles.find((a) => a.slug === slug);
  if (!article) throw new Error(`missing article ${slug}`);
  return JSON.stringify(article.body);
}

describe("Quarterly India Cross-Border Payment Fee Index (article 26)", () => {
  it("publishes exactly the ₹ figures the remittance config computes", () => {
    const body = articleBodyText("quarterly-india-cross-border-fee-index");

    const wise = providerConfig("wise");
    expect(body).toContain(netInr(500, wise.feePct, wise.feeFixed, wise.fxMargin));
    expect(body).toContain(netInr(1000, wise.feePct, wise.feeFixed, wise.fxMargin));
    expect(body).toContain(netInr(5000, wise.feePct, wise.feeFixed, wise.fxMargin));

    const revolut = providerConfig("revolut");
    expect(body).toContain(netInr(500, revolut.feePct, revolut.feeFixed, revolut.fxMargin));
    expect(body).toContain(netInr(1000, revolut.feePct, revolut.feeFixed, revolut.fxMargin));
    expect(body).toContain(netInr(5000, revolut.feePct, revolut.feeFixed, revolut.fxMargin));

    const paypal = providerConfig("paypal");
    expect(body).toContain(netInr(500, paypal.feePct, paypal.feeFixed, paypal.fxMargin));
    expect(body).toContain(netInr(1000, paypal.feePct, paypal.feeFixed, paypal.fxMargin));
    expect(body).toContain(netInr(5000, paypal.feePct, paypal.feeFixed, paypal.fxMargin));

    const bank = providerConfig("bank");
    expect(body).toContain(netInr(500, bank.feePct, bank.feeFixed, bank.fxMargin));
    expect(body).toContain(netInr(1000, bank.feePct, bank.feeFixed, bank.fxMargin));
    expect(body).toContain(netInr(5000, bank.feePct, bank.feeFixed, bank.fxMargin));

    // Payoneer is not in the estimator config (1–4% corridor, no fixed model);
    // the index publishes its 2% corridor midpoint.
    expect(body).toContain("≈ ₹40,915"); // $500 × 0.98 × 83.5
    expect(body).toContain("≈ ₹81,830"); // $1,000 × 0.98 × 83.5
    expect(body).toContain("≈ ₹4,09,150"); // $5,000 × 0.98 × 83.5
  });

  it("keeps the receiving-$500 article's table on the same config", () => {
    const body = articleBodyText("receiving-500-usd-from-us-client-in-india");
    const wise = providerConfig("wise");
    expect(body).toContain(netInr(500, wise.feePct, wise.feeFixed, wise.fxMargin));
    const paypal = providerConfig("paypal");
    expect(body).toContain(netInr(500, paypal.feePct, paypal.feeFixed, paypal.fxMargin));
    const bank = providerConfig("bank");
    expect(body).toContain(netInr(500, bank.feePct, bank.feeFixed, bank.fxMargin));
    expect(body).toContain("≈ ₹40,915"); // Payoneer 2% corridor
  });


  it("keeps the receiving-$5,000 article's table on the same config", () => {
    const body = articleBodyText("receiving-5000-usd-from-us-client-in-india");
    const wise = providerConfig("wise");
    expect(body).toContain(netInr(5000, wise.feePct, wise.feeFixed, wise.fxMargin));
    const revolut = providerConfig("revolut");
    expect(body).toContain(netInr(5000, revolut.feePct, revolut.feeFixed, revolut.fxMargin));
    const paypal = providerConfig("paypal");
    expect(body).toContain(netInr(5000, paypal.feePct, paypal.feeFixed, paypal.fxMargin));
    const bank = providerConfig("bank");
    expect(body).toContain(netInr(5000, bank.feePct, bank.feeFixed, bank.fxMargin));
    expect(body).toContain("≈ ₹4,09,150"); // Payoneer 2% corridor at $5,000
  });

  it("keeps the receiving-$1,000 article's table on the same config", () => {
    const body = articleBodyText("receiving-1000-usd-from-us-client-in-india");
    const wise = providerConfig("wise");
    expect(body).toContain(netInr(1000, wise.feePct, wise.feeFixed, wise.fxMargin));
    const revolut = providerConfig("revolut");
    expect(body).toContain(netInr(1000, revolut.feePct, revolut.feeFixed, revolut.fxMargin));
    const paypal = providerConfig("paypal");
    expect(body).toContain(netInr(1000, paypal.feePct, paypal.feeFixed, paypal.fxMargin));
    const bank = providerConfig("bank");
    expect(body).toContain(netInr(1000, bank.feePct, bank.feeFixed, bank.fxMargin));
    expect(body).toContain("≈ ₹81,830"); // Payoneer 2% corridor at $1,000
  });
  it("keeps the Payoneer article's worked example on the shared snapshot", () => {
    const body = articleBodyText("payoneer-fees-india");
    // 1% corridor: $990 × 83.5; 4% corridor: $960 × 83.5
    expect(body).toContain("₹82,665");
    expect(body).toContain("₹80,160");
  });
});
