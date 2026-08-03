# FinTech Atlas — Monetization Plan

> Strategy for turning FinTech Atlas from a static educational site into a
> revenue-generating property, while preserving the editorial trust that makes
> it worth linking to. This is the living plan; implementation lives in
> [PARTNER-PLAYBOOK.md](./PARTNER-PLAYBOOK.md) and the phased roadmap below.

---

## Core principle

**Trust is the product.** FinTech Atlas earns money *because* it's an
independent, well-sourced guide — the moment ratings or rankings can be bought,
traffic (and therefore revenue) dies. Every monetization lever below is designed
to keep editorial content independent and commercial inventory loudly disclosed.

---

## Phase 0 — Foundation & trust (prerequisite; do first)

> You cannot convert readers you don't have, and you cannot be trusted with
> stale, uncited financial data. This phase is not revenue; it is the license
> to earn.

- [x] Provenance validation engine (`src/data/provenance.ts`) — accepts ISO dates,
      whitelists `supports` fields, rejects unknown source IDs.
- [x] Migrate all 41 companies from legacy `sources: string[]` to structured
      `sourceReferences[]` with `publisher`, `accessedAt`, `effectiveAt`,
      `sourceType`, and `supports`. **Coverage: 41/41 (100%).** Track with
      `scripts/check-provenance.ts` (`npm run check:provenance`).
- [ ] **Re-verify** each migrated reference (currently official-site + aggregator
      labels structured from the legacy `sources`); add fresh $/fee/employee/valuation
      figures with `effectiveAt` as they are re-checked.
- [ ] Refresh stale figures (valuations, employee counts, pricing) against the
      sources; bump `DATA_AS_OF` in `src/lib/site-config.ts`.
- [ ] Open Graph / social previews for every company (SEO asks for it, trust
      rewards it).
- [ ] Legal review placeholders: affiliate disclosure, FTC-style disclosure
      language, tax treatment of commissions (see Phase 1).

**Why first:** a single stale or invented figure is a trust landmine that
poisons the whole funnel this plan depends on.


---

## Phase 1 — Activate the affiliate rails (first money; keep it static)

> The code already contains the affiliate plumbing (`PartnerOffer`,
> `resolvePartnerCta`, `partnerRel` with `rel="sponsored"`, `trackCtaClick`).
> Phase 1 is: enroll in programs, fill in real URLs, and let the existing
> machinery render disclosed CTAs.

### 1.1 Enroll in affiliate programs (see [PARTNER-PLAYBOOK.md](./PARTNER-PLAYBOOK.md))
Priority order by expected payout × conversion fit:
1. **Wise** (public affiliate via partner portals; strong FX intent)
2. **Revolut**, **Payoneer**, **MoneyGram** (cross-border / remittance intent)
3. **Chime**, **Monzo**, **N26**, **SoFi**, **Robinhood** (consumer banking)
4. **Stripe**, **Square**, **PayPal**, **Adyen** (B2B; many run partner/referral
   programs rather than public affiliates — requires outreach)
5. **Affirm**, **Klarna** (BNPL, if program terms allow)

### 1.2 Wire the CTAs
- In `src/data/partners.ts`, set `ctaUrl` to the tracked affiliate URL and
  `relationship: "affiliate"` for each enrolled program.
- The company profile page already renders a `Visit X` button that:
  - uses `resolvePartnerCta` (appends UTM params, never clobbers network params),
  - sets `rel="sponsored noopener noreferrer"` when commercial,
  - fires `trackCtaClick`, and
  - shows an earnings disclosure when the link is commercial.
- Add matching CTAs to the high-intent tool pages (fee calculator, remittance,
  matchmaker) via `PartnerCtaPlacement` (`"fee-calculator"`, `"remittance"`,
  `"matchmaker"`, `"compare"`) — these are where purchase intent is highest.
  **[DONE] All placements are wired** through the reusable `PartnerCta`
  component (`src/components/ui/partner-cta.tsx`): company profile,
  fee-calculator, remittance, matchmaker, compare, and articles.
- **[DONE] Centralized disclosure:** `COMMERCIAL_DISCLOSURE` in
  `src/lib/partners.ts` is rendered by `PartnerCta` and the company profile,
  keeping all affiliate notices in one place.
- **[DONE] Honesty gate:** the test suite (CI) asserts every commercial offer
  resolves to `rel="sponsored"` + the disclosure via `commercialLinksRemainDisclosed()`.
- **Remaining (needs your affiliate accounts):** set real `ctaUrl`
  + `relationship: "affiliate"` in `src/data/partners.ts`.

### 1.3 Measurement
- Stand up privacy-friendly analytics (Plausible / Fathom) via
  `NEXT_PUBLIC_ANALYTICS_DOMAIN`. `src/lib/analytics.ts` already fires
  `cta_click` with company + placement + relationship.
