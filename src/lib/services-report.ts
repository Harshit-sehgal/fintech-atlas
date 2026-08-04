/**
 * Sample gateway-selection report — the numbers are derived from the SAME
 * provider fee tables the /tools/calculator uses (`PROVIDER_FEE_CONFIGS`),
 * so the report can never drift from the published schedules on the site.
 *
 * The sample merchant is fictional; every figure is illustrative.
 */
import { PROVIDER_FEE_CONFIGS } from "@/data/fee-calculator-config";

/** Fictional merchant used by the public sample report. */
export const SAMPLE_MERCHANT = {
  name: "Curio & Co. (D2C home-decor store)",
  monthlyVolume: 1_200_000, // ₹ per month, card transactions
  avgOrderValue: 1_800, // ₹
  internationalCardShare: 0.15, // 15% of orders are international cards
} as const;

export interface GatewayEstimate {
  slug: string;
  name: string;
  /** Blended platform rate: domestic rate + international surcharge × intl share. */
  blendedPercent: number;
  /** Platform fee before GST, ₹. */
  platformFee: number;
  /** GST on the platform fee (18% for India schedules), ₹. */
  gst: number;
  /** Platform fee + GST, ₹. */
  total: number;
  /** Total as a percentage of volume. */
  effectivePercent: number;
}

/**
 * Estimate monthly gateway fees for the sample merchant from the published
 * India schedules. Only INR providers are comparable against each other
 * (the calculator never mixes currencies) — enforced here.
 */
export function gatewayEstimates(
  volume: number = SAMPLE_MERCHANT.monthlyVolume,
  internationalShare: number = SAMPLE_MERCHANT.internationalCardShare,
): GatewayEstimate[] {
  const inrProviders = PROVIDER_FEE_CONFIGS.filter(
    (p) => p.currency === "INR" && p.online && !p.blended,
  );
  return inrProviders.map((p) => {
    const { online } = p;
    const blendedPercent = (online.domPct + online.intlSurcharge * internationalShare) * 100;
    const platformFee = Math.round(volume * (blendedPercent / 100));
    const gst = Math.round(platformFee * ((p.gstPercent ?? 0) / 100));
    return {
      slug: p.slug,
      name: p.name,
      blendedPercent,
      platformFee,
      gst,
      total: platformFee + gst,
      effectivePercent: ((platformFee + gst) / volume) * 100,
    };
  });
}

/**
 * Build the prefilled GitHub-issue URL behind the services contact form.
 * The fully static site has no backend and no public contact email — the
 * repo's established feedback channel is GitHub Issues (same channel as the
 * footer "Feedback & Issues" link), so the form opens a structured inquiry
 * there. Swap for a mailto target if an operator email is ever published.
 */
export function buildContactIssueUrl(opts: {
  service: string;
  email: string;
  message: string;
  businessSize?: string;
}): string {
  const title = `Services inquiry: ${opts.service}`;
  const body = [
    "**Service:** " + opts.service,
    "**Business size:** " + (opts.businessSize ?? "Not specified"),
    "**Contact email:** " + opts.email,
    "",
    "**Message:**",
    opts.message,
  ].join("\n");
  const base = "https://github.com/Harshit-sehgal/fintech-atlas/issues/new";
  return `${base}?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
}
