"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { DATA_AS_OF } from "@/lib/site-config";

const faqs = [
  {
    q: "Is FinTech Atlas affiliated with any of the companies listed?",
    a: "FinTech Atlas is an independent educational guide: editorial ratings, pricing comparisons, and profiles are written without payment from the companies listed, and are never sold in exchange for favorable coverage. To keep the site free, some outbound links are affiliate links (disclosed on the relevant pages, including on this site's Affiliate Disclosure), and we may accept sponsored placements that are always clearly labeled as such. Independent editorial content is kept separate from any commercial inventory."
  },
  {
    q: "How is FinTech Atlas funded?",
    a: "We may earn a commission when you make a purchase or sign up through affiliate links to listed companies — at no extra cost to you. We may also run clearly-labeled sponsored placements. Our editorial methodology, ratings, and fee comparisons are independent of these arrangements; a commercial relationship never buys a rating, a ranking, or an editorial claim."
  },
  {
    q: "Where is your affiliate disclosure?",
    a: "Affiliate links and sponsored placements are disclosed in three places: this About page, our Privacy Notice, and a per-page disclosure notice shown beneath any commercial partner link (including on company profiles). Links that may earn us a commission use the HTML rel=\"sponsored\" attribute."
  },
  {
    q: "How accurate is the fee pricing data?",
    a: `Pricing data is updated regularly based on published standard rates (${DATA_AS_OF}). Keep in mind that high-volume merchants often receive custom interchange++ rates or negotiated tier discounts.`
  },
  {
    q: "How do your interactive calculators work?",
    a: "Our Fee Estimator and FX Remittance tools use illustrative published-rate assumptions (for example, Stripe 2.9%+$0.30 and a Wise-style percentage fee). They simulate costs dynamically based on your inputs, but do not provide route-specific or contractual quotes. Pricing assumptions are labeled with the catalog period " + DATA_AS_OF + "."
  }
];

export function AboutClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="relative mx-auto max-w-4xl px-5 py-20 md:py-28">
      <GridBackdrop />

      <SectionHeading
        headingLevel={1}
        eyebrow="Behind the Atlas"
        title="About & Methodology"
        description="How this platform was built, data sources, and our commitment to objective educational information."
      />

      {/* Purpose & Mission */}
      <Reveal delay={0.1}>
        <section className="mt-10 space-y-6 text-sm leading-relaxed text-[var(--muted-text)]">
          <div className="surface rounded-2xl border border-[var(--border-color)] p-6 space-y-3">
            <h2 className="text-lg font-bold text-[var(--foreground)]">Our Mission</h2>
            <p className="text-[var(--foreground)]">
              FinTech Atlas was created to demystify financial software. Financial technology can often feel shrouded in jargon, hidden FX markups, and complex API pricing. We build transparent calculators, plain-language guides, and objective benchmarks so consumers, developers, and founders can make informed decisions.
            </p>
          </div>

          <div>
            <h2 className="eyebrow !text-[var(--muted-text)] !tracking-widest border-b border-[var(--border-color)] pb-2 pt-4 text-lg font-bold text-[var(--foreground)]">
              Data Sources & Synthesizing Methodology
            </h2>
            <p className="mt-3">The information across our company profiles, tool calculators, and glossary is compiled from:</p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 text-xs reveal-stagger">
              {[
                "Official SEC Filings (10-K, 20-F) & Official Company Docs",
                `CNBC & Statista World's Top Fintech Companies ${DATA_AS_OF.split(" ")[1] || "2026"}`,
                "Forbes Fintech 50 Directory",
                "apiscout.dev — Payment API benchmarks",
                "neobanks.guide — Neobank features & FDIC data",
                "comparepsp.com — Foreign Exchange fee models",
                "Review platforms such as Trustpilot, App Store, and G2 (where referenced)",
                "Community discussions used as editorial context, where referenced",
              ].map((src) => (
                <li key={src} className="flex items-center gap-2 surface rounded-lg border border-[var(--border-color)] p-3 hover:border-[var(--accent)]/30 transition-colors">
                  <span className="text-success-text font-bold">✓</span>
                  <span className="text-[var(--foreground)]">{src}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Guarantees */}
          <div>
            <h2 className="eyebrow !text-[var(--muted-text)] !tracking-widest border-b border-[var(--border-color)] pb-2 pt-6 text-lg font-bold text-[var(--foreground)]">
              Our Guarantees
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3 reveal-stagger">
              {[
                { icon: "🛡️", title: "No Paid Bias", desc: "No company can pay to rank higher or receive a positive review." },
                { icon: "📊", title: "Transparent Math", desc: "Our fee calculators show raw mathematical breakdowns with no hidden numbers." },
                { icon: "📖", title: "No Jargon", desc: "Every complex financial term has interactive glossary cross-references." },
              ].map((g) => (
                <div key={g.title} className="surface rounded-xl border border-[var(--border-color)] p-5 card-glow group">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-glow)] text-2xl group-hover:scale-110 transition-transform duration-300">{g.icon}</span>
                  <h3 className="mt-3 text-sm font-bold text-[var(--foreground)]">{g.title}</h3>
                  <p className="mt-1 text-xs text-[var(--muted-text)] leading-relaxed">{g.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* FAQ Accordion */}
      <Reveal delay={0.2}>
        <section className="mt-16 space-y-4" id="faq">
          <h2 className="text-xl font-bold tracking-tight border-b border-[var(--border-color)] pb-3">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="surface rounded-xl border border-[var(--border-color)] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-4 text-left text-sm font-bold text-[var(--foreground)] hover:text-[var(--accent)] focus-visible:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-[var(--ring)] rounded-xl transition-colors"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                  >
                    <span>{faq.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="text-xs font-mono text-[var(--muted-text)]"
                      aria-hidden="true"
                    >
                      ▾
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                        id={`faq-answer-${idx}`}
                        role="region"
                      >
                        <div className="border-t border-[var(--border-color)] px-4 py-3 text-xs leading-relaxed text-[var(--muted-text)]">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>
      </Reveal>

      {/* Feedback status */}
      <Reveal delay={0.25}>
        <section className="surface mt-16 rounded-2xl border border-[var(--border-color)] p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[var(--foreground)]">Have Feedback or Suggestions?</h2>
          <p className="mt-1 text-xs leading-relaxed text-[var(--muted-text)]">
            This is a static demo with no in-app contact form. Please open a GitHub issue for product
            feedback, or use private vulnerability reporting for security concerns (see{" "}
            <code className="text-[var(--foreground)]">SECURITY.md</code>).
          </p>
          <a
            href="https://github.com/Harshit-sehgal/fintech-atlas/issues/new/choose"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-4 inline-flex text-sm"
          >
            Open a GitHub issue
          </a>
        </section>
      </Reveal>

      {/* Disclaimer */}
      <Reveal delay={0.3}>
        <section className="mt-16 text-xs text-[var(--muted-text)] border-t border-[var(--border-color)] pt-6 space-y-2" id="disclaimer">
          <h3 className="font-bold text-[var(--foreground)] uppercase tracking-wider font-mono">Educational Disclaimer</h3>
          <p>
            FinTech Atlas is an educational resource. All logos and product names are trademarks of their respective owners. Information reported is based on data as of {DATA_AS_OF}. Always verify directly with official product documentation before making financial or engineering decisions.
          </p>
        </section>
      </Reveal>
    </div>
  );
}

