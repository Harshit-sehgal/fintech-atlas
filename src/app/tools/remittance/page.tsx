import type { Metadata } from "next";
import Link from "next/link";
import RemittanceCalculatorPageClient from "./remittance-client";
import { pageMetadata } from "@/lib/shared-metadata";
import { breadcrumbJsonLd } from "@/components/breadcrumbs";

const description =
  "Compare illustrative reference FX rates, exchange markups, and upfront transfer fees across Wise, Revolut, PayPal, and a hypothetical bank-wire baseline.";

export const metadata: Metadata = pageMetadata({
  pathname: "/tools/remittance",
  title: "Cross-Border FX & Transfer Calculator",
  description,
});

export default function RemittanceCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Tools", href: "/tools" },
              { name: "Cross-Border FX Estimator", href: "/tools/remittance" },
            ]),
          ),
        }}
      />
      <RemittanceCalculatorPageClient />
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
