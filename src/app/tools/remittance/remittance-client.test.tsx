import { describe, it, expect } from "vitest";
import { ToastProvider } from "@/lib/toast-context";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import "@/test/mocks";
import RemittanceCalculatorPageClient from "./remittance-client";

describe("RemittanceCalculatorPageClient (interaction)", () => {
  it("moves currency radio focus with left/right arrow keys", () => {
    render(
      <ToastProvider>
        <RemittanceCalculatorPageClient />
      </ToastProvider>,
    );
    const radios = screen.getAllByRole("radio");
    expect(radios.length).toBeGreaterThan(1);

    radios[0].focus();
    expect(radios[0]).toHaveFocus();

    // ArrowRight advances to the next currency and moves DOM focus.
    fireEvent.keyDown(radios[0], { key: "ArrowRight" });
    expect(radios[1]).toHaveFocus();

    // ArrowLeft returns focus to the previous currency.
    fireEvent.keyDown(radios[1], { key: "ArrowLeft" });
    expect(radios[0]).toHaveFocus();
  });

  it("clamps Home/End navigation to the first and last currency", () => {
    render(
      <ToastProvider>
        <RemittanceCalculatorPageClient />
      </ToastProvider>,
    );
    const radios = screen.getAllByRole("radio");
    const last = radios.length - 1;

    // Move to the final radio, then Home returns to the first.
    fireEvent.keyDown(radios[0], {
      key: "End",
    });
    expect(radios[last]).toHaveFocus();

    fireEvent.keyDown(radios[last], {
      key: "Home",
    });
    expect(radios[0]).toHaveFocus();
  });
});
