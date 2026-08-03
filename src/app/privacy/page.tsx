import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { canonicalUrl } from "@/lib/canonical-url";

const description =
  "How FinTech Atlas handles browser storage, static hosting logs, external links, and privacy.";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description,
  alternates: { canonical: canonicalUrl("/privacy") },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal & privacy"
      title="Privacy Notice"
      description="FinTech Atlas is a static educational site. This notice explains what the site does and does not collect in its current architecture."
      effectiveDate="August 3, 2026"
    >
      <section>
        <h2 className="text-xl font-semibold text-[var(--foreground)]">What we collect</h2>
        <p className="mt-3">
          The application does not provide accounts, ask for sensitive financial information, or operate a server-side database. It does not currently include advertising, analytics, tracking pixels, or a contact-submission backend.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Data stored in your browser</h2>
        <p className="mt-3">
          Bookmarks, private notes, theme preferences, and similar interactive state are stored in your browser&apos;s local storage when you use those features. This data is not transmitted to FinTech Atlas by the application. You can remove it through the site&apos;s controls or your browser&apos;s site-data settings.
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
          This notice will be updated if the architecture changes—for example, if accounts, analytics, forms, or third-party services are introduced. Until a dedicated contact channel is published, security issues should be reported through the repository&apos;s private vulnerability-reporting mechanism described in <code className="text-[var(--foreground)]">SECURITY.md</code>.
        </p>
      </section>

      <p className="border-l-2 border-[var(--accent)] pl-4 text-xs">
        This is an informational privacy notice for the current static demo, not a substitute for jurisdiction-specific legal advice.
      </p>
    </LegalPage>
  );
}
