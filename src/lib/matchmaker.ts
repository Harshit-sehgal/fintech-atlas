/**
 * Pure matchmaker recommendation logic, extracted from the matchmaker client
 * component so the scoring algorithm is unit-testable without rendering React.
 */

import type { Company } from "@/data";
import {
  SCORE_WEIGHTS,
  QuizState,
} from "@/data/matchmaker-config";

export type { QuizState };

/**
 * Compute scores for all companies based on quiz answers.
 *
 * @param quizState - The user's answers (userType, priority, globalNeed, scale)
 * @param companies - Array of all companies to score
 * @returns Array of companies with their computed scores, sorted descending
 */
export function computeMatchScores(
  quizState: QuizState,
  companies: Company[]
): { company: Company; score: number }[] {
  const scores: Record<string, number> = {};

  // Initialize all companies with 0 score
  companies.forEach((company) => {
    scores[company.slug] = 0;
  });

  // Apply weights for each answered question
  Object.keys(quizState).forEach((key) => {
    const qKey = key as keyof QuizState;
    const value = quizState[qKey];
    if (value && SCORE_WEIGHTS[qKey]?.[value]) {
      Object.entries(SCORE_WEIGHTS[qKey][value]).forEach(
        ([slug, points]) => {
          if (scores[slug] !== undefined) {
            scores[slug] = (scores[slug] || 0) + points;
          }
        }
      );
    }
  });

  // Convert to array and sort by score descending
  const scoredCompanies = companies
    .map((company) => ({
      company,
      score: scores[company.slug] || 0,
    }))
    .sort((a, b) => b.score - a.score);

  return scoredCompanies;
}

/**
 * Get top N company recommendations based on quiz answers.
 *
 * @param quizState - The user's answers
 * @param companies - Array of all companies
 * @param limit - Number of top recommendations to return (default: 3)
 * @returns Array of top company recommendations
 */
export function getTopRecommendations(
  quizState: QuizState,
  companies: Company[],
  limit = 3
): Company[] {
  return computeMatchScores(quizState, companies)
    .slice(0, limit)
    .map((item) => item.company);
}

/**
 * Get the score breakdown for debugging/transparency.
 *
 * @param quizState - The user's answers
 * @param companies - Array of all companies
 * @returns Object mapping company slugs to their scores and contributing factors
 */
export function getScoreBreakdown(
  quizState: QuizState,
  companies: Company[]
): Record<string, { score: number; breakdown: Record<string, number> }> {
  const scores: Record<string, number> = {};
  const breakdown: Record<string, Record<string, number>> = {};

  // Initialize
  companies.forEach((company) => {
    scores[company.slug] = 0;
    breakdown[company.slug] = {};
  });

  // Track contributions by question
  Object.keys(quizState).forEach((key) => {
    const qKey = key as keyof QuizState;
    const value = quizState[qKey];
    if (value && SCORE_WEIGHTS[qKey]?.[value]) {
      Object.entries(SCORE_WEIGHTS[qKey][value]).forEach(
        ([slug, points]) => {
          if (scores[slug] !== undefined) {
            scores[slug] = (scores[slug] || 0) + points;
            // Track contribution from this question
            if (!breakdown[slug][qKey]) {
              breakdown[slug][qKey] = 0;
            }
            breakdown[slug][qKey] += points;
          }
        }
      );
    }
  });

  // Convert to final format
  const result: Record<string, { score: number; breakdown: Record<string, number> }> = {};
  companies.forEach((company) => {
    result[company.slug] = {
      score: scores[company.slug] || 0,
      breakdown: breakdown[company.slug] || {},
    };
  });

  return result;
}