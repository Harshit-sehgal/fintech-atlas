import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@/test/mocks";
import { ToastProvider, useToast } from "./toast-context";

function Trigger() {
  const { showToast } = useToast();
  return (
    <div>
      <button onClick={() => showToast("Success message")}>success</button>
      <button onClick={() => showToast("Info message", "info")}>info</button>
      <button onClick={() => showToast("Error message", "error")}>error</button>
    </div>
  );
}

describe("ToastProvider", () => {
  afterEach(() => vi.useRealTimers());

  it("renders polite, informational, and assertive notifications and allows dismissal", () => {
    render(<ToastProvider><Trigger /></ToastProvider>);

    fireEvent.click(screen.getByRole("button", { name: "success" }));
    expect(screen.getByRole("status")).toHaveTextContent("Success message");

    fireEvent.click(screen.getByRole("button", { name: "info" }));
    expect(screen.getAllByRole("status").map((node) => node.textContent).join(" ")).toContain("Info message");

    fireEvent.click(screen.getByRole("button", { name: "error" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Error message");

    fireEvent.click(screen.getAllByRole("button", { name: "Dismiss notification" })[0]);
    expect(screen.queryByText("Success message")).not.toBeInTheDocument();
  });

  it("expires normal and error notifications after their configured durations", () => {
    vi.useFakeTimers();
    render(<ToastProvider><Trigger /></ToastProvider>);

    fireEvent.click(screen.getByRole("button", { name: "success" }));
    fireEvent.click(screen.getByRole("button", { name: "error" }));
    act(() => vi.advanceTimersByTime(4001));
    expect(screen.queryByText("Success message")).not.toBeInTheDocument();
    expect(screen.getByText("Error message")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(6500));
    expect(screen.queryByText("Error message")).not.toBeInTheDocument();
  });

  it("pauses an active timer while hovered and resumes on mouse leave", () => {
    vi.useFakeTimers();
    render(<ToastProvider><Trigger /></ToastProvider>);
    fireEvent.click(screen.getByRole("button", { name: "success" }));
    const toast = screen.getByRole("status");
    fireEvent.mouseEnter(toast);
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByText("Success message")).toBeInTheDocument();
    fireEvent.mouseLeave(toast);
    act(() => vi.advanceTimersByTime(4000));
    expect(screen.queryByText("Success message")).not.toBeInTheDocument();
  });
});
