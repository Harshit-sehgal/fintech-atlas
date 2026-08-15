# Affiliate & Newsletter Enrollment — FinTech Atlas

> Operator enrollment runbook (issue #20). All code rails exist and are
> disclosed-ready (`PartnerOffer`, `resolvePartnerCta`, `rel="sponsored"`,
> `trackCtaClick`, on-device newsletter intent). What is missing is a business
> identity and accounts with the providers. Estimated total effort: 1–2 days.

## 1. Prerequisites (do once)

- [ ] Legal identity + tax details (GST/PAN for India-based payouts; W-8BEN for US payers) — see monetization-plan § legal placeholders
- [ ] Publish the affiliate disclosure page update: `src/app/affiliate-disclosure/page.tsx` exists — add the enrolled program names
- [ ] Decide the newsletter provider (list below) and set its form endpoint
- [ ] Set `NEXT_PUBLIC_NEWSLETTER_FORM_ACTION` + `NEXT_PUBLIC_WAITLIST_ENDPOINT` (`.env.example` documents both; UI stays hidden until set)

## 2. Affiliate programs — priority order (from monetization-plan § 1.1)

| # | Provider | Program type | Notes |
| --- | --- | --- | --- |
| 1 | Wise | Public affiliate (partner portals) | Strongest FX intent match; highest priority |
| 2 | Revolut, Payoneer, MoneyGram | Public affiliate | Cross-border/remittance intent |
| 3 | Chime, Monzo, N26, SoFi, Robinhood | Public affiliate | Consumer banking pages |
| 4 | Stripe, Square, PayPal, Adyen | Partner/referral outreach | Many are invite-only; requires outreach |
| 5 | Razorpay, Cashfree, PhonePe | India-fintech affiliate/referral | Verify program existence + India payout rules before applying |

Application checklist per program:
- [ ] Approved URL = `https://harshit-sehgal.github.io/fintech-atlas` (or the future custom domain — **wait for the domain if the program requires HTTPS on a top-level domain**)
- [ ] Confirm disclosure requirement language matches `affiliate-disclosure/page.tsx`
- [ ] After approval: fill `trackingId` on the relevant `PartnerOffer` entries (the code reads them; no code change needed) — see `PARTNER-PLAYBOOK.md`
- [ ] Add the program to the disclosure page + changelog entry

## 3. Newsletter provider decision

| Provider | Static-friendly? | Notes |
| --- | --- | --- |
| Buttondown | Yes (API-only, no JS) | Lowest friction for a static site; form posts to its endpoint |
| ConvertKit/Kit | Yes | Popular with indie content sites; requires JS embed or API |
| Mailchimp | Yes (embedded form) | Heavier branding; fine at this scale |
| Beehiiv / Substack | Yes | Newsletter-native platforms; can host archive off-site |

Recommended default: **Buttondown** (or Kit). The current UI keeps the email
intent on-device until `NEXT_PUBLIC_NEWSLETTER_FORM_ACTION` is set — after
enrollment, flip the env var and rebuild (static export → env vars are
build-time).

## 4. After enrollment (revenue hygiene)

- [ ] Add `rel="sponsored"` audit: `resolvePartnerCta` already emits it; verify in browser on 3–4 profiles
- [ ] Verify `trackCtaClick` fires with the real `trackingId` (analytics must be configured first — see `ISSUES-AND-GAPS.md` row for the analytics wiring: outbound_click + tool events are implemented; enable `NEXT_PUBLIC_ANALYTICS_DOMAIN` with Plausible)
- [ ] Log every payout contract (GST invoicing if Indian entity)
- [ ] Quarterly: re-check program terms; update disclosure page if a program is added or dropped