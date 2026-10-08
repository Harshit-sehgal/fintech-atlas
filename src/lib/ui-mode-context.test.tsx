import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { UiModeProvider, useUiMode } from "./ui-mode-context";

function Probe() {
  const { uiMode, setUiMode, toggleUiMode } = useUiMode();
  return (
    <div>
      <span data-testid="mode">{uiMode}</span>
      <button onClick={() => setUiMode("boring")}>set-boring</button>
      <button onClick={() => setUiMode((prev) => (prev === "standard" ? "boring" : "standard"))}>
        updater
      </button>
      <button onClick={toggleUiMode}>toggle</button>
    </div>
  );
}

function Bad() {
  useUiMode();
  return null;
}

const renderProbe = () =>
  render(
    <UiModeProvider>
      <Probe />
    </UiModeProvider>,
  );

afterEach(() => {
  window.localStorage.clear();
  document.documentElement.removeAttribute("data-ui-mode");
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("UiModeProvider", () => {
  it("defaults to standard and mirrors the mode onto the document", () => {
    renderProbe();
    expect(screen.getByTestId("mode").textContent).toBe("standard");
    expect(document.documentElement.getAttribute("data-ui-mode")).toBe("standard");
  });

  it("reads a stored preference and ignores invalid values", () => {
    window.localStorage.setItem("ui-mode", "boring");
    const { unmount } = renderProbe();
    expect(screen.getByTestId("mode").textContent).toBe("boring");
    unmount();

    window.localStorage.setItem("ui-mode", "garbage");
    renderProbe();
    expect(screen.getByTestId("mode").textContent).toBe("standard");
  });

  it("falls back to standard when storage read throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage blocked");
    });
    renderProbe();
    expect(screen.getByTestId("mode").textContent).toBe("standard");
  });

  it("sets and toggles the mode, persisting the choice", () => {
    renderProbe();
    act(() => screen.getByText("set-boring").click());
    expect(screen.getByTestId("mode").textContent).toBe("boring");
    expect(window.localStorage.getItem("ui-mode")).toBe("boring");

    act(() => screen.getByText("updater").click());
    expect(screen.getByTestId("mode").textContent).toBe("standard");

    act(() => screen.getByText("toggle").click());
    expect(screen.getByTestId("mode").textContent).toBe("boring");
  });

  it("re-reads on a matching storage event and ignores unrelated keys", () => {
    renderProbe();
    window.localStorage.setItem("ui-mode", "boring");
    act(() => window.dispatchEvent(new StorageEvent("storage", { key: "ui-mode" })));
    expect(screen.getByTestId("mode").textContent).toBe("boring");

    window.localStorage.setItem("ui-mode", "standard");
    act(() => window.dispatchEvent(new StorageEvent("storage", { key: "something-else" })));
    expect(screen.getByTestId("mode").textContent).toBe("boring");
  });

  it("swallows storage write failures when setting the mode", () => {
    renderProbe();
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    act(() => screen.getByText("set-boring").click());
    expect(screen.getByTestId("mode")).toBeInTheDocument();
  });

  it("throws when used outside the provider", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(() => render(<Bad />)).toThrow(/UiModeProvider/);
  });
});
