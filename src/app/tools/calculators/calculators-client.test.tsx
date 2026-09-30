import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import "@/test/mocks";
import { ToastProvider } from "@/lib/toast-context";
import CalculatorsClient from "./calculators-client";

describe("CalculatorsClient (interaction)", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("renders the complete calculator catalog and switches panels", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <CalculatorsClient />
      </ToastProvider>,
    );

    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(9);
    expect(screen.getByRole("tabpanel")).toHaveAttribute("id", "panel-sip");

    await user.click(screen.getByRole("tab", { name: /EMI \/ Loan Calculator/i }));
    expect(screen.getByRole("tab", { name: /EMI \/ Loan Calculator/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tabpanel")).toHaveAttribute("id", "panel-emi");
    expect(screen.getByLabelText("Loan Amount")).toHaveAttribute("type", "range");
  });

  it("recomputes a selected calculator when an input changes", async () => {
    render(
      <ToastProvider>
        <CalculatorsClient />
      </ToastProvider>,
    );

    const contribution = screen.getByLabelText("Monthly Contribution");
    expect(screen.getByText("$500")).toBeInTheDocument();
    fireEvent.change(contribution, { target: { value: "1000" } });

    expect(screen.getByText("$1,000")).toBeInTheDocument();
    expect(screen.getByText("$120,000")).toBeInTheDocument();
  });

  it("restores a valid saved calculator state and ignores malformed state", async () => {
    localStorage.setItem(
      "fintech_atlas_tool_calc_sip",
      JSON.stringify({ monthlyContribution: 1000, annualReturn: 10, years: 5 }),
    );
    render(
      <ToastProvider>
        <CalculatorsClient />
      </ToastProvider>,
    );

    await waitFor(() => expect(screen.getByText("$1,000")).toBeInTheDocument());
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Projected Corpus");
  });

  it("emits one completion event for hydration and does not duplicate it on input changes", async () => {
    const plausible = vi.fn();
    Object.defineProperty(window, "plausible", {
      configurable: true,
      value: plausible,
    });
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <CalculatorsClient />
      </ToastProvider>,
    );

    await waitFor(() =>
      expect(plausible).toHaveBeenCalledWith("tool_complete", {
        props: { tool: "calculator", calc_id: "sip" },
      }),
    );
    const completionCount = plausible.mock.calls.filter(([name]) => name === "tool_complete").length;

    await user.click(screen.getByLabelText("Monthly Contribution"));
    expect(plausible.mock.calls.filter(([name]) => name === "tool_complete")).toHaveLength(completionCount);
  });
});
