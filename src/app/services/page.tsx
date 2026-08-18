import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServicesContactForm } from "@/components/ui/services-contact";
import { SITE_URL } from "@/lib/site-config";
import { pageMetadata } from "@/lib/shared-metadata";

const description =
  "Hands-on help for Indian businesses: payment gateway selection audits (₹999–₹5,000), gateway integration (₹3,000+), and FinTech market research (verified company lists), independent of any affiliate relationship.";

export const metadata: Metadata = pageMetadata({
  pathname: "/services",
  title: "Payment Gateway Services for Indian Businesses",
  ogTitle: "Payment Gateway Services",
  description,
});

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

const RESEARCH_FEATURES = [
  { label: "Filtered list of Indian fintech companies for your ICP (category, licence, regulator, funding, location)", included: true },
  { label: "Every claim sourced and dated — confidence A = official regulator list", included: true },
  { label: "\u201cWhy it\u2019s a match\u201d reasoning per company", included: true },
  { label: "CSV export of the matched list", included: true },
  { label: "Source/evidence details per company", included: true },
  { label: "Ongoing monitoring and change alerts on the list", included: false, note: "add-on" },
  { label: "Custom taxonomy / dedicated research analyst", included: false, note: "custom" },
];

const RESEARCH_COLUMNS = [
  "Company",
  "Category",
  "Licence",
  "Regulator",
  "Website",
  "Funding",
  "Location",
  "Source",
  "Reason it\u2019s a match",
];

const STEPS = [
  {
    title: "Tell us what you need",
    text: "What you sell and at what volume — or the ICP you want a verified company list for.",
  },
  {
    title: "We analyse against your requirements",
    text: "Published India schedules + GST and settlement behaviour — or our verified directory filtered to your exact filters.",
  },
  {
    title: "You get the deliverable",
    text: "A written recommendation with the numbers and what to watch out for — or a sourced company list you can export.",
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
    "FinTech market research",
  ],
  provider: {
    "@type": "Organization",
    name: "FinTech Atlas",
    url: SITE_URL,
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
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "FinTech market research (verified company list)" },
        price: "10000",
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
        description="Fee numbers on this site are free — but if you want someone to do the analysis for your business, build the checkout, or put a verified company list in front of your sales team, here is what we offer. Independent of any gateway: we are not paid by the providers we compare."
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

      {/* Market research */}
      <section aria-labelledby="svc-research" className="surface mt-6 rounded-2xl border border-[var(--border-color)] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">FinTech market research</p>
        <h2 id="svc-research" className="mt-2 text-xl font-bold tracking-tight">
          A verified map of Indian fintech companies that fit your ICP
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--muted-text)]">
          For B2B sales, partnerships, compliance and research teams that sell to or
          work with Indian fintechs: a sourced, evidence-attached list of companies
          matching your target profile — what they do, which licences they hold,
          under which regulator, and why each one is a match. Built from the same
          verified directory behind FinTech Radar, not a generic database export.
        </p>
        <div className="mt-6 grid gap-x-8 gap-y-2.5 text-sm lg:grid-cols-2">
          {RESEARCH_FEATURES.map((f) => (
            <div key={f.label} className="flex items-start gap-2.5">
              <span aria-hidden="true" className={`mt-0.5 font-bold ${f.included ? "text-[var(--accent-ink)]" : "text-[var(--muted-text)]"}`}>
                {f.included ? "+" : "–"}
              </span>
              <span className="text-[var(--foreground)]">
                {f.label}
                {f.note && <span className="ml-2 rounded-full border border-[var(--border-color)] px-2 py-0.5 text-[11px] text-[var(--muted-text)]">{f.note}</span>}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-xl border border-[var(--border-color)] bg-[var(--subtle-bg)]/60 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-text)]">Deliverable format</p>
          <p className="mt-2 text-sm text-[var(--muted-text)]">
            A CSV / sheet with one company per row:
          </p>
          <p className="mt-2 font-mono text-xs leading-relaxed text-[var(--fg-dim)]">
            {RESEARCH_COLUMNS.join(" · ")}
          </p>
        </div>
        <div className="mt-6 rounded-xl border border-[var(--border-color)] bg-[var(--subtle-bg)]/60 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-text)]">Proposed price</p>
          <p className="mt-1 text-2xl font-bold tracking-tight">
            from ₹10,000 <span className="text-sm font-normal text-[var(--muted-text)]">per project</span>
          </p>
          <p className="mt-1 text-sm text-[var(--muted-text)]">
            Scoped by list size, filters and whether monitoring/alerts are included.
          </p>
        </div>
      </section>

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
          <h2 id="svc-book" className="text-xl font-bold tracking-tight sm:text-2xl">Book an audit, an integration, or research</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted-text)]">
            Tell us what you&apos;re selling, at what volume — or the ICP you want a
            verified list of. We reply with scope, price, and a date — no
            obligation, and no gateway will ever know you asked.
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
