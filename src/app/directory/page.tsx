import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Redirect } from "@/components/ui/redirect";
import { openGraphImage } from "@/lib/shared-metadata";
import { SITE_URL } from "@/lib/site-config";

/**
 * Retired hub (T158). "All directories" was a page that only linked to other
 * pages; companies are now a single directory, so this route redirects there.
 */
const title = "Companies";
const description =
  "Companies on FinTech Atlas now live in one directory, organised by region and country. Taking you there.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/directory" },
  robots: { index: false, follow: true },
  openGraph: {
    ...openGraphImage,
    title: `${title} — FinTech Atlas`,
    description,
    url: `${SITE_URL}/directory`,
  },
};

export default function DirectoryPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-24">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Companies", href: "/global-directory" },
        ]}
      />
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">Companies</h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--muted-text)]">
        Every company now lives at one address — indexed by region and country,
        with the same set grouped by industry.
      </p>
      <div className="mt-4">
        <Redirect to="/global-directory" label="the Companies directory" />
      </div>
    </div>
  );
}
