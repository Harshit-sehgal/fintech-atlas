import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ToastProvider, useToast } from "./toast-context";

function Trigger() {
  const { showToast } = useToast();
  return (
    <>
      <button onClick={() => showToast("ok msg")}>ok</button>
      <button onClick={() => showToast("info msg", "info")}>info</button>
      <button onClick={() => showToast("err msg", "error")}>err</button>
    </>
  );
}

const renderIt = () =>
  render(
    <ToastProvider>
      <Trigger />
    </ToastProvider>,
  );

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("toast branches", () => {
  it("renders success, info and error toasts with the right live roles", () => {
    renderIt();
    fireEvent.click(screen.getByText("ok"));
    expect(screen.getByRole("status")).toHaveTextContent("ok msg");

    fireEvent.click(screen.getByText("info"));
    expect(screen.getByText("info msg")).toBeInTheDocument();

    fireEvent.click(screen.getByText("err"));
    expect(screen.getByRole("alert")).toHaveTextContent("err msg");
  });

  it("pauses on hover/focus and dismisses on the close button", () => {
    vi.useFakeTimers();
    renderIt();
    fireEvent.click(screen.getByText("ok"));
    const toast = screen.getByRole("status");
    fireEvent.mouseEnter(toast);
    fireEvent.focus(toast);
    fireEvent.blur(toast);
    fireEvent.mouseLeave(toast);

    fireEvent.click(screen.getByLabelText("Dismiss notification"));

    act(() => {
      vi.advanceTimersByTime(7000);
    });
  });

  it("throws when used outside a provider", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(() => render(<Trigger />)).toThrow(/ToastProvider/);
  });
});
