import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServicesContactForm } from "@/components/ui/services-contact";
import { canonicalUrl } from "@/lib/canonical-url";
import { openGraphImage } from "@/lib/shared-metadata";

const description =
  "Hands-on help for Indian businesses: payment gateway selection audits (₹999–₹5,000) and gateway integration (₹3,000+), independent of any affiliate relationship.";

export const metadata: Metadata = {
  title: "Payment Gateway Services for Indian Businesses",
  description,
  alternates: { canonical: canonicalUrl("/services") },
  openGraph: {
    ...openGraphImage,
    title: "Payment Gateway Services — FinTech Atlas",
    description,
    url: canonicalUrl("/services"),
  },
};

const AUDIT_FEATURES = [
  { label: "Your volume, order value and card mix", included: true },
  { label: "Fee comparison across India-licensed gateways (incl. GST)", included: true },
  { label: "Settlement time and payout behaviour", included: true },
  { label: "UPI / international-card coverage", included: true },
  { label: "Written recommendation with reasoning", included: true },
  { label: "Contract and negotiation notes", included: false, note: "detailed tier" },
  { label: "Migration plan (if switching)", included: false, note: "detailed tier" },
];

const INTEGRATION_FEATURES = [
  { label: "Basic Razorpay/Cashfree checkout (test → live)", included: true },
  { label: "Custom webhook + refund handling", included: true },
  { label: "Ecommerce storefront integration", included: true, note: "ecommerce tier" },
  { label: "Subscription / recurring billing setup", included: false, note: "custom tier" },
  { label: "Fraud-rule and 3DS configuration", included: false, note: "ecommerce tier" },
  { label: "Reconciliation workflow with your bank statement", included: false, note: "custom tier" },
];

const STEPS = [
  {
    title: "Tell us about your business",
    text: "Volume, average order value, card mix, and what you sell — the same inputs our fee calculator uses.",
  },
  {
    title: "We analyse gateways against your profile",
    text: "Published India schedules + GST, settlement behaviour, and the operational details that matter at your volume.",
  },
  {
    title: "You get a written recommendation",
    text: "A short report with the numbers, the reasoning, and what to watch out for — or the integration work itself.",
  },
  {
    title: "You decide, we document",
    text: "The deliverable is yours regardless of which provider you pick. We are not paid by any gateway.",
  },
];

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "FinTech Atlas payment gateway services",
  serviceType: [
    "Payment gateway selection audit",
    "Payment gateway integration",
  ],
  provider: {
    "@type": "Organization",
    name: "FinTech Atlas",
    url: "https://harshit-sehgal.github.io/fintech-atlas",
  },
  areaServed: "IN",
  audience: { "@type": "BusinessAudience" },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Gateway services for Indian businesses",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Payment gateway selection audit (basic)" },
        price: "999",
        priceCurrency: "INR",
        priceValidUntil: "2027-08-04",
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Payment gateway selection audit (detailed)" },
        price: "2500",
        priceCurrency: "INR",
        priceValidUntil: "2027-08-04",
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Payment gateway integration (basic Razorpay checkout)" },
        price: "3000",
        priceCurrency: "INR",
        priceValidUntil: "2027-08-04",
      },
    ],
  },
};

