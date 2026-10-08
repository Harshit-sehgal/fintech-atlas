// GENERATED FILE — do not edit by hand.
// Derived from data/regulatory/rbi/payment-aggregators-v1.md by
// scripts/generate-radar-review.ts (runs automatically in `prebuild`).
// The review queue the change engine produces before any licence change is
// applied. Every item carries a pending state and a rationale; decisions
// are taken by an operator, never by the pipeline.

export interface RadarReviewItem {
  id: string;
  snapshotId: string;
  companyId?: string;
  companyName?: string;
  action: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  rationale: string;
  state: string;
}

export interface RadarReviewSummary {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  byAction: Record<string, number>;
}

export const radarReviewItems: RadarReviewItem[] = [
  {
    "id": "review-2e206ebd84e3",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "razorpay",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA for this company.",
    "state": "pending"
  },
  {
    "id": "review-76e4ba33aba9",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "razorpay",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA-CB",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA-CB for this company.",
    "state": "pending"
  },
  {
    "id": "review-2eebd8307038",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "cashfree-payments",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA for this company.",
    "state": "pending"
  },
  {
    "id": "review-7a5ea954fe32",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "cashfree-payments",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA-CB",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA-CB for this company.",
    "state": "pending"
  },
  {
    "id": "review-b533c2bb61c1",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "payu-payments-india",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA for this company.",
    "state": "pending"
  },
  {
    "id": "review-698fde1d32c3",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "payu-payments-india",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA-CB",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA-CB for this company.",
    "state": "pending"
  },
  {
    "id": "review-c7eefb66ace8",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "billdesk-indiaideas-com",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA for this company.",
    "state": "pending"
  },
  {
    "id": "review-42c541e85580",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "billdesk-indiaideas-com",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA-CB",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA-CB for this company.",
    "state": "pending"
  },
  {
    "id": "review-d06ee581f8ce",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "pine-labs",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA for this company.",
    "state": "pending"
  },
  {
    "id": "review-39fbb723932e",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "pine-labs",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA-CB",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA-CB for this company.",
    "state": "pending"
  },
  {
    "id": "review-13c063d9da44",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "easebuzz",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA for this company.",
    "state": "pending"
  },
  {
    "id": "review-8aa9ed406233",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "easebuzz",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA-CB",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA-CB for this company.",
    "state": "pending"
  },
  {
    "id": "review-33c26342ea77",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "airpay-payment-services",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA for this company.",
    "state": "pending"
  },
  {
    "id": "review-c7d8bfa61137",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "airpay-payment-services",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA-CB",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA-CB for this company.",
    "state": "pending"
  },
  {
    "id": "review-7d144f097a3a",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "mswipe-technologies",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA for this company.",
    "state": "pending"
  },
  {
    "id": "review-a992dd14408c",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "mswipe-technologies",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA-CB",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA-CB for this company.",
    "state": "pending"
  },
  {
    "id": "review-c57eb5926c07",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "khatabook-technologies",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA for this company.",
    "state": "pending"
  },
  {
    "id": "review-4229ea8093d1",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "lyra-network-private-limited",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA for this company.",
    "state": "pending"
  },
  {
    "id": "review-3113a796b410",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "mmad-communications",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA for this company.",
    "state": "pending"
  },
  {
    "id": "review-f4055c5c39ee",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "mmad-communications",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA-CB",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA-CB for this company.",
    "state": "pending"
  },
  {
    "id": "review-31fe783a953a",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "ndl-database-management-limited",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA for this company.",
    "state": "pending"
  },
  {
    "id": "review-d564c99d484b",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "omniware-technologies",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA for this company.",
    "state": "pending"
  },
  {
    "id": "review-200c0bdb7ab5",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "pay10-services",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA for this company.",
    "state": "pending"
  },
  {
    "id": "review-a87599272e57",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "pay10-services",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA-CB",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA-CB for this company.",
    "state": "pending"
  },
  {
    "id": "review-299fbeb18865",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "pb-pay",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA for this company.",
    "state": "pending"
  },
  {
    "id": "review-9617982f2854",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "payment-gateway-solutions-pgs",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA for this company.",
    "state": "pending"
  },
  {
    "id": "review-e1d851f3ee48",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "toucan-payments-india",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA for this company.",
    "state": "pending"
  },
  {
    "id": "review-dfdff41622a6",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "vay-network-services",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA for this company.",
    "state": "pending"
  },
  {
    "id": "review-659418eef71d",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "vay-network-services",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA-CB",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA-CB for this company.",
    "state": "pending"
  },
  {
    "id": "review-24f260353254",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "xsilica-software-solutions",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA for this company.",
    "state": "pending"
  },
  {
    "id": "review-beddd2deeef1",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "zoho-payment-technologies",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA for this company.",
    "state": "pending"
  },
  {
    "id": "review-db8ec31f1601",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "adyen-india",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA for this company.",
    "state": "pending"
  },
  {
    "id": "review-e5590fdf9080",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "adyen-india",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA-CB",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA-CB for this company.",
    "state": "pending"
  },
  {
    "id": "review-7310f445a013",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "amazon-pay-india",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA for this company.",
    "state": "pending"
  },
  {
    "id": "review-5f4c40eebd70",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "amazon-pay-india",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA-CB",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA-CB for this company.",
    "state": "pending"
  },
  {
    "id": "review-8e25f81be51e",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "paypal-india",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA-CB",
      "status": "in-principle"
    },
    "rationale": "Snapshot records licence PA-CB for this company.",
    "state": "pending"
  },
  {
    "id": "review-cf2f98a8d828",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "payoneer-india",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA-CB",
      "status": "in-principle"
    },
    "rationale": "Snapshot records licence PA-CB for this company.",
    "state": "pending"
  },
  {
    "id": "review-2d586764bf2b",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "worldline-epayments-india",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA for this company.",
    "state": "pending"
  },
  {
    "id": "review-49c91c303246",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "worldline-epayments-india",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA-CB",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA-CB for this company.",
    "state": "pending"
  },
  {
    "id": "review-323d17b98ff8",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "unlimit-in-unlimint",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA for this company.",
    "state": "pending"
  },
  {
    "id": "review-1e79eede8cbe",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "unlimit-in-unlimint",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA-CB",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA-CB for this company.",
    "state": "pending"
  },
  {
    "id": "review-ad03dc476476",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "skydo",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA for this company.",
    "state": "pending"
  },
  {
    "id": "review-8225e935bf52",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "skydo",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA-CB",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA-CB for this company.",
    "state": "pending"
  },
  {
    "id": "review-ca482d1559b6",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "payglocal",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA for this company.",
    "state": "pending"
  },
  {
    "id": "review-b1577b96f410",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "payglocal",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA-CB",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA-CB for this company.",
    "state": "pending"
  },
  {
    "id": "review-6ebe5daad007",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "xflow",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA-CB",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA-CB for this company.",
    "state": "pending"
  },
  {
    "id": "review-12e2b2c4ddfb",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "briskpe-gobrisk",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA-CB",
      "status": "authorised"
    },
    "rationale": "Snapshot records licence PA-CB for this company.",
    "state": "pending"
  },
  {
    "id": "review-c689c04ca9c4",
    "snapshotId": "payment-aggregators-v1",
    "companyId": "eximpe",
    "action": "add_license",
    "before": null,
    "after": {
      "code": "PA-CB",
      "status": "in-principle"
    },
    "rationale": "Snapshot records licence PA-CB for this company.",
    "state": "pending"
  }
];

export const radarReviewSummary: RadarReviewSummary = {
  "total": 48,
  "pending": 48,
  "approved": 0,
  "rejected": 0,
  "byAction": {
    "add_license": 48
  }
};

export const radarReviewSnapshotId = "payment-aggregators-v1";
export const radarReviewFetchedOn = "2026-08-15";
export const radarReviewIsBaseline = true;
