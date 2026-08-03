"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { CompanyLogo } from "@/components/ui/company-logo";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { companies } from "@/data";
import { getContrastingText } from "@/lib/color";
import {
  computeMatchScores,
  QuizState,
} from "@/lib/matchmaker";
import { QUESTIONS } from "@/data/matchmaker-config";

export default function MatchmakerQuizPageClient() {
  const [step, setStep] = useState(1);
  const [quizState, setQuizState] = useState<QuizState>({
    userType: "",
    priority: "",
    globalNeed: "",
    scale: "",
  });

  const handleSelect = (key: keyof QuizState, value: string) => {
    setQuizState((prev) => ({ ...prev, [key]: value }));
    setStep((prev) => prev + 1);
  };

  const restart = () => {
    setQuizState({ userType: "", priority: "", globalNeed: "", scale: "" });
    setStep(1);
  };

  const scoredResults = step > 4
    ? computeMatchScores(quizState, companies)
    : [];
  const topScore = scoredResults[0]?.score ?? 0;
  const results = topScore > 0
    ? scoredResults.slice(0, 3).map(({ company }) => company)
    : [];


  return (
    <div className="relative mx-auto max-w-4xl px-5 py-20 md:py-28">
      <GridBackdrop />

      <div className="mb-6 flex items-center gap-2 text-xs text-[var(--muted-text)] font-mono">
        <Link href="/tools" className="hover:text-[var(--foreground)] transition-colors">Tools</Link>
        <span>/</span>
        <span className="text-[var(--foreground)] font-medium">Matchmaker Quiz</span>
      </div>

      <SectionHeading
        headingLevel={1}
        eyebrow="Interactive Recommendation"
        title="FinTech Matchmaker Quiz"
        description="Answer 4 high-level questions to get an initial shortlist you can research further. This is an educational recommendation, not financial or procurement advice."
      />

      <div className="mt-10">
        {/* Step indicator */}
        <div className="mb-8 flex items-center justify-between border-b border-[var(--border-color)] pb-4 text-xs font-mono text-[var(--muted-text)]">
          <span>{step > 4 ? "Results" : <>Question <span className="text-[var(--foreground)] font-bold">{step}</span> of 4</>}</span>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                animate={{
                  backgroundColor: step >= i ? "var(--accent)" : "var(--border-color)",
                  width: step === i ? 32 : 24,
                }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="h-2 rounded-full"
                style={{ originX: 0 } as CSSProperties}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {QUESTIONS.map((q) => {
            const stepNumber = ["userType", "priority", "globalNeed", "scale"].indexOf(q.id) + 1;
            if (step === stepNumber) {
              return (
                <motion.div
                  key={`step${stepNumber}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="text-xl font-bold">{q.title}</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {q.options.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => handleSelect(q.id, opt.id)}
                        className="flex flex-col items-start rounded-xl border border-[var(--border-color)] p-5 text-left transition-all hover:border-[var(--accent)]/40 focus-visible:border-[var(--accent)]/60 focus-visible:outline-none focus-visible:ring-[var(--ring)]"
                      >
                        <span className="font-semibold text-base text-[var(--foreground)]">{opt.title}</span>
                        <span className="mt-1 text-xs text-[var(--muted-text)]">{opt.description}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              );
            }
            return null; // Skip if not matching current step
          })}

          {step > 4 && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="surface rounded-2xl border border-[var(--border-color)] p-8">
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
                  <div>
                    <span className="eyebrow text-[var(--accent)]">Initial Shortlist</span>
                    <h2 className="mt-1 text-2xl font-bold text-[var(--foreground)]">Suggested starting points</h2>
                  </div>
                  <button
                    onClick={restart}
                    className="btn-ghost text-xs"
                  >
                    🔄 Retake Quiz
                  </button>
                </div>

                <div className="mt-8 space-y-4 reveal-stagger">
                  {topScore === 0 && (
                    <div className="rounded-xl border border-[var(--warning)]/30 bg-[var(--warning)]/10 px-4 py-3 text-xs leading-relaxed text-[var(--foreground)]">
                      There is not enough evidence to rank companies from these answers. Try changing a preference for a more specific shortlist.
                    </div>
                  )}
                  {results.map((c, idx) => (
                    <div
                      key={c.slug}
                      style={{ ["--accent"]: c.accent } as CSSProperties}
                      className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-[var(--border-color)] p-5 surface card-glow"
                    >
                      <div className="flex items-center gap-4">
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold"
                          style={{ background: c.accent, color: getContrastingText(c.accent) }}
                        >
                          #{idx + 1}
                        </span>
                        <div className="group-hover:scale-105 transition-transform duration-300">
                          <CompanyLogo slug={c.slug} name={c.name} size={48} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">{c.name}</h3>
                          <p className="text-xs text-[var(--muted-text)]">{c.tagline}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link
                          href={`/companies/${c.slug}`}
                          className="btn-primary text-xs"
                        >
                          View Profile →
                        </Link>
                        <Link
                          href={`/compare?companies=${results.map((r) => r.slug).join(",")}`}
                          className="btn-ghost text-xs"
                        >
                          Compare top {results.length > 1 ? results.length : ""} →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}