export default function ServicesPage() {
  return (
    <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <GridBackdrop />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
        ]}
      />

      <SectionHeading
        headingLevel={1}
        eyebrow="Services"
        title="Payment gateway help for Indian businesses"
        description="Fee numbers on this site are free — but if you want someone to do the analysis for your business, or build the checkout, here is what we offer. Independent of any gateway: we are not paid by the providers we compare."
      />

      {/* Two service lines */}
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {/* Selection audit */}
        <section aria-labelledby="svc-audit" className="surface flex flex-col rounded-2xl border border-[var(--border-color)] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">Payment gateway selection audit</p>
          <h2 id="svc-audit" className="mt-2 text-xl font-bold tracking-tight">Which gateway should you actually use?</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted-text)]">
            A written recommendation for your specific volume, order value, and card mix — not a generic
            &ldquo;top 5&rdquo; list. Includes the GST-inclusive fee math and settlement reality.
          </p>
          <ul className="mt-5 space-y-2.5 text-sm">
            {AUDIT_FEATURES.map((f) => (
              <li key={f.label} className="flex items-start gap-2.5">
                <span aria-hidden="true" className={`mt-0.5 font-bold ${f.included ? "text-[var(--accent-ink)]" : "text-[var(--muted-text)]"}`}>
                  {f.included ? "+" : "–"}
                </span>
                <span className="text-[var(--foreground)]">
                  {f.label}
                  {f.note && <span className="ml-2 rounded-full border border-[var(--border-color)] px-2 py-0.5 text-[11px] text-[var(--muted-text)]">{f.note}</span>}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-xl border border-[var(--border-color)] bg-[var(--subtle-bg)]/60 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-text)]">Proposed price</p>
            <p className="mt-1 text-2xl font-bold tracking-tight">
              ₹999–₹1,999 <span className="text-sm font-normal text-[var(--muted-text)]">basic</span>
              <span className="mx-2 text-[var(--muted-text)]">·</span>
              ₹2,500–₹5,000 <span className="text-sm font-normal text-[var(--muted-text)]">detailed</span>
            </p>
          </div>
        </section>

        {/* Integration */}
        <section aria-labelledby="svc-integration" className="surface flex flex-col rounded-2xl border border-[var(--border-color)] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">Payment gateway integration</p>
          <h2 id="svc-integration" className="mt-2 text-xl font-bold tracking-tight">Get the checkout actually built</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted-text)]">
            From a basic Razorpay or Cashfree checkout to full ecommerce or subscription billing — done,
            tested, and handed over with the reconciliation workflow.
          </p>
          <ul className="mt-5 space-y-2.5 text-sm">
            {INTEGRATION_FEATURES.map((f) => (
              <li key={f.label} className="flex items-start gap-2.5">
                <span aria-hidden="true" className={`mt-0.5 font-bold ${f.included ? "text-[var(--accent-ink)]" : "text-[var(--muted-text)]"}`}>
                  {f.included ? "+" : "–"}
                </span>
                <span className="text-[var(--foreground)]">
                  {f.label}
                  {f.note && <span className="ml-2 rounded-full border border-[var(--border-color)] px-2 py-0.5 text-[11px] text-[var(--muted-text)]">{f.note}</span>}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-xl border border-[var(--border-color)] bg-[var(--subtle-bg)]/60 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-text)]">Proposed price</p>
            <p className="mt-1 text-2xl font-bold tracking-tight">
              ₹3,000–₹8,000 <span className="text-sm font-normal text-[var(--muted-text)]">basic checkout</span>
            </p>
            <p className="mt-1 text-sm text-[var(--muted-text)]">
              Ecommerce ₹5,000–₹15,000 · subscription/custom quoted separately
            </p>
          </div>
        </section>
      </div>

      {/* How it works */}
      <section aria-labelledby="svc-how" className="mt-16">
        <h2 id="svc-how" className="text-xl font-bold tracking-tight sm:text-2xl">How it works</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="surface rounded-2xl border border-[var(--border-color)] p-5">
              <span className="font-mono text-xs text-[var(--accent-ink)]">0{index + 1}</span>
              <h3 className="mt-2 text-sm font-bold">{step.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--muted-text)]">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Booking / contact */}
      <section aria-labelledby="svc-book" className="mt-16 grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <h2 id="svc-book" className="text-xl font-bold tracking-tight sm:text-2xl">Book an audit or request a quote</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted-text)]">
            Tell us what you&apos;re selling and at what volume. We reply with scope, price, and a date —
            no obligation, and no gateway will ever know you asked.
          </p>
          <div className="mt-6 space-y-3">
            <Link href="/services/gateway-selection-report-sample" className="block rounded-2xl border border-[var(--border-color)] bg-[var(--card)] p-4 transition-colors hover:border-[var(--accent)]/50">
              <p className="text-sm font-bold">See a sample audit report →</p>
              <p className="mt-1 text-xs text-[var(--muted-text)]">
                A fictional merchant, real published rates — exactly the format you&apos;d receive.
              </p>
            </Link>
            <Link href="/services/payment-gateway-implementation-checklist" className="block rounded-2xl border border-[var(--border-color)] bg-[var(--card)] p-4 transition-colors hover:border-[var(--accent)]/50">
              <p className="text-sm font-bold">Get the implementation checklist →</p>
              <p className="mt-1 text-xs text-[var(--muted-text)]">
                Pre-flight → go-live → reconciliation, with progress saved in your browser.
              </p>
            </Link>
          </div>
        </div>
        <div className="lg:col-span-3">
          <div className="surface rounded-2xl border border-[var(--border-color)] p-6 sm:p-8">
            <ServicesContactForm />
          </div>
        </div>
      </section>

      <p className="mt-12 border-t border-[var(--border-color)] pt-6 text-xs leading-relaxed text-[var(--muted-text)]">
        These are proposed starting prices, not guaranteed market rates. Scope and final price are confirmed
        before any work begins. Ratings and editorial conclusions on this site are never sold — the services
        above are implementation and analysis, not placement.
      </p>
    </div>
  );
}
