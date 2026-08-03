import type { Metadata } from "next";
import { Suspense } from "react";
import FeeCalculatorPageClient from "./calculator-client";
import { SITE_URL } from "@/lib/site-config";
import { openGraphImage } from "@/lib/shared-metadata";

const description =
  "Compare total monthly processing fees across Stripe, PayPal, Square, and Adyen based on your transaction volume, average order size, and international mix.";

export const metadata: Metadata = {
  title: "Payment Gateway Fee Calculator",
  description,
  alternates: { canonical: "/tools/calculator" },
  openGraph: {
    ...openGraphImage,
    title: "Payment Gateway Fee Calculator — FinTech Atlas",
    description,
    url: `${SITE_URL}/tools/calculator`,
  },
};

export default function FeeCalculatorPage() {
  return (
    <Suspense fallback={<div className="px-5 py-24 text-center text-sm text-[var(--muted-text)]">Loading calculator…</div>}>
      <FeeCalculatorPageClient />
    </Suspense>
  );
}
