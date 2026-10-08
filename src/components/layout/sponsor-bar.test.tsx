import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { SponsorBar } from "./sponsor-bar";

describe("SponsorBar", () => {
  it("shows the availability CTA and a services link when no sponsors are configured", () => {
    render(<SponsorBar />);
    expect(screen.getByText(/10 slots available/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /become a sponsor/i })).toHaveAttribute(
      "href",
      "/services",
    );
  });
});
