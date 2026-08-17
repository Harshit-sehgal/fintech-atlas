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
    "id": "review-2e206ebd-7b1",
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
    "id": "review-76e4ba33-545",
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
    "id": "review-7a5ea954-1cd",
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
    "id": "review--4acc3d4561c",
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
    "id": "review--2f911a7f-73",
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
    "id": "review-39fbb723-6cd",
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
    "id": "review-13c063d9-25b",
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
    "id": "review--755612c0623",
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
    "id": "review-33c26342-158",
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
    "id": "review--3827405a113",
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
    "id": "review--566d22ec408",
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
    "id": "review--3a814a6e6c0",
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
    "id": "review-4229ea80-6c2",
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
    "id": "review-3113a796-4be",
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
    "id": "review--bfaa3a439ee",
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
    "id": "review--2a9b3663484",
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
    "id": "review--578a66d92e5",
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
    "id": "review-299fbeb1-779",
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
    "id": "review--69e867d1285",
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
    "id": "review--1e27ae0d-11",
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
    "id": "review--20200bea22a",
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
    "id": "review-659418ee-8e2",
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
    "id": "review--41222d22-11",
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
    "id": "review--24713ce1160",
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
    "id": "review--1aa6f021-6f",
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
    "id": "review-7310f445-5fe",
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
    "id": "review-5f4c40ee-428",
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
    "id": "review--71da07e5-1a",
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
    "id": "review--30d06758-27",
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
    "id": "review-2d586764-40d",
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
    "id": "review-323d17b9-700",
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
    "id": "review-1e79eede-734",
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
    "id": "review--52fc23b9647",
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
    "id": "review--7dda16cb-40",
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
    "id": "review--35b7d2eb59b",
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
    "id": "review--4ea8846a-be",
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
    "id": "review-6ebe5daa-2ff",
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
    "id": "review-12e2b2c4-220",
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
    "id": "review--39763fb4-56",
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
