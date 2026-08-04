/**
 * Pure matchmaker recommendation logic (capability-based, audit #30).
 *
 * Each quiz answer maps to capability requirements (ANSWER_CAPABILITIES); a
 * company scores points for every requirement its capabilities satisfy
 * (COMPANY_CAPABILITIES). Because scoring is data-driven per capability, ANY
 * company described in the capabilities module can be recommended — adding a
 * company no longer requires hand-editing a slug→points matrix.
 */

import type { CompanyCapabilities } from "@/data/types";
import {
  ANSWER_CAPABILITIES,
  QuizState,
  CapabilityRequirement,
} from "@/data/matchmaker-config";
import { COMPANY_CAPABILITIES } from "@/data/company-capabilities";

export type { QuizState };

export function capabilityMatches(
  caps: CompanyCapabilities,
  req: CapabilityRequirement,
): boolean {
  return caps[req.dimension].includes(req.value);
}

/** Flatten the selected answers' capability requirements. */
export function requirementsFor(quizState: QuizState): CapabilityRequirement[] {
  const requirements: CapabilityRequirement[] = [];
  (Object.keys(quizState) as (keyof QuizState)[]).forEach((qKey) => {
    const value = quizState[qKey];
    if (!value) return;
    const list = ANSWER_CAPABILITIES[qKey]?.[value] ?? [];
    requirements.push(...list);
  });
  return requirements;
}

/** Group the selected answers' requirements by question, in question order. */
function requirementsByQuestion(
  quizState: QuizState,
): Array<[string, CapabilityRequirement[]]> {
  return (Object.keys(quizState) as (keyof QuizState)[])
    .filter((qKey) => Boolean(quizState[qKey]))
    .map((qKey) => [
      qKey,
      ANSWER_CAPABILITIES[qKey]?.[quizState[qKey] as string] ?? [],
    ]);
}

/**
 * Score every company by how many capability requirements its capabilities
 * satisfy, sorted descending. Companies without a capabilities entry score 0.
 */
export function computeMatchScores<T extends { slug: string }>(
  quizState: QuizState,
  companies: readonly T[],
): { company: T; score: number }[] {
  const requirements = requirementsFor(quizState);
  const scored = companies.map((company) => {
    const caps = COMPANY_CAPABILITIES[company.slug];
    const score = caps
      ? requirements.reduce(
          (sum, req) => sum + (capabilityMatches(caps, req) ? req.points : 0),
          0,
        )
      : 0;
    return { company, score };
  });
  return scored.sort((a, b) => b.score - a.score);
}

/**
 * Get top N recommended companies (only those that actually scored above 0).
 */
export function getTopRecommendations<T extends { slug: string }>(
  quizState: QuizState,
  companies: readonly T[],
  limit = 3,
): T[] {
  return computeMatchScores(quizState, companies)
    .filter(({ score }) => score > 0)
    .slice(0, limit)
    .map(({ company }) => company);
}

/**
 * Per-company score and per-question contribution, used by the UI to explain
 * why a company matched (audit #31).
 */
export function getScoreBreakdown<T extends { slug: string }>(
  quizState: QuizState,
  companies: readonly T[],
): Record<string, { score: number; breakdown: Record<string, number> }> {
  const result: Record<string, { score: number; breakdown: Record<string, number> }> = {};
  for (const company of companies) {
    const caps = COMPANY_CAPABILITIES[company.slug];
    if (!caps) continue;
    const breakdown: Record<string, number> = {};
    let score = 0;
    for (const [question, questionRequirements] of requirementsByQuestion(
      quizState,
    )) {
      const points = questionRequirements
        .filter((req) => capabilityMatches(caps, req))
        .reduce((sum, req) => sum + req.points, 0);
      if (points > 0) {
        breakdown[question] = points;
        score += points;
      }
    }
    result[company.slug] = { score, breakdown };
  }
  return result;
}
