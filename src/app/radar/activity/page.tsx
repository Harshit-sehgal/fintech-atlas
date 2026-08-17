import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageMetadata } from "@/lib/shared-metadata";
import { getIndiaDirectoryRecordBySlug } from "@/generated/india-directory";
import {
  radarFeedEvents,
  radarFeedFetchedOn,
  radarFeedSnapshotId,
} from "@/generated/radar-events";

export const metadata: Metadata = pageMetadata({
  pathname: "/radar/activity",
  title: "Radar Activity — Licence Events",
  description:
    "What the Radar change engine has recorded: licence events for Indian payment aggregators and cross-border aggregators from the RBI PA/PA-CB snapshot.",
});

function statusWord(status: string): string {
  switch (status) {
    case "authorised":
      return "Authorised";
    case "in-principle":
      return "In-principle";
    case "application":
      return "Application";
    default:
      return "Recorded";
  }
}

export default function RadarActivityPage() {
  const byDate = new Map<string, typeof radarFeedEvents>();
  for (const event of radarFeedEvents) {
    const bucket = byDate.get(event.happenedOn) ?? [];
    bucket.push(event);
    byDate.set(event.happenedOn, bucket);
  }
  const dates = [...byDate.keys()].sort().reverse();

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 md:py-20">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Radar", href: "/radar" },
          { name: "Activity", href: "/radar/activity" },
        ]}
      />

      <header className="mt-8">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Radar activity
        </h1>
        <p className="mt-4 text-[var(--fg-dim)]">
          Licence events recorded by the Radar change engine from the{" "}
          {radarFeedSnapshotId} RBI snapshot (fetched {radarFeedFetchedOn}). Each
          event is an established fact from the snapshot — a licence held by a
          company — not a speculative change. Real status changes will appear
          here once later snapshots are ingested through the review pipeline.
        </p>
      </header>

      <section className="mt-10">
        {dates.length === 0 ? (
          <p className="text-sm text-[var(--fg-dim)]">
            No events recorded yet.
          </p>
        ) : (
          dates.map((date) => (
            <div key={date} className="mb-8">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted-text)]">
                {date}
              </h2>
              <ul className="mt-3 space-y-2">
                {byDate.get(date)?.map((event) => {
                  const record = getIndiaDirectoryRecordBySlug(event.companyId);
                  return (
                    <li
                      key={`${event.companyId}-${event.code}-${event.happenedOn}`}
                      className="rounded-xl border border-[var(--border-color)] bg-[var(--card)] p-4"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        {record ? (
                          <Link
                            href={`/radar/company/${event.companyId}`}
                            data-placement="radar-activity-event"
                            className="font-semibold text-[var(--accent)] transition-colors hover:underline"
                          >
                            {record.name}
                          </Link>
                        ) : (
                          <span className="font-semibold">{event.companyId}</span>
                        )}
                        <span className="inline-flex w-fit rounded-full border border-[var(--accent)]/30 bg-[var(--accent-glow)] px-2.5 py-0.5 text-xs text-[var(--accent-ink)]">
                          {event.label}
                        </span>
                        <span className="inline-flex w-fit rounded-full border border-[var(--border-color)] px-2.5 py-0.5 text-xs text-[var(--muted-text)]">
                          {statusWord(event.status)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-[var(--fg-dim)]">
                        {event.type === "LICENSE_ADDED"
                          ? "Licence recorded"
                          : event.type.replace(/_/g, " ").toLowerCase()}{" "}
                        · detected {event.detectedOn}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </section>

      <section className="mt-12 border-t border-[var(--border-color)] pt-6">
        <Link
          href="/radar"
          className="inline-flex items-center gap-1 text-sm text-[var(--muted-text)] transition-colors hover:text-[var(--accent)]"
        >
          <span aria-hidden>←</span> Back to Radar
        </Link>
        <p className="mt-4 text-xs leading-relaxed text-[var(--muted-text)]">
          The change engine diffs regulator snapshots and sends every mutation
          through a human review queue before it reaches the database. The feed
          above is the baseline the engine was seeded with. Methodology:
          docs/architecture/RADAR-ARCHITECTURE.md §4–5.
        </p>
      </section>
    </div>
  );
}