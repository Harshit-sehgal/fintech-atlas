import { GA_MEASUREMENT_ID } from "@/lib/site-config";

/**
 * Optional Google Analytics 4 loader. Renders nothing when
 * NEXT_PUBLIC_GA_MEASUREMENT_ID is unset (privacy-default, like Plausible).
 *
 * Both tags are emitted as *literal* server-rendered <script> elements rather
 * than `next/script`. The static export places them directly in <head>, which
 * lets `scripts/generate-security-headers.mjs` hash the inline bootstrap for
 * the per-page CSP. A runtime-injected inline script (e.g. `afterInteractive`)
 * carries no build-time hash and would be blocked by `script-src`.
 *
 * The external loader is covered by the `https://www.googletagmanager.com`
 * origin the CSP generator adds when this ID is configured; the collect
 * beacons are covered by the `https://*.google-analytics.com` connect-src.
 */
export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  const src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
    GA_MEASUREMENT_ID,
  )}`;
  const bootstrap = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(
    GA_MEASUREMENT_ID,
  )},{anonymize_ip:true});`;

  return (
    <>
      <script async src={src} />
      <script dangerouslySetInnerHTML={{ __html: bootstrap }} />
    </>
  );
}
