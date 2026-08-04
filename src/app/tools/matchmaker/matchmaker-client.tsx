"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { CompanyLogo } from "@/components/ui/company-logo";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { companySummaries } from "@/generated/company-summaries";
import { getContrastingText } from "@/lib/color";
import {
  computeMatchScores,
  getScoreBreakdown,
  QuizState,
} from "@/lib/matchmaker";
import { QUESTIONS, type MatchmakerQuestion } from "@/data/matchmaker-config";
import { PartnerCta } from "@/components/ui/partner-cta";
import {
  downloadCsv,
  encodeToolParams,
  loadToolState,
  printToPdf,
  saveToolState,
  shareOrCopy,
} from "@/lib/share";
import { useToast } from "@/lib/toast-context";
import { trackEvent } from "@/lib/analytics";

const QUIZ_KEYS: (keyof QuizState)[] = ["userType", "priority", "globalNeed", "scale"];

function isValidQuizState(value: unknown): value is QuizState {
  if (!value || typeof value !== "object") return false;
  const state = value as Partial<QuizState>;
  return QUIZ_KEYS.every((key) => {
    const answer = state[key];
    if (typeof answer !== "string") return false;
    if (answer === "") return true;
    return QUESTIONS.find((question) => question.id === key)?.options.some((option) => option.id === answer) ?? false;
  });
}

function readQuizState(params: URLSearchParams, saved: unknown): QuizState | null {
  const fromUrl: QuizState = {
    userType: params.get("matchmaker_userType") ?? "",
    priority: params.get("matchmaker_priority") ?? "",
    globalNeed: params.get("matchmaker_globalNeed") ?? "",
    scale: params.get("matchmaker_scale") ?? "",
  };
  if (Object.values(fromUrl).some(Boolean) && isValidQuizState(fromUrl)) return fromUrl;
  return isValidQuizState(saved) ? saved : null;
}

