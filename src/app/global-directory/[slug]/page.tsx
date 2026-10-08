import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { canonicalUrl } from "@/lib/canonical-url";
import { openGraphImage, clampDescription } from "@/lib/shared-metadata";
import { getCompanyForGlobalProfile, getCompanyName } from "@/lib/company-directory-links";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  getGlobalDirectoryRecordBySlug,
  globalDirectoryRecords,
} from "@/generated/global-directory";

const UNVERIFIED = new Set(["n/a", "~", "", "-"]);

/** Escape-aware title: entities (`&amp;`, `&#x27;`, …) inflate the rendered
 *  length, so the 65-char title gate must budget for the escaped form. */
function titleFor(name: string): string {
  const escapedLength = (value: string) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .length;
  if (escapedLength(name) <= 49) return name;
  let cut = name.length;
  while (cut > 0 && escapedLength(name.slice(0, cut)) + 1 > 46) cut -= 1;
  return `${name.slice(0, cut)}…`;
}

function clean(value: string): string {
  return value.replace(/\s*\(n\/a\)\s*/g, "").replace(/^n\/a\s*$/, "").trim();
}

export function generateStaticParams() {
  return globalDirectoryRecords.map((record) => ({ slug: record.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const record = getGlobalDirectoryRecordBySlug(slug);
  if (!record) return { title: "Not Found" };
  const title = titleFor(record.name);
  // Intent-led description (per SERP CTR guidance): name + the
  // research-directory intent first, the one-liner second, then a
  // facts teaser — clamped to the 155-char display budget.
  const description =
    record.description && !UNVERIFIED.has(record.description)
      ? clampDescription(
          `${record.name} — Global research directory profile: ${record.description} Founders, funding, valuation and regulatory notes.`,
        )
      : `${record.name} — global fintech profile in the ${record.cluster} cluster: founders, funding, valuation, regulatory notes and website.`;
  return {
    title,
    description,
    alternates: { canonical: canonicalUrl(`/global-directory/${record.slug}`) },
    openGraph: {
      ...openGraphImage,
      title,
      description,
      url: canonicalUrl(`/global-directory/${record.slug}`),
    },
  };
}

function Field({ label, value }: { label: string; value: string }) {
  const isVerified = !UNVERIFIED.has(value) && !UNVERIFIED.has(clean(value));
  return (
    <div className="grid grid-cols-[minmax(0,8rem)_1fr] gap-x-4 gap-y-1 border-b border-[var(--border-color)] py-3 sm:grid-cols-[minmax(0,10rem)_1fr]">
      <dt className="text-sm font-medium text-[var(--muted-text)]">{label}</dt>
      <dd className="text-sm">
        {isVerified ? (
          value
        ) : (
          <span className="text-[var(--muted-text)]">Not publicly verified</span>
        )}
      </dd>
    </div>
  );
}

export default async function GlobalDirectoryProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const record = getGlobalDirectoryRecordBySlug(slug);
  if (!record) notFound();

  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "All directories", href: "/directory" },
    { name: "Global directory", href: "/global-directory" },
    { name: record.name, href: `/global-directory/${record.slug}` },
  ];

  // Directory bridge: when this research profile also has a curated
  // editorial profile (matched on slug — the curated catalog's slugs
  // are the company's canonical name), link across so visitors can
  // move between the data-driven record and the editorial breakdown.
  const curatedCompanySlug = getCompanyForGlobalProfile(record.slug);
  const curatedCompanyName = curatedCompanySlug
    ? getCompanyName(curatedCompanySlug)
    : null;

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 md:py-20">
      <Breadcrumbs items={breadcrumbItems} />

      <header className="mt-8">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--muted-text)]">
          {record.cluster}
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          {record.name}
        </h1>
        <p className="mt-3 text-[var(--fg-dim)]">{record.category}</p>
      </header>

      <dl className="mt-8">
        <Field label="Founded" value={record.founded} />
        <Field label="Headquarters" value={record.hq} />
        <Field label="Founders" value={record.founders} />
        <Field label="Funding raised" value={record.funding} />
        <Field label="Valuation / status" value={record.valuationOrStatus} />
        <Field label="Regulatory notes" value={record.licences} />
        <Field label="Website" value={record.website} />
      </dl>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Overview</h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--fg-dim)]">
          {clean(record.description) || "No public overview available for this company yet."}
        </p>
        {curatedCompanySlug && curatedCompanyName && (
          <Link
            href={`/companies/${curatedCompanySlug}`}
            data-placement="global-research-profile-to-company"
            className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)] transition-colors hover:underline"
          >
            Read the curated profile of {curatedCompanyName} <span aria-hidden>→</span>
          </Link>
        )}
        {record.website && !UNVERIFIED.has(record.website) && (
          <a
            href={`https://${record.website}`}
            target="_blank"
            rel="noopener noreferrer"
            data-placement="global-directory-profile"
            className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)] transition-colors hover:underline"
          >
            Visit {record.website} <span aria-hidden>→</span>
          </a>
        )}
      </section>

      <section className="mt-12 border-t border-[var(--border-color)] pt-6">
        <Link
          href="/global-directory"
          className="inline-flex items-center gap-1 text-sm text-[var(--muted-text)] transition-colors hover:text-[var(--accent)]"
        >
          <span aria-hidden>←</span> Back to the full directory
        </Link>
        <p className="mt-4 text-xs leading-relaxed text-[var(--muted-text)]">
          Research-only profile compiled from public sources. Unverified fields
          are marked &ldquo;n/a&rdquo; in the source research file.
        </p>
      </section>
    </div>
  );
}
