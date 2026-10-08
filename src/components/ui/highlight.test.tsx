import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render } from "@testing-library/react";
import { Highlight, MarkerRule } from "./highlight";

class FakeObserver {
  static instances: FakeObserver[] = [];
  observed: Element[] = [];
  disconnected = false;
  constructor(
    public callback: (entries: Array<{ isIntersecting: boolean }>) => void,
  ) {
    FakeObserver.instances.push(this);
  }
  observe(el: Element) {
    this.observed.push(el);
  }
  disconnect() {
    this.disconnected = true;
  }
}

afterEach(() => {
  FakeObserver.instances = [];
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("Highlight", () => {
  it("renders immediately without animation when animate is false", () => {
    const { container } = render(<Highlight animate={false}>fees</Highlight>);
    const el = container.querySelector(".hl")!;
    expect(el.className).toContain("hl-yellow");
    expect(el.className).not.toContain("hl-animate");
    expect(el.className).toContain("is-inview");
  });

  it("reveals via IntersectionObserver and disconnects once intersecting", () => {
    vi.stubGlobal("IntersectionObserver", FakeObserver);
    const { container } = render(
      <Highlight color="green" className="extra">
        prose
      </Highlight>,
    );
    const el = container.querySelector(".hl")!;
    expect(el.className).toContain("hl-animate");
    expect(el.className).toContain("hl-green");
    expect(el.className).toContain("extra");
    expect(el.className).not.toContain("is-inview");

    const io = FakeObserver.instances[0];
    expect(io.observed).toHaveLength(1);
    act(() => io.callback([{ isIntersecting: true }]));
    expect(container.querySelector(".hl")!.className).toContain("is-inview");
    expect(io.disconnected).toBe(true);
  });

  it("falls back to a frame when IntersectionObserver is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", () => undefined);
    const { container } = render(<Highlight>fallback</Highlight>);
    expect(container.querySelector(".hl")!.className).toContain("is-inview");
  });

  it("supports alternative tags", () => {
    const { container } = render(
      <Highlight as="strong" animate={false}>
        bold
      </Highlight>,
    );
    expect(container.querySelector("strong.hl")).not.toBeNull();
  });
});

describe("MarkerRule", () => {
  it("uses default props when none are supplied", () => {
    const { container } = render(<MarkerRule />);
    const el = container.querySelector(".marker-rule")!;
    expect(el.className).toContain("marker-rule-yellow");
    expect(el.className).not.toContain("undefined");
  });

  it("renders a decorative rule with the requested colour", () => {
    const { container } = render(<MarkerRule color="pink" className="mt-4" />);
    const el = container.querySelector(".marker-rule")!;
    expect(el.getAttribute("aria-hidden")).toBe("true");
    expect(el.className).toContain("marker-rule-pink");
    expect(el.className).toContain("mt-4");
  });
});
