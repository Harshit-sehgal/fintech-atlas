import type { Metadata } from "next";
import Link from "next/link";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageMetadata } from "@/lib/shared-metadata";
import { parseEnrichedDirectory } from "@/lib/india-directory-parse";
import { getIndiaDirectoryRecordBySlug } from "@/generated/india-directory";
import { importDirectory } from "@/data-platform/import-directory";
import { snapshotFreshnessStats } from "@/data-platform/freshness";
import { RESEARCH_COMPILED_AT } from "@/data-platform/sources";
import { buildApplyBatch } from "@/data-platform/rbi/review";
import {
  radarReviewFetchedOn,
  radarReviewIsBaseline,
  radarReviewItems,
  radarReviewSnapshotId,
  radarReviewSummary,
} from "@/generated/radar-review";

export const metadata: Metadata = pageMetadata({
  pathname: "/radar/review",
  title: "Radar Review Queue — Research Console",
  description:
    "The Radar change-engine review queue: every licence change an operator must approve or reject before it reaches the database, plus platform freshness health.",
});

const ACTION_LABELS: Record<string, string> = {
  add_license: "Add licence",
  remove_license: "Remove licence",
  update_status: "Update status",
  new_company: "New company",
  unmatched_entry: "Unmatched entry",
};

function stateWord(state: string): string {
  return state.charAt(0).toUpperCase() + state.slice(1);
}

function stateTone(state: string): string {
  switch (state) {
    case "approved":
      return "border-[var(--accent)]/30 bg-[var(--accent-glow)] text-[var(--accent-ink)]";
    case "rejected":
      return "border-[var(--border-strong)] bg-[var(--subtle-bg)] text-[var(--danger-text)]";
    default:
      return "border-[var(--border-strong)] bg-[var(--subtle-bg)] text-[var(--muted-text)]";
  }
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card)] p-4">
      <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted-text)]">
        {label}
      </dt>
      <dd className="mt-1.5 text-2xl font-bold tracking-tight">{value}</dd>
    </div>
  );
}

function diffBits(
  before: Record<string, unknown> | null,
  after: Record<string, unknown> | null,
): string {
  if (before && after) {
    const code = String(before.code ?? "");
    return `${String(before.status ?? "—")} → ${String(after.status ?? "—")} (${code})`;
  }
  if (after) {
    const code = String(after.code ?? "");
    return `${code} · ${String(after.status ?? "—")}`;
  }
  if (before) {
    const code = String(before.code ?? "");
    return `${code} · ${String(before.status ?? "—")}`;
  }
  return "";
}

