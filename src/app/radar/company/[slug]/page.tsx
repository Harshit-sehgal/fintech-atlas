import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { canonicalUrl } from "@/lib/canonical-url";
import { openGraphImage } from "@/lib/shared-metadata";
import { getCompanyForResearchProfile, getCompanyName } from "@/lib/company-directory-links";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  getIndiaDirectoryRecordBySlug,
  indiaDirectoryRecords,
} from "@/generated/india-directory";
import { importDirectoryRecord } from "@/data-platform/import-directory";
import { getSource, RESEARCH_COMPILED_AT } from "@/data-platform/sources";
import { recordFreshness } from "@/data-platform/freshness";
import type { Confidence, LicenceRecord } from "@/data-platform/types";
import { WatchButton } from "../../watch-button";

/** Escape-aware title: `&` renders as `&amp;` (+4 chars), so the 65-char
 *  title gate must budget for the escaped form plus the site-name appender
 *  (" — FinTech Atlas"). Mirrors the directory profile page. */
function titleFor(name: string): string {
  const escapedLength = (value: string) =>
    value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").length;
  if (escapedLength(name) <= 49) return name;
  let cut = name.length;
  while (cut > 0 && escapedLength(name.slice(0, cut)) + 1 > 46) cut -= 1;
  return `${name.slice(0, cut)}…`;
}

function confidenceLabel(confidence: Confidence): string {
  switch (confidence) {
    case "A":
      return "Verified";
    case "B":
      return "Official company source";
    case "C":
      return "Reported";
    case "D":
      return "Secondary";
    default:
      return "Unverified";
  }
}

function confidenceTone(confidence: Confidence): string {
  switch (confidence) {
    case "A":
      return "border-[var(--accent)]/30 bg-[var(--accent-glow)] text-[var(--accent-ink)]";
    case "B":
    case "C":
      return "border-[var(--border-strong)] bg-[var(--subtle-bg)] text-[var(--muted-text)]";
    default:
      return "border-[var(--border-color)] bg-[var(--subtle-bg)] text-[var(--muted-text)]";
  }
}

function statusLabel(status: LicenceRecord["status"]): string {
  switch (status) {
    case "authorised":
      return "Authorised";
    case "in-principle":
      return "In-principle";
    case "application":
      return "Application";
    default:
      return "Unknown";
  }
}

function statusTone(status: LicenceRecord["status"]): string {
  switch (status) {
    case "authorised":
      return "border-[var(--accent)]/30 bg-[var(--accent-glow)] text-[var(--accent-ink)]";
    case "in-principle":
      return "border-[var(--border-strong)] bg-[var(--subtle-bg)] text-[var(--muted-text)]";
    case "application":
      return "border-[var(--border-strong)] bg-[var(--subtle-bg)] text-[var(--muted-text)]";
    default:
      return "border-[var(--border-color)] bg-[var(--subtle-bg)] text-[var(--muted-text)]";
  }
}

function freshnessTone(state: string): string {
  switch (state) {
    case "fresh":
      return "border-[var(--accent)]/30 bg-[var(--accent-glow)] text-[var(--accent-ink)]";
    case "due":
      return "border-[var(--border-strong)] bg-[var(--subtle-bg)] text-[var(--muted-text)]";
    default:
      return "border-[var(--border-strong)] bg-[var(--subtle-bg)] text-[var(--danger-text)]";
  }
}

function freshnessWord(state: string): string {
  switch (state) {
    case "fresh":
      return "Fresh";
    case "due":
      return "Due";
    default:
      return "Stale";
  }
}

function formatFunding(usdM: number): string {
  if (usdM >= 1000) return `~$${Number((usdM / 1000).toFixed(2))}B`;
  if (usdM >= 100) return `~$${Math.round(usdM)}M`;
  if (usdM >= 1) return `~$${Number(usdM.toFixed(1))}M`;
  return `~$${Math.round(usdM * 1000)}K`;
}

function Stat({ label, value }: { label: string; value: string | number | null }) {
  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card)] p-4">
      <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted-text)]">
        {label}
      </dt>
      <dd className="mt-1.5 text-xl font-bold tracking-tight">{value ?? "—"}</dd>
    </div>
  );
}

