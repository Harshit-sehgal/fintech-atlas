"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Company, Category } from "@/data";
import { CompanyLogo } from "@/components/ui/company-logo";
import { CategoryIcon } from "@/components/ui/category-icon";
import { Reveal } from "@/components/ui/reveal";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { CountUp } from "@/components/ui/count-up";
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
import { CorrectionReportLink } from "@/components/ui/correction-report-link";

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


// A uniform section header: mono accent-dash eyebrow + bold section title.
function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-5">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="mt-2 text-xl font-bold tracking-tight">{title}</h2>
    </div>
  );
}

// CountUp from @/components/ui/count-up used below.

export function CompanyPageClient({
  company: c,
  relatedCategories,
  relatedArticles,
  adjacent,
}: {
  company: Company;
  relatedCategories: Category[];
  relatedArticles: { slug: string; title: string; category: string }[];
  adjacent: {
    previous: { slug: string; name: string } | null;
    next: { slug: string; name: string } | null;
  };
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

  // Keep this section qualitative: the repository does not contain a
  // reproducible benchmark dataset for numerical performance scores.
  const assessment: { label: string; value: string }[] = [
    { label: "Developer Experience / API", value: "Not independently assessed" },
    { label: "Pricing Transparency", value: "Not independently assessed" },
    { label: "Global Reach", value: "Not independently assessed" },
    { label: "Reliability & Uptime", value: "Not independently assessed" },
    { label: "Customer Support", value: "Editorial sentiment only" },
  ];

  const ratingRefs = useRef<Array<HTMLButtonElement | null>>([]);

  return (
    <div
      className="relative mx-auto max-w-4xl px-5 py-20 md:py-28"
      style={{ ["--accent"]: c.accent } as React.CSSProperties}
    >
      {/* Waitlayer-style grid backdrop — faint, radially faded, accent-tinted at top */}
      <GridBackdrop className="opacity-40" />

      {/* Top Breadcrumb & Controls */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4 mb-8">
        <div className="flex items-center gap-2 text-xs text-[var(--muted-text)] font-mono">
          <Link href="/companies" className="hover:text-[var(--foreground)]">Companies</Link>
          <span>/</span>
          <span className="text-[var(--foreground)] font-medium">{c.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleBookmark}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-[var(--ring)] ${
              bookmarked
                ? "border-warning/40 bg-warning/10 text-warning-text"
                : "border-[var(--border-color)] bg-[var(--subtle-bg)]/50 text-[var(--foreground)] hover:border-[var(--foreground)]/40 focus-visible:border-[var(--foreground)]/40"
            }`}
          >
            <span>{bookmarked ? "★ Saved" : "☆ Save"}</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--subtle-bg)]/50 px-3 py-1.5 text-xs font-semibold text-[var(--foreground)] hover:border-[var(--foreground)]/40 focus-visible:border-[var(--foreground)]/40 focus-visible:outline-none focus-visible:ring-[var(--ring)]"
          >
            <span>🔗 Share</span>
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
          <div className="relative flex items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--card)] shadow-[var(--shadow-sm)] p-6">
            <CompanyLogo slug={c.slug} name={c.name} size={80} />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="eyebrow text-[10px] py-0.5 px-2 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
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
                <span className="rounded-full border border-[var(--border-color)] bg-[var(--accent)]/10 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wide text-[var(--accent)]">
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

      {/* One-liner */}
      <Reveal delay={0.05}>
        <p className="mt-8 text-pretty text-base leading-relaxed text-[var(--foreground)] bg-[var(--subtle-bg)]/30 border-l-2 border-[var(--accent)] p-4 rounded-r-lg">
          <strong className="font-semibold">{c.name}</strong> {c.oneLiner}
        </p>
      </Reveal>

      {/* Quick stats grid */}
      <Reveal delay={0.1}>
        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 rounded-2xl border border-[var(--border-color)] p-5 sm:grid-cols-4 surface">
          {[
            { label: "Founded", value: String(c.founded) },
            { label: "Employees", value: c.employees },
            { label: "Valuation", value: formatValuationForStats(c) },
            { label: "Official Website", isLink: true, href: `https://${c.website}`, value: c.website },
          ].map(({ label, value, isLink, href }) => (
            <div key={label}>
              <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted-text)]">{label}</p>
              {isLink ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-sm font-bold text-[var(--accent)] hover:underline truncate max-w-full"
                >
                  {value} ↗
                </a>
              ) : (
                <p className="mt-1 text-sm font-bold tracking-tight text-[var(--foreground)]">{value}</p>
              )}
            </div>
          ))}
        </div>
      </Reveal>

      {/* Overview */}
      <Reveal delay={0.1}>
        <section className="mt-12">
          <SectionHeader eyebrow="Overview" title={`What is ${c.name}?`} />
          <p className="text-pretty text-sm leading-relaxed text-[var(--muted-text)]">{c.whatIsIt}</p>
        </section>
      </Reveal>

      {/* Offerings */}
      <Reveal delay={0.15}>
        <section className="mt-12">
          <SectionHeader eyebrow="Product Line" title="Products & Services" />
          <div className="grid gap-3">
            {c.whatTheyOffer.map((offer) => (
              <div key={offer.name} className="rounded-xl border border-[var(--border-color)] p-4 surface hover:border-[var(--accent)]/40 hover:-translate-y-0.5 transition-all">
                <h3 className="text-sm font-bold text-[var(--foreground)]">{offer.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[var(--muted-text)]">{offer.description}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Performance Scorecard */}
      <Reveal delay={0.18}>
        <section className="mt-12">
          <SectionHeader eyebrow="Editorial context" title="Qualitative assessment" />
          <div className="rounded-2xl border border-[var(--border-color)] p-6 space-y-4 surface">
            {assessment.map((item) => (
              <div key={item.label} className="flex items-start justify-between gap-4 border-b border-[var(--border-color)] pb-3 last:border-0 last:pb-0">
                <span className="text-sm font-semibold text-[var(--foreground)]">{item.label}</span>
                <span className="text-right text-sm font-medium text-[var(--accent)]">{item.value}</span>
              </div>
            ))}
            <p className="border-t border-[var(--border-color)] pt-3 text-[11px] text-[var(--muted-text)]">
              Qualitative editorial context based on the profile evidence shown on this page. It is not a measured benchmark, independently audited score, or procurement advice.
            </p>
          </div>
        </section>
      </Reveal>

      {/* Pricing */}
      <Reveal delay={0.2}>
        <section className="mt-12">
          <SectionHeader eyebrow="Pricing" title="Fee Structure" />
          <div className="rounded-xl border border-[var(--border-color)] p-5 space-y-2 surface">
            <p className="text-sm font-medium">Model: <span className="font-normal text-[var(--muted-text)]">{c.pricing.model}</span></p>
            {c.pricing.monthly && <p className="text-sm"><span className="font-medium">Monthly:</span> {c.pricing.monthly}</p>}
            {c.pricing.online && <p className="text-sm"><span className="font-medium">Online:</span> {c.pricing.online}</p>}
            {c.pricing.inPerson && <p className="text-sm"><span className="font-medium">In-person:</span> {c.pricing.inPerson}</p>}
            {c.pricing.international && <p className="text-sm"><span className="font-medium">International:</span> {c.pricing.international}</p>}
            {c.pricing.notes && <p className="mt-3 text-xs leading-relaxed text-[var(--muted-text)] border-t border-[var(--border-color)] pt-3">{c.pricing.notes}</p>}
          </div>

          <div className="mt-4">
            <Link
              href={
                c.slug === "razorpay"
                  ? "/tools/razorpay-fee-calculator"
                  : "/tools/calculator"
              }
              className="inline-flex items-center gap-2 text-xs font-bold text-[var(--accent)] hover:underline"
            >
              <span>⚡ Calculate your estimated fees on our Fee Estimator →</span>
            </Link>
          </div>
        </section>
      </Reveal>

      {/* Sources and effective dates */}
      <Reveal delay={0.24}>
        <section className="mt-12">
          <SectionHeader eyebrow="Traceability" title="Sources & effective dates" />
          <div className="rounded-2xl border border-[var(--border-color)] p-6 surface">
            <p className="text-xs leading-relaxed text-[var(--muted-text)]">
              These references identify the material used for the profile. A source label without a linked document is a research lead, not independently auditable evidence; verify volatile facts directly before relying on them.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
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
                <li key={source.key} className="rounded-lg border border-[var(--border-color)] p-3 text-xs">
                  {source.url ? (
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--accent)] hover:underline">
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
          </div>
        </section>
      </Reveal>

      {/* Strengths & Weaknesses */}
      <Reveal delay={0.25}>
        <section className="mt-12">
          <SectionHeader eyebrow="Analysis" title="Strengths & Tradeoffs" />
          <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-[var(--success)]/30 bg-[var(--success)]/5 p-5">
            <h3 className="text-sm font-bold text-success-text flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--success)]/20 text-[10px]">✓</span>
              Core Strengths
            </h3>
            <ul className="mt-3 space-y-2 reveal-stagger">
              {c.strengths.map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm leading-relaxed text-[var(--foreground)]">
                  <span className="mt-0.5 shrink-0 text-success-text font-bold">✓</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/5 p-5">
            <h3 className="text-sm font-bold text-danger-text flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--danger)]/20 text-[10px]">✕</span>
              Known Weaknesses
            </h3>
            <ul className="mt-3 space-y-2 reveal-stagger">
              {c.weaknesses.map((w) => (
                <li key={w} className="flex items-start gap-2 text-sm leading-relaxed text-[var(--foreground)]">
                  <span className="mt-0.5 shrink-0 text-danger-text font-bold">✕</span>
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

          <div className="mt-4 rounded-2xl border border-[var(--border-color)] p-6 surface shadow-sm">
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-[var(--success)]/20 px-3 py-1 text-lg font-bold font-mono text-success-text border border-[var(--success)]/20 tabular-nums">
                ★ <CountUp target={c.userReviews.rating} decimals={2} duration={1.1} /> / 5.0
              </span>
              <p className="text-xs text-[var(--muted-text)]">Editorial sentiment summary. Notes below are saved only in this browser and are not added to this rating.</p>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-[var(--muted-text)]">
              {c.userReviews.methodology ?? "Editorially synthesized from the reference labels below; this is not a statistically weighted review aggregate."}
              {c.userReviews.asOf ? ` Reviewed ${c.userReviews.asOf}.` : ""}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-[var(--foreground)]">{c.userReviews.summary}</p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 pt-4 border-t border-[var(--border-color)]">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-success-text">What users like</h3>
                <ul className="mt-2 space-y-1 reveal-stagger">
                  {c.userReviews.pros.map((p) => (
                    <li key={p} className="text-xs text-[var(--muted-text)]">+ {p}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-danger-text">What users complain about</h3>
                <ul className="mt-2 space-y-1 reveal-stagger">
                  {c.userReviews.cons.map((p) => (
                    <li key={p} className="text-xs text-[var(--muted-text)]">– {p}</li>
                  ))}
                </ul>
              </div>
            </div>              {/* Notes saved in this browser */}
            {userReviews.length > 0 && (
              <div className="mt-6 pt-6 border-t border-[var(--border-color)] space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                  Notes saved on this device ({userReviews.length})
                </h3>
                {userReviews.map((rev) => (
                  <div key={rev.id} className="rounded-lg border border-[var(--border-color)] p-4 surface space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[var(--foreground)]">{rev.author} <span className="font-normal text-[var(--muted-text)]">({rev.role})</span></span>
                      <span className="font-mono text-success-text">★ {rev.rating}/5 · {rev.date}</span>
                    </div>
                    <p className="text-xs text-[var(--muted-text)] leading-relaxed pt-1">{rev.text}</p>
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
          <div className="flex flex-wrap gap-2">
            {c.whoUses.map((w) => (
              <span
                key={w}
                className="rounded-lg border border-[var(--border-color)] surface px-3 py-1.5 text-xs font-medium transition-all hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:shadow-[var(--accent-glow)]"
                style={{ ["--accent"]: c.accent } as React.CSSProperties}
              >
                {w}
              </span>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Related Categories */}
      <Reveal delay={0.4}>
        <section className="mt-12">
          <SectionHeader eyebrow="Explore" title="Related Categories" />
          <div className="flex flex-wrap gap-3 reveal-stagger">
            {relatedCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                style={{ ["--accent"]: cat.accent } as React.CSSProperties}
                className="flex items-center gap-2.5 rounded-xl border border-[var(--border-color)] surface px-4 py-2.5 transition-all hover:border-[var(--accent)]/40 hover:-translate-y-0.5 hover:shadow-md hover:shadow-[var(--accent-glow)]"
              >
                <CategoryIcon icon={cat.icon} color={cat.accent} size={24} />
                <span className="text-sm font-semibold">{cat.name}</span>
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
            <ul className="grid gap-2 sm:grid-cols-2">
              {relatedArticles.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/articles/${a.slug}`}
                    className="block rounded-xl border border-[var(--border-color)] surface px-4 py-3 text-sm transition-all hover:border-[var(--accent)]/40 hover:-translate-y-0.5 hover:shadow-md hover:shadow-[var(--accent-glow)]"
                  >
                    <span className="block text-[11px] font-mono uppercase tracking-wider text-[var(--muted-text)]">
                      {a.category}
                    </span>
                    <span className="mt-0.5 block font-semibold leading-snug">{a.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      )}

      {/* Next / Previous Nav */}
      <Reveal delay={0.5}>
        <div className="mt-16 flex justify-between border-t border-[var(--border-color)] pt-6 text-sm font-semibold">
          <>
            <span>
              {adjacent.previous ? (
                <Link href={`/companies/${adjacent.previous.slug}`} className="text-[var(--accent)] hover:underline">
                  ← {adjacent.previous.name}
                </Link>
              ) : (
                <span className="text-[var(--muted-text)]">First Profile</span>
              )}
            </span>
            <span>
              {adjacent.next ? (
                <Link href={`/companies/${adjacent.next.slug}`} className="text-[var(--accent)] hover:underline">
                  {adjacent.next.name} →
                </Link>
              ) : (
                <span className="text-[var(--muted-text)]">Last Profile</span>
              )}
            </span>
          </>
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
              className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--background)] p-6 shadow-2xl space-y-4"
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
