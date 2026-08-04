import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { canonicalUrl } from "@/lib/canonical-url";
import { openGraphImage } from "@/lib/shared-metadata";

const description =
  "Estimate payment gateway processing costs, compare reference FX scenarios, or build an initial fintech shortlist with our interactive tools.";

export const metadata: Metadata = {
  title: "Interactive FinTech Tools",
  description,
  alternates: { canonical: canonicalUrl("/tools") },
  openGraph: {
    ...openGraphImage,
    title: "Interactive FinTech Tools — FinTech Atlas",
    description,
    url: canonicalUrl("/tools"),
  },
};

const toolsList = [
  {
    id: "calculators",
    href: "/tools/calculators",
    icon: "🧮",
    name: "Personal Finance Calculators",
    badge: "Calculator Suite",
    description: "Project SIP and SWP growth, estimate EMIs, inflation, retirement corpus, FIRE number, emergency fund, and net worth.",
    features: ["SIP, SWP & CAGR", "EMI & loan costs", "Retirement & FIRE planning", "Net worth & emergency fund"],
  },
  {
    id: "calculator",
    href: "/tools/calculator",
    icon: "💳",
    name: "Payment Gateway Fee Estimator",
    badge: "Interactive Calculator",
    description: "Compare total monthly processing fees across Stripe, PayPal, Square, and Adyen based on your transaction volume, average order size, and international mix.",
    features: ["Real-time fee calculation", "Effective rate comparison", "Volume discount thresholds", "Detailed cost breakdowns"],
  },
  {
    id: "razorpay-fee-calculator",
    href: "/tools/razorpay-fee-calculator",
    icon: "🇮🇳",
    name: "Razorpay Fee Calculator (India)",
    badge: "India Calculator",
    description: "Estimate Razorpay's real cost for Indian businesses: 2% on all domestic instruments, 18% GST on top, international up to 3% — with a reverse-charge formula for target payouts.",
    features: ["2% domestic + 18% GST (2.36% all-in)", "International up to 3%", "Reverse-charge estimate", "Compare with Stripe & Cashfree"],
  },
  {
    id: "remittance",
    href: "/tools/remittance",
    icon: "🌍",
    name: "Cross-Border FX & Transfer Estimator",
    badge: "FX Tool",
    description: "Estimate recipient payouts for USD transfers to common currencies using simplified Wise, Revolut, PayPal, or hypothetical bank-wire scenarios.",
    features: ["Reference FX comparison", "Markup visibility", "Transfer speed comparison", "Recipient net payout estimate"],
  },
  {
    id: "matchmaker",
    href: "/tools/matchmaker",
    icon: "🎯",
    name: "FinTech Matchmaker Quiz",
    badge: "Interactive Quiz",
    description: "Answer a few questions about your business, scale, or personal finance needs to get an initial shortlist of FinTech platforms.",
    features: ["4-step recommendation flow", "SaaS, E-commerce, Freelance, & Personal tracks", "Pros & cons breakdown", "Direct profile links"],
  },
];

// Per-tool accent colors used to tint each tool's ambient glow + hover ring
const TOOL_ACCENTS: Record<string, string> = {
  calculators: "#8b5cf6", // violet
  calculator: "#6366f1", // indigo
  "razorpay-fee-calculator": "#3395ff", // Razorpay blue
  remittance: "#10b981", // emerald
  matchmaker: "#f59e0b", // amber
};

export default function ToolsPage() {
  return (
    <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-28">
      <GridBackdrop />

      <SectionHeading
        headingLevel={1}
        eyebrow="Interactive Decision Suite"
        title="FinTech Tools & Calculators"
        description="Data-driven tools to help you calculate real costs, compare exchange rates, and choose the right fintech services."
      />

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4 reveal-stagger">
        {toolsList.map((tool) => {
          const accent = TOOL_ACCENTS[tool.id] ?? "#6366f1";
          return (
            <Link
              key={tool.id}
              href={tool.href}
              style={{ ["--accent"]: accent } as CSSProperties}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--border-color)] surface p-6 transition-all duration-300 card-glow hover:-translate-y-1"
            >
              {/* Per-tool tinted ambient glow that intensifies on hover */}
              <div
                className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-2xl transition-all duration-500 group-hover:scale-150"
                style={{ background: `${accent}33` }}
              />

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-4xl">{tool.icon}</span>
                  <span
                    className="rounded-full border px-3 py-1 text-[11px] font-medium font-mono"
                    style={{ borderColor: `${accent}55`, background: `${accent}1a`, color: accent }}
                  >
                    {tool.badge}
                  </span>
                </div>

                <h2 className="mt-5 text-xl font-bold tracking-tight text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                  {tool.name}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted-text)]">
                  {tool.description}
                </p>

                <div className="mt-6 space-y-2 border-t border-[var(--border-color)] pt-4">
                  {tool.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-xs text-[var(--foreground)]/80">
                      <span className="text-success-text">✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex items-center gap-2 text-sm font-bold text-[var(--accent)] group-hover:translate-x-1 transition-transform">
                <span>Launch tool</span>
                <span>→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
