# Paid Beta Playbook

> The manual, human-run process for the first paying Radar customers. **Billing by
> invoice only** — no checkout, no payment processor, no auth, until P13 passes
> the [validation gate](./VALIDATION-GATE.md).

## 1. Who gets in

- Design partners from [PROSPECT-DATABASE.md](./PROSPECT-DATABASE.md)
  (`discovery-call` → interested)
- ≤ 5 simultaneous paid partners during the beta
- Only people whose job matches the Radar ICP (PRD §2.1)

## 2. The cycle (one partner)

```text
Discovery call          CUSTOMER-DISCOVERY.md
  → scope               one vertical, one regulator family max
  → deliver             RESEARCH-OUTPUT-TEMPLATE.md (≤ 5 working days)
  → invoice             ₹999 (founding) or ₹1,499–2,499 (test) by invoice
  → follow-up           usage question: "did you use it? for what?"
  → gate evidence       VALIDATION-GATE.md §2 recorded
```

## 3. What the operator must never do

- Never promise "the platform can do X" — deliverable is the product now.
- Never share unverified data as fact (confidence A–E hierarchy).
- Never leak a free user's paid feature (verified regulatory data stays paid).
- Never build billing/auth "just in case" — the gate decides.
- Never fabricate gate evidence.

## 4. Deliverable rules

- Follow [RESEARCH-OUTPUT-TEMPLATE.md](./RESEARCH-OUTPUT-TEMPLATE.md).
- Every licence claim cites its source + date + confidence.
- Explicitly list what is **not** verified yet.
- Two-week review cadence with the operator on format: what did they open first?

## 5. When a partner pays

- Confirm payment received (bank transfer / UPI reference) and record it.
- Send the deliverable.
- Offer the second cycle at the **same price** (founding price holds 60 days).
- Ask for a referral before the end of the second cycle.

## 6. Exits

| Signal | Action |
| --- | --- |
| Partner uses the deliverable in their workflow | record gate evidence #4 |
| Partner reorders / renews | record gate evidence #3 |
| Partner pays non-introductory price | record gate evidence #5 |
| Partner refers | record gate evidence #6 |
| Partner stops responding | log reason; stop; no guilt-trip emails |
| Partner asks for something already on the roadmap | note the ask, don't build it on the spot |

## 7. Handover to P13

Only when all six gate criteria in VALIDATION-GATE.md §2 are met and recorded.
Then (and only then) spec the accounts/billing work — starting from the
invoice workflow that already worked.