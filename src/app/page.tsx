import type { Metadata } from "next";
import { Suspense } from "react";
import HomePageClient from "./home-client";
import { SITE_URL } from "@/lib/site-config";
import { openGraphImage } from "@/lib/shared-metadata";

const description =
  "Compare Razorpay, Stripe, Cashfree, Wise, Payoneer and other payment services. Calculate fees, settlement amounts and provider differences for India.";

export const metadata: Metadata = {
  title: "Payment Gateway & International Payment Comparisons India",
  description,
  alternates: { canonical: "/" },
  // Page-level openGraph keeps og:title in sync with <title> (the title template
  // appends " — FinTech Atlas") and pins og:url to the homepage.
  openGraph: {
    ...openGraphImage,
    title: "Payment Gateway & International Payment Comparisons India — FinTech Atlas",
    description,
    url: SITE_URL,
  },
};

export default function HomePage() {
  return (
    <Suspense fallback={<div className="px-5 py-24 text-center text-sm text-[var(--muted-text)]">Loading…</div>}>
      <HomePageClient />
    </Suspense>
  );
}
