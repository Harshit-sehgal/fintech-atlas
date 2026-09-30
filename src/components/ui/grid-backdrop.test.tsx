import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { GridBackdrop } from "./grid-backdrop";

describe("GridBackdrop", () => {
  it("is decorative: hidden from assistive tech and never focusable", () => {
    const { container } = render(<GridBackdrop />);
    const el = container.firstElementChild as HTMLElement;

    // The grid is a repeating CSS pattern with no content, so it must not be
    // announced and must not accept pointer input over the page beneath it.
    expect(el).toHaveAttribute("aria-hidden", "true");
    expect(el.className).toContain("pointer-events-none");
    expect(el.className).toContain("grid-bg");
  });

  it("defaults to the hero preset and a top-anchored band", () => {
    const { container } = render(<GridBackdrop />);
    const el = container.firstElementChild as HTMLElement;

    expect(el.className).toContain("opacity-30");
    expect(el.className).toContain("-top-10");
    expect(el.className).not.toContain("inset-0");
  });

  it("switches to a full-bleed background when asked", () => {
    const { container } = render(<GridBackdrop fullBleed variant="bold" />);
    const el = container.firstElementChild as HTMLElement;

    expect(el.className).toContain("inset-0");
    expect(el.className).toContain("opacity-45");
    expect(el.className).not.toContain("pointer-events-none");
  });

  it("honours the subtle preset and an extra className", () => {
    const { container } = render(<GridBackdrop variant="subtle" className="-z-20" />);
    const el = container.firstElementChild as HTMLElement;

    expect(el.className).toContain("opacity-20");
    expect(el.className).toContain("-z-20");
  });
});