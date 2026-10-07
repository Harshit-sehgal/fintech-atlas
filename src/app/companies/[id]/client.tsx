"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Company, Category } from "@/data";
import { CompanyLogo } from "@/components/ui/company-logo";
import { CategoryIcon } from "@/components/ui/category-icon";
import { IconBolt, IconLink } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { useBookmarks } from "@/lib/bookmarks-context";
import { useToast } from "@/lib/toast-context";
import {
  type UserReviewItem,
  parseReviews,
  createReviewId,
  REVIEW_EVENT,
} from "@/lib/reviews";
import { formatValuationForStats, formatHeadquartersCity } from "@/lib/format-company";
import { getFocusableElementsInDialog } from "@/lib/focus-trap";
import { resolvePartnerCta, partnerRel, COMMERCIAL_DISCLOSURE } from "@/lib/partners";
import { trackCtaClick } from "@/lib/analytics";
import { readLastCompareSlugs } from "@/lib/compare";
import { CorrectionReportLink } from "@/components/ui/correction-report-link";
import { Highlight, MarkerRule } from "@/components/ui/highlight";
import type { OwnershipType } from "@/data";

function readReviews(slug: string): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(`reviews_${slug}`) ?? "";
  } catch {
    return "";
  }
}

function subscribeReviews(slug: string, onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === `reviews_${slug}`) onStoreChange();
  };
  const onLocalChange = (event: Event) => {
    if ((event as CustomEvent<{ slug?: string }>).detail?.slug === slug) onStoreChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(REVIEW_EVENT, onLocalChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(REVIEW_EVENT, onLocalChange);
  };
}


// Human-readable label + one-line description for each ownership classification
// (T009). The label is what we render in the company profile; the description is
// used as the accessible hint to make machine-checkable ownership sane to a
// non-technical reader.
const OWNERSHIP_LABELS: Record<OwnershipType, { label: string; description: string }> = {
  public: { label: "Publicly listed", description: "Traded on a public stock exchange." },
  private: { label: "Privately held", description: "Not listed on any public exchange." },
  subsidiary: { label: "Subsidiary", description: "Wholly owned by a publicly listed parent company." },
  division: { label: "Product / division", description: "A business unit or product line of a larger parent." },
  acquired: { label: "Acquired unit", description: "Acquired by a larger company and now operates within it." },
  "not-disclosed": { label: "Not disclosed", description: "Ownership status is not publicly verifiable." },
};
function ownershipLabel(t: OwnershipType): string {
  return OWNERSHIP_LABELS[t]?.label ?? t;
}

// A uniform section header: mono accent-dash eyebrow + bold section title.
function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
   return (
     <div className="mb-5">
       <span className="eyebrow">{eyebrow}</span>
       <h2 className="mt-2 text-xl font-bold tracking-tight">{title}</h2>
     </div>
   );
 }


/**
 * Profile → Compare bridge (T101). Renders a static deep link that works
 * without JS; after hydration it upgrades to "Add to comparison" when the
 * visitor has a stored line-up this profile can join. Stored slugs are used
 * as-is here (deduped + capped by readLastCompareSlugs) — the compare page's
 * parser re-validates the final URL, so stale/unknown slugs are dropped there
 * and can never reach the render layer.
 */
function CompareBridgeLink({ slug }: { slug: string }) {
  const [joinSlugs, setJoinSlugs] = useState<string[] | null>(null);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setJoinSlugs(readLastCompareSlugs());
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const target =
    joinSlugs && joinSlugs.length > 0 && joinSlugs.length < 3 && !joinSlugs.includes(slug)
      ? [...joinSlugs, slug]
      : [slug];
  const joins = target.length > 1;

  return (
    <Link
      href={`/compare?companies=${target.join(",")}`}
      data-placement="profile-to-compare"
      className="btn-ghost flex items-center gap-1.5 px-3 py-1.5 text-xs"
      title={joins ? `Open /compare with ${target.length} companies` : `Compare side-by-side`}
    >
      <span>{joins ? "Add to comparison" : "Compare"}</span>
    </Link>
  );
}

