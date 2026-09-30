import type { ReactNode } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";

export function LegalPage({
  eyebrow,
  title,
  description,
  effectiveDate,
  pathname,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  effectiveDate: string;
  /** Route this legal document is served at — the breadcrumb trail's last hop. */
  pathname: string;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl px-5 py-20 md:py-28">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: title, href: pathname },
        ]}
      />
      <header className="border-b border-[var(--border-color)] pb-8">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--foreground)] md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--muted-text)]">
          {description}
        </p>
        <p className="mt-4 text-xs text-[var(--muted-text)]">
          Effective {effectiveDate}
        </p>
      </header>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-[var(--muted-text)]">
        {children}
      </div>

      <nav aria-label="Legal pages" className="mt-12 border-t border-[var(--border-color)] pt-6 text-xs">
        <Link className="text-[var(--accent)] hover:underline" href="/about">
          Methodology & disclaimer
        </Link>
        <span className="mx-2 text-[var(--muted-dim)]" aria-hidden="true">·</span>
        <Link className="text-[var(--accent)] hover:underline" href="/privacy">
          Privacy
        </Link>
        <span className="mx-2 text-[var(--muted-dim)]" aria-hidden="true">·</span>
        <Link className="text-[var(--accent)] hover:underline" href="/terms">
          Terms
        </Link>
      </nav>
    </article>
  );
}
