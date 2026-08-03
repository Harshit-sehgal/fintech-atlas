import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import "@/test/mocks";
import { ToastProvider } from "@/lib/toast-context";
import FeeCalculatorPageClient from "./calculator-client";

function renderFeeCalculator() {
  return render(
    <ToastProvider>
      <FeeCalculatorPageClient />
    </ToastProvider>,
  );
}

describe("FeeCalculatorPageClient (interaction)", () => {
  it("renders all four providers and marks a single lowest comparable estimate", () => {
    renderFeeCalculator();
    expect(screen.getAllByText("Payment Gateway Fee Calculator").length).toBeGreaterThan(0);

    // Every provider name appears (as a link and/or note text).
    for (const name of ["Stripe", "PayPal", "Square", "Adyen"]) {
      expect(screen.getAllByText(name).length).toBeGreaterThan(0);
    }

    // Adyen is flagged as a custom contract, not a flat rate.
    expect(screen.getByText("Custom contract")).toBeInTheDocument();

    // Exactly one provider is labelled the lowest comparable estimate.
    expect(screen.getAllByText("Lowest comparable estimate")).toHaveLength(1);
  });

  it("recomputes displayed volume when the monthly revenue slider changes", () => {
    renderFeeCalculator();
    const slider = screen.getByLabelText(/Monthly Processing Volume/i);
    expect(slider).toHaveAttribute("type", "range");

    fireEvent.change(slider, { target: { value: "120000" } });

    // The formatted volume label updates.
    expect(screen.getByText(/120,000/)).toBeInTheDocument();
  });

  it("shows the comparability caveat that keeps custom-contract Adyen out of the ranking", () => {
    renderFeeCalculator();
    const notice = screen.getByText(/How to read this:/i).closest("div")!;
    expect(notice).toHaveTextContent(/Stripe, PayPal, and Square use the published flat-rate assumptions/);
    expect(notice).toHaveTextContent(/Adyen is a custom-contract provider/);
    expect(notice).toHaveTextContent(/not used for the comparable-rate recommendation/);
  });
});
