import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { pageMetadata } from "@/lib/shared-metadata";
import { changelog, changelogKindLabels } from "@/data/changelog";
export const metadata: Metadata = pageMetadata({
  pathname: "/changelog",
  title: "Site Changelog",
  description:
    "What changed on FinTech Atlas and when: new guides, tools, fee updates, and fixes — the site's own update log, also available as an RSS feed.",
  ogDescription:
    "New guides, tools, fee updates, and fixes on FinTech Atlas — the site's update log, also available as an RSS feed.",
  extraAlternates: {
    types: {
      "application/rss+xml": [
        { url: "/changelog.xml", title: "FinTech Atlas — Site Changelog" },
      ],
    },
  },
});

const kindDot: Record<string, string> = {
  tool: "bg-[var(--accent-strong)]",
  fix: "bg-[var(--danger-text)]",
  site: "bg-[var(--muted-text)]",
};

export default function ChangelogPage() {
  return (
    <div className="relative mx-auto max-w-4xl px-5 py-20 md:py-28">
      <GridBackdrop />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Changelog", href: "/changelog" },
        ]}
      />

      <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl text-[var(--foreground)]">
        Site <span className="font-serif italic text-[var(--accent)]">Changelog</span>
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted-text)]">
        What changed on FinTech Atlas and when — new guides, tools, fee updates, and fixes. This
        page is also published as an{" "}
        <a
          className="text-[var(--accent-ink)] underline decoration-[var(--accent)]/40 underline-offset-4 hover:decoration-[var(--accent)]"
          href="/changelog.xml"
        >
          RSS feed
        </a>
        .
      </p>

      {/* The update log — no rules: each entry breathes, the title
          sweeps a marker on hover, the kind dot stays as a glyph. */}
      <ol className="mt-8">
        {changelog.map((entry) => (
          <li
            key={entry.href + entry.title}
            className="group py-5"
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span
                className={`inline-block h-2 w-2 rounded-full ${kindDot[entry.kind] ?? "bg-[var(--muted-text)]"}`}
                aria-hidden="true"
              />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted-text)]">
                {changelogKindLabels[entry.kind]}
              </span>
              <time
                dateTime={entry.date}
                className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted-text)]"
              >
                {entry.date}
              </time>
            </div>
            <h2 className="mt-2 text-base font-bold text-[var(--foreground)]">
              {entry.href.startsWith("http") ? (
                <a
                  className="transition-colors hover:text-[var(--accent)]"
                  href={entry.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="hl-link">{entry.title}</span> <span aria-hidden>→</span>
                </a>
              ) : (
                <Link
                  className="transition-colors hover:text-[var(--accent)]"
                  href={entry.href}
                >
                  <span className="hl-link">{entry.title}</span> <span aria-hidden>→</span>
                </Link>
              )}
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-[var(--muted-text)]">{entry.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
