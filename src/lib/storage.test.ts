import { describe, it, expect } from "vitest";
import {
  parseStoredList,
  BOOKMARKS_KEY,
  GLOSSARY_BOOKMARKS_KEY,
  STORAGE_EVENT,
} from "@/lib/storage";

describe("parseStoredList()", () => {
  it("returns [] for empty input", () => {
    expect(parseStoredList("")).toEqual([]);
  });

  it("returns [] for malformed JSON", () => {
    expect(parseStoredList("{not json")).toEqual([]);
    expect(parseStoredList("undefined")).toEqual([]);
  });

  it("returns [] when root is not an array", () => {
    expect(parseStoredList(JSON.stringify({ a: "b" }))).toEqual([]);
    expect(parseStoredList(JSON.stringify("notarray"))).toEqual([]);
    expect(parseStoredList(JSON.stringify(42))).toEqual([]);
    expect(parseStoredList(JSON.stringify(["ok", 123]))).toEqual([]);
  });

  it("keeps a pure string array", () => {
    expect(parseStoredList(JSON.stringify(["a", "b", "c"]))).toEqual(["a", "b", "c"]);
  });

  it("returns [] for an array containing a non-string element", () => {
    // The validator requires EVERY element to be a string — one bad egg nulls the lot.
    expect(parseStoredList(JSON.stringify(["a", "b", 42]))).toEqual([]);
  });

  it("accepts an empty array", () => {
    expect(parseStoredList("[]")).toEqual([]);
  });
});

describe("storage key constants", () => {
  it("exposes stable bookmark keys", () => {
    expect(BOOKMARKS_KEY).toContain("bookmarks");
    expect(GLOSSARY_BOOKMARKS_KEY).toContain("glossary");
    expect(BOOKMARKS_KEY).not.toBe(GLOSSARY_BOOKMARKS_KEY);
  });

  it("exposes a storage event name", () => {
    expect(STORAGE_EVENT).toContain("storage");
  });
});
