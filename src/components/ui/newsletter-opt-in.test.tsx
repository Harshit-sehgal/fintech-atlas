import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import "@/test/mocks";
import { ToastProvider } from "@/lib/toast-context";
import { NewsletterOptIn } from "./newsletter-opt-in";

function renderNewsletter() {
  return render(
    <ToastProvider>
      <NewsletterOptIn />
    </ToastProvider>,
  );
}

describe("NewsletterOptIn", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("reports a provider HTTP failure instead of showing success", async () => {
    vi.stubEnv("NEXT_PUBLIC_NEWSLETTER_FORM_ACTION", "https://newsletter.example.test/subscribe");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 400 }));
    renderNewsletter();

    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "person@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Subscribe" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Subscription failed");
    expect(screen.queryByText(/Your request is recorded/)).not.toBeInTheDocument();
  });

  it("prevents duplicate provider requests while the first request is pending", async () => {
    vi.stubEnv("NEXT_PUBLIC_NEWSLETTER_FORM_ACTION", "https://newsletter.example.test/subscribe");
    let resolveRequest!: (response: { ok: boolean; status: number }) => void;
    const request = vi.fn(
      () => new Promise<{ ok: boolean; status: number }>((resolve) => {
        resolveRequest = resolve;
      }),
    );
    vi.stubGlobal("fetch", request);
    renderNewsletter();

    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "person@example.com" },
    });
    const submit = screen.getByRole("button", { name: "Subscribe" });
    fireEvent.click(submit);
    await waitFor(() => expect(screen.getByRole("button", { name: "Submitting…" })).toBeDisabled());
    fireEvent.click(screen.getByRole("button", { name: "Submitting…" }));

    expect(request).toHaveBeenCalledOnce();

    resolveRequest({ ok: true, status: 200 });
    await waitFor(() => expect(screen.getByText("Submission received. Check your inbox for the confirmation email.")).toBeInTheDocument());
  });
});
