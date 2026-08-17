# FinTech Atlas: complete execution plan

FinTech Atlas will not rank simply because it contains dozens of company profiles. Google must first **discover**, **index**, **understand**, and then consider each page more useful and trustworthy than competing results. Google explicitly recommends people-first content, crawlable internal links, descriptive titles, secure/mobile-friendly pages, and original value; following these practices still does not guarantee ranking. ([Google for Developers][1])

For this project, the winning strategy is:

> **Build the best India-focused decision platform for payment gateways and international payments, use calculators and original data to rank, and earn through referrals, implementation services, and eventually sponsors.**

---

# 1. Current position of the repository

## What is already good

The project already has:

* Static Next.js pages that Google can crawl without depending entirely on client-side JavaScript.
* Page metadata, Open Graph tags and a canonical URL framework.
* An automatically generated sitemap and `robots.txt`.
* Structured data validation.
* A GitHub Pages deployment workflow.
* Company profiles, comparison pages, tools and an initial article catalog.
* An affiliate-disclosure page.
* Commercial CTAs separated from editorial company information.
* Security, accessibility and production-readiness documentation.

This is a much stronger technical foundation than a normal new content website.

## What currently prevents growth

### The positioning is too broad

The homepage currently describes FinTech Atlas as:

> “A clear, plain-language guide to the FinTech industry.”

That does not target a specific user problem or high-intent search.

A user searching “what is fintech” is far less likely to generate revenue than someone searching:

* Razorpay vs Cashfree
* Best payment gateway for Indian SaaS
* Payoneer fees India
* Receive USD in India
* Wise vs Payoneer for Indian freelancers

### The current articles are too generic

The initial content covers global topics such as Stripe vs Adyen, Wise vs Revolut, Stripe vs PayPal and neobanks. Some pages use illustrative, manually maintained figures without claim-level citations.

Current results for searches such as “Razorpay vs Stripe India” and “Wise vs Payoneer India” already contain many recently published comparison pages. Generic summaries will therefore struggle. Your advantage must be **original calculators, India-specific scenarios, evidence, testing and transparent methodology**. This is an inference from the current competitive results. ([Big Helpers Software and Solutions][2])

### Revenue is not active

Every configured partner currently has `relationship: "none"`. The buttons direct users to official websites, but no tracked affiliate relationship is active yet.

### Correctness pass completed locally

The FIRE result now converts monthly compounding periods to years before display. The retirement calculator separates accumulation and retirement returns and accepts existing retirement savings. SWP indefinite results are explicitly qualified as fixed-return assumptions. Exact-value tests cover these paths; independent professional review remains outside repository verification.

Because financial topics can significantly affect users, Google’s guidance places unusually strong emphasis on trust, evidence, expertise and accuracy for this kind of content. ([Google for Developers][3])

### Newsletter provider remains an operator task

The newsletter implementation now checks `response.ok`, prevents duplicate submissions while a request is pending, and clearly distinguishes a real provider submission from on-device intent storage. Provider selection, double opt-in, unsubscribe handling, consent records, and delivery cadence still require an operator/provider decision.

### GitHub Pages is live, custom domain still pending

The site is deployed and verified at:

```text
https://harshit-sehgal.github.io/fintech-atlas
```

The deploy workflow builds with `NEXT_PUBLIC_BASE_PATH=/fintech-atlas` (applied to Next routing, public asset helpers, PWA manifest and service-worker URLs), and live-host checks are green (T022 complete, 2026-08-13). GitHub Pages cannot apply `_headers` (HSTS only, no per-page CSP headers — the per-page `<meta>` CSP covers this host) and has no redirects from a bare `www` or alternate host. The cleaner long-term solution remains a dedicated custom domain at the root (T019–T021, operator action).

---

# 2. How the website will rank

Think of Google growth as five sequential gates.

## Gate 1: Discovery

Google must find the website through:

* A public domain
* Crawlable internal links
* A submitted sitemap
* External links from other websites
* Google Search Console

A sitemap helps discovery, particularly for a new website with few external links, but does not guarantee crawling or indexing. ([Google for Developers][4])

## Gate 2: Indexing

Each page must provide:

