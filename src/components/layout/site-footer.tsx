import Link from "next/link";
import { companySummaries } from "@/generated/company-summaries";
import { indiaDirectorySummaries } from "@/generated/india-directory-summaries";
import { DATA_AS_OF } from "@/lib/site-config";
import { footerExploreLinks, footerAboutLinks } from "@/lib/site-nav";
import { tools } from "@/data/tools";
import { NewsletterOptIn } from "@/components/ui/newsletter-opt-in";

// Explore column from the shared nav registry, with the directory count
// derived from data so it never goes stale.
const exploreLinks = footerExploreLinks.map((l) =>
  l.href === "/india/directory"
    ? { ...l, label: `India FinTech Directory (${indiaDirectorySummaries.length.toLocaleString()})` }
    : l,
);

const toolsLinks = [
  { href: "/tools", label: "Tools Overview" },
  ...tools.map((t) => ({ href: t.href, label: t.name })),
];

const aboutLinks = footerAboutLinks;

export function SiteFooter() {
  return (
    <footer id="footer" className="relative mt-24 border-t border-[var(--border-color)] bg-[var(--subtle-bg)]/50 overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand block */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--foreground)] text-[var(--background)] transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M2 3.5h12M2 8h12M2 12.5h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
              <span className="text-[15px] font-semibold tracking-tight">FinTech Atlas</span>
            </Link>
            <p className="max-w-sm text-xs leading-relaxed text-[var(--muted-text)]">
              A plain-language guide to the companies, products, and terms reshaping financial services.
              Built from public reference material and editorial summaries.
            </p>

            {/* Small, quiet source note (no fake "live" status dot) */}
            <p className="text-[11px] text-[var(--muted-text)]">
              {companySummaries.length} companies profiled · Updated {DATA_AS_OF}.
            </p>

            {/* Newsletter opt-in (Phase 3 — audience capture) */}
            <div className="mt-2">
              <p className="text-xs font-bold text-[var(--foreground)]">
                Get the FinTech money-moves newsletter
              </p>
              <p className="mt-1 text-[11px] text-[var(--muted-text)]">
                Occasional, plain-language guides and fee comparisons. No spam.
              </p>
              <NewsletterOptIn />
            </div>
          </div>

          {/* Explore */}
          <FooterColumn title="Explore" links={exploreLinks} />

          {/* Tools */}
          <FooterColumn title="Interactive Tools" links={toolsLinks} />

          {/* About */}
          <FooterColumn title="About & Info" links={aboutLinks} />
        </div>

        {/* Bottom strip */}
        <div className="mt-12 flex flex-col gap-3 border-t border-[var(--border-color)] pt-6 text-xs text-[var(--muted-text)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} FinTech Atlas. Educational directory & decision suite.</p>
          <p>
            Data compiled from public reference labels and editorial research. See{" "}
            <Link className="text-[var(--foreground)] underline decoration-[var(--accent)]/40 underline-offset-4 hover:decoration-[var(--accent)]" href="/about">
              /about
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <div>
      <h3 className="eyebrow mb-3">{title}</h3>
      <ul className="space-y-2.5 text-xs">
        {links.map((l) => {
          const external = l.href.startsWith("http");
          const className =
            "inline-flex items-center gap-1.5 text-[var(--foreground)]/85 transition-colors hover:text-[var(--accent)] group";
          return (
            <li key={l.href}>
              {external ? (
                <a
                  className={className}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>{l.label}</span>
                  <span
                    aria-hidden
                    className="opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 text-[var(--accent)]"
                  >
                    →
                  </span>
                </a>
              ) : (
                <Link className={className} href={l.href}>
                  <span>{l.label}</span>
                  <span
                    aria-hidden
                    className="opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 text-[var(--accent)]"
                  >
                    →
                  </span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}