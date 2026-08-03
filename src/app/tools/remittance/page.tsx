import type { Metadata } from "next";
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
    <Suspense fallback={<div className="px-5 py-24 text-center text-sm text-[var(--muted-text)]">Loading FX tool…</div>}>
      <RemittanceCalculatorPageClient />
    </Suspense>
  );
}
