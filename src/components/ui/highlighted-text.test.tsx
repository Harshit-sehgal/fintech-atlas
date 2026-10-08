import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { HighlightedText } from "./highlighted-text";

describe("HighlightedText", () => {
  it("returns the plain string when there is no query", () => {
    const { container } = render(<HighlightedText text="Stripe Payments" />);
    expect(container.textContent).toBe("Stripe Payments");
    expect(container.querySelector(".hl")).toBeNull();
  });

  it("marks every case-insensitive occurrence", () => {
    const { container } = render(<HighlightedText text="PayPal pays" query="pay" />);
    const marks = container.querySelectorAll(".hl");
    expect(marks).toHaveLength(2);
    expect(marks[0].textContent).toBe("Pay");
    expect(container.textContent).toBe("PayPal pays");
  });

  it("leaves non-matching text untouched", () => {
    const { container } = render(<HighlightedText text="Adyen" query="zzz" />);
    expect(container.querySelectorAll(".hl")).toHaveLength(0);
    expect(container.textContent).toBe("Adyen");
  });
});
