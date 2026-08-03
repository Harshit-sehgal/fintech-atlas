import Script from "next/script";
import { ANALYTICS_DOMAIN } from "@/lib/site-config";

/**
 * Optional cookieless Plausible loader. Renders nothing when
 * NEXT_PUBLIC_ANALYTICS_DOMAIN is unset (privacy-default).
 */
export function AnalyticsScript() {
  if (!ANALYTICS_DOMAIN) return null;

  return (
    <Script
      defer
      data-domain={ANALYTICS_DOMAIN}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
