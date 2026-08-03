"use client";

/**
 * Newsletter opt-in (Phase 3 of the monetization plan — audience capture).
 *
 * Privacy-first by design:
 *  - No third-party script is loaded until you configure a provider.
 *  - If `NEXT_PUBLIC_NEWSLETTER_FORM_ACTION` is set (e.g. a Buttondown / ConvertKit /
 *    Mailchimp form endpoint), the email is submitted there on subscribe.
 *  - Otherwise the intent is saved to localStorage as a clear stub and the user
 *    is told the newsletter is not connected yet — matching the site's honesty
 *    pattern (see the feedback section on /about). Nothing is sent off-device.
 *
 * This keeps the static architecture intact while making the UX real today and
 * the provider wiring a one-config change later.
 */

import { useState, type FormEvent } from "react";
import { useToast } from "@/lib/toast-context";
import { loadToolState, saveToolState } from "@/lib/share";

const NEWSLETTER_KEY = "newsletter_opt_in";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function NewsletterOptIn() {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const action = process.env.NEXT_PUBLIC_NEWSLETTER_FORM_ACTION?.trim();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    if (action) {
      try {
        // Provider form endpoints typically accept application/x-www-form-urlencoded
        // with an `email` field and support CORS.
        await fetch(action, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ email }).toString(),
        });
        setSubmitted(true);
        showToast("You're subscribed — check your inbox to confirm.", "success");
      } catch {
        showToast("Subscription failed. Please try again later.", "error");
      }
      return;
    }

    // No provider wired yet: persist the intent locally so the UI is real and
    // the operator can migrate stored addresses once a provider is connected.
    saveToolState(NEWSLETTER_KEY, { email, at: new Date().toISOString() });
    const existing = loadToolState<{ email: string } | null>(NEWSLETTER_KEY);
    if (existing) {
      setSubmitted(true);
      showToast(
        "Saved on this device — the newsletter isn't connected yet, so nothing was sent. We'll only email you once a provider is wired and you've confirmed.",
        "success",
      );
    }
  };

  if (submitted) {
    return (
      <p className="text-xs text-[var(--muted-text)]">
        Thanks — you&apos;re on the list. We never share your email, and you can
        unsubscribe anytime.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2" noValidate>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--subtle-bg)]/50 px-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--foreground)]/40"
        />
        <button
          type="submit"
          className="btn-primary shrink-0 text-xs px-4 py-2"
        >
          Subscribe
        </button>
      </div>
      <p className="text-[10px] leading-relaxed text-[var(--muted-text)]">
        Privacy: we store your email only to send the newsletter. No tracking
        pixels, no sharing.{" "}
        {!action &&
          "This newsletter isn't connected to a provider yet — your email is saved on this device only until then. "}
        Unsubscribe anytime.
      </p>
    </form>
  );
}
