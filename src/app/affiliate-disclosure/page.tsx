import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { LEGAL_EFFECTIVE_DATE } from "@/lib/legal-config";
import { pageMetadata } from "@/lib/shared-metadata";

const description =
  "When and how FinTech Atlas earns money through affiliate links and clearly-labeled sponsored placements, and why it never affects our editorial independence.";

export const metadata: Metadata = {
  ...pageMetadata({
    pathname: "/affiliate-disclosure",
    title: "Affiliate Disclosure",
    description,
  }),
  robots: { index: true, follow: true },
};

export default function AffiliateDisclosurePage() {
  return (
    <LegalPage
      eyebrow="Legal & transparency"
      title="Affiliate Disclosure"
      description="We keep independent editorial content separate from commercial inventory, and we tell you when a link may earn us money."
      effectiveDate={LEGAL_EFFECTIVE_DATE}
    >
      <section>
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Affiliate links</h2>
        <p className="mt-3">
          Some outbound links on this site are affiliate links. If you click one and
          make a purchase or sign up for a service, FinTech Atlas may earn a
          commission — at no extra cost to you. We only link to companies we cover in
          our directory and evaluate as part of our editorial project.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[var(--foreground)]">How it works</h2>
        <p className="mt-3">
          When a link is commercial, we add the HTML <code className="text-[var(--foreground)]">rel=&quot;sponsored&quot;</code>{" "}
          attribute and display a disclosure notice next to or near the link — for
          example, &ldquo;we may earn a commission when you buy through this link.&rdquo;
          This reflects the standard FTC guidance that readers should be able to tell,
          before clicking, that a link may generate revenue.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Sponsored placements</h2>
        <p className="mt-3">
          We may also accept sponsored placements from companies in our directory.
          When we do, those placements are always clearly labeled (for example with a
          &ldquo;Featured partner&rdquo; badge) and are handled as inventory separate from
          editorial content.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Editorial independence</h2>
        <p className="mt-3">
          A commercial relationship never buys a rating, a ranking position in the
          editorial directory, or an editorial claim. Our ratings are presented as
          editorial sentiment summaries and our pricing comparisons use the same
          published-rate assumptions regardless of whether a company has any
          commercial arrangement with us. If you believe any content is not
          independent, contact us through the repository&apos;s issue tracker.
        </p>
      </section>

      <p className="border-l-2 border-[var(--accent)] pl-4 text-xs">
        This disclosure is informational and complements our Privacy Notice and Terms
        of Use. It should be reviewed alongside jurisdiction-specific legal advice
        before production launch.
      </p>
    </LegalPage>
  );
}
