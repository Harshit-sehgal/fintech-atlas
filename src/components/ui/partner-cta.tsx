"use client";

/**
 * Reusable commercial partner CTA for tool results and comparison rows.
 *
 * Resolves the affiliate/partner link via `resolvePartnerCta` (appending UTMs
 * without clobbering network params), applies `rel="sponsored"` when the link
 * is commercial, and fires a `cta_click` analytics event. Falls back to the
 * official website for companies with no partner row, and renders nothing for
 * slugs that are not real companies (e.g. the remittance "bank" baseline).
 */

import {
  resolvePartnerCta,
  partnerRel,
  COMMERCIAL_DISCLOSURE,
  type PartnerCtaPlacement,
} from "@/lib/partners";
import { trackCtaClick } from "@/lib/analytics";

interface PartnerCtaProps {
  slug: string;
  placement: PartnerCtaPlacement;
  /** Override button label; defaults to the partner config label. */
  label?: string;
  variant?: "button" | "link" | "compact";
  className?: string;
}

const VARIANT_CLASSES: Record<NonNullable<PartnerCtaProps["variant"]>, string> = {
  button:
    "btn-primary inline-flex items-center gap-2 text-sm px-5 py-2.5",
  link:
    "inline-flex items-center gap-1 text-sm font-bold text-[var(--accent)] hover:underline",
  compact:
    "inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--subtle-bg)]/50 px-3 py-1.5 text-xs font-semibold text-[var(--foreground)] hover:border-[var(--foreground)]/40 focus-visible:outline-none focus-visible:ring-[var(--ring)]",
};

export function PartnerCta({
  slug,
  placement,
  label,
  variant = "button",
  className = "",
}: PartnerCtaProps) {
  const cta = resolvePartnerCta(slug, placement);
  if (!cta) return null;

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <a
        href={cta.href}
        target="_blank"
        rel={partnerRel(cta.isCommercial)}
        onClick={() =>
          trackCtaClick({
            companySlug: slug,
            placement,
            relationship: cta.relationship,
            trackingId: cta.trackingId,
          })
        }
        className={`${VARIANT_CLASSES[variant]} ${className}`.trim()}
      >
        {label ?? cta.label} ↗
      </a>
      {cta.isCommercial && (
        <span className="max-w-xs text-[10px] leading-snug text-[var(--muted-text)]">
          {COMMERCIAL_DISCLOSURE}
        </span>
      )}
    </span>
  );
}