export default function MatchmakerQuizPageClient() {
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [quizState, setQuizState] = useState<QuizState>({
    userType: "",
    priority: "",
    globalNeed: "",
    scale: "",
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const saved = loadToolState<unknown>("matchmaker");
    const restored = readQuizState(params, saved);
    const restoredStep = restored
      ? Object.values(restored).every(Boolean)
        ? 5
        : Object.values(restored).filter(Boolean).length + 1
      : 1;

    const id = window.setTimeout(() => {
      if (restored) setQuizState((current) => ({ ...current, ...restored }));
      setStep(restoredStep);
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const handleSelect = (key: keyof QuizState, value: string) => {
    setQuizState((prev) => ({ ...prev, [key]: value }));
    setStep((prev) => prev + 1);
  };

  const restart = () => {
    setQuizState({ userType: "", priority: "", globalNeed: "", scale: "" });
    setStep(1);
  };

  const scoredResults = step > 4
    ? computeMatchScores(quizState, companySummaries)
    : [];
  const topScore = scoredResults[0]?.score ?? 0;
  const results = topScore > 0
    ? scoredResults.slice(0, 3).map(({ company }) => company)
    : [];

  // Fire analytics when quiz is completed and results computed.
  useEffect(() => {
    if (hydrated && topScore > 0) {
      trackEvent("tool_complete", {
        tool: "matchmaker",
        matches: results.length,
        top_score: topScore,
        user_type: quizState.userType,
        priority: quizState.priority,
      });
    }
  }, [hydrated, topScore, results.length, quizState.userType, quizState.priority]);

  // Human-readable question/option labels so the score breakdown can be
  // surfaced as plain-language "why it matched" reasons (audit #31).
  const questionMeta = useMemo(() => {
    const byId = new Map<string, MatchmakerQuestion>(QUESTIONS.map((q) => [q.id, q]));
    return {
      title: (qId: string) => byId.get(qId)?.title ?? qId,
      optionTitle: (qId: string, optionId: string) =>
        byId.get(qId)?.options.find((o) => o.id === optionId)?.title ?? optionId,
    };
  }, []);

  // Per-company score breakdown keyed by question; used to explain the
  // shortlist instead of presenting it as a black box.
  const scoreBreakdown = step > 4
    ? getScoreBreakdown(quizState, companySummaries)
    : {};

  const handleShare = async () => {
    const params = encodeToolParams("matchmaker_", {
      userType: quizState.userType,
      priority: quizState.priority,
      globalNeed: quizState.globalNeed,
      scale: quizState.scale,
    });
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", url);
    const result = await shareOrCopy({
      title: "FinTech Matchmaker Quiz — FinTech Atlas",
      text: "Educational FinTech shortlist from FinTech Atlas",
      url,
    });
    showToast(
      result === "shared" ? "Shared matchmaker results" : result === "copied" ? "Matchmaker link copied" : "Could not share or copy the link",
      result === "failed" ? "error" : "success",
    );
  };

  const handleSave = () => {
    const ok = saveToolState("matchmaker", quizState);
    showToast(ok ? "Saved on this device" : "Could not save (storage blocked or full)", ok ? "success" : "error");
  };

  const handleExportCsv = () => {
    downloadCsv("fintech-atlas-matchmaker.csv", [
      ["Question", "Answer"],
      ["User type", quizState.userType],
      ["Priority", quizState.priority],
      ["International need", quizState.globalNeed],
      ["Scale", quizState.scale],
      [],
      ["Rank", "Company", "Score"],
      ...scoredResults.slice(0, 3).map(({ company, score }, index) => [String(index + 1), company.name, String(score)]),
    ]);
    showToast("CSV downloaded", "success");
  };

  const handlePrintPdf = () => {
    if (printToPdf()) showToast("Print dialog opened — choose Save as PDF", "success");
  };

  return (
    <div className="relative mx-auto max-w-4xl px-5 py-20 md:py-28">
      <GridBackdrop />

      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[var(--muted-text)] font-mono">
        <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/tools" className="hover:text-[var(--foreground)] transition-colors">Tools</Link>
        <span>/</span>
        <span className="text-[var(--foreground)] font-medium">Matchmaker Quiz</span>
      </nav>

      <SectionHeading
        headingLevel={1}
        eyebrow="Interactive Recommendation"
        title="FinTech Matchmaker Quiz"
        description="Answer 4 high-level questions to get an initial shortlist you can research further. This is an educational recommendation, not financial or procurement advice."
      />

      {step > 4 && (
        <div className="mt-4 flex flex-wrap gap-2 print:hidden">
          <button type="button" onClick={handleShare} className="btn-ghost text-xs px-3 py-1.5" disabled={!hydrated}>Share link</button>
          <button type="button" onClick={handleSave} className="btn-ghost text-xs px-3 py-1.5" disabled={!hydrated}>Save locally</button>
          <button type="button" onClick={handleExportCsv} className="btn-ghost text-xs px-3 py-1.5">Export CSV</button>
          <button type="button" onClick={handlePrintPdf} className="btn-ghost text-xs px-3 py-1.5">Save as PDF</button>
        </div>
      )}

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
                  {results.map((c, idx) => {
                    const bd = scoreBreakdown[c.slug];
                    const reasons = bd
                      ? Object.entries(bd.breakdown)
                          .filter(([, pts]) => pts > 0)
                          .map(([qId, pts]) => ({
                            key: qId,
                            question: questionMeta.title(qId),
                            option: questionMeta.optionTitle(
                              qId,
                              quizState[qId as keyof QuizState],
                            ),
                            points: pts,
                          }))
                      : [];
                    return (
                      <div
                        key={c.slug}
                        style={{ ["--accent"]: c.accent } as CSSProperties}
                        className="group flex flex-col gap-4 rounded-xl border border-[var(--border-color)] p-5 surface card-glow"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
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
                            <PartnerCta
                              slug={c.slug}
                              placement="matchmaker"
                              label={`Visit ${c.name}`}
                              variant="compact"
                            />
                          </div>
                        </div>

                        {reasons.length > 0 && (
                          <div className="border-t border-[var(--border-color)] pt-3">
                            <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--muted-text)]">
                              Why it matched · {bd!.score} pts
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {reasons.map((r) => (
                                <span
                                  key={r.key}
                                  title={r.question}
                                  className="rounded-full border border-[var(--border-color)] bg-[var(--subtle-bg)] px-2.5 py-1 text-[11px] text-[var(--muted-text)]"
                                >
                                  <span className="font-medium text-[var(--foreground)]">{r.option}</span>
                                  <span className="ml-1">+{r.points}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}