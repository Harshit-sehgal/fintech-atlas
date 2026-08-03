import type { Metadata } from "next";
import { Suspense } from "react";
import { CompaniesClient } from "./client";
import { SITE_URL } from "@/lib/site-config";
import { openGraphImage } from "@/lib/shared-metadata";
import StructuredData from "@/components/SEO/StructuredData";

const description =
  "Browse, filter, and compare top FinTech companies worldwide including Stripe, PayPal, Wise, Revolut, Robinhood, Plaid, and more.";

export const metadata: Metadata = {
  title: "FinTech Companies Directory",
  description,
  alternates: { canonical: "/companies" },
  openGraph: {
    ...openGraphImage,
    title: "FinTech Companies Directory — FinTech Atlas",
    description,
    url: `${SITE_URL}/companies`,
  },
};

export default function CompaniesPage() {
  return (
    <Suspense fallback={<div className="px-5 py-24 text-center text-sm text-[var(--muted-text)]">Loading companies…</div>}>
      <StructuredData />
      <CompaniesClient />
    </Suspense>
  );
}