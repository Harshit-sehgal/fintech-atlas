import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import RemittanceCalculatorPageClient from "./remittance-client";
import { canonicalUrl } from "@/lib/canonical-url";
import { openGraphImage } from "@/lib/shared-metadata";

const description =
  "Compare illustrative reference FX rates, exchange markups, and upfront transfer fees across Wise, Revolut, PayPal, and a hypothetical bank-wire baseline.";

export const metadata: Metadata = {
  title: "Cross-Border FX & Transfer Calculator",
  description,
  alternates: { canonical: canonicalUrl("/tools/remittance") },
  openGraph: {
    ...openGraphImage,
    title: "Cross-Border FX & Transfer Calculator — FinTech Atlas",
    description,
    url: canonicalUrl("/tools/remittance"),
  },
};

export default function RemittanceCalculatorPage() {
  return (
    <>
      <Suspense fallback={<div className="px-5 py-24 text-center text-sm text-[var(--muted-text)]">Loading FX tool…</div>}>
        <RemittanceCalculatorPageClient />
      </Suspense>
      <section className="mx-auto max-w-5xl px-5 pb-16">
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card)] p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--muted-text)]">Related comparisons</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link href="/tools/exchange-rate-markup-calculator" className="btn-ghost text-xs">Measure a rate markup</Link>
            <Link href="/articles/how-to-send-money-abroad-cheap" className="btn-ghost text-xs">Send money abroad: cost guide</Link>
            <Link href="/articles/payoneer-fees-india" className="btn-ghost text-xs">Payoneer fees in India</Link>
            <Link href="/articles/wise-vs-payoneer-business-payouts" className="btn-ghost text-xs">Wise vs Payoneer for payouts</Link>
          </div>
        </div>
      </section>
    </>
  );
}
