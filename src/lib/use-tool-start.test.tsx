import { describe, expect, it, afterEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { createRef } from "react";
import "@/test/mocks";
import { useToolStart } from "./use-tool-start";

function Host({
  tool,
  withRef,
}: {
  tool: string;
  withRef?: boolean;
}) {
  const ref = withRef ? createRef<HTMLDivElement>() : undefined;
  useToolStart(tool, ref as React.RefObject<HTMLDivElement | null>);
  return (
    <div>
      <div data-testid="tool" ref={ref}>
        <button type="button" data-testid="inside">inside</button>
      </div>
      <button type="button" data-testid="outside">outside</button>
    </div>
  );
}

function installPlausible(events: string[]) {
  const w = window as unknown as {
    plausible?: (name: string) => void;
  };
  const previous = w.plausible;
  w.plausible = (name: string) => events.push(name);
  return () => {
    if (previous) w.plausible = previous;
    else delete w.plausible;
  };
}

describe("useToolStart", () => {
  const cleanups: (() => void)[] = [];
  afterEach(() => {
    cleanups.splice(0).forEach((fn) => fn());
  });

  it("fires a single tool_start event on first interaction inside the tool", () => {
    const events: string[] = [];
    cleanups.push(installPlausible(events));

    const { getByTestId } = render(<Host tool="fee_calculator" withRef />);

    fireEvent.pointerDown(getByTestId("inside"));
    fireEvent.pointerDown(getByTestId("inside"));
    fireEvent.keyDown(getByTestId("inside"), { key: "Enter" });

    expect(events).toEqual(["tool_start"]);
  });

  it("ignores interaction outside the tool when a ref scopes the source", () => {
    const events: string[] = [];
    cleanups.push(installPlausible(events));

    const { getByTestId } = render(<Host tool="remittance" withRef />);
    fireEvent.pointerDown(getByTestId("outside"));

    expect(events).toEqual([]);
  });

  it("fires even without a ref (global scope)", () => {
    const events: string[] = [];
    cleanups.push(installPlausible(events));
    const { getByTestId } = render(<Host tool="matchmaker" />);
    fireEvent.pointerDown(getByTestId("outside"));
    expect(events).toEqual(["tool_start"]);
  });
});