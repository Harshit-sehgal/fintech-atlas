"use client";

/**
 * Client anchor for an ALREADY-RESOLVED partner CTA.
 *
 * Unlike {@link ./partner-cta.tsx} it takes no slug and imports no resolver:
 * the server resolves the offer (lib/partners runs at build time) and hands
 * over plain display props. This keeps lib/partners → data/partners →
 * generated/company-summaries out of the route's client graph — the entire
 * reason article pages used to ship the full company catalog (T095/T096).
 *
 * Rendering, rel qualification and click analytics are identical to
 * PartnerCta; only the resolution moved to the server.
 */

import { trackCtaClick } from "@/lib/analytics";
import { COMMERCIAL_DISCLOSURE } from "@/lib/commercial-disclosure";

interface ResolvedPartnerCtaLinkProps {
  href: string;
  label: string;
  /** Full rel value, e.g. "sponsored noopener noreferrer". */
  rel: string;
  isCommercial: boolean;
  companySlug: string;
  placement: string;
  relationship: string;
  trackingId: string;
  variant?: "button" | "link" | "compact";
  className?: string;
}

const VARIANT_CLASSES: Record<
  NonNullable<ResolvedPartnerCtaLinkProps["variant"]>,
  string
> = {
  button: "btn-primary inline-flex items-center gap-2 text-sm px-5 py-2.5",
  link: "inline-flex items-center gap-1 text-sm font-bold text-[var(--accent)] hover:underline",
  compact:
    "inline-flex items-center gap-1.5 px-1 py-1 text-xs font-semibold text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-[var(--ring)]",
};

export function ResolvedPartnerCtaLink({
  href,
  label,
  rel,
  isCommercial,
  companySlug,
  placement,
  relationship,
  trackingId,
  variant = "button",
  className = "",
}: ResolvedPartnerCtaLinkProps) {
  return (
    <span className="inline-flex flex-col items-start gap-1">
      <a
        href={href}
        target="_blank"
        rel={rel}
        onClick={() =>
          trackCtaClick({
            companySlug,
            placement,
            relationship,
            trackingId,
          })
        }
        className={`${VARIANT_CLASSES[variant]} ${className}`.trim()}
      >
        {label} ↗
      </a>
      {isCommercial && (
        <span className="max-w-xs text-[10px] leading-snug text-[var(--muted-text)]">
          {COMMERCIAL_DISCLOSURE}
        </span>
      )}
    </span>
  );
}
