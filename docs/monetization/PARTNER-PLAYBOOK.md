# Affiliate & Sponsor Playbook

> Operational guide for activating the money rails in FinTech Atlas. Read
> [monetization-plan.md](../monetization-plan.md) first for strategy; this
> document is the step-by-step for going live with a real program, staying
> compliant, and keeping links honest.

---

## 0. The one rule that protects everything

**Never let a commercial relationship buy editorial.** Ratings, pricing
comparisons, and narrative live in `src/data/companies.ts` and are deliberately
separate from commercial config in `src/data/partners.ts`. A paid placement
boughts **inventory placement only** (a labeled `Visit X` CTA / featured rail),
never a rating, a ranking position in the editorial directory, or an editorial
claim.

---

## 1. Enrolling in affiliate programs

Priority order and typical entry points (terms change — verify at signup):

| Company | Typical program | Notes |
|---|---|---|
| Wise | Public affiliate via partner/impact portals | Strong FX intent; easy starter |
| Revolut | Public affiliate program (regional) | Consumer cards/referrals |
| Payoneer | Partner/affiliate program | Cross-border payout intent |
| MoneyGram | Affiliate network program | Remittance intent |
| Chime / Monzo / N26 / SoFi / Robinhood | Consumer card affiliate programs | High volume, lower payout |
| Stripe / Square / PayPal / Adyen | B2B partner/referral (often not public) | Requires outreach to BD |
| Affirm / Klarna | BNPL affiliate (terms vary) | Some disallow contextual comparison |

**Enrollment checklist**
- [ ] Create the affiliate account and read the prohibited-content/terms.
- [ ] Confirm the program permits a **comparison/review directory** (some
      forbid "content that disparages competitors" — keep comparisons factual).
- [ ] Capture the affiliate/referral link and its parameter format.
- [ ] Note payout model (CPL, CPS, CPI) and cookie duration for reporting.

---

## 2. Going live in the code

Everything below is already implemented; you are only adding *configuration*.

1. Open `src/data/partners.ts` → `PRIORITY_OVERRIDES[<slug>]`.
2. Set `ctaUrl` to the **tracked affiliate URL** from your program.
3. Set `relationship: "affiliate"`.
4. Keep `trackingId` stable (used for analytics + UTM campaign).
5. Optional: to feature the partner, add `sponsored: true`, `priority` (lower =
   earlier), and `sponsoredLabel` (e.g. `"Featured partner"`).
6. Redeploy the static export.

The `resolvePartnerCta` mapper already:
- appends `utm_source/medium/campaign/content` **without clobbering** the
  network's own params,
- marks the link `isCommercial` and renders `rel="sponsored noopener
  noreferrer"`,
- fires `trackCtaClick` (company + placement + relationship) for analytics, and
- the company profile shows an earnings-disclosure line beneath any commercial
  CTA.

**Never hard-code a raw affiliate ID into a `companies.ts` record.** Keep it in
`partners.ts` (or better, env-provided) so editorial and commercial stay split.

---

## 3. Disclosure & compliance (do not skip)

- Per-page disclosure is automatic once `relationship` is commercial (the CTA
  block prints the notice). Keep this text present.
- Global disclosure lives on the About page FAQ and the Privacy Notice — both
  already updated. If you change the model, update both together.
- FTC-style guidance: the reader must be able to tell, before clicking, that a
  link may earn money. The on-page notice + `rel="sponsored"` satisfy this.
- Keep a copy of each program's terms and the date you enrolled (audit trail).
- Tax: consult a professional about reporting affiliate income in your
  jurisdiction. This project is not tax advice.

---

## 4. Measuring (privacy-light)

- Set `NEXT_PUBLIC_ANALYTICS_DOMAIN` to a Plausible/Fathom-compatible domain.
- `src/lib/analytics.ts` already encodes `cta_click` events with
  `company`, `placement`, `relationship`, `tracking_id`.
- Track per-company outbound CTR and per-tool conversion. Kill CTAs that
  convert < ~1–2% — they add clutter without revenue.

---

## 5. Hygiene & honesty gates

- [x] Run a check that **every commercial CTA** carries `rel="sponsored"` and a
      visible disclosure (`commercialLinksRemainDisclosed()` is covered by
      `src/lib/partners.test.ts`).
- [x] Keep a public "Affiliate Disclosure" link reachable from the footer;
      the route and footer link are covered by `e2e/app.spec.ts`.
- [ ] Periodically re-verify affiliate links (programs expire/rotate URLs).
- [ ] Remove or re-check any program whose terms change and conflict with this
      site's editorial independence.
