import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import FeeCalculatorPageClient from "./calculator-client";
import { canonicalUrl } from "@/lib/canonical-url";
import { openGraphImage } from "@/lib/shared-metadata";
import { breadcrumbJsonLd } from "@/components/breadcrumbs";

const description =
  "Compare total monthly processing fees across Stripe, PayPal, Square, and Adyen based on your transaction volume, average order size, and international mix.";

export const metadata: Metadata = {
  title: "Payment Gateway Fee Calculator",
  description,
  alternates: { canonical: canonicalUrl("/tools/calculator") },
  openGraph: {
    ...openGraphImage,
    title: "Payment Gateway Fee Calculator — FinTech Atlas",
    description,
    url: canonicalUrl("/tools/calculator"),
  },
};

export default function FeeCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Tools", href: "/tools" },
              { name: "Payment Gateway Fee Calculator", href: "/tools/calculator" },
            ]),
          ),
        }}
      />
      <Suspense fallback={<div className="px-5 py-24 text-center text-sm text-[var(--muted-text)]">Loading calculator…</div>}>
        <FeeCalculatorPageClient />
      </Suspense>
      <section className="mx-auto max-w-5xl px-5 pb-16">
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card)] p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--muted-text)]">Related comparisons</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link href="/articles/razorpay-vs-stripe-payments-india" className="btn-ghost text-xs">Razorpay vs Stripe (India)</Link>
            <Link href="/articles/razorpay-vs-cashfree-indian-gateways" className="btn-ghost text-xs">Razorpay vs Cashfree</Link>
            <Link href="/articles/stripe-vs-paypal-online-payments" className="btn-ghost text-xs">Stripe vs PayPal</Link>
          </div>
        </div>
      </section>
    </>
  );
}