* A successful `200` response
* A unique canonical URL
* Indexable HTML
* Unique and useful content
* No accidental `noindex`
* No conflicting canonical
* No duplicate URL variants

Use Search Console’s URL Inspection and Page Indexing reports to identify pages that Google discovered but decided not to index. ([Google for Developers][5])

## Gate 3: Relevance

Each page must answer one identifiable search intent.

For example:

| Page                           | Primary intent                            |
| ------------------------------ | ----------------------------------------- |
| Razorpay fee calculator        | Calculate gateway deductions              |
| Razorpay vs Stripe India       | Choose between two gateways               |
| Receive USD in India           | Find a legal, affordable receiving method |
| Payoneer fees India            | Understand Payoneer’s complete cost       |
| Payment gateway for SaaS India | Select a gateway for subscriptions        |

The title, H1, opening answer, headings, tables and internal-link text should naturally use the language real searchers use. Google explicitly recommends placing relevant terms in titles, headings, alt text and link text. ([Google for Developers][1])

## Gate 4: Quality and trust

This is where FinTech Atlas must outperform other affiliate websites.

Each ranking page should provide at least one form of original value:

* A working calculator
* A reproducible fee comparison
* Tested signup or payment flow
* Original screenshots
* Region-specific eligibility details
* Settlement-time comparison
* Source-linked claims
* Effective dates
* An explicit methodology
* A scenario-based recommendation

Google considers affiliate pages low-quality when they merely copy provider descriptions. It explicitly says useful affiliate websites can add value through original reviews, testing, comparisons, pricing information and navigation. ([Google for Developers][6])

## Gate 5: Authority

Google needs independent evidence that other people find the website useful.

Authority comes from:

* Genuine backlinks
* Mentions in communities
* Calculator embeds
* Original reports
* GitHub stars and technical references
* Links from agencies, accountants, startup communities and colleges
* Branded searches for “FinTech Atlas”

Do not buy backlinks or exchange large numbers of artificial links.

---

# 3. Strategic positioning

## Recommended audience

Focus first on:

1. Indian freelancers receiving international payments
2. Indian SaaS and ecommerce businesses choosing payment gateways
3. Developers integrating payment gateways for clients
4. Small agencies working with international customers

## Recommended homepage proposition

Replace the broad industry-guide positioning with something like:

> **Compare payment gateways and international payment services for India. Calculate real fees, settlement amounts and provider differences before choosing.**

Primary homepage CTAs:

* Compare payment gateways
* Calculate international payment costs
* Find the right provider

The company directory can remain, but it should support the tools rather than being the main product.

---

# 4. Master task backlog

## Phase 0 — Correctness and trust

These are release blockers.

| ID   | Task                                      | Completion requirement                                                         |
| ---- | ----------------------------------------- | ------------------------------------------------------------------------------ |
| T001 | Fix FIRE month/year error                 | Every monthly result is divided by 12 before display                           |
| T002 | Add exact FIRE tests                      | Known examples assert expected values, not merely `> 0`                        |
| T003 | Separate retirement returns               | Use accumulation return and retirement return as distinct inputs               |
| T004 | Add existing retirement savings           | Current corpus reduces required future contributions                           |
| T005 | Correct SWP wording                       | Replace “Indefinitely” with assumption-qualified wording                       |
| T006 | Add calculator methodology                | Every calculator exposes formula, assumptions and exclusions                   |
| T007 | Add calculation test matrix               | Zero return, zero contribution, extreme values and rounding covered            |
| T008 | Validate all payment fee formulas         | Verify domestic, international, fixed, percentage and tax components           |
| T009 | Audit every company’s ownership status    | Public, private, acquired and subsidiary statuses verified                     |
| T010 | Audit every company’s availability        | Record supported countries and unavailable regions                             |
| T011 | Verify every financial figure             | Source URL, effective date and access date required                            |
| T012 | Remove unsourced ratings                  | Replace review-like scores with transparent editorial criteria                 |
| T013 | Add correction reporting                  | Every company/article has “Report incorrect information”                       |
| T014 | Create editorial methodology              | Explain sourcing, scoring, updating and commercial independence                |
| T015 | Add named author information              | Every article names its responsible author                                     |
| T016 | Add professional review workflow          | Tax, FEMA, RBI and legal content reviewed by a qualified professional          |
| T017 | Define update expiry rules                | Fees expire after 30–60 days; ownership and availability periodically reviewed |
| T018 | Prevent stale content silently publishing | CI warns or fails when high-risk data exceeds its expiry                       |

