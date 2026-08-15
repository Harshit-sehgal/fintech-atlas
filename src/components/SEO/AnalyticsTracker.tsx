"use client";

import { useEffect } from "react";
import { getAnalyticsDomain, trackOutboundClick } from "@/lib/analytics";

/**
 * Global outbound-link click tracking (optional, cookieless).
 *
 * Delegates a single document-level click listener so every external link —
 * article citations, company websites, provider CTAs — is attributed with the
 * nearest `data-placement` section when analytics is configured. Renders
 * nothing and attaches no listener when NEXT_PUBLIC_ANALYTICS_DOMAIN is unset
 * (privacy-default).
 */
export function AnalyticsTracker() {
  useEffect(() => {
    if (!getAnalyticsDomain()) return;

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      const anchor = (event.target as Element | null)?.closest?.(
        "a[href]",
      ) as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;
      if (/^(mailto:|tel:|#)/.test(href)) return;

      try {
        const url = new URL(href, window.location.href);
        if (url.origin === window.location.origin) return;
        const placement =
          anchor.closest("[data-placement]")?.getAttribute("data-placement") ||
          undefined;
        trackOutboundClick({ url: url.href, placement });
      } catch {
        // Malformed hrefs are not analytics events.
      }
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}