import type { Metadata } from "next";
import { Suspense } from "react";
import RemittanceCalculatorPageClient from "./remittance-client";
import { SITE_URL } from "@/lib/site-config";
import { openGraphImage } from "@/lib/shared-metadata";

const description =
  "Compare reference mid-market FX rates, hidden exchange markups, and upfront transfer fees across Wise, Revolut, PayPal, and traditional banks.";

export const metadata: Metadata = {
  title: "Cross-Border FX & Transfer Calculator",
  description,
  alternates: { canonical: "/tools/remittance" },
  openGraph: {
    ...openGraphImage,
    title: "Cross-Border FX & Transfer Calculator — FinTech Atlas",
    description,
    url: `${SITE_URL}/tools/remittance`,
  },
};

export default function RemittanceCalculatorPage() {
  return (
    <Suspense fallback={<div className="px-5 py-24 text-center text-sm text-[var(--muted-text)]">Loading FX tool…</div>}>
      <RemittanceCalculatorPageClient />
    </Suspense>
  );
}
