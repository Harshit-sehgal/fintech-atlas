import type { Metadata } from "next";
import CalculatorsClient from "./calculators-client";
import { canonicalUrl } from "@/lib/canonical-url";
import { openGraphImage } from "@/lib/shared-metadata";
import { breadcrumbJsonLd } from "@/components/breadcrumbs";

const description =
  "Project SIP and SWP growth, estimate EMIs, inflation, retirement corpus, FIRE number, emergency fund, and net worth with illustrative calculators.";

export const metadata: Metadata = {
  title: "Personal Finance Calculators",
  description,
  alternates: { canonical: canonicalUrl("/tools/calculators") },
  openGraph: {
    ...openGraphImage,
    title: "Personal Finance Calculators — FinTech Atlas",
    description,
    url: canonicalUrl("/tools/calculators"),
  },
};

export default function CalculatorsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Tools", href: "/tools" },
              { name: "Personal Finance Calculators", href: "/tools/calculators" },
            ]),
          ),
        }}
      />
      <CalculatorsClient />
    </>
  );
}