**Phase complete when:** no known high-severity calculation or factual errors remain.

---

## Phase 1 — Production deployment

| ID   | Task                                          | Completion requirement                                                           |
| ---- | --------------------------------------------- | -------------------------------------------------------------------------------- |
| T019 | Choose a dedicated domain                     | Site runs at one permanent root-domain version                                   |
| T020 | Configure DNS and HTTPS                       | HTTPS works without certificate warnings                                         |
| T021 | Set production `SITE_URL`                     | No placeholder or GitHub subdirectory canonical                                  |
| T022 | Fix GitHub Pages path handling or change host | All assets, routes and canonicals work from production                           |
| T023 | Choose one canonical host                     | Redirect `www` to non-`www`, or the reverse                                      |
| T024 | Verify every canonical                        | Canonical matches the publicly accessible URL                                    |
| T025 | Verify `robots.txt`                           | Public pages allowed; private browser-only pages excluded                        |
| T026 | Verify the sitemap                            | Contains only canonical, indexable URLs                                          |
| T027 | Correct sitemap `lastmod`                     | Use each article/data page’s actual significant update date                      |
| T028 | Remove sitemap `priority` dependency          | Done: generated sitemap omits the obsolete `priority` element                |
| T029 | Verify security headers                       | CSP, HSTS and other generated headers present on live responses                  |
| T030 | Run clean CI                                  | Typecheck, lint, tests, build, E2E and audit all pass                            |
| T031 | Enable branch protection                      | `main` cannot accept changes with failed required checks                         |
| T032 | Create preview deployments                    | Every pull request gets a testable preview                                       |
| T033 | Perform rollback drill                        | Restore the last known-good deployment successfully                              |
| T034 | Configure uptime monitoring                   | Set the `DEPLOYMENT_URL` repository variable and verify scheduled alerts       |
| T035 | Test real 404 behaviour                       | Missing pages return correct status and no indexable soft-404                    |

The sitemap uses article `updatedAt` values for article pages and the build date for generated non-article pages. Google says `<lastmod>` should represent the last significant page update and may use it only when it is consistently accurate. The generated sitemap now omits the obsolete `priority` element, which Google states is ignored. ([Google for Developers][7])

---

## Phase 2 — Google setup

| ID   | Task                                  | Completion requirement                                        |
| ---- | ------------------------------------- | ------------------------------------------------------------- |
| T036 | Create Search Console domain property | Domain verified through DNS                                   |
| T037 | Submit sitemap                        | Google accepts the sitemap without parsing errors             |
| T038 | Inspect five priority URLs            | Live test shows page, metadata and resources correctly        |
| T039 | Request initial indexing              | Homepage, primary tools and pillar pages submitted            |
| T040 | Configure Bing Webmaster Tools        | Sitemap and domain submitted                                  |
| T041 | Connect analytics                     | Page views, tools and CTA events recorded                     |
| T042 | Track outbound partner clicks         | Provider, page, placement and campaign stored                 |
| T043 | Track calculator completion           | Start and successful calculation distinguished                |
| T044 | Create SEO dashboard                  | Impressions, clicks, CTR, position, indexed pages and revenue |
| T045 | Establish a weekly review             | Record changes and actions every week                         |

Search Console should become the source of truth for queries, countries, pages, indexing and crawl issues. ([Google for Developers][5])

---

## Phase 3 — Site architecture

Use a clear structure instead of putting everything under generic articles.

```text
/
├── india/
│   ├── payment-gateways/
│   ├── international-payments/
│   └── freelancer-payments/
│
├── compare/
│   ├── razorpay-vs-stripe/
│   ├── razorpay-vs-cashfree/
│   ├── wise-vs-payoneer-india/
│   └── paypal-vs-payoneer-india/
│
├── tools/
│   ├── razorpay-fee-calculator/
│   ├── payment-gateway-fee-calculator/
│   ├── receive-usd-india-calculator/
│   └── exchange-rate-markup-calculator/
│
├── providers/
│   ├── razorpay/
│   ├── payoneer/
│   ├── wise/
│   └── cashfree/
│
├── guides/
└── methodology/
```

