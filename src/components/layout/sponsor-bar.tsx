import Link from "next/link";
import { sponsors } from "@/data/sponsors";

/**
 * Site-wide sponsor bar (T163) — a slim band under the header, so a sponsor is
 * seen on every page (not just the landing page). Filled sponsors render as
 * disclosed, `rel="sponsored"` links; with none configured it shows the
 * availability CTA instead of empty boxes, so the band never looks broken.
 *
 * Kept deliberately slim (one row, static) so it does not push content down or
 * delay paint on any route.
 */
export function SponsorBar() {
  const hasSponsors = sponsors.length > 0;

  return (
    <aside aria-label="Sponsors" className="border-b border-[var(--border-color)] bg-[var(--subtle-bg)]/40">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-0.5 px-5 py-1.5 text-xs">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted-text)]">
          {hasSponsors ? "Sponsored by" : "Sponsors"}
        </span>
        {hasSponsors ? (
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-0.5">
            {sponsors.map((s) => (
              <li key={s.name}>
                <a
                  href={s.url}
                  rel="sponsored noopener"
                  target="_blank"
                  className="font-semibold text-[var(--accent)] hover:underline"
                >
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <span className="text-[var(--muted-text)]">
            10 slots available —{" "}
            <Link href="/services" className="text-[var(--accent)] underline underline-offset-2">
              become a sponsor
            </Link>
          </span>
        )}
        {hasSponsors && (
          <Link href="/services" className="ml-auto font-medium text-[var(--accent)] hover:underline">
            Sponsor this site →
          </Link>
        )}
      </div>
    </aside>
  );
}
