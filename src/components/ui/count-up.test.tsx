import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CountUp } from "./count-up";

afterEach(() => vi.unstubAllGlobals());

describe("CountUp", () => {
  it("renders the final value and stays static under reduced motion", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    render(<CountUp value={3061} />);
    expect(screen.getByText("3,061")).toBeInTheDocument();
  });

  it("renders the value when matchMedia is unavailable", () => {
    vi.stubGlobal("matchMedia", undefined);
    render(<CountUp value={42} />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });
});
