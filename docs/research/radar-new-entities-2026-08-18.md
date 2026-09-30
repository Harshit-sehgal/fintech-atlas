# Radar — New Entity Research Worksheet (17 unmatched, live fetch 2026-08-18)

> Decision aid for the 17 `unmatched_entry` review items
> (`recommended-decisions-payment-aggregators-live-2026-08-18.json` → pending).
> Only **web-verified** context is listed; every row keeps the licence
> fact from the RBI page (confidence A). Operator decides add-to-directory /
> merge / out-of-scope and completes remaining enrichment (founding, HQ,
> funding, people).

Licence facts source: RBI `Id=4236` "As on 16.08.2026" (confidence A).
Company context: web-verified 2026-08-18 (confidence B/C, cited below).

| # | Entity | Licence line / status | Verified context | Confidence | Next action |
| --- | --- | --- | --- | --- | --- |
| 1 | IRCTC Payments Limited | PA, in-principle (Table B) | Wholly-owned subsidiary of IRCTC (Indian Railways); incorporated Feb 2024; in-principle via RBI letter dated 04.08.2025 (NSE/IRCTC filing). PSU-backed entrant targeting railway/govt-linked transactions | A (licence), B (context) | Add to directory — high-priority (PSU, IP) |
| 2 | Navi Payment Technologies Private Limited | PA, in-principle (Table B) | Group: Navi Technologies (Sachin Bansal; Navi Finserv NBFC). Navi UPI ~4th-largest UPI app by volume (406M txns, Jun 2025). Match flagged ambiguous vs canonical "Navi UPI" (`navi-upi`) | A (licence), B (context) | Add or merge with Navi UPI; resolve ambiguous match |
| 3 | Sodexo SVC India Private Limited | PA, in-principle (Table B) | Now branded **Pluxee India Private Limited** (formerly Sodexo SVC India; Pluxee Group). Historically semi-closed PPI issuer (meal cards); PPI master-direction governed | A (licence), C (name change to verify) | Add; verify current registered name (Pluxee rename) |
| 4 | Integra Micro Systems Private Limited | PA, application (Table B) | Bangalore; ~40-yr-old fintech tech provider for banks/PSUs (Aadhaar stack, eKYC, UPI, Bharat BillPay; ISO 27001, CMMI-3; Thales partner) | A (licence), B (context) | Add — infrastructure/payments-tech provider |
| 5 | Otropay India Private Limited | PA, application (Table B) | Earlier PA-Online application returned 20.11.2025 (Table C) — appears re-filed/under process | A (licence), B (both RBI tables) | Add; note re-application history |
| 6 | Quick Forex Limited | PA-CB, application (Table E) | Earlier PA-CB application returned 07.11.2024 (Table F) — re-filed, now under process | A (licence), B (both RBI tables) | Add; FX/cross-border angle |
| 7 | Skilworth Technologies Private Limited | PA-P, application (Table G) | **Existing** PA-P; earlier PA-Online application returned 26.09.2022 (Table C) | A (licence), B (both RBI tables) | Add as existing PA-P continuing under PA-MD |
| 8 | RNFI Services Limited | PA-P, application (Table G) | Existing PA-P under process | A (licence) | Add — PA-P (physical proximity) |
| 9 | Yudiz Solutions Limited | PA, application (Table B) | No verified context this round | A (licence) | Research |
| 10 | Samvriddhi Inclusive Growth Network Private Limited | PA, application (Table B) | No verified context this round | A (licence) | Research |
| 11 | Trade Pe Tech Private Limited | PA-CB, in-principle (Table D) | Existing PA-CB in-principle | A (licence) | Research — cross-border |
| 12 | Alt Pay Technologies Private Limited | PA-CB, application (Table E) | No verified context this round | A (licence) | Research |
| 13 | ARM Commercial Services Private Limited | PA-CB, application (Table E) | No verified context this round | A (licence) | Research |
| 14 | Alliance Network India Private Limited | PA-P, application (Table G) | Existing PA-P under process | A (licence) | Research — physical proximity |
| 15 | Digitsecure India Private Limited | PA-P, application (Table G) | Existing PA-P under process | A (licence) | Research |
| 16 | Nearby Technologies Private Limited | PA-P, application (Table G) | Existing PA-P under process | A (licence) | Research |
| 17 | Kamaal Universe Private Limited | PA-P, application (Table H) | New PA-P under process | A (licence) | Research |

## Notes

- "Existing PA-P" (Tables G/H) reflects the consolidated PA-MD (effective
  15.09.2025) regime, where existing physical-proximity aggregators had to
  apply for authorisation by 31.12.2025.
- Entities appearing in both an active table and a returned table (Otropay,
  Quick Forex, Skilworth) have a re-application history — record it in the
  evidence chain when added.
- Confidence hierarchy A–E per RADAR-ARCHITECTURE.md §3; treat all
  non-licence context as B/C until a source line is attached.