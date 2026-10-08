import { describe, expect, it } from "vitest";
import {
  capabilityMatches,
  computeMatchScores,
  getScoreBreakdown,
  getTopRecommendations,
  requirementsFor,
  type QuizState,
} from "./matchmaker";
import { companies } from "@/data";
import { COMPANY_CAPABILITIES } from "@/data/company-capabilities";
import { ANSWER_CAPABILITIES } from "@/data/matchmaker-config";

const quiz = { userType: "saas" } as QuizState;

describe("requirementsFor", () => {
  it("ignores an unknown question and a blank answer", () => {
    expect(requirementsFor({ unknownQuestion: "x" } as never)).toEqual([]);
    expect(requirementsFor({ userType: "" } as never)).toEqual([]);
  });

  it("flattens the selected answers' requirements", () => {
    expect(requirementsFor(quiz).length).toBe(
      ANSWER_CAPABILITIES.userType.saas.length,
    );
  });
});

describe("computeMatchScores", () => {
  it("scores companies without a capabilities entry at 0", () => {
    expect(computeMatchScores(quiz, [{ slug: "no-such-company" }])).toEqual([
      { company: { slug: "no-such-company" }, score: 0 },
    ]);
  });

  it("scores at least one real company above zero for a real answer", () => {
    const scored = computeMatchScores(quiz, companies);
    expect(scored.some((s) => s.score > 0)).toBe(true);
    // sorted descending
    for (let i = 1; i < scored.length; i++) {
      expect(scored[i - 1].score).toBeGreaterThanOrEqual(scored[i].score);
    }
  });
});

describe("getTopRecommendations", () => {
  it("returns only positively-scoring companies, capped at the limit", () => {
    const top = getTopRecommendations(quiz, companies, 3);
    expect(top.length).toBeGreaterThan(0);
    expect(top.length).toBeLessThanOrEqual(3);
  });
});

describe("getScoreBreakdown", () => {
  it("skips unknown companies but explains a real match", () => {
    expect(getScoreBreakdown(quiz, [{ slug: "ghost" }])).toEqual({});
    const breakdown = getScoreBreakdown(quiz, companies);
    const matched = Object.values(breakdown).find((b) => b.score > 0);
    expect(matched).toBeDefined();
    expect(Object.keys(matched!.breakdown).length).toBeGreaterThan(0);
  });
});

describe("capabilityMatches", () => {
  it("reflects the capabilities data for a real dimension/value", () => {
    const slug = Object.keys(COMPANY_CAPABILITIES)[0];
    const caps = COMPANY_CAPABILITIES[slug];
    const dimension = Object.keys(caps)[0] as keyof typeof caps;
    const value = (caps[dimension] as string[])[0];
    expect(capabilityMatches(caps, { dimension, value, points: 1 } as never)).toBe(true);
  });
});
