import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { canonicalUrl } from "@/lib/canonical-url";
import { openGraphImage } from "@/lib/shared-metadata";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  getIndiaDirectoryRecordBySlug,
  indiaDirectoryRecords,
} from "@/generated/india-directory";

const UNVERIFIED = new Set(["n/a", "~", "", "-"]);

/** Escape-aware title: `&` renders as `&amp;` (+4 chars), so the 65-char
 *  title gate must budget for the escaped form. */
function titleFor(name: string): string {
  const escapedLength = (value: string) =>
    value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").length;
  if (escapedLength(name) <= 49) return name;
  let cut = name.length;
  while (cut > 0 && escapedLength(name.slice(0, cut)) + 1 > 46) cut -= 1;
  return `${name.slice(0, cut)}…`;
}

function clean(value: string): string {
  return value.replace(/\s*\(n\/a\)\s*/g, "").replace(/^n\/a\s*$/, "").trim();
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
    record.description && !UNVERIFIED.has(record.description)
      ? record.description.slice(0, 155)
      : `${record.name} — Indian fintech profile in the ${record.cluster} cluster: founders, funding, valuation, licences, and website.`;
  return {
    title,
    description,
    alternates: { canonical: canonicalUrl(`/india/directory/${record.slug}`) },
    openGraph: {
      ...openGraphImage,
      title,
      description,
      url: canonicalUrl(`/india/directory/${record.slug}`),
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

export default async function IndiaDirectoryProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const record = getIndiaDirectoryRecordBySlug(slug);
  if (!record) notFound();

  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "India", href: "/india" },
    { name: "FinTech Directory", href: "/india/directory" },
    { name: record.name, href: `/india/directory/${record.slug}` },
  ];

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
      </header>

      <dl className="mt-8">
        <Field label="Founded" value={record.founded} />
        <Field label="Headquarters" value={record.hq} />
        <Field label="Founders" value={record.founders} />
        <Field label="Funding raised" value={record.funding} />
        <Field label="Valuation / status" value={record.valuationOrStatus} />
        <Field label="Licences" value={record.licences} />
        <Field label="Website" value={record.website} />
      </dl>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Overview</h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--fg-dim)]">
          {clean(record.description) || "No public overview available for this company yet."}
        </p>
        {record.website && !UNVERIFIED.has(record.website) && (
          <a
            href={`https://${record.website}`}
            target="_blank"
            rel="noopener noreferrer"
            data-placement="india-directory-profile"
            className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)] transition-colors hover:underline"
          >
            Visit {record.website} <span aria-hidden>→</span>
          </a>
        )}
      </section>

      <section className="mt-12 border-t border-[var(--border-color)] pt-6">
        <Link
          href="/india/directory"
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
