import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import "@/test/mocks";
import { ToastProvider } from "@/lib/toast-context";
import { NewsletterOptIn } from "./newsletter-opt-in";

const share = vi.hoisted(() => ({ loadToolState: vi.fn() }));
vi.mock("@/lib/share", () => ({
  saveToolState: vi.fn(),
  loadToolState: share.loadToolState,
}));

const renderIt = () =>
  render(
    <ToastProvider>
      <NewsletterOptIn />
    </ToastProvider>,
  );

const submit = (email: string) => {
  fireEvent.change(screen.getByLabelText("Email address"), { target: { value: email } });
  fireEvent.click(screen.getByRole("button", { name: "Subscribe" }));
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("NewsletterOptIn branches", () => {
  it("rejects an invalid email with an error toast", async () => {
    vi.stubEnv("NEXT_PUBLIC_NEWSLETTER_FORM_ACTION", "");
    renderIt();
    submit("not-an-email");
    expect(await screen.findByRole("alert")).toHaveTextContent("valid email");
  });

  it("keeps the form when the local read-back is empty", () => {
    vi.stubEnv("NEXT_PUBLIC_NEWSLETTER_FORM_ACTION", "");
    share.loadToolState.mockReturnValue(null);
    renderIt();
    submit("person@example.com");
    expect(screen.getByRole("button", { name: "Subscribe" })).toBeInTheDocument();
  });

  it("shows the local-saved notice when the intent is read back", () => {
    vi.stubEnv("NEXT_PUBLIC_NEWSLETTER_FORM_ACTION", "");
    share.loadToolState.mockReturnValue({ email: "person@example.com" });
    renderIt();
    submit("person@example.com");
    expect(screen.getByText(/recorded on this device/)).toBeInTheDocument();
  });

  it("reports a provider exception as a failure", async () => {
    vi.stubEnv("NEXT_PUBLIC_NEWSLETTER_FORM_ACTION", "https://newsletter.example.test/subscribe");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));
    renderIt();
    submit("person@example.com");
    expect(await screen.findByRole("alert")).toHaveTextContent("Subscription failed");
  });
});
