import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-context";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { BookmarksProvider } from "@/lib/bookmarks-context";
import { ToastProvider } from "@/lib/toast-context";
import StructuredDataLite from "@/components/SEO/StructuredDataLite";
import { AnalyticsScript } from "@/components/SEO/AnalyticsScript";
import { assetPath, SITE_URL } from "@/lib/site-config";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { MotionConfig } from "framer-motion";
import { ServiceWorkerRegister } from "@/components/ui/service-worker-register";

// Apply the saved/system theme before the first paint using a same-origin
// blocking asset. This keeps the static export compatible with a strict CSP.

export const metadata: Metadata = {
  title: {
    default: "FinTech Atlas — Understand the companies reshaping finance",
    template: "%s — FinTech Atlas",
  },
  description:
    "A clear, plain-language guide to the FinTech industry: what each company does, how they differ, how they make money, and what the available editorial evidence suggests.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "FinTech Atlas — Understand the companies reshaping finance",
    description:
      "A plain-language guide to the FinTech industry, its leading companies, and the terms you need to understand it.",
    type: "website",
    url: SITE_URL,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "FinTech Atlas — Understand the companies reshaping finance",
      },
    ],
    siteName: "FinTech Atlas",
  },
  twitter: {
    // Intentionally only the card *format* + image. Per-page twitter:title and
    // twitter:description are omitted so X's crawler falls back to each page's
    // own og:title / og:description (set in the page-level openGraph block).
    // Defining twitter:title only at the root would lock every share to the
    // homepage's title even on per-company/category pages — the same
    // shallow-merge footgun that apply to openGraph.
    card: "summary_large_image",
    images: [`${SITE_URL}/og-image.png`],
  },
  icons: [
    {
      rel: "icon",
      url: assetPath("/globe.svg"),
    },
    {
      // iOS Safari requires a raster, square icon for home screens.
      rel: "apple-touch-icon",
      url: assetPath("/apple-touch-icon.png"),
    },
    // PWA raster icons (declared in the web manifest); referenced here so the
    // public-asset integrity test confirms none are orphaned.
    { rel: "icon", url: assetPath("/icon-192.png"), sizes: "192x192", type: "image/png" },
    { rel: "icon", url: assetPath("/icon-512.png"), sizes: "512x512", type: "image/png" },
    { rel: "icon", url: assetPath("/maskable-512.png"), sizes: "512x512", type: "image/png" },
  ],
  manifest: assetPath("/manifest.json"),
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
  },
};

// Browser/OS chrome follows the user's colour scheme instead of forcing dark.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf6" },
    { media: "(prefers-color-scheme: dark)", color: "#16140f" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <head>
        <Script src={assetPath("/theme-init.js")} strategy="beforeInteractive" />
        <AnalyticsScript />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <StructuredDataLite />
        <ServiceWorkerRegister />
        <a
          href="#main-content"
          className="sr-only focus:fixed focus:w-auto focus:h-auto focus:[clip:auto] focus:m-0 focus:px-4 focus:py-2 focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-[var(--accent)] focus:text-white focus:font-semibold focus:outline-none"
        >
          Skip to main content
        </a>
        <a
          href="#footer"
          className="sr-only focus:fixed focus:w-auto focus:h-auto focus:[clip:auto] focus:m-0 focus:px-4 focus:py-2 focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-[var(--accent)] focus:text-white focus:font-semibold focus:outline-none"
        >
          Skip to footer
        </a>
        <ErrorBoundary>
          <MotionConfig reducedMotion="user">
          <ThemeProvider>
            <ToastProvider>
              <BookmarksProvider>
                <ScrollProgress />
                <SiteHeader />
                <main id="main-content" className="flex-1">{children}</main>
                <SiteFooter />
              </BookmarksProvider>
            </ToastProvider>
          </ThemeProvider>
          </MotionConfig>
        </ErrorBoundary>
      </body>
    </html>
  );
}