export function CompanyPageClient({
  company: c,
  relatedCategories,
  relatedArticles,
  adjacent,
  researchProfile,
}: {
  company: Company;
  relatedCategories: Category[];
  relatedArticles: { slug: string; title: string; category: string }[];
  adjacent: {
    previous: { slug: string; name: string } | null;
    next: { slug: string; name: string } | null;
  };
  researchProfile: { slug: string; name: string } | null;
}) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { showToast } = useToast();
  const bookmarked = isBookmarked(c.slug);

  // Commercial partner CTA resolved server-agnostic; fallback is the official
  // website when no partner row exists. `isCommercial` drives rel="sponsored"
  // and the earnings disclosure.
  const cta = resolvePartnerCta(c.slug, "company-profile");

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const subscribeToReviews = useCallback(
    (onStoreChange: () => void) => subscribeReviews(c.slug, onStoreChange),
    [c.slug],
  );
  const getReviewSnapshot = useCallback(() => readReviews(c.slug), [c.slug]);
  const reviewSnapshot = useSyncExternalStore(subscribeToReviews, getReviewSnapshot, () => "");
  const userReviews = parseReviews(reviewSnapshot);

  const [newRating, setNewRating] = useState(5);
  const [newAuthor, setNewAuthor] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newText, setNewText] = useState("");
  const [formErrors, setFormErrors] = useState({
    author: "",
    text: ""
  });

  // Focus management for review modal accessibility
  const previousElementRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Handle focus trapping and escape key for review modal.
  useEffect(() => {
    if (!reviewModalOpen) return;

    previousElementRef.current = document.activeElement as HTMLElement;

    const focusFirst = () => {
      const dialog = dialogRef.current;
      if (dialog) getFocusableElementsInDialog(dialog)[0]?.focus();
    };
    const animationFrame = requestAnimationFrame(focusFirst);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setReviewModalOpen(false);
        return;
      }
      if (e.key !== "Tab") return;

      const dialog = dialogRef.current;
      const focusableElements = dialog ? getFocusableElementsInDialog(dialog) : [];
      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const handleFocusIn = (e: FocusEvent) => {
      const dialog = dialogRef.current;
      const target = e.target;
      if (dialog && target instanceof Node && !dialog.contains(target)) {
        focusFirst();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("focusin", handleFocusIn);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("focusin", handleFocusIn);
      previousElementRef.current?.focus();
    };
  }, [reviewModalOpen]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href).then(
        () => showToast("Profile link copied to clipboard!", "success"),
        () => showToast("Couldn't copy the link — clipboard access was blocked.", "error"),
      );
    }
  };

  const handleBookmark = () => {
    toggleBookmark(c.slug);
    showToast(
      bookmarked ? `Removed ${c.name} from saved items` : `Saved ${c.name} to bookmarks!`,
      bookmarked ? "info" : "success"
    );
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();



    // Validate form

    const errors: {

      author: string;

      text: string;

    } = {

      author: "",

      text: ""

    };



    if (!newAuthor.trim()) {

      errors.author = "Author name is required";

    }

    if (!newText.trim()) {

      errors.text = "Review text is required";

    }



    setFormErrors(errors);



    // If there are errors, don't submit

    if (errors.author || errors.text) {

      return;

    }



    const review: UserReviewItem = {

      id: createReviewId(),

      rating: newRating,

      author: newAuthor.trim(),

      role: newRole.trim() || "Local note",

      text: newText.trim(),

      date: new Date().toLocaleDateString(),

    };



    const updated = [review, ...userReviews];

    try {

      localStorage.setItem(`reviews_${c.slug}`, JSON.stringify(updated));

    } catch {

      showToast("Failed to save review to local storage", "error");

      return;

    }

    window.dispatchEvent(new CustomEvent(REVIEW_EVENT, { detail: { slug: c.slug } }));



    setReviewModalOpen(false);

    setNewAuthor("");

    setNewRole("");

    setNewText("");

    setFormErrors({ author: "", text: "" });
    showToast("Private note saved to this browser.", "success");

  };

  const ratingRefs = useRef<Array<HTMLButtonElement | null>>([]);

  return (
    <div
      className="relative mx-auto max-w-4xl px-5 py-20 md:py-28"
      style={{ ["--accent"]: c.accent } as React.CSSProperties}
    >
      {/* Waitlayer-style grid backdrop — faint, radially faded, accent-tinted at top */}
      <GridBackdrop className="opacity-40" />

      {/* Profile controls.
          This row used to carry a *second*, hand-rolled breadcrumb beside the
          controls — a duplicate `aria-label="Breadcrumb"` landmark (axe
          landmark-unique) duplicating the canonical trail that page.tsx
          renders above, and a rigid `justify-between` flex row whose two rigid
          children measured ~355px of content in a 350px row at 390px. That
          overflow was font-metric dependent, so it passed locally and failed
          in CI. Dropping the duplicate trail and letting the controls wrap
          fixes both. */}
      {/* Profile controls — no rule row: the buttons wrap with air. */}
      <div className="mb-8 flex flex-wrap items-center justify-end gap-2">
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <CompareBridgeLink slug={c.slug} />
          <button
            onClick={handleBookmark}
            className={`flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-[var(--ring)] ${
              bookmarked
                ? "bg-[var(--warning)]/10 text-warning-text"
                : "text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]"
            }`}
          >
            <span>{bookmarked ? "★ Saved" : "☆ Save"}</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-semibold text-[var(--muted-text)] transition-colors hover:text-[var(--foreground)] hover:bg-[var(--surface)] focus-visible:outline-none focus-visible:ring-[var(--ring)]"
          >
            <IconLink size={13} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Header — brand-accented Profile Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col md:flex-row items-start gap-6 pt-2"
      >
        <div className="relative group">
          <div className="relative flex items-center justify-center p-2">
            <CompanyLogo slug={c.slug} name={c.name} size={80} />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
             <span className="eyebrow text-[10px]">
               Company profile
             </span>
            <span className="text-[10px] font-mono text-[var(--muted-text)]">
              Founded {c.founded} · {formatHeadquartersCity(c.headquarters)}
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl text-[var(--foreground)]">
            {c.name}
          </h1>
          <p className="mt-2 text-lg text-[var(--muted-text)] max-w-2xl leading-relaxed">
            {c.tagline}
          </p>

          {/* Partner CTA — commercial link with disclosure when enrolled */}
          {cta && (
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
              <a
                href={cta.href}
                target="_blank"
                rel={partnerRel(cta.isCommercial)}
                onClick={() =>
                  trackCtaClick({
                    companySlug: c.slug,
                    placement: "company-profile",
                    relationship: cta.relationship,
                    trackingId: cta.trackingId,
                  })
                }
                className="btn-primary inline-flex items-center gap-2 text-sm px-5 py-2.5"
              >
                {cta.label} ↗
              </a>
              {cta.sponsored && cta.sponsoredLabel && (
                <span className="rounded-full bg-[var(--accent)]/10 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wide text-[var(--accent)]">
                  {cta.sponsoredLabel}
                </span>
              )}
            </div>
          )}
          {cta?.isCommercial && (
            <p className="mt-3 max-w-2xl text-[11px] leading-relaxed text-[var(--muted-text)]">
              {COMMERCIAL_DISCLOSURE}
            </p>
          )}
        </div>
      </motion.div>

      {/* One-liner — no tinted block: plain ink with the key phrase marked */}
      <Reveal delay={0.05}>
        <p className="mt-8 text-pretty text-base leading-relaxed text-[var(--foreground)]">
          <strong className="font-semibold">{c.name}</strong>{" "}
          <Highlight color="yellow">{c.oneLiner}</Highlight>
        </p>
      </Reveal>

      {/* Directory bridge — plan T053: link between the curated profile and the
          India research directory when the company appears on both surfaces. */}
      {researchProfile && (
        <Reveal delay={0.05}>
          <Link
            href={`/india/directory/${researchProfile.slug}`}
            data-placement="company-profile-to-research"
            className="group mt-4 flex items-center justify-between gap-3 py-3 text-sm transition-colors"
          >
            <span className="text-[var(--muted-text)]">
              Also in the India research directory —{" "}
              <span className="hl-link font-semibold text-[var(--foreground)]">{researchProfile.name}</span>
            </span>
            <span className="shrink-0 font-semibold text-[var(--accent)]" aria-hidden>
              →
            </span>
          </Link>
        </Reveal>
      )}

      {/* Quick stats — an open fact row, not a boxed band */}
      <Reveal delay={0.1}>
        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { label: "Founded", value: String(c.founded) },
            { label: "Employees", value: c.employees },
            { label: "Ownership", value: ownershipLabel(c.ownershipType), hint: OWNERSHIP_LABELS[c.ownershipType].description },
            { label: "Valuation", value: formatValuationForStats(c) },
            { label: "Official Website", isLink: true, href: `https://${c.website}`, value: c.website },
          ].map(({ label, value, isLink, hint, href }) => (
            <div key={label} className="min-w-0">
              <dt className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted-text)]">{label}</dt>
              {isLink ? (
                <dd className="mt-1">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block truncate max-w-full text-sm font-bold text-[var(--accent-ink)] hover:underline"
                  >
                    {value} ↗
                  </a>
                </dd>
              ) : (
                <dd className="mt-1 text-sm font-bold tracking-tight text-[var(--foreground)]">
                  {value}
                  {hint && <span className="sr-only"> {hint}</span>}
                </dd>
              )}
            </div>
          ))}
        </dl>
      </Reveal>

      {/* Overview */}
      <Reveal delay={0.1}>
        <section className="mt-12">
          <SectionHeader eyebrow="Overview" title={`What is ${c.name}?`} />
          <p className="text-pretty text-sm leading-relaxed text-[var(--muted-text)]">{c.whatIsIt}</p>
        </section>
      </Reveal>

      {/* Offerings — an open list: one entry per product, the name
          sweeping a marker on hover, breathing room between entries. */}
      <Reveal delay={0.15}>
        <section className="mt-12">
          <SectionHeader eyebrow="Product Line" title="Products & Services" />
          <ul className="mt-2">
            {c.whatTheyOffer.map((offer) => (
              <li key={offer.name} className="group relative py-4">
                <h3 className="text-sm font-bold text-[var(--foreground)]">
                  <span className="hl-link">{offer.name}</span>
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-[var(--muted-text)]">{offer.description}</p>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      {/* Pricing — definition-list ledger rows instead of a boxed card. */}
      <Reveal delay={0.2}>
        <section className="mt-12">
          <SectionHeader eyebrow="Pricing" title="Fee Structure" />
          <dl className="mt-1">
            {[
              ["Model", c.pricing.model],
              ["Monthly", c.pricing.monthly],
              ["Online", c.pricing.online],
              ["In-person", c.pricing.inPerson],
              ["International", c.pricing.international],
            ]
              .filter(([, v]) => Boolean(v))
              .map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-[7rem_1fr] gap-4 py-3 sm:grid-cols-[10rem_1fr]"
                >
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted-text)] sm:pt-0.5">
                    {label}
                  </dt>
                  <dd className="text-sm text-[var(--foreground)]">{value}</dd>
                </div>
              ))}
          </dl>
          {c.pricing.notes && (
            <p className="mt-3 text-xs leading-relaxed text-[var(--muted-text)]">
              {c.pricing.notes}
            </p>
          )}

          <div className="mt-4">
            <Link
              href={
                c.slug === "razorpay"
                  ? "/tools/razorpay-fee-calculator"
                  : "/tools/calculator"
              }
              className="inline-flex items-center gap-2 text-xs font-bold text-[var(--accent-ink)] hover:underline"
            >
              <IconBolt size={13} />
              <span>Calculate your estimated fees on our Fee Estimator →</span>
            </Link>
          </div>
        </section>
      </Reveal>

      {/* Geographic Availability (T010) — definition-list ledger. */}
      {c.availability && (
        <Reveal delay={0.22}>
          <section className="mt-12">
            <SectionHeader eyebrow="Availability" title="Geographic availability" />
            <dl className="mt-1">
              <div className="grid grid-cols-[7rem_1fr] gap-4 py-3 sm:grid-cols-[10rem_1fr]">
                <dt className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted-text)] sm:pt-0.5">
                  Regions
                </dt>
                <dd className="text-sm font-medium text-[var(--foreground)]">
                  {c.availability.supportedRegions.join(" · ")}
                </dd>
              </div>
              {c.availability.unavailableRegions.length > 0 && (
                <div className="grid grid-cols-[7rem_1fr] gap-4 py-3 sm:grid-cols-[10rem_1fr]">
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted-text)] sm:pt-0.5">
                    Exclusions
                  </dt>
                  <dd className="text-sm text-[var(--muted-text)]">
                    {c.availability.unavailableRegions.join(" · ")}
                  </dd>
                </div>
              )}
            </dl>
            <p className="mt-3 text-[11px] text-[var(--muted-text)]">
              Editorial snapshot as of {c.availability.asOf}. Verify current availability directly with the provider.
            </p>
          </section>
        </Reveal>
      )}

      {/* Sources and effective dates */}
      <Reveal delay={0.24}>
        <section className="mt-12">
          <SectionHeader eyebrow="Traceability" title="Sources & effective dates" />
          <div className="pt-5">
            <p className="max-w-3xl text-sm leading-relaxed text-[var(--muted-text)]">
              These references identify the material used for the profile. A source label without a linked document is a research lead, not independently auditable evidence; verify volatile facts directly before relying on them.
            </p>
            <ul className="mt-4 grid sm:grid-cols-2">
              {(c.sourceReferences?.length
                ? c.sourceReferences.map((source) => ({
                    key: source.id,
                    label: source.title,
                    publisher: source.publisher,
                    url: source.url,
                    accessedAt: source.accessedAt,
                    effectiveAt: source.effectiveAt,
                  }))
                : c.sources.map((source) => ({
                    key: source,
                    label: source,
                    publisher: "Reference label",
                    url: undefined,
                    accessedAt: undefined,
                    effectiveAt: undefined,
                  }))
              ).map((source) => (
                <li key={source.key} className="py-3 pr-6 text-sm">
                  {source.url ? (
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--accent-ink)] hover:underline">
                      {source.label} ↗
                    </a>
                  ) : (
                    <span className="font-semibold text-[var(--foreground)]">{source.label}</span>
                  )}
                  <span className="mt-1 block text-[var(--muted-text)]">
                    {source.publisher}
                    {source.accessedAt ? ` · accessed ${source.accessedAt}` : " · access date not recorded"}
                    {source.effectiveAt ? ` · effective ${source.effectiveAt}` : ""}
                  </span>
                </li>
              ))}
            </ul>
            <CorrectionReportLink
              pageLabel={`${c.name} profile`}
              pagePath={`/companies/${c.slug}`}
            />
          </div>
        </section>
      </Reveal>

      {/* Strengths & Weaknesses */}
      <Reveal delay={0.25}>
        <section className="mt-12">
          <SectionHeader eyebrow="Analysis" title="Strengths & Tradeoffs" />
          <div className="mt-2 grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-success-text">
              <span aria-hidden className="font-mono">✓</span>
              Core Strengths
            </h3>
            <ul className="mt-3 space-y-2">
              {c.strengths.map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm leading-relaxed text-[var(--foreground)]">
                  <span className="mt-0.5 shrink-0 font-bold text-success-text">✓</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-danger-text">
              <span aria-hidden className="font-mono">✕</span>
              Known Weaknesses
            </h3>
            <ul className="mt-3 space-y-2">
              {c.weaknesses.map((w) => (
                <li key={w} className="flex items-start gap-2 text-sm leading-relaxed text-[var(--foreground)]">
                  <span className="mt-0.5 shrink-0 font-bold text-danger-text">✕</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
          </div>
        </section>
      </Reveal>

      {/* User Reviews & Review Submission */}
      <Reveal delay={0.3}>
        <section className="mt-12">
          <div className="flex items-end justify-between">
            <SectionHeader eyebrow="On-device notes" title="Editorial rating & private notes" />
            <button
              onClick={() => setReviewModalOpen(true)}
              className="btn-primary text-xs px-3.5 py-1.5 shrink-0"
            >
              + Add private note
            </button>
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-lg font-bold tabular-nums text-success-text">
                ★ {c.userReviews.rating.toFixed(2)} / 5.0
              </span>
              <p className="text-sm text-[var(--muted-text)]">Editorial sentiment summary. Notes below are saved only in this browser and are not added to this rating.</p>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-[var(--muted-text)]">
              {c.userReviews.methodology ?? `Editorially synthesized from the provenance record shown below. Ratings are qualitative editorial context — not a statistically weighted community average, independently audited score, or procurement recommendation.`}
              {c.userReviews.asOf ? ` Reviewed ${c.userReviews.asOf}.` : ""}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-[var(--muted-text)]">{c.userReviews.summary}</p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-success-text">What users like</h3>
                <ul className="mt-2 space-y-1">
                  {c.userReviews.pros.map((p) => (
                    <li key={p} className="text-xs text-[var(--muted-text)]">+ {p}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-danger-text">What users complain about</h3>
                <ul className="mt-2 space-y-1">
                  {c.userReviews.cons.map((p) => (
                    <li key={p} className="text-xs text-[var(--muted-text)]">– {p}</li>
                  ))}
                </ul>
              </div>
            </div>              {/* Notes saved in this browser */}
            {userReviews.length > 0 && (
              <div className="mt-6 pt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                  Notes saved on this device ({userReviews.length})
                </h3>
                {userReviews.map((rev) => (
                  <div key={rev.id} className="space-y-1 py-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[var(--foreground)]">{rev.author} <span className="font-normal text-[var(--muted-text)]">({rev.role})</span></span>
                      <span className="font-mono text-success-text">★ {rev.rating}/5 · {rev.date}</span>
                    </div>
                    <p className="pt-1 text-sm leading-relaxed text-[var(--muted-text)]">{rev.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </Reveal>

      {/* Customers */}
      <Reveal delay={0.35}>
        <section className="mt-12">
          <SectionHeader eyebrow="Adoption" title="Notable Customer Segments" />
          <p className="pt-4 text-sm leading-relaxed text-[var(--muted-text)]">
            {c.whoUses.map((w, i) => (
              <span key={w}>
                {i > 0 && <span aria-hidden className="px-2 text-[var(--muted-dim)]">·</span>}
                <span className="text-[var(--foreground)]">{w}</span>
              </span>
            ))}
          </p>
        </section>
      </Reveal>

      {/* Related Categories */}
      <Reveal delay={0.4}>
        <section className="mt-12">
          <SectionHeader eyebrow="Explore" title="Related Categories" />
          <div className="flex flex-wrap gap-x-6 gap-y-3 pt-4">
            {relatedCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                style={{ ["--accent"]: cat.accent } as React.CSSProperties}
                className="flex items-center gap-2.5 text-sm font-semibold text-[var(--foreground)] transition-colors hover:text-[var(--accent)]"
              >
                <CategoryIcon icon={cat.icon} color={cat.accent} size={22} />
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Related Articles — plan T051: link each provider profile to its articles */}
      {relatedArticles.length > 0 && (
        <Reveal delay={0.45}>
          <section className="mt-12">
            <SectionHeader eyebrow="Explore" title="Related Articles & Guides" />
            <ul className="mt-2 grid sm:grid-cols-2">
              {relatedArticles.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/articles/${a.slug}`}
                    className="group block py-3 pr-6 text-sm transition-colors"
                  >
                    <span className="block text-[11px] font-mono uppercase tracking-wider text-[var(--muted-text)]">
                      {a.category}
                    </span>
                    <span className="hl-link mt-0.5 block font-semibold leading-snug">{a.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      )}

      {/* Next / Previous Nav */}
      <Reveal delay={0.5}>
        <div className="mt-16">
          <MarkerRule color="pink" />
          <div className="flex justify-between pt-6 text-sm font-semibold">
          <>
            <span>
              {adjacent.previous ? (
                <Link href={`/companies/${adjacent.previous.slug}`} className="text-[var(--accent-ink)] hover:underline">
                  ← {adjacent.previous.name}
                </Link>
              ) : (
                <span className="text-[var(--muted-text)]">First Profile</span>
              )}
            </span>
            <span>
              {adjacent.next ? (
                <Link href={`/companies/${adjacent.next.slug}`} className="text-[var(--accent-ink)] hover:underline">
                  {adjacent.next.name} →
                </Link>
              ) : (
                <span className="text-[var(--muted-text)]">Last Profile</span>
              )}
            </span>
          </>
          </div>
        </div>
      </Reveal>

      {/* Submit Review Modal */}
      <AnimatePresence>
        {reviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReviewModalOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
              role="button"
              tabIndex={-1}
              aria-label="Close review form"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="review-modal-title"
              className="relative z-10 w-full max-w-lg space-y-4 overflow-hidden border border-[var(--border-color)] bg-[var(--background)] p-6"
            >
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <h3 id="review-modal-title" className="text-lg font-bold">Add a private note for {c.name}</h3>
                <button onClick={() => setReviewModalOpen(false)} className="text-xs text-[var(--muted-text)] hover:text-[var(--foreground)] focus-visible:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-[var(--ring)] rounded p-1" aria-label="Close review modal">✕</button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <span className="block text-xs font-semibold text-[var(--muted-text)] mb-1">Rating (1 to 5 Stars)</span>
                  <div
                    role="radiogroup"
                    aria-label="Rating"
                    className="flex gap-2 text-xl"
                    onKeyDown={(e) => {
                      // Roving-tabindex keyboard support: arrows/Home/End move
                      // the selected radio and the DOM focus together.
                      let next = newRating;
                      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = Math.min(5, newRating + 1);
                      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = Math.max(1, newRating - 1);
                      else if (e.key === "Home") next = 1;
                      else if (e.key === "End") next = 5;
                      else return;
                      e.preventDefault();
                      setNewRating(next);
                      ratingRefs.current[next - 1]?.focus();
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        role="radio"
                        aria-checked={star === newRating}
                        tabIndex={star === newRating ? 0 : -1}
                        key={star}
                        ref={(element) => { ratingRefs.current[star - 1] = element; }}
                        onClick={() => setNewRating(star)}
                        className={`rounded p-1 ${star <= newRating ? "text-warning-text" : "text-[var(--border-strong)]"} focus-visible:outline-none focus-visible:ring-[var(--ring)]`}
                        aria-label={`${star} star${star > 1 ? "s" : ""}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>

                    <label htmlFor="review-input-author" className="block text-xs font-semibold text-[var(--muted-text)] mb-1">Your Name *</label>

                    <input

                      id="review-input-author"

                      type="text"

                      required

                      placeholder="e.g. Alex M."

                      value={newAuthor}

                      onChange={(e) => setNewAuthor(e.target.value)}

                      className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--subtle-bg)]/50 px-3 py-2 text-xs outline-none"
                      aria-invalid={formErrors.author ? "true" : "false"}
                      aria-describedby="author-error"
                    />
                    {formErrors.author && (
                      <div id="author-error" className="mt-1 text-sm text-[var(--foreground)]/60">
                        {formErrors.author}
                      </div>
                    )}
                  </div>
                <div>
                  <label htmlFor="review-input-role" className="block text-xs font-semibold text-[var(--muted-text)] mb-1">Role / Company (Optional)</label>
                    <input
                      id="review-input-role"
                      type="text"
                      placeholder="e.g. Founder at TechCo"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--subtle-bg)]/50 px-3 py-2 text-xs outline-none"
                      autoComplete="organization"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="review-input-feedback" className="block text-xs font-semibold text-[var(--muted-text)] mb-1">Your private note *</label>
                  <textarea
                    id="review-input-feedback"
                    required
                    rows={3}
                    placeholder="Save a note about your experience on this device..."
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--subtle-bg)]/50 p-3 text-xs outline-none"
                    aria-invalid={formErrors.text ? "true" : "false"}
                    aria-describedby="feedback-error"
                  />
                  {formErrors.text && (
                    <div id="feedback-error" className="mt-1 text-sm text-[var(--foreground)]/60">
                      {formErrors.text}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(false)}
                    className="rounded-lg border border-[var(--border-color)] px-4 py-2 text-xs text-[var(--muted-text)] hover:text-[var(--foreground)] hover:border-[var(--border-strong)] focus-visible:text-[var(--foreground)] focus-visible:border-[var(--border-strong)] focus-visible:outline-none focus-visible:ring-[var(--ring)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary text-xs px-4 py-2"
                  >
                    Save private note
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
