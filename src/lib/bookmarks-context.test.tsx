import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@/test/mocks";
import { BookmarksProvider, useBookmarks } from "./bookmarks-context";
import { ToastProvider } from "./toast-context";
import {
  BOOKMARKS_KEY,
  GLOSSARY_BOOKMARKS_KEY,
  STORAGE_EVENT,
} from "./storage";

function Harness() {
  const {
    bookmarks,
    toggleBookmark,
    isBookmarked,
    glossaryBookmarks,
    toggleGlossaryBookmark,
    isGlossaryBookmarked,
  } = useBookmarks();
  return (
    <div>
      <span data-testid="bookmarks">{bookmarks.join(",")}</span>
      <span data-testid="glossary">{glossaryBookmarks.join(",")}</span>
      <span data-testid="is-bookmarked">{String(isBookmarked("stripe"))}</span>
      <span data-testid="is-glossary-bookmarked">
        {String(isGlossaryBookmarked("apy"))}
      </span>
      <button onClick={() => toggleBookmark("stripe")}>toggle-company</button>
      <button onClick={() => toggleGlossaryBookmark("apy")}>toggle-term</button>
    </div>
  );
}

const renderProvider = () =>
  render(
    <ToastProvider>
      <BookmarksProvider>
        <Harness />
      </BookmarksProvider>
    </ToastProvider>,
  );

describe("BookmarksProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("toggles a company bookmark on and back off", () => {
    renderProvider();

    expect(screen.getByTestId("bookmarks")).toHaveTextContent("");
    expect(screen.getByTestId("is-bookmarked")).toHaveTextContent("false");

    fireEvent.click(screen.getByRole("button", { name: "toggle-company" }));
    expect(screen.getByTestId("bookmarks")).toHaveTextContent("stripe");
    expect(screen.getByTestId("is-bookmarked")).toHaveTextContent("true");
    expect(
      JSON.parse(window.localStorage.getItem(BOOKMARKS_KEY) ?? "[]"),
    ).toEqual(["stripe"]);

    fireEvent.click(screen.getByRole("button", { name: "toggle-company" }));
    expect(screen.getByTestId("bookmarks")).toHaveTextContent("");
    expect(screen.getByTestId("is-bookmarked")).toHaveTextContent("false");
  });

  it("keeps glossary bookmarks in a separate list", () => {
    renderProvider();

    fireEvent.click(screen.getByRole("button", { name: "toggle-company" }));
    fireEvent.click(screen.getByRole("button", { name: "toggle-term" }));

    expect(screen.getByTestId("bookmarks")).toHaveTextContent("stripe");
    expect(screen.getByTestId("glossary")).toHaveTextContent("apy");
    expect(screen.getByTestId("is-glossary-bookmarked")).toHaveTextContent("true");
    expect(
      JSON.parse(window.localStorage.getItem(GLOSSARY_BOOKMARKS_KEY) ?? "[]"),
    ).toEqual(["apy"]);
  });

  it("restores previously persisted bookmarks on mount", () => {
    act(() => {
      window.localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(["razorpay"]));
      window.localStorage.setItem(
        GLOSSARY_BOOKMARKS_KEY,
        JSON.stringify(["upi", "neft"]),
      );
    });

    renderProvider();

    expect(screen.getByTestId("bookmarks")).toHaveTextContent("razorpay");
    expect(screen.getByTestId("glossary")).toHaveTextContent("upi,neft");
  });

  it("ignores malformed stored data rather than crashing", () => {
    act(() => {
      window.localStorage.setItem(BOOKMARKS_KEY, "{not json");
      window.localStorage.setItem(GLOSSARY_BOOKMARKS_KEY, '{"a":1}');
    });

    renderProvider();

    expect(screen.getByTestId("bookmarks")).toHaveTextContent("");
    expect(screen.getByTestId("glossary")).toHaveTextContent("");
  });

  it("reacts to same-tab writes and to cross-tab storage events", () => {
    renderProvider();

    // Same-tab: writeStorage dispatches a CustomEvent on window.
    act(() => {
      window.dispatchEvent(
        new CustomEvent(STORAGE_EVENT, { detail: { key: BOOKMARKS_KEY } }),
      );
    });
    expect(screen.getByTestId("bookmarks")).toHaveTextContent("");

    // A different key must not force a re-read.
    act(() => {
      window.localStorage.setItem(GLOSSARY_BOOKMARKS_KEY, JSON.stringify(["x"]));
      window.dispatchEvent(
        new CustomEvent(STORAGE_EVENT, { detail: { key: "unrelated" } }),
      );
    });
    expect(screen.getByTestId("glossary")).toHaveTextContent("");

    // Cross-tab: the native storage event for our key should refresh.
    act(() => {
      window.localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(["payoneer"]));
      window.dispatchEvent(new StorageEvent("storage", { key: BOOKMARKS_KEY }));
    });
    expect(screen.getByTestId("bookmarks")).toHaveTextContent("payoneer");

    // key === null means the whole store was cleared; that must also refresh.
    act(() => {
      window.localStorage.clear();
      window.dispatchEvent(new StorageEvent("storage", { key: null }));
    });
    expect(screen.getByTestId("bookmarks")).toHaveTextContent("");
  });

  it("surfaces a toast instead of throwing when storage rejects the write", () => {
    const setItem = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new DOMException("QuotaExceededError");
      });

    renderProvider();

    // The guard exists so a private-mode browser shows an error rather than
    // crashing the click handler.
    expect(() =>
      fireEvent.click(screen.getByRole("button", { name: "toggle-company" })),
    ).not.toThrow();

    expect(setItem).toHaveBeenCalled();
  });

  it("fails loudly when a consumer renders outside the provider", () => {
    // Silently no-op'ing would hide a whole class of wiring bug.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Harness />)).toThrow(
      /useBookmarks must be used inside a BookmarksProvider/,
    );
    spy.mockRestore();
  });
});