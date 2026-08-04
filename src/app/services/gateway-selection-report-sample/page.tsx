import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { SectionHeading } from "@/components/ui/section-heading";
import { canonicalUrl } from "@/lib/canonical-url";
import { openGraphImage } from "@/lib/shared-metadata";
import { gatewayEstimates, SAMPLE_MERCHANT } from "@/lib/services-report";

const description =
  "A public sample of the FinTech Atlas gateway-selection audit: a fictional merchant, real published India fee schedules (2% + 18% GST), and the reasoning behind the recommendation.";

export const metadata: Metadata = {
  title: "Sample Gateway Selection Report (public sample)",
  description,
  alternates: { canonical: canonicalUrl("/services/gateway-selection-report-sample") },
  openGraph: {
    ...openGraphImage,
    title: "Sample Gateway Selection Report — FinTech Atlas",
    description,
    url: canonicalUrl("/services/gateway-selection-report-sample"),
  },
};

const CURRENCY = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function SampleReportPage() {
  // Computed at build time from PROVIDER_FEE_CONFIGS — the same tables the
  // site's fee calculator uses. If a provider changes its published rates,
  // this report changes with the calculator.
  const rows = gatewayEstimates();
  const best = [...rows].sort((a, b) => a.total - b.total)[0];
  const monthlyOrderCount = Math.round(SAMPLE_MERCHANT.monthlyVolume / SAMPLE_MERCHANT.avgOrderValue);

  return (
    <div className="relative mx-auto max-w-4xl px-5 py-20 md:py-28">
      <GridBackdrop />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: "Sample report", href: "/services/gateway-selection-report-sample" },
        ]}
      />

      <SectionHeading
        headingLevel={1}
        eyebrow="Sample deliverable · T061"
        title="Gateway selection audit — sample report"
        description="This is a public sample of the paid audit. The merchant is fictional; every fee figure is computed from the published India schedules this site already uses in its fee calculator."
      />

      {/* Merchant profile */}
      <section aria-labelledby="rpt-profile" className="mt-12">
        <h2 id="rpt-profile" className="text-lg font-bold tracking-tight">1 · Merchant profile</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            ["Business", SAMPLE_MERCHANT.name],
            ["Monthly card volume", CURRENCY.format(SAMPLE_MERCHANT.monthlyVolume)],
            ["Average order value", CURRENCY.format(SAMPLE_MERCHANT.avgOrderValue)],
            ["Orders per month", String(monthlyOrderCount)],
            ["International-card share", `${Math.round(SAMPLE_MERCHANT.internationalCardShare * 100)}%`],
            ["Channel", "Shopify storefront + custom checkout page"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-[var(--border-color)] bg-[var(--card)] px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-text)]">{label}</p>
              <p className="mt-0.5 text-sm font-medium text-[var(--foreground)]">{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fee comparison */}
      <section aria-labelledby="rpt-fees" className="mt-12">
        <h2 id="rpt-fees" className="text-lg font-bold tracking-tight">2 · Monthly fee comparison (GST-inclusive)</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <caption className="sr-only">
              Estimated monthly gateway fees for the sample merchant, sorted by total cost.
            </caption>
            <thead>
              <tr className="border-b border-[var(--border-color)] text-left text-xs uppercase tracking-wider text-[var(--muted-text)]">
                <th scope="col" className="py-2.5 pr-4 font-semibold">Provider</th>
                <th scope="col" className="py-2.5 pr-4 font-semibold">Blended rate</th>
                <th scope="col" className="py-2.5 pr-4 font-semibold">Platform fee</th>
                <th scope="col" className="py-2.5 pr-4 font-semibold">GST (18%)</th>
                <th scope="col" className="py-2.5 font-semibold">Monthly total</th>
              </tr>
            </thead>
            <tbody>
              {[...rows]
                .sort((a, b) => a.total - b.total)
                .map((row, index) => (
                  <tr key={row.slug} className={`border-b border-[var(--border-color)] ${index === 0 ? "bg-[var(--subtle-bg)]/60" : ""}`}>
                    <td className="py-3 pr-4 font-medium text-[var(--foreground)]">
                      {row.name}
                      {index === 0 && <span className="ml-2 rounded-full bg-[var(--accent)]/15 px-2 py-0.5 text-[11px] font-semibold text-[var(--accent-ink)]">Lowest total</span>}
                    </td>
                    <td className="py-3 pr-4 font-mono text-[var(--muted-text)]">{row.blendedPercent.toFixed(3)}%</td>
                    <td className="py-3 pr-4 font-mono text-[var(--foreground)]">{CURRENCY.format(row.platformFee)}</td>
                    <td className="py-3 pr-4 font-mono text-[var(--muted-text)]">{CURRENCY.format(row.gst)}</td>
                    <td className="py-3 font-mono font-semibold text-[var(--foreground)]">{CURRENCY.format(row.total)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-[var(--muted-text)]">
          Blended rate = 2% domestic + international surcharge × 15% international share, matching the
          calculator&apos;s methodology; GST is 18% on the platform fee per the published India schedules.
          Effective total: {best.effectivePercent.toFixed(2)}% of volume.
        </p>
      </section>

      {/* Recommendation */}
      <section aria-labelledby="rpt-rec" className="mt-12">
        <h2 id="rpt-rec" className="text-lg font-bold tracking-tight">3 · Recommendation</h2>
        <div className="mt-4 rounded-2xl border border-[var(--border-color)] bg-[var(--card)] p-6">
          <p className="text-sm leading-relaxed text-[var(--foreground)]">
            <strong>Recommendation: {best.name}</strong> — but only just. At this volume the monthly fee
            difference between the India gateways is under a few hundred rupees; the decision should be made
            on <em>settlement speed, UPI coverage, chargeback tooling, and support</em>, not headline rates.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--foreground)]">
            <li className="flex gap-2.5"><span aria-hidden="true" className="text-[var(--accent-ink)]">→</span>Settlement: daily payout to the registered bank account for all three shortlisted providers; verify the actual T+1 vs T+2 behaviour with a live test before migrating.</li>
            <li className="flex gap-2.5"><span aria-hidden="true" className="text-[var(--accent-ink)]">→</span>International cards: all shortlisted providers charge a ~1% surcharge over the domestic rate — for a 15% international mix this added ≈₹3,600/month in the estimate; consider routing international cards through a cross-border provider only if volumes justify the setup.</li>
            <li className="flex gap-2.5"><span aria-hidden="true" className="text-[var(--accent-ink)]">→</span>Negotiation: above ₹10L/month, every major gateway publishes enterprise pricing — ask for a written quote before committing; the audit&apos;s detailed tier includes the negotiation notes.</li>
          </ul>
        </div>
      </section>

      {/* What a paid report adds */}
      <section aria-labelledby="rpt-paid" className="mt-12">
        <h2 id="rpt-paid" className="text-lg font-bold tracking-tight">4 · What the paid audit adds</h2>
        <ul className="mt-4 space-y-2 text-sm text-[var(--muted-text)]">
          <li>· Your actual volumes and card mix, not a fictional profile.</li>
          <li>· Contract review and negotiation talking points.</li>
          <li>· A migration plan with a testing checklist if you&apos;re switching.</li>
          <li>· A follow-up call to walk through the numbers.</li>
        </ul>
      </section>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link href="/services" className="btn-primary">Book your audit</Link>
        <Link href="/tools/calculator" className="btn-ghost">Run your own numbers in the free calculator</Link>
      </div>
    </div>
  );
}