Required architecture tasks:

| ID   | Task                                                          |
| ---- | ------------------------------------------------------------- |
| T046 | Add India landing page                                        |
| T047 | Create separate comparison, tool, provider and guide sections |
| T048 | Add breadcrumbs to detail pages                               |
| T049 | Link every article to its related calculator                  |
| T050 | Link every calculator to relevant comparisons                 |
| T051 | Link each provider profile to all related articles            |
| T052 | Add “Related guides” based on genuine relevance               |
| T053 | Ensure every indexable page is linked from another page       |
| T054 | Remove orphan pages                                           |
| T055 | Add Article and Breadcrumb structured data where accurate     |
| T056 | Validate structured data after every build                    |
| T057 | Add author and methodology links to all financial articles    |

Googlebot discovers pages by following normal crawlable links. Every important page should be reachable from another findable page rather than depending only on the sitemap. ([Google for Developers][8])

---

# 5. Content production plan

## Content rule

Do not publish 100 AI-generated pages.

Google’s spam policies prohibit scaled content created primarily to manipulate rankings, regardless of whether it was produced by AI, humans or a combination. ([Google for Developers][9])

Publish **two deeply researched pages per week** instead.

## Month 1: payment-gateway cluster

Publish in this order:

1. Razorpay fee calculator
2. Razorpay vs Stripe for Indian businesses
3. Razorpay vs Cashfree
4. ~~Best payment gateway for Indian startups~~ ✅ done — `/articles/best-payment-gateway-indian-startups/` (2026-08-15): Razorpay/Cashfree/Stripe (India)/Paytm compared on flat 2% + 18% GST, UPI as the zero-MDR default rail; relatedTool fee calculator
5. Payment gateway fee comparison India
6. ~~Best payment gateway for Indian SaaS~~ ✅ done — `/articles/best-payment-gateway-indian-saas/` (2026-08-15): INR subscriptions + USD revenue in one stack — Razorpay UPI-first vs Stripe Billing vs Cashfree payouts; relatedTool fee calculator
7. ~~Razorpay international payment fees~~ ✅ done — `/articles/razorpay-international-payment-fees/` (2026-08-15): up-to-3% international cards, 18% GST on the fee (3.54% on ₹10,000), bundled conversion, MoneySaver export-account path; relatedTool exchange-rate markup calculator
8. Best payment gateway for Shopify India

### Original value required

* Monthly-volume calculator
* Average-order-value input
* Domestic/international split
* Payment-method split
* GST display
* Estimated settlement
* Reverse calculator: “How much should I charge to receive ₹X?”
* Region and eligibility notes
* Current provider sources

## Month 2: international freelancer payments

9. Best way to receive USD in India
10. Payoneer fees India
11. Wise vs Payoneer for Indian freelancers
12. PayPal vs Payoneer India
13. Best payment method for Upwork India
14. Best payment method for Fiverr India
15. Receive international client payments in India
16. International payment fee calculator India

Search results show active competition in this area, including provider pages, independent comparisons and dedicated calculators. Your content needs exact India-specific scenarios and original calculations rather than another broad list. ([Payoneer][10])

## Month 3: specialist long-tail content

17. Receiving $500 from a US client in India
18. Receiving $1,000 from a US client in India
19. Receiving $5,000 from a US client in India
20. Payment gateway for Indian subscription businesses
21. Razorpay vs Stripe for developers
22. Razorpay vs Cashfree for ecommerce
23. International payment settlement times
24. ~~Exchange-rate markup calculator~~ ✅ done — `/tools/exchange-rate-markup-calculator` (2026-08-04): input-only mid-vs-offered rate tool with markup % and INR/USD loss for both directions; relatedTool on payoneer-fees-india, how-to-send-money-abroad-cheap, wise-vs-payoneer-business-payouts
25. FIRA/FIRC payment-method comparison
26. Quarterly India Cross-Border Payment Fee Index

The amount-specific pages should not be nearly identical. Each must have distinct calculations, explanation, provider eligibility and recommendations, or they risk being perceived as scaled low-value content.

---

# 6. Required page template

Every commercial comparison page should contain:

