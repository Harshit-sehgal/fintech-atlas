import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import "@/test/mocks";
import MatchmakerQuizPageClient from "./matchmaker-client";
import { ToastProvider } from "@/lib/toast-context";

describe("MatchmakerQuizPageClient (interaction)", () => {
  it("walks through the four questions and surfaces scored results with reasons", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <MatchmakerQuizPageClient />
      </ToastProvider>,
    );

    // Question 1 — user type
    await user.click(screen.getByRole("button", { name: /Online Business \/ SaaS/ }));
    // Question 2 — priority
    await user.click(screen.getByRole("button", { name: /Developer APIs & Customization/ }));
    // Question 3 — international need
    await user.click(screen.getByRole("button", { name: /Yes — High International Need/ }));
    // Question 4 — scale
    await user.click(screen.getByRole("button", { name: /Enterprise \/ High Volume/ }));

    // Results screen
    expect(screen.getByText("Suggested starting points")).toBeInTheDocument();

    // The shortlist is explained (audit #31) rather than a black box.
    expect(screen.getAllByText(/Why it matched/).length).toBeGreaterThan(0);
  });

  it("shows the educational-not-advice disclaimer", () => {
    render(
      <ToastProvider>
        <MatchmakerQuizPageClient />
      </ToastProvider>,
    );
    expect(
      screen.getByText(/educational recommendation, not financial or procurement advice/i),
    ).toBeInTheDocument();
  });
});
