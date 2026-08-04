"use client";

/**
 * Per-page correction reporting link — T013.
 *
 * Opens a pre-filled GitHub issue so visitors can flag stale fees, inaccurate
 * data, or broken sources without needing a GitHub account workflow (the issue
 * form is public). The link is intentionally subtle — an underlined text link
 * rather than a heavy call-to-action — so it is visible when someone looks for
 * it but doesn't distract from the main content.
 */

const GH_REPO_OWNER = "Harshit-sehgal";
const GH_REPO_NAME = "fintech-atlas";

function ghIssueUrl(params: Record<string, string>): string {
  const q = new URLSearchParams(params);
  return `https://github.com/${GH_REPO_OWNER}/${GH_REPO_NAME}/issues/new?${q.toString()}`;
}

export interface CorrectionReportLinkProps {
  /** Human-readable label for the page, e.g. "Stripe profile" or "Razorpay vs Stripe". */
  pageLabel: string;
  /** Relative path on the deployed site, e.g. "/companies/stripe". */
  pagePath: string;
  /** Optional: specific section on the page the reporter is looking at. */
  section?: string;
}

export function CorrectionReportLink({
  pageLabel,
  pagePath,
  section,
}: CorrectionReportLinkProps) {
  const title = section
    ? `Correction: ${pageLabel} — ${section}`
    : `Correction: ${pageLabel}`;

  const body = [
    `**Page:** ${pagePath}`,
    section ? `**Section:** ${section}` : "",
    "",
    "**What is incorrect?**",
    "",
    "**Suggested correction / evidence:**",
    "",
    "---",
    "_Submitted via the on-site correction link. Thank you for helping keep FinTech Atlas accurate._",
  ]
    .filter(Boolean)
    .join("\n");

  const href = ghIssueUrl({
    template: "correction-report.yml",
    title,
    body,
  });

  return (
    <p className="mt-4 text-[11px] leading-relaxed text-[var(--muted-text)]">
      Found incorrect information?{" "}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-[var(--accent)]/40 underline-offset-4 hover:decoration-[var(--accent)] transition-colors"
      >
        Report an issue
      </a>{" "}
      — corrections are reviewed every week.
    </p>
  );
}