## 1. Direct answer

The first section should answer:

* Which option is generally better?
* For whom?
* Under what assumptions?
* When is the other option better?

## 2. “Last verified” information

Display:

```text
Last independently verified: August 2026
Region: India
Sources: Provider pricing and documentation
```

## 3. Scenario table

Example:

| Scenario                    | Recommended starting option   | Reason                                      |
| --------------------------- | ----------------------------- | ------------------------------------------- |
| Indian UPI-heavy store      | Razorpay/Cashfree             | Local payment-method support                |
| Global SaaS                 | Depends on eligibility        | International and subscription requirements |
| Upwork freelancer           | Payoneer or direct bank route | Marketplace and withdrawal requirements     |
| Direct international client | Compare full conversion cost  | FX markup may dominate                      |

## 4. Original calculator

The calculator should be part of the page, not a decorative link.

## 5. Complete cost model

Show:

* Percentage fee
* Fixed fee
* International surcharge
* Currency-conversion cost
* GST or tax on fee
* Settlement amount
* Possible annual/account fees
* Conditions and exclusions

## 6. Evidence

Every material statement should link to:

* Official pricing
* Official eligibility
* Official documentation
* Regulatory source where applicable

## 7. Methodology

Explain exactly how the result was computed.

## 8. Limitations

State what the calculator does not include.

## 9. Commercial disclosure

Affiliate links must be marked with `rel="sponsored"`. Google explicitly recommends `sponsored` for advertising and affiliate links. ([Google for Developers][11])

## 10. Related pages

Link to one tool, one comparison and one provider profile.

There is no magic minimum word count. A page is complete when it answers the decision comprehensively and provides original value.

---

# 7. Homepage task list

## Above the fold

Include:

* India-focused value proposition
* Payment gateway calculator CTA
* International payment calculator CTA
* Trust statement
* Last-updated date

## Homepage sections

1. Choose what you are trying to do
2. Featured calculators
3. Popular comparisons
4. India-specific provider directory
5. Recently verified updates
6. How FinTech Atlas makes money
7. Methodology
8. Newsletter
9. Author/editorial information

## Homepage metadata

Suggested title:

```text
Payment Gateway & International Payment Comparisons India | FinTech Atlas
```

Suggested description:

```text
Compare Razorpay, Stripe, Cashfree, Wise, Payoneer and other payment services. Calculate fees, settlement amounts and provider differences for India.
```

Do not stuff every provider name into the title. Keep it readable and aligned with the main purpose.

---

# 8. Authority and backlink plan

## Create assets worth linking to

The strongest linkable assets would be:

* India Payment Gateway Fee Index
* International Payment Cost Index
* Public provider-pricing dataset
* Embeddable Razorpay fee calculator
* Open-source calculator formulas
* Quarterly pricing-change report
* Provider availability matrix
* Settlement-time benchmark

## Weekly outreach

Contact:

* Indian SaaS newsletters
* Freelancing newsletters
* Startup incubators
* College entrepreneurship cells
* Payment-integration agencies
* Chartered accountants writing about freelancers
* Web-development communities
* Ecommerce consultants
* Remote-work communities

Do not ask:

> “Please give me a backlink.”

Instead offer:

> “We created a free calculator and independently sourced comparison that your readers can use. I noticed your guide currently explains gateway pricing but does not calculate the final settlement after all fee components.”

## Distribution cadence

Every newly published page should receive:

* One LinkedIn post
* One detailed Reddit/community contribution where relevant
* One short video
* One visual comparison
* Five targeted outreach messages
* Internal links from three existing pages

---

# 9. Monetization task list

## Revenue track 1: integration services

SEO will take time. Your first revenue can come from directly helping businesses.

Create a page for:

### Payment gateway selection audit

Proposed test price:

* Basic comparison: ₹999–₹1,999
* Detailed gateway recommendation: ₹2,500–₹5,000

### Payment gateway integration

Depending on scope:

* Basic Razorpay checkout: ₹3,000–₹8,000
* Ecommerce integration: ₹5,000–₹15,000
* Subscription/custom integration: quoted separately

These are proposed starting prices, not guaranteed market rates.

Tasks:

