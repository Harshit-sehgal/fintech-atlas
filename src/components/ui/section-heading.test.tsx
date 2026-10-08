import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { SectionHeading } from "./section-heading";

describe("SectionHeading", () => {
  it("renders a static h1 with eyebrow and description at level 1", () => {
    const { container } = render(
      <SectionHeading headingLevel={1} eyebrow="Eyebrow" title="Title" description="Desc" />,
    );
    const h1 = container.querySelector("h1")!;
    expect(h1.textContent).toBe("Title");
    expect(container.querySelector(".eyebrow, p")?.textContent).toBe("Eyebrow");
    expect(container.textContent).toContain("Desc");
  });

  it("renders an h2 by default and centres when asked", () => {
    const { container } = render(<SectionHeading title="Sub" align="center" />);
    expect(container.querySelector("h2")?.textContent).toBe("Sub");
    expect(container.firstElementChild?.className).toContain("text-center");
  });

  it("renders a centred h1 primary heading", () => {
    const { container } = render(
      <SectionHeading headingLevel={1} align="center" title="Primary" eyebrow="Eyebrow" description="Desc" />,
    );
    expect(container.querySelector("h1")?.textContent).toBe("Primary");
    expect(container.firstElementChild?.className).toContain("text-center");
  });

  it("omits the eyebrow and description when not provided", () => {
    const { container } = render(<SectionHeading title="Bare" />);
    expect(container.querySelector("h2")).not.toBeNull();
    expect(container.querySelectorAll("p")).toHaveLength(0);
  });
});
