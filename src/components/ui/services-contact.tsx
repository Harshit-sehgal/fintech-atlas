"use client";

import { useState } from "react";
import { buildContactIssueUrl } from "@/lib/services-report";

const SERVICE_OPTIONS = [
  "Payment gateway selection audit (basic)",
  "Payment gateway selection audit (detailed)",
  "Payment gateway integration — basic Razorpay checkout",
  "Payment gateway integration — ecommerce",
  "Payment gateway integration — subscription/custom",
] as const;

const BUSINESS_SIZE_OPTIONS = ["Just me / freelancer", "2–10 people", "11–50 people", "51+ people"] as const;

/**
 * Booking/contact form (plan T060). Fully static: submitting opens a
 * prefilled GitHub issue on the site repository — the same channel the
 * footer "Feedback & Issues" link uses, since the site has no backend or
 * published contact email.
 */
export function ServicesContactForm() {
  const [service, setService] = useState<string>(SERVICE_OPTIONS[0]);
  const [businessSize, setBusinessSize] = useState<string>(BUSINESS_SIZE_OPTIONS[0]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ email?: string; message?: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [draftUrl, setDraftUrl] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Enter a valid email address so we can reply.";
    }
    if (message.trim().length < 20) {
      nextErrors.message = "Tell us a bit more — at least 20 characters helps us scope the work.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const url = buildContactIssueUrl({
      service,
      businessSize,
      email: email.trim(),
      message: message.trim(),
    });
    setDraftUrl(url);
    // Popups can be blocked (browser settings, in-app webviews) — window.open
    // returns null then, so only claim success when the draft actually opened.
    const popup = window.open(url, "_blank", "noopener");
    setSubmitted(popup !== null);
  }

  const inputClasses =
    "w-full rounded-lg border border-[var(--border-color)] bg-[var(--background)] px-3.5 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-strong)]";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="svc-service" className="mb-1.5 block text-xs font-semibold text-[var(--foreground)]">
          Service you&apos;re interested in
        </label>
        <select
          id="svc-service"
          className={inputClasses}
          value={service}
          onChange={(e) => setService(e.target.value)}
        >
          {SERVICE_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="svc-size" className="mb-1.5 block text-xs font-semibold text-[var(--foreground)]">
          Business size
        </label>
        <select
          id="svc-size"
          className={inputClasses}
          value={businessSize}
          onChange={(e) => setBusinessSize(e.target.value)}
        >
          {BUSINESS_SIZE_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="svc-email" className="mb-1.5 block text-xs font-semibold text-[var(--foreground)]">
          Email <span className="text-[var(--muted-text)]">(so we can reply)</span>
        </label>
        <input
          id="svc-email"
          type="email"
          autoComplete="email"
          required
          className={inputClasses}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@business.in"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "svc-email-error" : undefined}
        />
        {errors.email && (
          <p id="svc-email-error" role="alert" className="mt-1 text-xs text-[var(--danger-text)]">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="svc-message" className="mb-1.5 block text-xs font-semibold text-[var(--foreground)]">
          What are you trying to do?
        </label>
        <textarea
          id="svc-message"
          required
          rows={4}
          className={inputClasses}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g. We run a D2C store on Shopify, currently on Cashfree, ~₹8L/month — we want a second opinion on fees and settlement."
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "svc-message-error" : undefined}
        />
        {errors.message && (
          <p id="svc-message-error" role="alert" className="mt-1 text-xs text-[var(--danger-text)]">
            {errors.message}
          </p>
        )}
      </div>

      <button type="submit" className="btn-primary w-full">
        Send inquiry
      </button>

      {submitted ? (
        <p role="status" className="text-xs leading-relaxed text-[var(--muted-text)]">
          Your browser opened a <strong className="text-[var(--foreground)]">GitHub issue draft</strong> with
          your inquiry prefilled — press <em>Submit new issue</em> there to send it. Nothing is sent until you
          do; it lands in the site&apos;s public issue tracker.
        </p>
      ) : draftUrl ? (
        <p role="status" className="text-xs leading-relaxed text-[var(--muted-text)]">
          The popup was blocked —{" "}
          <a
            href={draftUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--accent-ink)] underline decoration-[var(--accent)]/40 underline-offset-4 hover:decoration-[var(--accent)]"
          >
            open your prefilled inquiry draft here
          </a>
          . Nothing is sent until you submit it on GitHub.
        </p>
      ) : (
        <p className="text-xs leading-relaxed text-[var(--muted-text)]">
          Submitting opens a prefilled GitHub issue — the site&apos;s public contact channel (no backend, no
          stored data). You can review it before posting; nothing is sent until you hit <em>Submit new issue</em>.
        </p>
      )}
    </form>
  );
}