| ID   | Task                                               |
| ---- | -------------------------------------------------- |
| T058 | Create services page                               |
| T059 | Define deliverables and exclusions                 |
| T060 | Add booking/contact form                           |
| T061 | Create one sample gateway report                   |
| T062 | Create implementation checklist                    |
| T063 | Contact local businesses and student founders      |
| T064 | Collect genuine testimonials after completing work |

## Revenue track 2: affiliate and referral links

| ID   | Task                                    |
| ---- | --------------------------------------- |
| T065 | Complete Razorpay Partner registration  |
| T066 | Complete partner KYC                    |
| T067 | Obtain unique Razorpay referral URL     |
| T068 | Apply to Payoneer affiliate programme   |
| T069 | Apply to Wise website partnership       |
| T070 | Record each programme’s terms           |
| T071 | Add links only after approval           |
| T072 | Set partner relationship to `affiliate` |
| T073 | Verify `rel="sponsored"`                |
| T074 | Track every outbound click              |
| T075 | Recheck referral links monthly          |
| T076 | Reconcile clicks, approvals and payouts |

## Revenue track 3: sponsorships

Do not sell sponsorships until the site has audience evidence.

Start outreach after achieving at least one of:

* 10,000 targeted monthly sessions
* 1,000 newsletter subscribers
* Strong rankings for several commercial queries
* Meaningful recurring affiliate conversions

Potential products:

* Sponsored tool placement
* Sponsored newsletter section
* Sponsored research report
* Clearly labelled category sponsorship

Never sell ratings, editorial conclusions or “best provider” status.

---

# 10. Newsletter and privacy tasks

| ID   | Task                                                 |
| ---- | ---------------------------------------------------- |
| T077 | Choose a real email provider                         |
| T078 | Remove local-only email storage                      |
| T079 | Check `response.ok` before showing success           |
| T080 | Add loading and duplicate-submission handling        |
| T081 | Implement double opt-in                              |
| T082 | Add a functioning unsubscribe route                  |
| T083 | Record consent and privacy-version date              |
| T084 | Add anti-spam protection                             |
| T085 | Update privacy notice to name the provider           |
| T086 | Do not claim subscription before confirmation        |
| T087 | Define newsletter schedule                           |
| T088 | Send useful comparison updates, not promotional spam |

---

# 11. Performance and user-experience tasks

Target Google’s recommended Core Web Vitals:

* LCP within 2.5 seconds
* INP below 200 milliseconds
* CLS below 0.1 ([Google for Developers][12])

Tasks:

| ID   | Task                                                                      |
| ---- | ------------------------------------------------------------------------- |
| T089 | Test mobile Chrome                                                        |
| T090 | Test Safari/WebKit                                                        |
| T091 | Test Firefox                                                              |
| T092 | Run keyboard-only audit                                                   |
| T093 | Run screen-reader audit                                                   |
| T094 | Record production Core Web Vitals                                         |
| T095 | Reduce unnecessary JavaScript                                             |
| T096 | Lazy-load non-critical components                                         |
| T097 | Optimise images and fonts                                                 |
| T098 | Prevent calculator layout shifts                                          |
| T099 | Test pages on slow mobile connection                                      |
| T100 | Raise Lighthouse performance enforcement above the current weak threshold |

---

# 12. Ninety-day execution order

## Weeks 1–2: make it trustworthy

Complete T001–T018.

Main outcome:

* Correct calculations
* Verified company data
* Methodology
* Source requirements
* No misleading newsletter state

## Weeks 3–4: launch correctly

Complete T019–T045.

Main outcome:

* Dedicated domain
* Production deployment
* Search Console
* Sitemap submission
* Analytics
* Correct canonicals
* CI and branch protection

## Weeks 5–8: build the gateway cluster

Complete:

* New homepage
* Razorpay fee calculator
* Razorpay vs Stripe
* Razorpay vs Cashfree
* Payment gateway comparison India
* Best gateway for SaaS
* Service page
* Razorpay referral activation

Main outcome:

* Eight strong commercial-intent pages
* Direct service offering
* First referral funnel

## Weeks 9–12: build the freelancer-payment cluster

Complete:

* Receive USD in India
* Payoneer fees India
* Wise vs Payoneer India
* PayPal vs Payoneer
* International payment calculator
* Upwork/Fiverr payment guides
* Original benchmark report
* Outreach campaign

