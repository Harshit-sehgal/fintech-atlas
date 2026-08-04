import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { GatewayChecklist, type ChecklistGroup } from "@/components/ui/gateway-checklist";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { SectionHeading } from "@/components/ui/section-heading";
import { canonicalUrl } from "@/lib/canonical-url";
import { openGraphImage } from "@/lib/shared-metadata";

const description =
  "The FinTech Atlas payment gateway implementation checklist: pre-flight, integration, testing, go-live and reconciliation — with progress saved in your browser.";

export const metadata: Metadata = {
  title: "Payment Gateway Implementation Checklist",
  description,
  alternates: { canonical: canonicalUrl("/services/payment-gateway-implementation-checklist") },
  openGraph: {
    ...openGraphImage,
    title: "Payment Gateway Implementation Checklist — FinTech Atlas",
    description,
    url: canonicalUrl("/services/payment-gateway-implementation-checklist"),
  },
};

const GROUPS: ChecklistGroup[] = [
  {
    id: "preflight",
    title: "Pre-flight",
    items: [
      "Confirm your business entity documents and bank account (gateway KYC is in the company's name)",
      "Check the gateway's domestic + international card rates and the 18% GST line against your volume",
      "Confirm settlement schedule (T+1 vs T+2) and the payout cut-off time with the provider",
      "Decide which payment methods you must support (UPI, cards, net banking, international cards)",
      "Ask for a written quote — published rates are not always the best available rate",
    ],
  },
  {
    id: "integration",
    title: "Integration",
    items: [
      "Use the provider's official SDK/library, not a random GitHub fork",
      "Build the checkout on the server side with a unique order ID and amount in paise",
      "Store the payment status from the webhook, not from the frontend redirect",
      "Verify refunds flow back to the original payment method",
      "Handle the failure paths: user closes the tab, timeout, double-submit prevention",
    ],
  },
  {
    id: "testing",
    title: "Testing",
    items: [
      "Run the provider's test-mode cards: success, declined, insufficient funds, 3DS",
      "Test a UPI payment end to end (collect request → success callback)",
      "Test an international card with a non-INR billing address if you accept them",
      "Verify settlement amounts reconcile with the gateway dashboard and your bank statement",
      "Test refund and partial-refund flows in test mode",
    ],
  },
  {
    id: "golive",
    title: "Go-live",
    items: [
      "Complete KYC and get production API keys — never run test keys in production",
      "Switch the webhook URL to production and verify the signature check is on",
      "Set fraud rules: velocity limits, international-card flags, AVS where supported",
      "Enable 3-D Secure (and the network token / saved-card flow if you offer it)",
      "Run a real ₹10 payment through the production checkout and verify the webhook + dashboard entry",
    ],
  },
  {
    id: "postlaunch",
    title: "Post-launch & reconciliation",
    items: [
      "Reconcile daily: gateway dashboard total vs bank credit vs your order table",
      "Investigate every mismatch before month-end, not after",
      "Track chargebacks and their reason codes monthly; respond within the provider's window",
      "Review the effective rate (fees ÷ volume) quarterly and re-check published schedules",
      "Keep the gateway's settlement reports for tax records alongside your GST returns",
    ],
  },
];

export default function ImplementationChecklistPage() {
  return (
    <div className="relative mx-auto max-w-4xl px-5 py-20 md:py-28">
      <GridBackdrop />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: "Implementation checklist", href: "/services/payment-gateway-implementation-checklist" },
        ]}
      />

      <SectionHeading
        headingLevel={1}
        eyebrow="Free deliverable · T062"
        title="Payment gateway implementation checklist"
        description="The steps we walk through on every integration we build — free to use for your own. Progress is saved in your browser, so you can track it across days."
      />

      <div className="mt-10">
        <GatewayChecklist groups={GROUPS} />
      </div>

      <div className="mt-12 flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--border-color)] bg-[var(--card)] p-5">
        <p className="text-sm text-[var(--muted-text)]">
          Stuck on a step, or want this done for you?{" "}
          <Link href="/services" className="font-semibold text-[var(--accent-ink)] underline decoration-[var(--accent)]/40 underline-offset-4 hover:decoration-[var(--accent)]">
            Book a gateway integration
          </Link>{" "}
          or run the numbers yourself in the{" "}
          <Link href="/tools/calculator" className="font-semibold text-[var(--accent-ink)] underline decoration-[var(--accent)]/40 underline-offset-4 hover:decoration-[var(--accent)]">
            fee calculator
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
