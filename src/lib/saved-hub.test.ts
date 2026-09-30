import { beforeEach, describe, expect, it } from "vitest";
import {
  calcSessionId,
  enumerateNotes,
  enumerateToolSessions,
  noteKeyToSlug,
  radarSavedSummary,
} from "./saved-hub";
import { SAVED_SEARCHES_KEY } from "./saved-searches";
import { WATCHLIST_KEY } from "./watchlists";

/**
 * The saved-hub enumerators read real localStorage; jsdom provides a fresh
 * store per test file, and these tests own every key they touch.
 */

const TOOL_PREFIX = "fintech_atlas_tool_";

beforeEach(() => {
  window.localStorage.clear();
});

describe("noteKeyToSlug", () => {
  it("extracts the slug from a reviews_ key", () => {
    expect(noteKeyToSlug("reviews_stripe")).toBe("stripe");
    expect(noteKeyToSlug("reviews_cashfree-payments")).toBe("cashfree-payments");
  });

  it("rejects foreign keys and bare prefix", () => {
    expect(noteKeyToSlug("fintech_atlas_bookmarks")).toBeNull();
    expect(noteKeyToSlug("reviews_")).toBeNull();
  });
});

describe("calcSessionId", () => {
  it("recognises configured calculator ids", () => {
    expect(calcSessionId("calc_sip")).toBe("sip");
  });

  it("rejects unknown calculators and non-calc keys", () => {
    expect(calcSessionId("calc_removed_tool")).toBeNull();
    expect(calcSessionId("fee_calculator")).toBeNull();
  });
});

describe("enumerateNotes", () => {
  it("returns an empty list when nothing is stored", () => {
    expect(enumerateNotes()).toEqual([]);
  });

  it("summarises stored notes with resolved names and links", () => {
    window.localStorage.setItem(
      "reviews_stripe",
      JSON.stringify([
        { id: "r1", rating: 4, author: "A", role: "Dev", text: "Solid", date: "2026-08-01" },
        { id: "r2", rating: 5, author: "B", role: "CTO", text: "Great docs", date: "2026-08-10" },
      ]),
    );
    const notes = enumerateNotes();
    expect(notes).toHaveLength(1);
    expect(notes[0]).toMatchObject({
      slug: "stripe",
      name: "Stripe",
      href: "/companies/stripe",
      count: 2,
      latestDate: "2026-08-10",
    });
  });

  it("skips malformed note payloads instead of throwing", () => {
    window.localStorage.setItem("reviews_stripe", "not json at all");
    expect(enumerateNotes()).toEqual([]);
  });
});

describe("enumerateToolSessions", () => {
  it("returns an empty list when nothing is stored", () => {
    expect(enumerateToolSessions()).toEqual([]);
  });

  it("finds fixed tool sessions with labels and links", () => {
    window.localStorage.setItem(`${TOOL_PREFIX}remittance`, '{"sendAmount":100}');
    const sessions = enumerateToolSessions();
    expect(sessions).toHaveLength(1);
    expect(sessions[0]).toMatchObject({ key: "remittance", href: "/tools/remittance" });
  });

  it("maps per-calculator sessions to the calculators hub", () => {
    window.localStorage.setItem(`${TOOL_PREFIX}calc_sip`, "{}");
    const sessions = enumerateToolSessions();
    expect(sessions[0]?.href).toBe("/tools/calculators");
    expect(sessions[0]?.label).toContain("session");
  });

  it("ignores orphaned sessions for tools that no longer exist", () => {
    window.localStorage.setItem(`${TOOL_PREFIX}ancient_tool`, "{}");
    window.localStorage.setItem("unrelated_key", "{}");
    expect(enumerateToolSessions()).toEqual([]);
  });
});

describe("radarSavedSummary", () => {
  it("counts watchlist entries and saved searches", () => {
    window.localStorage.setItem(WATCHLIST_KEY, JSON.stringify(["razorpay", "paytm"]));
    window.localStorage.setItem(
      SAVED_SEARCHES_KEY,
      JSON.stringify([
        { id: "s1", name: "UPI-first", state: {}, createdAt: "2026-08-01" },
      ]),
    );
    expect(radarSavedSummary()).toEqual({ watchlistCount: 2, savedSearchCount: 1 });
  });

  it("reports zeros on empty storage", () => {
    expect(radarSavedSummary()).toEqual({ watchlistCount: 0, savedSearchCount: 0 });
  });
});
