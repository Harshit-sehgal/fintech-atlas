import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  enumerateNotes,
  enumerateToolSessions,
  radarSavedSummary,
} from "./saved-hub";
import { companySummaries } from "@/generated/company-summaries";
import { indiaDirectorySummaries } from "@/generated/india-directory-summaries";

const TOOL_PREFIX = "fintech_atlas_tool_";
const review = (over: Record<string, unknown> = {}) =>
  JSON.stringify([
    { id: "r1", rating: 4, author: "A", role: "Dev", text: "ok", date: "2026-08-01", ...over },
  ]);

beforeEach(() => window.localStorage.clear());
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("enumerateNotes branches", () => {
  it("returns [] without a window", () => {
    vi.stubGlobal("window", undefined);
    expect(enumerateNotes()).toEqual([]);
  });

  it("prettifies and unlinks an unresolvable slug", () => {
    window.localStorage.setItem("reviews_ghost-company", review());
    const [note] = enumerateNotes();
    expect(note).toMatchObject({ slug: "ghost-company", name: "ghost company", href: "" });
  });

  it("reports a null latest date when reviews carry no date", () => {
    window.localStorage.setItem("reviews_stripe", review({ date: "" }));
    const [note] = enumerateNotes();
    expect(note.latestDate).toBeNull();
  });

  it("skips an empty review array", () => {
    window.localStorage.setItem("reviews_stripe", "[]");
    expect(enumerateNotes()).toEqual([]);
  });

  it("resolves an India-only slug to the radar profile", () => {
    const companySlugs = new Set(companySummaries.map((c) => c.slug));
    const indiaOnly = indiaDirectorySummaries.find((s) => !companySlugs.has(s.slug));
    expect(indiaOnly, "expected at least one India-only slug").toBeDefined();
    window.localStorage.setItem(`reviews_${indiaOnly!.slug}`, review());
    const note = enumerateNotes().find((n) => n.slug === indiaOnly!.slug)!;
    expect(note.href).toBe(`/radar/company/${indiaOnly!.slug}`);
  });
});

describe("enumerateToolSessions branches", () => {
  it("returns [] without a window", () => {
    vi.stubGlobal("window", undefined);
    expect(enumerateToolSessions()).toEqual([]);
  });

  it("ignores a malformed per-calculator id", () => {
    window.localStorage.setItem(`${TOOL_PREFIX}calc_Bad`, "{}");
    expect(enumerateToolSessions()).toEqual([]);
  });
});

describe("radarSavedSummary without a window", () => {
  it("reports zeros", () => {
    vi.stubGlobal("window", undefined);
    expect(radarSavedSummary()).toEqual({ watchlistCount: 0, savedSearchCount: 0 });
  });
});
