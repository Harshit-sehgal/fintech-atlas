import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { articles } from "@/data/articles";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { SectionHeading } from "@/components/ui/section-heading";
import { canonicalUrl } from "@/lib/canonical-url";
import { openGraphImage } from "@/lib/shared-metadata";
import { SITE_URL } from "@/lib/site-config";

const description =
  "Payment gateways and international payments for India: compare Razorpay, Cashfree, Wise, Payoneer and PayPal, calculate real fees and see what actually lands in your INR account.";

export const metadata: Metadata = {
  title: "Payment Gateways & Transfers for India",
  description,
  alternates: { canonical: canonicalUrl("/india") },
  openGraph: {
    ...openGraphImage,
    title: "Payment Gateways & Transfers for India · FinTech Atlas",
    description,
    url: canonicalUrl("/india"),
  },
};

// Every India-focused comparison in the catalog (checked against article
// availability at build time — the ComposePost step links only released slugs).
const INDIA_ARTICLES = [
  "razorpay-vs-stripe-payments-india",
  "razorpay-vs-cashfree-indian-gateways",
  "payoneer-fees-india",
  "best-way-to-receive-usd-in-india",
  "paypal-vs-payoneer-india",
  "best-payment-method-upwork-india",
  "best-payment-method-fiverr-india",
  "payment-gateway-fee-comparison-india",
  "best-payment-gateway-shopify-india",
  "receiving-500-usd-from-us-client-in-india",
  "receiving-1000-usd-from-us-client-in-india",
  "receiving-5000-usd-from-us-client-in-india",
  "quarterly-india-cross-border-fee-index",
  "fira-vs-firc-payment-methods",
  "payment-gateway-for-subscription-businesses",
] as const;

const INDIA_TOOLS = [
  {
    href: "/tools/razorpay-fee-calculator",
    name: "Razorpay Fee Calculator",
    description: "2% domestic + 18% GST (2.36% all-in) on Indian card/UPI transactions, international up to 3% — with a reverse-charge formula.",
  },
  {
    href: "/tools/calculator",
    name: "Payment Gateway Fee Estimator",
    description: "Compare total monthly processing fees across gateways on your own volume, order value and international mix (GST included).",
  },
  {
    href: "/tools/remittance",
    name: "Cross-Border FX & Transfer Estimator",
    description: "Estimate exactly what a USD transfer lands in your INR account after fees and FX markup.",
  },
  {
    href: "/tools/exchange-rate-markup-calculator",
    name: "Exchange-Rate Markup Calculator",
    description: "Expose the hidden spread on any rate you are offered — the Payoneer corridor, a bank's FX margin, or a platform quote.",
  },
];

const INDIA_PROVIDERS = [
  { slug: "razorpay", name: "Razorpay" },
  { slug: "cashfree", name: "Cashfree Payments" },
  { slug: "wise", name: "Wise" },
  { slug: "payoneer", name: "Payoneer" },
  { slug: "paytm", name: "Paytm" },
  { slug: "phonepe", name: "PhonePe" },
] as const;

function resolveArticles() {
  return INDIA_ARTICLES.map((slug) => {
    const article = articles.find((a) => a.slug === slug);
    return article ? { slug: article.slug, title: article.title, category: article.category } : null;
  }).filter(Boolean) as Array<{ slug: string; title: string; category: string }>;
}

const indiaJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Payment Gateways & International Payments for India",
  description,
  url: `${SITE_URL}/india/`,
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "India", item: `${SITE_URL}/india/` },
    ],
  },
};

