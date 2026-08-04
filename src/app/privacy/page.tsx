import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { canonicalUrl } from "@/lib/canonical-url";
import { LEGAL_EFFECTIVE_DATE } from "@/lib/legal-config";
import { openGraphImage } from "@/lib/shared-metadata";

const description =
  "How FinTech Atlas handles browser storage, static hosting logs, external links, and privacy.";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description,
  alternates: { canonical: canonicalUrl("/privacy") },
  openGraph: {
    ...openGraphImage,
    title: "Privacy Notice — FinTech Atlas",
    description,
    url: canonicalUrl("/privacy"),
  },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal & privacy"
      title="Privacy Notice"
      description="FinTech Atlas is a static educational site. This notice explains what the site does and does not collect in its current architecture."
      effectiveDate={LEGAL_EFFECTIVE_DATE}
    >
      <section>
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Affiliate links and sponsored placements</h2>
        <p className="mt-3">
          Some outbound links on this site are affiliate links. If you follow one and make a
          purchase or sign up, FinTech Atlas may earn a commission at no extra cost to you.
          Sponsored placements, when present, are always labeled (for example with a
          &ldquo;Featured partner&rdquo; badge). Affiliate and sponsored relationships are disclosed
          to keep independent editorial content separate from commercial inventory. We do not collect
          your data in connection with these links; the partner receives only the fact that a visitor
          arrived from this site, according to their own privacy practices.
        </p>
        <p className="mt-3">
          Where analytics is enabled (you can opt out at the site level), we may count outbound link
          clicks to measure which resources are useful. This uses no cookies, no fingerprinting, and
          no personal data — see &ldquo;Analytics&rdquo; below.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Analytics</h2>
        <p className="mt-3">
          The site may use a privacy-friendly analytics service (for example, Plausible or Fathom)
          that aggregates page views and outbound-click counts without cookies, fingerprinting, or
          storing personal data. Analytics is disabled by default unless the site operator enables it,
          and can be switched off by the visitor. We do not use advertising networks, tracking pixels,
          or cross-site trackers.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[var(--foreground)]">What we collect</h2>
        <p className="mt-3">
          The application does not provide accounts, ask for sensitive financial information, or operate a server-side database. It does not use advertising networks, tracking pixels, or a contact-submission backend.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Data stored in your browser</h2>
        <p className="mt-3">
          Bookmarks, private notes, theme preferences, and similar interactive state are stored in your browser&apos;s local storage when you use those features. The current application does not send this local state to a FinTech Atlas server. You can remove it through the site&apos;s controls or your browser&apos;s site-data settings.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Static hosting and external services</h2>
        <p className="mt-3">
          Static hosting providers may create ordinary infrastructure logs such as an IP address, request time, user agent, or requested file according to their own policies. FinTech Atlas does not control those logs. Company websites and other external links have their own privacy practices; review them before following a link or sharing information.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Changes and contact</h2>
        <p className="mt-3">
          This notice will be updated if the architecture changes—for example, if accounts, forms, or additional third-party services are introduced. Product feedback:{" "}
          <a
            href="https://github.com/Harshit-sehgal/fintech-atlas/issues/new/choose"
            className="text-[var(--accent)] underline decoration-[var(--accent)]/40 underline-offset-4 hover:decoration-[var(--accent)]"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Issues
          </a>
          . Security issues should be reported through the repository&apos;s private vulnerability-reporting mechanism described in <code className="text-[var(--foreground)]">SECURITY.md</code>.
        </p>
      </section>

      <p className="border-l-2 border-[var(--accent)] pl-4 text-xs">
        This is an informational privacy notice for the current static demo and should receive jurisdiction-specific legal review before production launch.
      </p>
    </LegalPage>
  );
}