- Add a `scripts/check-partner-links.mjs` gate asserting every commercial CTA
  has `rel="sponsored"` and a disclosure — keeps monetization honest as it grows.

### KPIs
Outbound CTA click-through on company profiles ≥ 2–4%; affiliate conversion on
tools pages ≥ 5–8%; zero undisclosed commercial links (hard gate).

---

## Phase 2 — Turn the SEO machine into traffic (the growth engine)

> This is the only durable, compounding traffic source for a site like this.
> SEO is already a strength (canonicals, JSON-LD, sitemap, headings). Lean in.

- Publish long-tail, money-adjacent topics: "Stripe vs Adyen fees 2026",
  "How much does Wise charge to send money to India?", "Square vs PayPal for
  small business". These rank and convert to affiliate clicks.
  **[SCAFFOLD DONE]** A data-driven article system is in place (`src/data/articles.ts`
  + `/articles/[slug]` SSG with full metadata, Article JSON-LD, related-profile
  internal links, and CTAs). Add new articles by appending to the catalog.
  A seed article ("Stripe vs Adyen fees") ships as an example. **Remaining:**
  write/commission more articles and add an Articles link in the site nav.
- Programmatic pages: per-route/tool landing pages with each interactive tool
  getting a dedicated indexable URL.
- Internal linking from tool pages → company profiles → CTA.
- Refresh cadence: fee/FX rates age fast; the incident runbook already defines
  a rate-snapshot freshness gate — reuse it as a "content fresh" signal.

### KPI
Grow from ~0 to ≥10k sessions/mo of commercial-intent traffic within 6–12 months.

---

## Phase 3 — Capture the audience (compound the value)

- **[SCAFFOLD DONE]** Email opt-in is built and live in the site footer
  (`src/components/ui/newsletter-opt-in.tsx`): privacy-first, no third-party
  script loaded, stores intent locally until a provider is wired, then submits
  to `NEXT_PUBLIC_NEWSLETTER_FORM_ACTION` (Buttondown/ConvertKit/Mailchimp) with
  one env change. No cookies, no tracking pixels, clear unsubscribe language.
- **[SCAFFOLD DONE → LIVE]** 8 SEO articles now ship in `src/data/articles.ts`
  (Stripe vs Adyen, Wise vs Revolut, Stripe vs PayPal, Affirm vs Klarna, Best
  neobanks, Coinbase vs Robinhood, Best gateway for small business), each with
  Article JSON-LD, related-profile internal links, and commercial CTAs —
  sitemap grew to 75 URLs. Add more by appending to the catalog.
- **[DONE] Affiliate Disclosure page** — `/affiliate-disclosure` (FTC-style,
  matches the About FAQ reference), linked from the footer, indexable in the
  sitemap, covered by e2e.
- **Remaining (needs you):** choose a newsletter provider and set
  `NEXT_PUBLIC_NEWSLETTER_FORM_ACTION`; commission/author more articles; build
  a real send cadence.

---

## Phase 4 — At scale, unlock premium

Only after consistent traffic and a tracked audience:
1. **Sponsored listings** — set `sponsored: true`/`priority` on
   `PartnerOffer`; the featured rail and `sponsoredLabel` badge already exist.
   Sell to fintech marketing teams; always labeled.
2. **Premium tier (paid)** — gate the advanced matchmaker/compare/export
   features behind a subscription. **Requires introducing a backend + payments**
   (intentionally deferred — conflicts with static-only architecture).
3. **B2B lead-gen / data licensing** — package the curated, sourced catalog as
   a dataset or sell qualified leads to fintech sales teams. Highest per-deal
   value; needs the Phase 0 provenance migration completed to be credible.

---

## Model selection guide

| Model | Fit | Realistic $ | Effort | When |
|---|---|---|---|---|
| Affiliate + sponsored | Excellent (code exists) | Medium–High | Low | Phase 1 (now) |
| Display ads (Ezoic/AdSense) | Easy | Low | Very low | after Phase 2 traffic |
| Newsletter | Medium | Medium (recurring) | Medium | Phase 3 |
| Paid SaaS tier | Needs backend | High | High | Phase 4 |
| B2B lead-gen / data license | Good | Highest per deal | Medium | Phase 4 |

---

## Risks & guardrails

- **Trust erosion:** undisclosed or bought ratings destroy the site. Mitigated by
  the `rel="sponsored"` gate, loud disclosure, and separating commercial config
  from editorial data (`src/data/partners.ts` vs `src/data/companies.ts`).
- **Compliance:** commission disclosure (FTC-style), tax handling, and terms-of-
  use updates all documented in [PARTNER-PLAYBOOK.md](./PARTNER-PLAYBOOK.md).
- **Program revocation:** affiliate links are credentials; keep them out of
  public git where possible, and let the playbook document renewal/termination
  handling.

