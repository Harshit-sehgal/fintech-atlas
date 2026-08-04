import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import Link from "next/link";
import { Suspense } from "react";
import FeeCalculatorPageClient from "../calculator/calculator-client";
import { canonicalUrl } from "@/lib/canonical-url";
import { openGraphImage } from "@/lib/shared-metadata";

const description =
  "Estimate what Razorpay actually charges Indian businesses: 2% on all domestic payment instruments, 18% GST on top, and international fees up to 3%. Reverse-calculate the charge for a target payout.";

export const metadata: Metadata = {
  title: "Razorpay Fee Calculator (India) — fees & GST",
  description,
  alternates: { canonical: canonicalUrl("/tools/razorpay-fee-calculator") },
  openGraph: {
    ...openGraphImage,
    title: "Razorpay Fee Calculator (India) — FinTech Atlas",
    description,
    url: canonicalUrl("/tools/razorpay-fee-calculator"),
  },
};

export default function RazorpayFeeCalculatorPage() {
  return (
    <div className="relative mx-auto max-w-6xl px-5 py-16 md:py-24">
      <article className="prose-sm mx-auto max-w-3xl">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Tools", href: "/tools" },
            { name: "Razorpay Fee Calculator", href: "/tools/razorpay-fee-calculator" },
          ]}
        />
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">India · Payment Gateways</p>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">Razorpay fee calculator</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted-text)]">
          Razorpay charges <strong className="text-[var(--foreground)]">2% on all domestic payment instruments</strong> (cards,
          UPI, netbanking, wallets) with <strong className="text-[var(--foreground)]">18% GST on the platform fee</strong> — so
          the all-in domestic rate is 2.36%. There is no setup cost or monthly fee, international cards cost up to 3%, and
          standard settlement is T+1. The calculator below applies those published assumptions to your monthly volume and
          compares Razorpay against Stripe (India) and Cashfree, with GST added on top.
        </p>

        <h2 className="mt-10 text-xl font-bold">Razorpay published India rates</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--border-color)]">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--surface)]">
                <th className="px-4 py-3 font-bold">Fee item</th>
                <th className="px-4 py-3 font-bold">Published rate</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[var(--border-color)]">
                <td className="px-4 py-3">All domestic instruments (cards, UPI, netbanking, wallets)</td>
                <td className="px-4 py-3 font-medium">2%</td>
              </tr>
              <tr className="border-b border-[var(--border-color)]">
                <td className="px-4 py-3">GST on platform fee</td>
                <td className="px-4 py-3 font-medium">18% (added on top)</td>
              </tr>
              <tr className="border-b border-[var(--border-color)]">
                <td className="px-4 py-3">All-in domestic rate</td>
                <td className="px-4 py-3 font-medium">2.36%</td>
              </tr>
              <tr className="border-b border-[var(--border-color)]">
                <td className="px-4 py-3">International cards</td>
                <td className="px-4 py-3 font-medium">Up to 3%</td>
              </tr>
              <tr className="border-b border-[var(--border-color)]">
                <td className="px-4 py-3">Setup cost / monthly fee</td>
                <td className="px-4 py-3 font-medium">₹0</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Standard settlement</td>
                <td className="px-4 py-3 font-medium">T+1</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="mt-10 text-xl font-bold">Worked example</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted-text)]">
          A D2C store processing ₹5,00,000 of domestic UPI and card payments per month pays
          ₹10,000 in platform fees (2%) plus ₹1,800 GST (18% of ₹10,000) — <strong className="text-[var(--foreground)]">₹11,800
          total, an effective 2.36%</strong> — before any chargebacks, refunds, or payment-failure reversals.
        </p>

        <h2 className="mt-10 text-xl font-bold">Reverse calculation: what to charge for a target payout</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted-text)]">
          To net ₹X after the 2.36% all-in domestic fee, set your price to{" "}
          <strong className="text-[var(--foreground)]">X ÷ 0.9764</strong>. For example, to receive ₹1,00,000 you would
          charge ₹1,02,418 — ₹2,418 of which covers fee plus GST. The calculator below lets you verify this with any
          monthly volume and average order size.
        </p>

        <h2 className="mt-10 text-xl font-bold">Methodology & limitations</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted-text)]">
          Rates reflect Razorpay&apos;s published India pricing at the catalog period
          (2% domestic, up to 3% international, 18% GST on the platform fee) and are applied uniformly to your inputs —
          they are not a contractual quote. Enterprise or volume-negotiated plans, dynamic pricing, and
          method-specific surcharges can differ. The international assumption (up to 3%) is a ceiling, not a quote; actual
          international rates depend on card network and currency. Verify current terms on Razorpay&apos;s pricing page
          before relying on the numbers.
        </p>
      </article>

      <div className="mx-auto mt-12 max-w-5xl">
        <Suspense fallback={<div className="px-5 py-24 text-center text-sm text-[var(--muted-text)]">Loading calculator…</div>}>
          <FeeCalculatorPageClient defaultCurrency="INR" showBreadcrumb={false} />
        </Suspense>
      </div>
      <section className="mx-auto max-w-5xl px-5 pb-16">
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card)] p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--muted-text)]">Related comparisons</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link href="/articles/razorpay-vs-stripe-payments-india" className="btn-ghost text-xs">Razorpay vs Stripe (India)</Link>
            <Link href="/articles/razorpay-vs-cashfree-indian-gateways" className="btn-ghost text-xs">Razorpay vs Cashfree</Link>
            <Link href="/articles/how-to-send-money-abroad-cheap" className="btn-ghost text-xs">Send money abroad: cost guide</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
