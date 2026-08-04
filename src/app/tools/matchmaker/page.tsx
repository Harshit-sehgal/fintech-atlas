import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import MatchmakerQuizPageClient from "./matchmaker-client";
import { canonicalUrl } from "@/lib/canonical-url";
import { openGraphImage } from "@/lib/shared-metadata";
import { breadcrumbJsonLd } from "@/components/breadcrumbs";

const description =
  "Answer 4 quick questions about your business or personal finance needs to get a tailored recommendation of top FinTech platforms.";

export const metadata: Metadata = {
  title: "FinTech Matchmaker Quiz",
  description,
  alternates: { canonical: canonicalUrl("/tools/matchmaker") },
  openGraph: {
    ...openGraphImage,
    title: "FinTech Matchmaker Quiz — FinTech Atlas",
    description,
    url: canonicalUrl("/tools/matchmaker"),
  },
};

export default function MatchmakerQuizPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Tools", href: "/tools" },
              { name: "Matchmaker Quiz", href: "/tools/matchmaker" },
            ]),
          ),
        }}
      />
      <Suspense fallback={<div className="px-5 py-24 text-center text-sm text-[var(--muted-text)]">Loading quiz…</div>}>
        <MatchmakerQuizPageClient />
      </Suspense>
      <section className="mx-auto max-w-5xl px-5 pb-16">
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card)] p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--muted-text)]">Related comparisons</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link href="/articles/best-payment-gateway-small-business" className="btn-ghost text-xs">Best payment gateway for small business</Link>
            <Link href="/articles/wise-vs-payoneer-business-payouts" className="btn-ghost text-xs">Wise vs Payoneer for payouts</Link>
            <Link href="/articles/best-neobanks-2026" className="btn-ghost text-xs">Best neobanks 2026</Link>
            <Link href="/articles/razorpay-vs-stripe-payments-india" className="btn-ghost text-xs">Razorpay vs Stripe (India)</Link>
          </div>
        </div>
      </section>
    </>
  );
}
