import Link from "next/link";
import { SPONSOR_SLOTS, sponsors, type Sponsor } from "@/data/sponsors";

const cellClass =
  "flex h-full min-h-[5.5rem] flex-col items-center justify-center gap-1.5 rounded-sm p-4 text-center";

function EmptySlot() {
  return (
    <Link
      href="/services"
      className={`${cellClass} border border-dashed border-[var(--border-strong)] transition-colors hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-[var(--ring)]`}
    >
      <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted-text)]">
        Sponsor slot
      </span>
      <span className="text-xs font-semibold text-[var(--accent)]">Available — get in touch</span>
    </Link>
  );
}

function FilledSlot({ sponsor }: { sponsor: Sponsor }) {
  return (
    <a
      href={sponsor.url}
      rel="sponsored noopener"
      target="_blank"
      className={`${cellClass} border border-[var(--border-color)] transition-colors hover:border-[var(--border-strong)] focus-visible:outline-none focus-visible:ring-[var(--ring)]`}
    >
      {sponsor.logo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={sponsor.logo}
          alt=""
          aria-hidden="true"
          width={96}
          height={28}
          loading="lazy"
          decoding="async"
          style={{ maxHeight: 28, objectFit: "contain" }}
        />
      )}
      <span className="text-sm font-semibold text-[var(--foreground)]">{sponsor.name}</span>
      {sponsor.tagline && (
        <span className="text-xs leading-snug text-[var(--muted-text)]">{sponsor.tagline}</span>
      )}
      <span className="mt-auto font-mono text-[9px] uppercase tracking-wider text-[var(--muted-text)]">
        Sponsored
      </span>
    </a>
  );
}

/**
 * The ten-slot sponsor band. Filled slots render a disclosed, `rel="sponsored"`
 * link; empty slots render an "available" placeholder linking to the services
 * contact form. Defaults come from `@/data/sponsors` so content lives in data.
 */
export function SponsorSlots({
  items = sponsors,
  slots = SPONSOR_SLOTS,
}: {
  items?: Sponsor[];
  slots?: number;
}) {
  const cells = Array.from({ length: slots }, (_, i) => items[i]);
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cells.map((sponsor, i) => (
        <li key={sponsor?.name ?? `slot-${i}`}>
          {sponsor ? <FilledSlot sponsor={sponsor} /> : <EmptySlot />}
        </li>
      ))}
    </ul>
  );
}
