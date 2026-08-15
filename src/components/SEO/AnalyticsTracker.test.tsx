import { afterEach, describe, expect, it, vi } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { AnalyticsTracker } from "./AnalyticsTracker";

describe("AnalyticsTracker (outbound-link events)", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllEnvs();
  });

  const renderWithLinks = () => {
    render(
      <>
        <AnalyticsTracker />
        <div data-placement="article-body">
          <a href="https://external.test/ref">external</a>
          <a href="/not-a-page">internal</a>
          <a href="mailto:hello@example.test">mail</a>
          <a href="#fragment">fragment</a>
        </div>
        <div>
          <a href="https://other.test/no-section">no section</a>
        </div>
      </>,
    );
  };

  it("fires outbound_click with the nearest data-placement", () => {
    const plausible = vi.fn();
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_DOMAIN", "plausible.test");
    window.plausible = plausible;

    renderWithLinks();
    fireEvent.click(document.querySelector('a[href="https://external.test/ref"]') as HTMLAnchorElement);

    expect(plausible).toHaveBeenCalledWith("outbound_click", {
      props: { url: "https://external.test/ref", placement: "article-body" },
    });
  });

  it("ignores internal links, mailto, and fragments", () => {
    const plausible = vi.fn();
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_DOMAIN", "plausible.test");
    window.plausible = plausible;

    renderWithLinks();
    for (const href of ["/not-a-page", "mailto:hello@example.test", "#fragment"]) {
      fireEvent.click(document.querySelector(`a[href="${href}"]`) as HTMLAnchorElement);
    }

    expect(plausible).not.toHaveBeenCalled();
  });

  it("falls back to body placement when no section is annotated", () => {
    const plausible = vi.fn();
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_DOMAIN", "plausible.test");
    window.plausible = plausible;

    renderWithLinks();
    fireEvent.click(document.querySelector('a[href="https://other.test/no-section"]') as HTMLAnchorElement);

    expect(plausible).toHaveBeenCalledWith("outbound_click", {
      props: { url: "https://other.test/no-section", placement: "body" },
    });
  });

  it("does not attach a listener when analytics is unset (privacy-default)", () => {
    const plausible = vi.fn();
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_DOMAIN", "   ");
    window.plausible = plausible;

    renderWithLinks();
    fireEvent.click(document.querySelector('a[href="https://external.test/ref"]') as HTMLAnchorElement);

    expect(plausible).not.toHaveBeenCalled();
  });
});