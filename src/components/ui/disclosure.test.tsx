import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Disclosure } from "./disclosure";

describe("Disclosure", () => {
  it("renders the summary only when closed and marks aria-expanded", () => {
    render(
      <Disclosure open={false} onToggle={() => {}} summary={() => <span>Region</span>}>
        <span>Content</span>
      </Disclosure>,
    );
    expect(screen.getByText("Region")).toBeInTheDocument();
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
  });

  it("renders children and the expanded summary when open", () => {
    render(
      <Disclosure open onToggle={() => {}} summary={(open) => <span>{open ? "Hide" : "Show"}</span>}>
        <span>Content</span>
      </Disclosure>,
    );
    expect(screen.getByText("Hide")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
  });

  it("calls onToggle when the summary is clicked", () => {
    const onToggle = vi.fn();
    render(
      <Disclosure open={false} onToggle={onToggle} summary={() => <span>Region</span>}>
        <span>Content</span>
      </Disclosure>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onToggle).toHaveBeenCalledOnce();
  });
});