Main outcome:

* 16–20 quality India-focused pages
* First genuine backlinks
* First organic impressions and clicks
* First direct leads or affiliate conversions

---

# 13. Metrics to monitor

## Technical

* Intended URLs indexed
* Excluded URLs and reasons
* Sitemap errors
* Broken links
* Core Web Vitals
* Build and deployment failures

## SEO

* Google impressions
* Organic clicks
* Average position
* Query-level CTR
* Number of queries in top 100
* Number of queries in top 20
* Number of pages receiving organic clicks
* Referring domains

## Product

* Calculator starts
* Calculator completions
* Comparison interactions
* Provider CTA clicks
* Newsletter confirmations
* Returning visitors

## Revenue

* Referral clicks
* Referral signups
* Activated referrals
* Referred transaction volume
* Affiliate commissions
* Consultation leads
* Integration projects
* Revenue per 1,000 organic visitors

---

# 14. Realistic ranking expectations

Treat these as planning assumptions, not promises:

### First 30 days

* Site discovered and indexed
* Early impressions for branded and very specific queries
* Search Console begins collecting useful data

### Days 30–90

* Long-tail pages may begin entering the top 50–100
* Some low-competition queries may generate clicks
* Google tests different pages and titles
* Early backlinks and branded searches become important

### Months 3–6

* Strong, updated pages can begin reaching top 20 or top 10 for selected long-tail queries
* Revenue becomes possible if the traffic has commercial intent

### Months 6–12

* Topic clusters and original research can begin building meaningful authority
* Strong calculator pages can attract recurring backlinks
* Affiliate income can become less dependent on direct outreach

The plan should assume **six months of consistent execution**, not a one-week SEO trick.

# The correct priority order

```text
1. Fix accuracy
2. Deploy on a proper domain
3. Connect Search Console and analytics
4. Reposition around India-specific payment decisions
5. Build three original calculators
6. Publish 16–20 researched commercial-intent pages
7. Obtain referral links
8. Perform direct outreach and sell integration help
9. Build backlinks through original tools and reports
10. Scale only after Search Console shows what is working
```

The most important immediate work is **not publishing more generic fintech articles**. It is fixing the calculators, launching on a permanent domain, changing the positioning, and building the Razorpay/payment-gateway cluster first.

[1]: https://developers.google.com/search/docs/essentials "Google Search Essentials (formerly Webmaster Guidelines) | Google Search Central  |  Documentation  |  Google for Developers"
[2]: https://bighelpers.in/compare/razorpay-vs-stripe-india/ "Razorpay vs Stripe — for Indian businesses in 2026 · Big Helpers"
[3]: https://developers.google.com/search/docs/fundamentals/creating-helpful-content "Creating Helpful, Reliable, People-First Content | Google Search Central  |  Documentation  |  Google for Developers"
[4]: https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview "What Is a Sitemap | Google Search Central  |  Documentation  |  Google for Developers"
[5]: https://developers.google.com/search/docs/monitor-debug/search-console-start "How To Use Search Console | Google Search Central  |  Documentation  |  Google for Developers"
[6]: https://developers.google.com/search/docs/essentials/spam-policies "Spam Policies for Google Web Search | Google Search Central  |  Documentation  |  Google for Developers"
[7]: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap "Build and Submit a Sitemap | Google Search Central  |  Documentation  |  Google for Developers"
[8]: https://developers.google.com/search/docs/fundamentals/get-started-developers "SEO Guide for Web Developers | Google Search Central  |  Documentation  |  Google for Developers"
[9]: https://developers.google.com/search/blog/2024/03/core-update-spam-policies "What web creators should know about our March 2024 core update and new spam policies  |  Google Search Central Blog  |  Google for Developers"
[10]: https://www.payoneer.com/en-in/about/pricing/ "Low fees and no hidden costs Fees | Payoneer India"
[11]: https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links "Qualify Outbound Links for SEO | Google Search Central  |  Documentation  |  Google for Developers"
[12]: https://developers.google.com/search/docs/appearance/core-web-vitals "Understanding Core Web Vitals and Google search results | Google Search Central  |  Documentation  |  Google for Developers"