export function generateStaticParams() {
  return indiaDirectoryRecords.map((record) => ({ slug: record.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const record = getIndiaDirectoryRecordBySlug(slug);
  if (!record) return { title: "Not Found" };
  const title = titleFor(record.name);
  const description =
    record.description && record.description !== "n/a"
      ? `${record.description.slice(0, 140)} — regulatory intelligence for ${record.name} in the ${record.cluster} cluster.`
      : `Radar regulatory intelligence for ${record.name} in the ${record.cluster} cluster: licences, regulator, confidence and sources.`;
  return {
    title,
    description,
    alternates: { canonical: canonicalUrl(`/radar/company/${record.slug}`) },
    openGraph: {
      ...openGraphImage,
      title,
      description,
      url: canonicalUrl(`/radar/company/${record.slug}`),
    },
  };
}

export default async function RadarCompanyProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const record = getIndiaDirectoryRecordBySlug(slug);
  if (!record) notFound();

  const intelligence = importDirectoryRecord(record);
  const { company, licences, funding, evidence } = intelligence;
  const regulators = [...new Set(licences.map((l) => l.regulator))];
  const freshness = recordFreshness(intelligence, RESEARCH_COMPILED_AT);

  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Radar", href: "/radar" },
    { name: record.name, href: `/radar/company/${record.slug}` },
  ];

  const curatedCompanySlug = getCompanyForResearchProfile(record.slug);
  const curatedCompanyName = curatedCompanySlug
    ? getCompanyName(curatedCompanySlug)
    : null;

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 md:py-20">
      <Breadcrumbs items={breadcrumbItems} />

      <header className="mt-8">
        <span className="inline-flex w-fit rounded-full border border-[var(--border-color)] px-3 py-1 text-xs font-medium text-[var(--muted-text)]">
          {record.cluster}
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          {record.name}
        </h1>
        <p className="mt-3 text-[var(--fg-dim)]">{record.category}</p>
        <div className="mt-5">
          <WatchButton slug={record.slug} label={record.name} />
        </div>
      </header>

      <dl className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Founded" value={company.foundedYear ?? null} />
        <Stat
          label="Funding raised"
          value={funding.length > 0 && funding[0].totalUsdM !== undefined
            ? formatFunding(funding[0].totalUsdM)
            : null}
        />
        <Stat label="Regulator" value={regulators.length > 0 ? regulators.join(", ") : null} />
        <Stat label="Licences" value={licences.length > 0 ? licences.length : null} />
      </dl>

      <section className="mt-12">
        <h2 className="text-lg font-semibold">Regulatory intelligence</h2>
        {licences.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--fg-dim)]">
            No regulator-issued licence from the tracked families (payment
            aggregator, PPI, AA, P2P, TPAP, MTSS, SFB, AD-II, ATM, BBPOU) is
            recorded for this company yet.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {licences.map((licence) => {
              const source = getSource(licence.sourceId);
              return (
                <li
                  key={`${licence.code}-${licence.regulator}`}
                  className="rounded-xl border border-[var(--border-color)] bg-[var(--card)] p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{licence.label}</span>
                    <span
                      className={`inline-flex w-fit rounded-full border px-2.5 py-0.5 text-xs ${statusTone(licence.status)}`}
                    >
                      {statusLabel(licence.status)}
                    </span>
                    <span
                      className={`inline-flex w-fit rounded-full border px-2.5 py-0.5 text-xs ${confidenceTone(licence.confidence)}`}
                    >
                      {confidenceLabel(licence.confidence)} ({licence.confidence})
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[var(--fg-dim)]">
                    {licence.regulator} · Source: {source.publisher}
                    {licence.notes ? ` · ${licence.notes}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted-text)]">
                    Verified {licence.verifiedAt}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold">Data freshness</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--fg-dim)]">
          Every fact family is graded against a refresh policy — regulatory
          licences 30 days, funding 90, category/website 180, founded year 365 —
          as of {RESEARCH_COMPILED_AT}. Oldest verification on record:{" "}
          <strong className="text-[var(--foreground)]">{freshness.oldestVerifiedAt}</strong>.
        </p>
        <ul className="mt-4 space-y-2">
          {freshness.fields.map((field) => (
            <li
              key={field.family}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--border-color)] bg-[var(--card)] px-4 py-2.5 text-sm"
            >
              <span className="font-medium">{field.label}</span>
              <span className="flex items-center gap-2">
                <span className="text-xs text-[var(--muted-text)]">
                  verified {field.verifiedAt} · {Math.round(field.ageDays)}d old
                </span>
                <span
                  className={`inline-flex w-fit rounded-full border px-2.5 py-0.5 text-xs ${freshnessTone(field.state)}`}
                >
                  {freshnessWord(field.state)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold">Evidence &amp; sources</h2>
        <ul className="mt-4 divide-y divide-[var(--border-color)] border-y border-[var(--border-color)]">
          {evidence.map((row) => {
            const source = getSource(row.sourceId);
            return (
              <li key={`${row.fieldName}-${row.sourceId}`} className="py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-medium">{row.fieldName}</span>
                  <span
                    className={`inline-flex w-fit rounded-full border px-2.5 py-0.5 text-xs ${confidenceTone(row.confidence)}`}
                  >
                    {row.confidence}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--fg-dim)]">{row.value}</p>
                <p className="mt-1 text-xs text-[var(--muted-text)]">
                  {source.publisher} · verified {row.verifiedAt}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      {record.description && record.description !== "n/a" && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold">Overview</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--fg-dim)]">
            {record.description}
          </p>
        </section>
      )}

      <section className="mt-12 border-t border-[var(--border-color)] pt-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            href={`/india/directory/${record.slug}`}
            data-placement="radar-profile-to-directory"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)] transition-colors hover:underline"
          >
            View the full directory profile <span aria-hidden>→</span>
          </Link>
          {curatedCompanySlug && curatedCompanyName && (
            <Link
              href={`/companies/${curatedCompanySlug}`}
              data-placement="radar-profile-to-curated"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)] transition-colors hover:underline"
            >
              Read the curated profile of {curatedCompanyName} <span aria-hidden>→</span>
            </Link>
          )}
          <Link
            href="/radar"
            className="inline-flex items-center gap-1 text-sm text-[var(--muted-text)] transition-colors hover:text-[var(--accent)]"
          >
            <span aria-hidden>←</span> Back to Radar
          </Link>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-[var(--muted-text)]">
          Radar intelligence is compiled from public sources as of{" "}
          {RESEARCH_COMPILED_AT}. Confidence A means an official regulator source;
          D means a secondary compilation that still needs regulator verification.
          Full methodology: docs/architecture/RADAR-ARCHITECTURE.md.
        </p>
      </section>
    </div>
  );
}