export default function RadarReviewQueuePage() {
  const records = parseEnrichedDirectory(
    readFileSync(
      resolve(process.cwd(), "docs/research/india-fintech-directory-enriched.md"),
      "utf8",
    ),
  );
  const snapshot = importDirectory(records);
  const freshness = snapshotFreshnessStats(snapshot, RESEARCH_COMPILED_AT);

  const batch = buildApplyBatch(radarReviewItems);
  const worksheet = JSON.stringify(batch, null, 2);

  const actions = Object.keys(radarReviewSummary.byAction);
  const itemsByCompany = new Map<string, typeof radarReviewItems>();
  for (const item of radarReviewItems) {
    const key = item.companyId ?? item.companyName ?? item.id;
    const list = itemsByCompany.get(key) ?? [];
    list.push(item);
    itemsByCompany.set(key, list);
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-14 md:py-20">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Radar", href: "/radar" },
          { name: "Review queue", href: "/radar/review" },
        ]}
      />

      <header className="mt-8">
        <span className="inline-flex w-fit rounded-full border border-[var(--border-color)] px-3 py-1 text-xs font-medium text-[var(--muted-text)]">
          Research console · {radarReviewSnapshotId}
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          Radar review queue
        </h1>
        <p className="mt-4 text-[var(--fg-dim)]">
          The change engine never mutates licence data silently. Every proposed
          change from the {radarReviewSnapshotId} snapshot (fetched{" "}
          {radarReviewFetchedOn}) lands here for an operator to approve or
          reject before it reaches the database. This is the review surface an
          ingest run produces; decisions are exported as an apply batch.
          {radarReviewIsBaseline
            ? " This run established the baseline, so every item records a licence from the snapshot rather than a status change."
            : ""}
        </p>
      </header>

      <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Total" value={radarReviewSummary.total} />
        <Stat label="Pending" value={radarReviewSummary.pending} />
        <Stat label="Approved" value={radarReviewSummary.approved} />
        <Stat label="Rejected" value={radarReviewSummary.rejected} />
      </dl>

      <div className="mt-4 flex flex-wrap gap-2">
        {actions.map((action) => (
          <span
            key={action}
            className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[var(--border-color)] px-3 py-1 text-xs text-[var(--muted-text)]"
          >
            {ACTION_LABELS[action] ?? action}
            <span className="font-semibold text-[var(--foreground)]">
              {radarReviewSummary.byAction[action]}
            </span>
          </span>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="text-lg font-semibold">Queue by company</h2>
        {itemsByCompany.size === 0 ? (
          <p className="mt-3 text-sm text-[var(--fg-dim)]">
            No review items in this snapshot — nothing needs approval.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {[...itemsByCompany.entries()].map(([key, items]) => {
              const record = items[0].companyId
                ? getIndiaDirectoryRecordBySlug(items[0].companyId)
                : undefined;
              return (
                <details
                  key={key}
                  className="group rounded-xl border border-[var(--border-color)] bg-[var(--card)] open:pb-2"
                >
                  <summary className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 text-sm cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    {record ? (
                      <span className="font-semibold">{record.name}</span>
                    ) : (
                      <span className="font-semibold">{items[0].companyName ?? key}</span>
                    )}
                    <span className="text-xs text-[var(--muted-text)]">
                      {items.length} item{items.length === 1 ? "" : "s"}
                    </span>
                    <span className="ml-auto text-xs text-[var(--muted-text)] group-open:hidden">
                      Expand
                    </span>
                  </summary>
                  <div className="border-t border-[var(--border-color)] px-4 py-2">
                    {record && (
                      <p className="py-2 text-xs">
                        <Link
                          href={`/radar/company/${record.slug}`}
                          data-placement="radar-review-company"
                          className="font-semibold text-[var(--accent)] transition-colors hover:underline"
                        >
                          View {record.name} profile <span aria-hidden>→</span>
                        </Link>
                      </p>
                    )}
                    <ul>
                      {items.map((item) => (
                        <li
                          key={item.id}
                          className="flex flex-wrap items-start justify-between gap-3 py-2.5"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium">
                              {ACTION_LABELS[item.action] ?? item.action}
                            </p>
                            <p className="mt-0.5 text-sm text-[var(--fg-dim)]">
                              {diffBits(item.before, item.after) || "—"}
                            </p>
                            <p className="mt-0.5 text-xs leading-relaxed text-[var(--muted-text)]">
                              {item.rationale}
                            </p>
                          </div>
                          <span
                            className={`inline-flex w-fit shrink-0 rounded-full border px-2.5 py-0.5 text-xs ${stateTone(item.state)}`}
                          >
                            {stateWord(item.state)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold">Data freshness</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--fg-dim)]">
          Platform health as of {RESEARCH_COMPILED_AT}:{" "}
          <strong className="text-[var(--foreground)]">{freshness.fresh}</strong>{" "}
          records fresh, <strong className="text-[var(--foreground)]">{freshness.due}</strong>{" "}
          due for re-verification,{" "}
          <strong className="text-[var(--foreground)]">{freshness.stale}</strong>{" "}
          stale ({freshness.freshPct}% fresh of {freshness.companies}). Freshness
          windows: regulatory licences 30 days, funding 90, category/website 180,
          founded year 365.
        </p>
        {freshness.stalest.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {freshness.stalest.map((row) => {
              const record = getIndiaDirectoryRecordBySlug(row.companyId);
              return (
                <li
                  key={`${row.companyId}-${row.family}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--border-color)] bg-[var(--card)] px-4 py-2.5 text-sm"
                >
                  <span className="font-medium">{record?.name ?? row.companyId}</span>
                  <span className="text-xs text-[var(--muted-text)]">
                    {row.family} · {row.state} · {Math.round(row.ageDays)}d old
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-[var(--fg-dim)]">
            No records need verification — the catalog is fully fresh.
          </p>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold">Decision worksheet</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--fg-dim)]">
          Every queue item carries a <em>state</em> field. To apply decisions,
          copy the JSON below, flip <code className="text-xs">pending</code> to{" "}
          <code className="text-xs">approved</code> or{" "}
          <code className="text-xs">rejected</code> per item, and hand the
          resulting file to the database apply step (the ingest CLI accepts the
          same shape via <code className="text-xs">--decisions</code>). Decisions
          never mutate the snapshot itself — they are recorded alongside it.
        </p>
        <textarea
          readOnly
          rows={10}
          aria-label="Review queue apply-batch JSON"
          className="mt-4 w-full rounded-lg border border-[var(--border-color)] bg-[var(--background)] px-3.5 py-3 font-mono text-xs leading-relaxed text-[var(--foreground)]"
          value={worksheet}
        />
      </section>

      <section className="mt-12 border-t border-[var(--border-color)] pt-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            href="/radar/activity"
            data-placement="review-to-activity"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)] transition-colors hover:underline"
          >
            See the recorded events feed <span aria-hidden>→</span>
          </Link>
          <Link
            href="/radar"
            className="inline-flex items-center gap-1 text-sm text-[var(--muted-text)] transition-colors hover:text-[var(--accent)]"
          >
            <span aria-hidden>←</span> Back to Radar
          </Link>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-[var(--muted-text)]">
          The review queue is generated from the RBI snapshot at build time by
          scripts/generate-radar-review.ts; the full pipeline is
          parse → match → diff → review (ADR-002). Confidence and source rules:
          docs/architecture/RADAR-ARCHITECTURE.md §4–5.
        </p>
      </section>
    </div>
  );
}