import type { Metadata } from "next";
import { CompaniesClient } from "./client";
import { openGraphImage } from "@/lib/shared-metadata";
import { canonicalUrl } from "@/lib/canonical-url";
import StructuredData from "@/components/SEO/StructuredData";

const description =
  "Browse, filter, and compare top FinTech companies worldwide including Stripe, PayPal, Wise, Revolut, Robinhood, Plaid, and more.";

const pathname = "/companies";

export const metadata: Metadata = {
  title: "FinTech Companies Directory",
  description,
  alternates: { canonical: canonicalUrl(pathname) },
  openGraph: {
    ...openGraphImage,
    title: "FinTech Companies Directory — FinTech Atlas",
    description,
    url: canonicalUrl(pathname),
  },
};

export default function CompaniesPage() {
  return (
    <>
      <StructuredData />
      <CompaniesClient />
    </>
  );
}