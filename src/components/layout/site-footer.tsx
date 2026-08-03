import Link from "next/link";
import { companies } from "@/data";
import { DATA_AS_OF } from "@/lib/site-config";

const exploreLinks = [
  { href: "/companies", label: "Companies Directory" },
  { href: "/categories", label: "Industry Categories" },
  { href: "/compare", label: "Side-by-Side Comparison" },
  { href: "/glossary", label: "FinTech Glossary" },
  { href: "/bookmarks", label: "Saved Bookmarks" },
];

const toolsLinks = [
  { href: "/tools", label: "Tools Overview" },
  { href: "/tools/calculator", label: "Fee Estimator" },
  { href: "/tools/remittance", label: "Cross-Border FX Tool" },
  { href: "/tools/matchmaker", label: "Matchmaker Quiz" },
];

const aboutLinks = [
  { href: "/about", label: "Methodology & Sources" },
  { href: "/about#faq", label: "Frequently Asked Questions" },
  { href: "/about#disclaimer", label: "Educational Disclaimer" },
  { href: "/privacy", label: "Privacy Notice" },
  { href: "/terms", label: "Terms of Use" },
];

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
              {companies.length} companies profiled · Updated {DATA_AS_OF}.
            </p>
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
        {links.map((l) => (
          <li key={l.href}>
            <Link
              className="inline-flex items-center gap-1.5 text-[var(--foreground)]/85 transition-colors hover:text-[var(--accent)] group"
              href={l.href}
            >
              <span>{l.label}</span>
              <span
                aria-hidden
                className="opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 text-[var(--accent)]"
              >
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}