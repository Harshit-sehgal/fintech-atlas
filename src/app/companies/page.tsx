import type { Metadata } from "next";
import { CompaniesClient } from "./client";
import { pageMetadata } from "@/lib/shared-metadata";
import StructuredData from "@/components/SEO/StructuredData";

const description =
  "Browse, filter, and compare top FinTech companies worldwide including Stripe, PayPal, Wise, Revolut, Robinhood, Plaid, and more.";

const pathname = "/companies";

export const metadata: Metadata = pageMetadata({
  pathname,
  title: "FinTech Companies Directory",
  description,
});

export default function CompaniesPage() {
  return (
    <>
      <StructuredData />
      <CompaniesClient />
    </>
  );
}