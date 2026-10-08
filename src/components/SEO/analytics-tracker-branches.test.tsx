import { afterEach, describe, expect, it, vi } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { AnalyticsTracker } from "./AnalyticsTracker";

function renderTracker() {
  return render(
    <>
      <AnalyticsTracker />
      <div id="plain">not a link</div>
      <a
        id="prevented"
        href="https://external.test/prevented"
        onClick={(e) => e.preventDefault()}
      >
        prevented
      </a>
      <a id="nohref">no href</a>
      <a id="middle" href="https://external.test/middle">
        middle
      </a>
    </>,
  );
}

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("AnalyticsTracker click branches", () => {
  it("ignores non-anchor targets, prevented clicks, missing hrefs and non-left buttons", () => {
    const plausible = vi.fn();
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_DOMAIN", "plausible.test");
    window.plausible = plausible;

    renderTracker();
    fireEvent.click(document.getElementById("plain")!);
    fireEvent.click(document.getElementById("prevented")!);
    fireEvent.click(document.getElementById("nohref")!);
    fireEvent.click(document.getElementById("middle")!, { button: 2 });

    expect(plausible).not.toHaveBeenCalled();
  });
});
