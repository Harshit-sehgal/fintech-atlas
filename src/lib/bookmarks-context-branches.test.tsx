import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ToastProvider } from "@/lib/toast-context";
import { BookmarksProvider, useBookmarks } from "./bookmarks-context";
import { BOOKMARKS_KEY, STORAGE_EVENT } from "@/lib/storage";

function Probe() {
  const {
    bookmarks,
    toggleBookmark,
    isBookmarked,
    toggleGlossaryBookmark,
    isGlossaryBookmarked,
  } = useBookmarks();
  return (
    <>
      <span data-testid="count">{bookmarks.length}</span>
      <span data-testid="is">{isBookmarked("stripe") ? "y" : "n"}</span>
      <span data-testid="isg">{isGlossaryBookmarked("apr") ? "y" : "n"}</span>
      <button onClick={() => toggleBookmark("stripe")}>toggle</button>
      <button onClick={() => toggleGlossaryBookmark("apr")}>toggle-glossary</button>
    </>
  );
}

const renderIt = () =>
  render(
    <ToastProvider>
      <BookmarksProvider>
        <Probe />
      </BookmarksProvider>
    </ToastProvider>,
  );

beforeEach(() => window.localStorage.clear());
afterEach(() => {
  vi.restoreAllMocks();
});

describe("bookmarks context branches", () => {
  it("toggles bookmarks and glossary bookmarks and reacts to local change events", () => {
    renderIt();
    fireEvent.click(screen.getByText("toggle"));
    expect(screen.getByTestId("count").textContent).toBe("1");
    expect(screen.getByTestId("is").textContent).toBe("y");

    fireEvent.click(screen.getByText("toggle-glossary"));
    expect(screen.getByTestId("isg").textContent).toBe("y");

    act(() => {
      window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key: BOOKMARKS_KEY } }));
    });
    act(() => {
      window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key: "other" } }));
    });
    expect(screen.getByTestId("count").textContent).toBe("1");
  });

  it("surfaces a toast when a write fails", () => {
    renderIt();
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    fireEvent.click(screen.getByText("toggle"));
    expect(screen.getByRole("alert")).toHaveTextContent("Failed to save");
  });

  it("throws outside the provider", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(() =>
      render(
        <ToastProvider>
          <Probe />
        </ToastProvider>,
      ),
    ).toThrow(/BookmarksProvider/);
  });
});
