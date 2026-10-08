import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { PartnerCta } from "./partner-cta";

describe("PartnerCta", () => {
  it("renders nothing for a slug that is not a real company", () => {
    const { container } = render(<PartnerCta slug="not-a-real-company" placement="home" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a link with the resolved label and a custom label override", () => {
    const { rerender } = render(<PartnerCta slug="stripe" placement="home" />);
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toContain("https://");
    expect(link.getAttribute("rel")).toContain("noopener");

    rerender(<PartnerCta slug="stripe" placement="home" label="Check Stripe" variant="compact" />);
    expect(screen.getByRole("link")).toHaveTextContent("Check Stripe");
  });
});
