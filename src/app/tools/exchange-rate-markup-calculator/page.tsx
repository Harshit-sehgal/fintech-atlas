import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { MarkupCalculatorClient } from "./markup-calculator-client";
import { canonicalUrl } from "@/lib/canonical-url";
import { openGraphImage } from "@/lib/shared-metadata";

const description =
  "Measure the hidden exchange-rate markup on any international transfer: enter the mid-market rate and your provider's rate, see the markup percentage and the rupee cost of the spread — for both receiving INR (USD → INR) and sending INR (INR → USD).";

export const metadata: Metadata = {
  title: "Exchange-Rate Markup Calculator — measure the hidden FX spread",
  description,
  alternates: { canonical: canonicalUrl("/tools/exchange-rate-markup-calculator") },
  openGraph: {
    ...openGraphImage,
    title: "Exchange-Rate Markup Calculator — FinTech Atlas",
    description,
    url: canonicalUrl("/tools/exchange-rate-markup-calculator"),
  },
};

export default function ExchangeRateMarkupCalculatorPage() {
  return (
    <div className="relative mx-auto max-w-6xl px-5 py-16 md:py-24">
      <article className="prose-sm mx-auto max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">Cross-Border · FX</p>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">Exchange-rate markup calculator</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted-text)]">
          Banks and payment platforms often advertise low or zero transfer fees and still make
          money on the <strong className="text-[var(--foreground)]">exchange-rate markup</strong> —
          the gap between the rate they give you and the real mid-market rate. For an Indian
          freelancer withdrawing USD to a bank account, or a family sending rupees abroad, that
          hidden spread is usually the largest single cost of the transfer. This calculator turns
          two numbers — the mid-market rate and the rate your provider offered — into the markup
          percentage and the actual rupee cost of the spread.
        </p>

        <h2 className="mt-10 text-xl font-bold">What mid-market means, and where the markup hides</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted-text)]">
          The mid-market (interbank) rate is the rate banks trade among themselves, and it is the
          fairest reference point for any retail conversion. Providers rarely quote it directly:
          they quote a rate a fraction worse and pocket the difference. Because the spread is baked
          into the rate rather than itemised as a fee, it is easy to miss — and unlike a fee, GST
          does not apply to the embedded spread, which is one reason platforms prefer it.
        </p>

        <h2 className="mt-10 text-xl font-bold">Published reference corridors (India, 2026)</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--border-color)]">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--surface)]">
                <th className="px-4 py-3 font-bold">Scenario</th>
                <th className="px-4 py-3 font-bold">Typical rate treatment</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[var(--border-color)]">
                <td className="px-4 py-3">Payoneer USD → INR bank withdrawal</td>
                <td className="px-4 py-3 font-medium">1–4% markup (published corridor)</td>
              </tr>
              <tr className="border-b border-[var(--border-color)]">
                <td className="px-4 py-3">Wise / Revolut transfers</td>
                <td className="px-4 py-3 font-medium">Near mid-market, explicit small fee</td>
              </tr>
              <tr className="border-b border-[var(--border-color)]">
                <td className="px-4 py-3">Wise balance conversions (currency to currency)</td>
                <td className="px-4 py-3 font-medium">0.50% conversion fee</td>
              </tr>
              <tr className="border-b border-[var(--border-color)]">
                <td className="px-4 py-3">Typical Indian bank wire / NRE conversions</td>
                <td className="px-4 py-3 font-medium">Roughly 1.5–4% hidden spread</td>
              </tr>
              <tr>
                <td className="px-4 py-3">PayPal international payments</td>
                <td className="px-4 py-3 font-medium">~3.5–4% above the base rate</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-[var(--muted-text)]">
          Reference corridors are published assumptions for context (catalog period August 2026),
          not live quotes. The calculator itself only uses the two rates you enter.
        </p>

        <h2 className="mt-10 text-xl font-bold">Worked example: receiving USD as a freelancer</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted-text)]">
          The mid-market rate is ₹83.50 per US$. Your payout platform quotes ₹82.00 — that is a{" "}
          <strong className="text-[var(--foreground)]">1.80% markup</strong> ((83.50 − 82.00) ÷ 83.50).
          On a $1,000 withdrawal you receive ₹82,000 instead of ₹83,500 —{" "}
          <strong className="text-[var(--foreground)]">₹1,500 lost to the spread alone</strong>, before
          any withdrawal fee. Add a 1% fee and the total cost crosses 2.8% of the amount.
        </p>

        <h2 className="mt-10 text-xl font-bold">Worked example: sending rupees abroad</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted-text)]">
          Mid-market is ₹83.50, but the sender&apos;s bank charges ₹84.50 per US$. That is a{" "}
          <strong className="text-[var(--foreground)]">1.20% markup</strong> — on a ₹50,000 transfer the
          recipient gets about $591.72 instead of $598.80, a loss of roughly ₹592. The same
          calculator measures it: pick &quot;Sending INR&quot; and enter the two rates.
        </p>

        <h2 className="mt-10 text-xl font-bold">Methodology & limitations</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted-text)]">
          The tool computes the absolute deviation between the two rates you enter as a percentage
          of the mid-market rate — it never fetches live FX, and the reference corridors above are
          published assumptions, not quotes. The markup is only the rate spread; total cost also
          includes any upfront fee (and GST where it applies to fees). Verify the day&apos;s actual
          mid-market rate on an independent aggregator before relying on the numbers.
        </p>
      </article>

      <div className="mx-auto mt-12 max-w-5xl">
        <Suspense fallback={<div className="px-5 py-24 text-center text-sm text-[var(--muted-text)]">Loading calculator…</div>}>
          <MarkupCalculatorClient />
        </Suspense>
      </div>

      <section className="mx-auto max-w-5xl px-5 pb-16">
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card)] p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--muted-text)]">Related comparisons</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link href="/articles/payoneer-fees-india" className="btn-ghost text-xs">Payoneer fees in India (receiving USD)</Link>
            <Link href="/articles/how-to-send-money-abroad-cheap" className="btn-ghost text-xs">Send money abroad: cost guide</Link>
            <Link href="/articles/wise-vs-payoneer-business-payouts" className="btn-ghost text-xs">Wise vs Payoneer for payouts</Link>
            <Link href="/tools/remittance" className="btn-ghost text-xs">Cross-border transfer estimator</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
