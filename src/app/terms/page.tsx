import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { canonicalUrl } from "@/lib/canonical-url";
import { LEGAL_EFFECTIVE_DATE } from "@/lib/legal-config";
import { openGraphImage } from "@/lib/shared-metadata";

const description =
  "Terms for using FinTech Atlas as an educational directory and illustrative decision-tool site.";

export const metadata: Metadata = {
  title: "Terms of Use",
  description,
  alternates: { canonical: canonicalUrl("/terms") },
  openGraph: {
    ...openGraphImage,
    title: "Terms of Use — FinTech Atlas",
    description,
    url: canonicalUrl("/terms"),
  },
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal & usage"
      title="Terms of Use"
      description="These terms describe the permitted and intended use of FinTech Atlas in its current static, educational form."
      effectiveDate={LEGAL_EFFECTIVE_DATE}
    >
      <section>
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Educational information only</h2>
        <p className="mt-3">
          FinTech Atlas provides general educational information about financial-technology companies, products, terminology, and illustrative calculations. It is not financial, legal, tax, investment, lending, or procurement advice, and it does not create a client, fiduciary, or advisory relationship.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Verify before relying</h2>
        <p className="mt-3">
          Company details, pricing, employee counts, valuations, ratings, and exchange-rate snapshots can change, vary by jurisdiction, or reflect editorial context rather than a measured aggregate. Calculator outputs are illustrative models, not quotes. Verify current terms with the relevant provider and obtain professional advice where appropriate.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Acceptable use</h2>
        <p className="mt-3">
          You may access and link to the site for lawful personal, educational, and research purposes. Do not misuse the site, attempt to disrupt its static hosting, scrape it in a way that harms availability, or represent the site&apos;s editorial summaries as endorsements by the companies mentioned.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Third-party names and links</h2>
        <p className="mt-3">
          Company names, logos, and product names belong to their respective owners and are used for identification and education. External links are provided for reference; FinTech Atlas does not control or warrant third-party content, availability, pricing, or policies.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Availability and changes</h2>
        <p className="mt-3">
          The site is provided on an “as is” and “as available” basis. We may correct content, change features, or remove pages without notice. Nothing in these terms limits rights that cannot lawfully be limited in your jurisdiction.
        </p>
      </section>
    </LegalPage>
  );
}
