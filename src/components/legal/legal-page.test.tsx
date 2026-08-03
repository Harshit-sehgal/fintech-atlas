import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import "@/test/mocks";
import { LegalPage } from "./legal-page";

describe("LegalPage", () => {
  it("renders the legal header, effective date, content, and navigation", () => {
    render(
      <LegalPage
        eyebrow="Legal"
        title="Example notice"
        description="A short description"
        effectiveDate="2026-08-03"
      >
        <p>Example legal content</p>
      </LegalPage>,
    );

    expect(screen.getByRole("heading", { name: "Example notice" })).toBeInTheDocument();
    expect(screen.getByText("Legal")).toBeInTheDocument();
    expect(screen.getByText("Effective 2026-08-03")).toBeInTheDocument();
    expect(screen.getByText("Example legal content")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Legal pages" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
  });
});
