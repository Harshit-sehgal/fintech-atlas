import { afterEach, beforeAll, afterAll, describe, expect, it } from "vitest";
import { getFocusableElements, getFocusableElementsInDialog } from "./focus-trap";

const fakeRectList = {
  length: 1,
  0: { top: 0, bottom: 10, left: 0, right: 10, width: 10, height: 10, x: 0, y: 0 },
} as unknown as DOMRectList;

const originalHTMLElement = HTMLElement.prototype.getClientRects;
const originalElement = Element.prototype.getClientRects;

beforeAll(() => {
  HTMLElement.prototype.getClientRects = () => fakeRectList;
  Element.prototype.getClientRects = () => fakeRectList;
});
afterAll(() => {
  HTMLElement.prototype.getClientRects = originalHTMLElement;
  Element.prototype.getClientRects = originalElement;
});
afterEach(() => {
  document.body.innerHTML = "";
});

describe("focus-trap extra branches", () => {
  it("excludes visibility:hidden elements", () => {
    const container = document.createElement("div");
    const visible = document.createElement("button");
    const hidden = document.createElement("button");
    hidden.style.visibility = "hidden";
    container.append(visible, hidden);
    document.body.append(container);

    expect(getFocusableElements(container)).toEqual([visible]);
  });

  it("de-duplicates an element matched by more than one selector", () => {
    const container = document.createElement("div");
    const button = document.createElement("button");
    button.setAttribute("tabindex", "0"); // matches button and [tabindex]
    container.append(button);
    document.body.append(container);

    expect(getFocusableElements(container)).toEqual([button]);
  });

  it("treats a non-numeric tabindex as 0 and orders positives first", () => {
    const container = document.createElement("div");
    const weird = document.createElement("button");
    weird.setAttribute("tabindex", "abc");
    const positive = document.createElement("button");
    positive.setAttribute("tabindex", "2");
    container.append(weird, positive);
    document.body.append(container);

    expect(getFocusableElements(container)[0]).toBe(positive);
  });

  it("getFocusableElementsInDialog delegates to the shared helper", () => {
    const dialog = document.createElement("div");
    const button = document.createElement("button");
    dialog.append(button);
    document.body.append(dialog);

    expect(getFocusableElementsInDialog(dialog)).toEqual([button]);
  });
});
