# Manual UX Audit — FinTech Atlas

> Executed **2026-08-15** against the live origin
> `https://harshit-sehgal.github.io/fintech-atlas` (issue #18). Covers
> cross-browser, slow-connection, mobile, and screen-reader-oriented semantic
> checks. The automated suites (89 e2e incl. keyboard + axe on 47 routes —
> 31 light + 16 dark) remain the primary gates; this report records the
> manual/live pass.

## 1. Cross-browser smoke (Playwright, live origin, 2026-08-15)

Browsers: Chromium (current) + Firefox 153.8 (fresh install). WebKit could not
run on this machine (missing system library `libwoff2dec.so`; not a site
defect — the same suite passes Chromium/Firefox and WebKit is exercised in CI
once configured).

| Route | Chromium | Firefox | Notes |
| --- | --- | --- | --- |
| `/` | ok | ok | 1 H1, main landmark, nav, 0 console errors, 0 page errors |
| `/companies/` | ok | ok | same |
| `/articles/` | ok | ok | cold Chromium 11.3 s to networkidle; Firefox 4.7 s (asset caching) |
| `/tools/remittance` | ok | ok | interactive tool renders |
| `/glossary/` | ok | ok | |
| `/compare/` | ok | ok | cold Chromium 19.7 s networkidle (motion-heavy); subsequent loads fast; LCP lab 1 s |

No rendering, layout, or console differences between engines on any route.

## 2. Mobile viewport (Moto G4 360×640, Chromium)

| Route | Result |
| --- | --- |
| `/` | Initial scrollWidth > viewport traced to the logo marquee strip; **false positive** — parent `.marquee-mask` has `overflow: hidden` and the page is not scrollable horizontally (`scrollLeft` forced to 500 reads back 0). No user-visible overflow |
| `/tools/remittance` | ok |
| `/companies/` | ok |

## 3. Slow connection (400 KB/s, 300 ms latency, Chromium CDP)

| Route | Result |
| --- | --- |
| `/` | Rendered, interactive, 0 errors |
| `/companies/` | Rendered, interactive, 0 errors (largest asset set; ~6.7 s to networkidle) |

Service worker + hashed assets keep repeat visits fast; no blocking third-party
requests on any route (the analytics script loads only when configured).

## 4. Screen-reader-oriented semantic pass (home, live)

| Check | Result |
| --- | --- |
| Landmarks | `header`, `nav[aria-label="Primary"]`, `main`, `form`, `footer` — correct roles present |
| Heading hierarchy | H1 → H2 → H3, no skips on home |
| Images | 75 imgs, **0 missing alt** |
| `aria-hidden` | 161 (logo-marquee duplicate copy + decorative icons — intentional, verified axe-clean) |
| Skip link | `a[href="#main-content"]` present and keyboard-verified by the e2e keyboard suite |
| Duplicate marquee copy | Rendered as non-link spans (no extra tab stops/announcements; axe rule-compliant) |
| CountUp announcement | Final value only (animated digits aria-hidden, sr-only twin) |

## 5. Manual walkthrough guide (operator, NVDA/VoiceOver — not run here)

The site is Linux-only in this environment, so a live NVDA/VoiceOver session
was not possible. Run this checklist once on a Windows/macOS machine:

1. Home: Tab from skip link → nav → search pill → main heading → marquee links → tool CTAs. Confirm focus rings at every stop (the unlayered `:focus-visible` rule).
2. `/tools/matchmaker`: complete the quiz with keyboard only (radio groups, Enter, arrow keys) and confirm the result announces.
3. `/tools/remittance`: change currency with arrow keys; confirm the recalculated amount is announced (sr-only live region).
4. `/companies/razorpay`: Tab through CTAs; confirm `rel="sponsored"` links are distinguishable and the CTA announces as a link.
5. Dark theme: toggle theme, repeat 1–4 (axe dark pass is automated; confirm contrast holds in a real screen reader).
6. Changelog + articles: verify "Related guides" grid and breadcrumbs announce sensibly.

## 6. Verdict

No user-facing defects found in the live pass. The single suspicious metric
(mobile horizontal overflow) is a clipped-animation false positive. WebKit and
real screen-reader passes are the only outstanding items, both environment-bound
and documented for the operator.