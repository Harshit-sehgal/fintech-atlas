/**
 * Privacy-light product analytics for conversion optimization.
 *
 * - No cookies, no fingerprinting libraries.
 * - Events are best-effort; failures are swallowed so CTAs never break.
 * - When NEXT_PUBLIC_ANALYTICS_DOMAIN is set (Plausible-compatible), events
 *   are sent via the standard Plausible custom-event API if `window.plausible`
 *   is present. Otherwise events are no-ops (still typed for future wiring).
 *
 * Configure:
 *   NEXT_PUBLIC_ANALYTICS_DOMAIN=your-plausible-or-fathom-domain
 */

export type AnalyticsEventName =
  | "cta_click"
  | "outbound_click"
  | "tool_start"
  | "tool_complete"
  | "featured_impression"
  | "waitlist_submit"
  | "compare_view";

export interface AnalyticsProps {
  [key: string]: string | number | boolean | undefined;
}

declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, string | number | boolean | undefined> },
    ) => void;
  }
}

export function getAnalyticsDomain(): string | undefined {
  const value = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN?.trim();
  return value || undefined;
}

export function trackEvent(
  name: AnalyticsEventName,
  props?: AnalyticsProps,
): void {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.plausible === "function") {
      window.plausible(name, props ? { props } : undefined);
    }
  } catch {
    // Analytics must never break product UX.
  }
}

export function trackCtaClick(opts: {
  companySlug: string;
  placement: string;
  relationship: string;
  trackingId?: string;
}): void {
  trackEvent("cta_click", {
    company: opts.companySlug,
    placement: opts.placement,
    relationship: opts.relationship,
    tracking_id: opts.trackingId,
  });
}

export function trackOutboundClick(opts: {
  url: string;
  placement?: string;
}): void {
  trackEvent("outbound_click", {
    url: opts.url,
    placement: opts.placement || "body",
  });
}
