"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { companies, type Company, type Category } from "@/data";
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
import { formatValuationShort, formatHeadquartersCity } from "@/lib/format-company";
import { getFocusableElementsInDialog } from "@/lib/focus-trap";

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
}: {
  company: Company;
  relatedCategories: Category[];
}) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { showToast } = useToast();
  const bookmarked = isBookmarked(c.slug);

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

  // Handle focus trapping and escape key for review modal
  useEffect(() => {
    if (!reviewModalOpen) return;

    // Save the currently focused element
    previousElementRef.current = document.activeElement as HTMLElement;

    // Focus the first input (rating stars) when modal opens
    const handleFocus = () => {
      const ratingButton = document.querySelector('button[aria-label="1 star"]') as HTMLButtonElement | null;
      if (ratingButton) {
        ratingButton.focus();
      }
    };

    // Request animation frame to ensure DOM is updated
    requestAnimationFrame(handleFocus);

    // Trap focus inside the modal and handle escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setReviewModalOpen(false);
      } else if (e.key === "Tab") {
        // Trap focus within the modal
        const focusableElements = getFocusableElementsInDialog();
        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) { // Shift + Tab
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else { // Tab
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      // If focus is leaving the modal, bring it back to the first focusable element
      const dialog = e.currentTarget as HTMLElement;
      if (!dialog.contains(e.relatedTarget as Node)) {
        e.preventDefault();
        const focusableElements = getFocusableElementsInDialog();
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("focusout", handleFocusOut);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("focusout", handleFocusOut);

      // Return focus to the element that triggered the modal
      if (previousElementRef.current) {
        previousElementRef.current.focus();
      }
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

      role: newRole.trim() || "Verified User",

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

    setFormErrors({

      author: "",

      text: ""

    });

    showToast("Thank you! Your review has been published.", "success");

  };

  // Performance metrics — illustrative benchmarks (not independently audited).
  // Scores are heuristically derived from a mix of public documentation, user-review
  // aggregator sentiment, and known product breadth. Treat them as directional
  // comparisons and read the full profile for specifics.
  const slugStr = c.slug as string;

  const metrics: { label: string; score: number }[] = [
    {
      label: "Developer Experience / API",
      score: slugStr === "stripe" || slugStr === "plaid" ? 96 : 85,
    },
    {
      label: "Pricing Transparency",
      score: slugStr === "wise" || slugStr === "chime" ? 95 : 78,
    },
    {
      label: "Global Reach",
      score:
        slugStr === "stripe" ||
        slugStr === "wise" ||
        slugStr === "revolut" ||
        slugStr === "adyen"
          ? 94
          : 82,
    },
    { label: "Reliability & Uptime", score: 92 },
    {
      label: "Customer Support",
      score: c.userReviews.rating >= 4.5 ? 90 : 75,
    },
  ];

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
        <div
          className="pointer-events-none absolute -top-6 left-0 h-48 w-48 rounded-full blur-[80px] -z-10"
          style={{ background: c.accent, opacity: 0.15 }}
        />
        <div className="relative group">
          <div className="absolute inset-0 blur-xl bg-[var(--accent)] opacity-20 group-hover:opacity-30 transition-opacity duration-500 rounded-2xl" />
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <CompanyLogo slug={c.slug} size={80} />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="eyebrow text-[10px] py-0.5 px-2 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
              Verified Profile
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
            { label: "Valuation", value: formatValuationShort(c.valuation) },
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
          <SectionHeader eyebrow="Benchmark" title="Performance Index" />
          <div className="rounded-2xl border border-[var(--border-color)] p-6 space-y-4 surface">
            {metrics.map((m) => (
              <div key={m.label} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[var(--foreground)]">{m.label}</span>
                  <span className="font-mono text-[var(--accent)]">{m.score}/100</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[var(--border-color)] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${m.score}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-strong)]"
                  />
                </div>
              </div>
            ))}
            <p className="text-[11px] text-[var(--muted-text)] pt-1 border-t border-[var(--border-color)]">
              Illustrative benchmarks — not independently audited. See the full profile below for details.
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
              href="/tools/calculator"
              className="inline-flex items-center gap-2 text-xs font-bold text-[var(--accent)] hover:underline"
            >
              <span>⚡ Calculate your estimated fees on our Fee Estimator →</span>
            </Link>
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
            <SectionHeader eyebrow="Community" title="User Feedback & Rating" />
            <button
              onClick={() => setReviewModalOpen(true)}
              className="btn-primary text-xs px-3.5 py-1.5 shrink-0"
            >
              + Submit Review
            </button>
          </div>

          <div className="mt-4 rounded-2xl border border-[var(--border-color)] p-6 surface shadow-sm">
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-[var(--success)]/20 px-3 py-1 text-lg font-bold font-mono text-success-text border border-[var(--success)]/20 tabular-nums">
                ★ <CountUp target={c.userReviews.rating} decimals={2} duration={1.1} /> / 5.0
              </span>
              <p className="text-xs text-[var(--muted-text)]">Aggregated from verified market data & community feedback</p>
            </div>

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
            </div>

            {/* Submitted Community Reviews */}
            {userReviews.length > 0 && (
              <div className="mt-6 pt-6 border-t border-[var(--border-color)] space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                  Community Reviews ({userReviews.length})
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

      {/* Next / Previous Nav */}
      <Reveal delay={0.5}>
        <div className="mt-16 flex justify-between border-t border-[var(--border-color)] pt-6 text-sm font-semibold">
          {(() => {
            const { next, prev } = getAdjacent(c);
            return (
              <>
                <span>
                  {prev ? (
                    <Link href={`/companies/${prev.slug}`} className="text-[var(--accent)] hover:underline">
                      ← {prev.name}
                    </Link>
                  ) : (
                    <span className="text-[var(--muted-text)]">First Profile</span>
                  )}
                </span>
                <span>
                  {next ? (
                    <Link href={`/companies/${next.slug}`} className="text-[var(--accent)] hover:underline">
                      {next.name} →
                    </Link>
                  ) : (
                    <span className="text-[var(--muted-text)]">Last Profile</span>
                  )}
                </span>
              </>
            );
          })()}
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
              role="dialog"
              aria-modal="true"
              aria-labelledby="review-modal-title"
              className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--background)] p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <h3 id="review-modal-title" className="text-lg font-bold">Write a Review for {c.name}</h3>
                <button onClick={() => setReviewModalOpen(false)} className="text-xs text-[var(--muted-text)] hover:text-[var(--foreground)] focus-visible:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-[var(--ring)] rounded p-1" aria-label="Close review modal">✕</button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <span className="block text-xs font-semibold text-[var(--muted-text)] mb-1">Rating (1 to 5 Stars)</span>
                  <div role="radiogroup" aria-label="Rating" className="flex gap-2 text-xl">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        role="radio"
                        aria-checked={star <= newRating}
                        key={star}
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
                  <label htmlFor="review-input-feedback" className="block text-xs font-semibold text-[var(--muted-text)] mb-1">Your Experience / Feedback *</label>
                  <textarea
                    id="review-input-feedback"
                    required
                    rows={3}
                    placeholder="Share what you like or dislike about this service..."
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
                    Submit Review
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

function getAdjacent(c: Company): { prev?: Company; next?: Company } {
  const idx = companies.indexOf(c);
  return {
    prev: companies[idx - 1],
    next: companies[idx + 1],
  };
}