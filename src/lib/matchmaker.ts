/**
 * Pure matchmaker recommendation logic (capability-based, audit #30).
 *
 * Each quiz answer maps to capability requirements (ANSWER_CAPABILITIES); a
 * company scores points for every requirement its capabilities satisfy
 * (COMPANY_CAPABILITIES). Because scoring is data-driven per capability, ANY
 * company described in the capabilities module can be recommended — adding a
 * company no longer requires hand-editing a slug→points matrix.
 */

import type { Company } from "@/data";
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

/**
 * Score every company by how many capability requirements its capabilities
 * satisfy, sorted descending. Companies without a capabilities entry score 0.
 */
export function computeMatchScores(
  quizState: QuizState,
  companies: Company[],
): { company: Company; score: number }[] {
  const requirements = requirementsFor(quizState);
  return companies
    .map((company) => {
      const caps = COMPANY_CAPABILITIES[company.slug];
      const score = caps
        ? requirements.reduce(
            (sum, req) => sum + (capabilityMatches(caps, req) ? req.points : 0),
            0,
          )
        : 0;
      return { company, score };
    })
    .sort((a, b) => b.score - a.score);
}

/**
 * Get top N recommended companies (only those that actually scored above 0).
 */
export function getTopRecommendations(
  quizState: QuizState,
  companies: Company[],
  limit = 3,
): Company[] {
  return computeMatchScores(quizState, companies)
    .filter((item) => item.score > 0)
    .slice(0, limit)
    .map((item) => item.company);
}

/**
 * Per-company score and per-question contribution, used by the UI to explain
 * why a company matched (audit #31).
 */
export function getScoreBreakdown(
  quizState: QuizState,
  companies: Company[],
): Record<string, { score: number; breakdown: Record<string, number> }> {
  const result: Record<string, { score: number; breakdown: Record<string, number> }> = {};
  companies.forEach((company) => {
    const caps = COMPANY_CAPABILITIES[company.slug];
    const breakdown: Record<string, number> = {};
    let score = 0;
    if (caps) {
      (Object.keys(quizState) as (keyof QuizState)[]).forEach((qKey) => {
        const value = quizState[qKey];
        if (!value) return;
        const list = ANSWER_CAPABILITIES[qKey]?.[value] ?? [];
        const pts = list.reduce(
          (sum, req) => sum + (capabilityMatches(caps, req) ? req.points : 0),
          0,
        );
        if (pts > 0) breakdown[qKey] = pts;
        score += pts;
      });
    }
    result[company.slug] = { score, breakdown };
  });
  return result;
}