export default function IndiaLandingPage() {
  const featured = resolveArticles();
  // "Recently verified" block: newest three India articles by updatedAt.
  const recentlyUpdated = [...featured]
    .sort(
      (a, b) =>
        (articles.find((x) => x.slug === b.slug)?.updatedAt ?? "").localeCompare(
          articles.find((x) => x.slug === a.slug)?.updatedAt ?? "",
        ),
    )
    .slice(0, 3);

  return (
    <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-28">
      <GridBackdrop />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "India", href: "/india" },
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(indiaJsonLd) }}
      />

      <SectionHeading
        headingLevel={1}
        eyebrow="FinTech Atlas · India"
        title="Payment gateways & international payments, compared for India"
        description={description}
      />

      {/* Primary decision CTAs — the two India-first calculators. */}
      <section aria-labelledby="india-start-here" className="mt-12">
        <h2 id="india-start-here" className="eyebrow mb-4">Start here</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <Link
            href="/tools/calculator"
            className="group relative overflow-hidden rounded-2xl border border-[var(--border-color)] surface p-6 transition-all duration-300 card-glow hover:-translate-y-1"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">Calculate fees</p>
            <h3 className="mt-2 text-xl font-bold tracking-tight text-[var(--foreground)]">
              How much do the gateways take?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted-text)]">
              Run your monthly volume, order value and international mix through the fee estimator for a GST-inclusive bottom line.
            </p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)] group-hover:translate-x-1 transition-transform">
              Open the gateway fee estimator <span aria-hidden>→</span>
            </span>
          </Link>

          <Link
            href="/tools/remittance"
            className="group relative overflow-hidden rounded-2xl border border-[var(--border-color)] surface p-6 transition-all duration-300 card-glow hover:-translate-y-1"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">What lands in INR</p>
            <h3 className="mt-2 text-xl font-bold tracking-tight text-[var(--foreground)]">
              What does a USD payment really deliver?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted-text)]">
              Compare Wise, Revolut, PayPal and a bank wire after fees, FX markup and the days in between.
            </p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)] group-hover:translate-x-1 transition-transform">
              Open the cross-border estimator <span aria-hidden>→</span>
            </span>
          </Link>
        </div>
      </section>

      {/* Tools rail */}
      <section aria-labelledby="india-tools" className="mt-14">
        <h2 id="india-tools" className="eyebrow mb-4">India calculators</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {INDIA_TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex items-start gap-4 rounded-xl border border-[var(--border-color)] surface p-5 transition-all duration-300 card-glow hover:-translate-y-0.5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--subtle-bg)] text-xl">
                <span aria-hidden>🧮</span>
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold tracking-tight text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                  {tool.name}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-[var(--muted-text)]">{tool.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Head-to-head comparisons */}
      <section aria-labelledby="india-compare" className="mt-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="india-compare" className="eyebrow mb-1">Head to head</h2>
            <p className="text-sm text-[var(--muted-text)]">Curated comparisons for Indian payment decisions.</p>
          </div>
          <Link href="/compare" className="hidden text-sm font-semibold text-[var(--accent)] hover:underline underline-offset-4 sm:inline">
            All comparisons →
          </Link>
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {featured.slice(0, 4).map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-[var(--border-color)] surface p-6 transition-all duration-300 card-glow hover:-translate-y-1"
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-text)]">{article.category}</p>
                <h3 className="mt-2 text-lg font-bold tracking-tight text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                  {article.title}
                </h3>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)] group-hover:translate-x-1 transition-transform">
                Read the comparison <span aria-hidden>→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* India provider directory */}
      <section aria-labelledby="india-providers" className="mt-14">
        <h2 id="india-providers" className="eyebrow mb-4">India provider profiles</h2>
        <p className="mb-4 max-w-2xl text-sm text-[var(--fg-dim)]">
          The full research directory holds all {""}
          <Link href="/india/directory" className="font-semibold text-[var(--accent)] hover:underline">
            1,386 Indian fintech companies
          </Link>{" "}
          — founders, funding, valuations, licences, and websites. Start with
          the curated profiles below.
        </p>
        <div className="flex flex-wrap gap-3">
          {INDIA_PROVIDERS.map((provider) => (
            <Link
              key={provider.slug}
              href={`/companies/${provider.slug}`}
              style={{ "--accent": "var(--accent)" } as CSSProperties}
              className="rounded-full border border-[var(--border-color)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              {provider.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Recently verified */}
      <section aria-labelledby="india-recently" className="mt-14">
        <h2 id="india-recently" className="eyebrow mb-4">Recently verified</h2>
        <ul className="space-y-2">
          {recentlyUpdated.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/articles/${article.slug}`}
                className="inline-flex items-baseline gap-2 text-sm text-[var(--fg-dim)] transition-colors hover:text-[var(--accent)]"
              >
                <span className="text-[var(--muted-text)]">→</span>
                <span>{article.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* All India comparisons */}
      <section aria-labelledby="india-all" className="mt-14 border-t border-[var(--border-color)] pt-8">
        <h2 id="india-all" className="eyebrow mb-4">All India guides</h2>
        <ul className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
          {featured.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/articles/${article.slug}`}
                className="inline-flex items-baseline gap-2 text-sm text-[var(--fg-dim)] transition-colors hover:text-[var(--accent)]"
              >
                <span className="text-[var(--muted-text)]">→</span>
                <span>{article.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Cross-sell services (monetization track 1) */}
      <section aria-labelledby="india-services" className="mt-14">
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-[var(--border-color)] bg-[var(--card)] p-6 sm:flex-row sm:items-center">
          <div>
            <h2 id="india-services" className="text-base font-bold tracking-tight">Want a human to run the numbers?</h2>
            <p className="mt-1 text-sm text-[var(--muted-text)]">
              Gateway selection audits and integration for Indian businesses — independent of any provider.
            </p>
          </div>
          <Link href="/services" className="btn-primary shrink-0">See services</Link>
        </div>
      </section>
    </div>
  );
}