import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { SponsorSlots } from "./sponsor-slots";

describe("SponsorSlots", () => {
  it("renders ten available slots by default", () => {
    render(<SponsorSlots slots={10} items={[]} />);
    expect(screen.getAllByText(/Sponsor slot/i)).toHaveLength(10);
    expect(screen.getAllByRole("link", { name: /Available — get in touch/i })).toHaveLength(10);
  });

  it("renders a filled, disclosed slot and leaves the rest available", () => {
    render(
      <SponsorSlots
        slots={3}
        items={[{ name: "Acme", url: "https://acme.test", tagline: "Payments infra" }]}
      />,
    );
    const link = screen.getByRole("link", { name: /Acme/ });
    expect(link).toHaveAttribute("href", "https://acme.test");
    expect(link.getAttribute("rel")).toContain("sponsored");
    expect(screen.getAllByText(/Sponsor slot/i)).toHaveLength(2);
  });
});
