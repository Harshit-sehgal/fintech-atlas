import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import ComparePageClient from "./compare-client";
import { canonicalUrl } from "@/lib/canonical-url";
import { openGraphImage } from "@/lib/shared-metadata";

const description =
  "Compare FinTech companies across pricing, editorial sentiment, strengths, weaknesses, and notable customers. Values may have different dates and methodologies; use the matrix as an orientation tool.";

export const metadata: Metadata = {
  title: "Compare FinTech Companies Side-by-Side",
  description,
  alternates: { canonical: canonicalUrl("/compare") },
  openGraph: {
    ...openGraphImage,
    title: "Compare FinTech Companies Side-by-Side — FinTech Atlas",
    description,
    url: canonicalUrl("/compare"),
  },
};

export default function ComparePage() {
  return (
    <>
      <Suspense fallback={<div className="px-5 py-24 text-center text-sm text-[var(--muted-text)]">Loading comparison…</div>}>
        <ComparePageClient />
      </Suspense>
      <section className="mx-auto max-w-5xl px-5 pb-16">
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card)] p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--muted-text)]">Related comparisons</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link href="/articles/razorpay-vs-stripe-payments-india" className="btn-ghost text-xs">Razorpay vs Stripe (India)</Link>
            <Link href="/articles/razorpay-vs-cashfree-indian-gateways" className="btn-ghost text-xs">Razorpay vs Cashfree</Link>
            <Link href="/articles/wise-vs-payoneer-business-payouts" className="btn-ghost text-xs">Wise vs Payoneer for payouts</Link>
            <Link href="/articles/best-payment-gateway-small-business" className="btn-ghost text-xs">Best gateway for small business</Link>
          </div>
        </div>
      </section>
    </>
  );
}