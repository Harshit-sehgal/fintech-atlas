import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { getFocusableElements } from "@/lib/focus-trap";

// jsdom does not run layout, so `getClientRects()` returns an empty list,
// which would make the visibility gate reject every element. Stub it to return
// a fake laid-out box so tested elements are considered visible.
const fakeRectList = {
  length: 1,
  0: { top: 0, bottom: 10, left: 0, right: 10, width: 10, height: 10, x: 0, y: 0 },
} as unknown as DOMRectList;

const originalGetClientRects = Element.prototype.getClientRects;

beforeAll(() => {
  // jsdom defines this on HTMLElement.prototype; override it (and Element for
  // safety) so the visibility check sees a laid-out box.
  HTMLElement.prototype.getClientRects = function getClientRects() {
    return fakeRectList;
  } as typeof HTMLElement.prototype.getClientRects;
  Element.prototype.getClientRects = function getClientRects() {
    return fakeRectList;
  } as typeof Element.prototype.getClientRects;
});

afterAll(() => {
  HTMLElement.prototype.getClientRects = originalGetClientRects;
  Element.prototype.getClientRects = originalGetClientRects;
});

afterEach(() => {
  document.body.innerHTML = "";
});

describe("getFocusableElements", () => {
  it("returns focusable elements in correct DOM order", () => {
    const container = document.createElement("div");
    const first = document.createElement("button");
    const second = document.createElement("button");
    const third = document.createElement("button");
    container.append(first, second, third);
    document.body.append(container);

    const result = getFocusableElements(container);
    expect(result).toEqual([first, second, third]);
  });

  it("sorts positive tabindex ahead of tabindex 0", () => {
    const container = document.createElement("div");
    const a = document.createElement("button");
    const b = document.createElement("button");
    b.tabIndex = 2; // positive tabindex sorts first
    const c = document.createElement("button");
    container.append(a, b, c);
    document.body.append(container);

    const result = getFocusableElements(container);
    expect(result).toEqual([b, a, c]);
  });

  it("excludes display:none and aria-hidden elements", () => {
    const container = document.createElement("div");
    const visible = document.createElement("button");
    const hidden = document.createElement("button");
    hidden.style.display = "none";
    const ariaHidden = document.createElement("button");
    ariaHidden.setAttribute("aria-hidden", "true");
    container.append(visible, hidden, ariaHidden);
    document.body.append(container);

    const result = getFocusableElements(container);
    expect(result).toEqual([visible]);
  });

  it("excludes elements inside an inert subtree", () => {
    const container = document.createElement("div");
    const inert = document.createElement("div");
    inert.setAttribute("inert", "");
    const hiddenInert = document.createElement("button");
    inert.append(hiddenInert);
    const visible = document.createElement("button");
    container.append(inert, visible);
    document.body.append(container);

    expect(getFocusableElements(container)).toEqual([visible]);
  });
});
