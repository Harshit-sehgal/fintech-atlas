import { describe, expect, it, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@/test/mocks";
import { UiModeProvider, useUiMode } from "./ui-mode-context";

function Harness() {
  const { uiMode, toggleUiMode } = useUiMode();
  return (
    <div>
      <span data-testid="mode">{uiMode}</span>
      <button onClick={toggleUiMode}>toggle</button>
    </div>
  );
}

describe("UiModeProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-ui-mode");
  });

  it("defaults to the standard mode and persists toggles to localStorage", () => {
    render(
      <UiModeProvider>
        <Harness />
      </UiModeProvider>,
    );

    expect(screen.getByTestId("mode")).toHaveTextContent("standard");
    expect(document.documentElement.getAttribute("data-ui-mode")).toBe("standard");

    fireEvent.click(screen.getByRole("button", { name: "toggle" }));
    expect(screen.getByTestId("mode")).toHaveTextContent("boring");
    expect(window.localStorage.getItem("ui-mode")).toBe("boring");
    expect(document.documentElement.getAttribute("data-ui-mode")).toBe("boring");

    fireEvent.click(screen.getByRole("button", { name: "toggle" }));
    expect(screen.getByTestId("mode")).toHaveTextContent("standard");
    expect(window.localStorage.getItem("ui-mode")).toBe("standard");
  });

  it("restores a persisted preference on mount", () => {
    act(() => {
      window.localStorage.setItem("ui-mode", "boring");
    });
    render(
      <UiModeProvider>
        <Harness />
      </UiModeProvider>,
    );
    expect(screen.getByTestId("mode")).toHaveTextContent("boring");
  });
});
