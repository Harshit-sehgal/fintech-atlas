/**
 * Personal-finance calculator catalog for the `/tools/calculators` hub.
 *
 * Each calculator is a pure, data-driven definition: a list of numeric inputs
 * and a `compute` function that returns display-ready output rows. The client
 * component renders the inputs and outputs generically, so adding a new
 * calculator is a single entry in `CALCULATORS`.
 *
 * All math lives in `@/lib/investment-calculators` so it is unit-testable
 * without React.
 */

import {
  computeSip,
  computeSwp,
  computeEmi,
  computeCagr,
  inflate,
  computeRetirement,
  computeFire,
  emergencyFundNeeded,
  emergencyFundCoverage,
  computeNetWorth,
} from "@/lib/investment-calculators";

export type CalcInputKind = "currency" | "percent" | "years" | "number";

export interface CalcInput {
  key: string;
  label: string;
  kind: CalcInputKind;
  min: number;
  max: number;
  step: number;
  default: number;
  hint?: string;
}

export type CalcOutputKind =
  | "currency"
  | "percent"
  | "years"
  | "plain"
  | "warning";

export interface CalcOutput {
  label: string;
  value: string | null;
  kind: CalcOutputKind;
}

export type CalcValues = Record<string, number>;

export interface CalculatorDefinition {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  inputs: CalcInput[];
  compute: (values: CalcValues) => CalcOutput[];
}

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const moneyCents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatMoney(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  return money.format(Math.abs(value) >= 100 ? Math.round(value) : value);
}

export function formatMoneyCents(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  return moneyCents.format(value);
}

export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  return `${value.toFixed(2).replace(/\.00$/, "")}%`;
}

export function formatYears(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  return `${value.toFixed(1)} years`;
}

const CALCULATORS: CalculatorDefinition[] = [
  {
    id: "sip",
    name: "SIP Calculator",
    tagline: "Project the future value of a monthly investment plan.",
    icon: "📈",
    inputs: [
      { key: "monthlyContribution", label: "Monthly Contribution", kind: "currency", min: 50, max: 5000, step: 50, default: 500 },
      { key: "annualReturn", label: "Expected Annual Return", kind: "percent", min: 0, max: 20, step: 0.5, default: 12, hint: "Illustrative: equity index funds have historically averaged ~8–10% in real terms." },
      { key: "years", label: "Investment Period", kind: "years", min: 1, max: 40, step: 1, default: 10 },
    ],
    compute: (v) => {
      const r = computeSip(v.monthlyContribution, v.annualReturn, v.years);
      if (!r) return [{ label: "Adjust inputs", value: "Enter a positive contribution and period.", kind: "warning" }];
      return [
        { label: "Total Invested", value: formatMoney(r.invested), kind: "currency" },
        { label: "Projected Corpus", value: formatMoney(r.futureValue), kind: "currency" },
        { label: "Estimated Gains", value: formatMoney(r.gains), kind: "currency" },
      ];
    },
  },
  {
    id: "swp",
    name: "SWP Calculator",
    tagline: "How long can a lump sum fund a fixed monthly withdrawal?",
    icon: "🏦",
    inputs: [
      { key: "corpus", label: "Starting Corpus", kind: "currency", min: 10000, max: 10000000, step: 10000, default: 500000 },
      { key: "monthlyWithdrawal", label: "Monthly Withdrawal", kind: "currency", min: 100, max: 100000, step: 100, default: 3000 },
      { key: "annualReturn", label: "Expected Annual Return", kind: "percent", min: 0, max: 20, step: 0.5, default: 8 },
    ],
    compute: (v) => {
      const r = computeSwp(v.corpus, v.monthlyWithdrawal, v.annualReturn);
      if (!r) return [{ label: "Adjust inputs", value: "Enter a positive corpus and withdrawal.", kind: "warning" }];
      const outputs: CalcOutput[] = [
        { label: "Corpus Lifetime", value: r.lifetimeLabel, kind: r.monthsUntilDepleted === null ? "warning" : "years" },
      ];
      if (r.monthsUntilDepleted !== null && r.totalWithdrawn !== null) {
        outputs.push({ label: "Total Withdrawn", value: formatMoney(r.totalWithdrawn), kind: "currency" });
      } else {
        outputs.push({ label: "Total Withdrawn", value: "Unlimited — returns cover withdrawals", kind: "plain" });
      }
      return outputs;
    },
  },
  {
    id: "emi",
    name: "EMI / Loan Calculator",
    tagline: "Monthly installments and total interest for a fixed-rate loan.",
    icon: "🏠",
    inputs: [
      { key: "principal", label: "Loan Amount", kind: "currency", min: 1000, max: 50000000, step: 10000, default: 500000 },
      { key: "annualRate", label: "Annual Interest Rate", kind: "percent", min: 0, max: 20, step: 0.25, default: 8 },
      { key: "years", label: "Loan Term", kind: "years", min: 0.5, max: 30, step: 0.5, default: 20 },
    ],
    compute: (v) => {
      const r = computeEmi(v.principal, v.annualRate, v.years);
      if (!r) return [{ label: "Adjust inputs", value: "Enter a positive loan amount and term.", kind: "warning" }];
      return [
        { label: "Monthly Installment (EMI)", value: formatMoneyCents(r.emi), kind: "currency" },
        { label: "Total Repaid", value: formatMoney(r.totalPayment), kind: "currency" },
        { label: "Total Interest", value: formatMoney(r.totalInterest), kind: "currency" },
      ];
    },
  },
  {
    id: "cagr",
    name: "CAGR Calculator",
    tagline: "The compound annual growth rate of any investment.",
    icon: "📊",
    inputs: [
      { key: "initialValue", label: "Initial Value", kind: "currency", min: 100, max: 10000000, step: 100, default: 10000 },
      { key: "finalValue", label: "Final Value", kind: "currency", min: 0, max: 50000000, step: 100, default: 20000 },
      { key: "years", label: "Holding Period", kind: "years", min: 1, max: 50, step: 0.5, default: 5 },
    ],
    compute: (v) => {
      const r = computeCagr(v.initialValue, v.finalValue, v.years);
      if (r === null) return [{ label: "Adjust inputs", value: "Enter a positive initial value and period.", kind: "warning" }];
      return [{ label: "Compound Annual Growth Rate", value: formatPercent(r), kind: "percent" }];
    },
  },
  {
    id: "inflation",
    name: "Inflation Calculator",
    tagline: "What will today's price tag look like in the future?",
    icon: "🏷️",
    inputs: [
      { key: "amount", label: "Current Cost", kind: "currency", min: 100, max: 1000000, step: 100, default: 1000 },
      { key: "inflationRate", label: "Annual Inflation Rate", kind: "percent", min: 0, max: 15, step: 0.1, default: 6 },
      { key: "years", label: "Years Ahead", kind: "years", min: 1, max: 50, step: 1, default: 10 },
    ],
    compute: (v) => {
      const futureCost = inflate(v.amount, v.inflationRate, v.years);
      const realValue = v.amount / inflate(1, v.inflationRate, v.years);
      return [
        { label: "Future Cost", value: formatMoney(futureCost), kind: "currency" },
        { label: "Today's Cash Value in Future Terms", value: formatMoney(realValue), kind: "currency" },
      ];
    },
  },
  {
    id: "retirement",
    name: "Retirement Corpus Calculator",
    tagline: "Estimate the corpus you need and the monthly investment to build it.",
    icon: "🌅",
    inputs: [
      { key: "currentMonthlyExpense", label: "Current Monthly Expenses", kind: "currency", min: 500, max: 100000, step: 500, default: 5000 },
      { key: "annualInflation", label: "Expected Inflation", kind: "percent", min: 0, max: 15, step: 0.5, default: 6 },
      { key: "yearsToRetirement", label: "Years Until Retirement", kind: "years", min: 0, max: 50, step: 1, default: 25 },
      { key: "retirementYears", label: "Years in Retirement", kind: "years", min: 10, max: 50, step: 1, default: 30 },
      { key: "currentSavings", label: "Current Retirement Savings", kind: "currency", min: 0, max: 5000000, step: 5000, default: 0 },
      { key: "accumulationReturn", label: "Expected Return Before Retirement", kind: "percent", min: 0, max: 15, step: 0.5, default: 8 },
      { key: "retirementReturn", label: "Expected Return During Retirement", kind: "percent", min: 0, max: 15, step: 0.5, default: 6 },
    ],
    compute: (v) => {
      const r = computeRetirement(
        v.currentMonthlyExpense,
        v.annualInflation,
        v.yearsToRetirement,
        v.retirementYears,
        v.accumulationReturn,
        v.retirementReturn,
        v.currentSavings,
      );
      if (!r) return [{ label: "Adjust inputs", value: "Enter positive expenses and retirement years.", kind: "warning" }];
      return [
        { label: "Expenses at Retirement (per year)", value: formatMoney(r.annualExpenseAtRetirement), kind: "currency" },
        { label: "Corpus Needed at Retirement", value: formatMoney(r.corpusNeeded), kind: "currency" },
        { label: "Required Monthly Contribution", value: formatMoney(r.requiredMonthlyContribution), kind: "currency" },
      ];
    },
  },
  {
    id: "fire",
    name: "FIRE Number Calculator",
    tagline: "Estimate your FIRE target and the time to reach it under fixed-return assumptions.",
    icon: "🔥",
    inputs: [
      { key: "annualExpenses", label: "Annual Expenses", kind: "currency", min: 10000, max: 1000000, step: 5000, default: 60000 },
      { key: "safeWithdrawalRate", label: "Safe Withdrawal Rate", kind: "percent", min: 2, max: 8, step: 0.25, default: 4, hint: "The classic 4% rule is a common starting benchmark." },
      { key: "currentAssets", label: "Current Investable Assets", kind: "currency", min: 0, max: 50000000, step: 50000, default: 100000 },
      { key: "monthlyContribution", label: "Monthly Contribution", kind: "currency", min: 0, max: 50000, step: 250, default: 1500 },
      { key: "annualReturn", label: "Expected Annual Return", kind: "percent", min: 0, max: 15, step: 0.5, default: 7 },
    ],
    compute: (v) => {
      const r = computeFire(
        v.annualExpenses,
        v.safeWithdrawalRate,
        v.currentAssets,
        v.monthlyContribution,
        v.annualReturn,
      );
      if (!r) return [{ label: "FI unreachable", value: "With no return or contributions, this target can't be reached. Adjust inputs.", kind: "warning" }];
      const outputs: CalcOutput[] = [
        { label: "FIRE Number", value: formatMoney(r.fireNumber), kind: "currency" },
      ];
      if (r.alreadyReached) {
        outputs.push({ label: "Status", value: "Financial independence already reached", kind: "warning" });
      } else {
        outputs.push({ label: "Years to FI", value: formatYears(r.yearsToFi), kind: "years" });
      }
      return outputs;
    },
  },
  {
    id: "emergency",
    name: "Emergency Fund Calculator",
    tagline: "Size your cash buffer and see what you still have to save.",
    icon: "🛟",
    inputs: [
      { key: "monthlyExpenses", label: "Monthly Essential Expenses", kind: "currency", min: 500, max: 50000, step: 250, default: 3000 },
      { key: "months", label: "Months of Cover", kind: "number", min: 1, max: 24, step: 1, default: 6 },
      { key: "currentSavings", label: "Current Savings Balance", kind: "currency", min: 0, max: 500000, step: 1000, default: 0 },
    ],
    compute: (v) => {
      const needed = emergencyFundNeeded(v.monthlyExpenses, v.months);
      const gap = needed - v.currentSavings;
      const coverage = emergencyFundCoverage(v.currentSavings, v.monthlyExpenses);
      const outputs: CalcOutput[] = [
        { label: "Recommended Emergency Fund", value: formatMoney(needed), kind: "currency" },
        {
          label: gap > 0 ? "Still to Save" : "Surplus",
          value: formatMoney(Math.abs(gap)),
          kind: gap > 0 ? "currency" : "warning",
        },
      ];
      if (v.currentSavings > 0) {
        outputs.push({
          label: "Your Current Coverage",
          value: coverage === null ? "—" : `${coverage.toFixed(1)} months`,
          kind: "plain",
        });
      }
      return outputs;
    },
  },
  {
    id: "networth",
    name: "Net Worth Calculator",
    tagline: "Sum your assets and liabilities to see your true financial position.",
    icon: "🧮",
    inputs: [
      { key: "cash", label: "Cash & Savings", kind: "currency", min: 0, max: 5000000, step: 1000, default: 10000 },
      { key: "investments", label: "Investments", kind: "currency", min: 0, max: 50000000, step: 10000, default: 40000 },
      { key: "property", label: "Property / Home Equity", kind: "currency", min: 0, max: 100000000, step: 10000, default: 200000 },
      { key: "vehicles", label: "Vehicles & Valuables", kind: "currency", min: 0, max: 5000000, step: 5000, default: 15000 },
      { key: "otherAssets", label: "Other Assets", kind: "currency", min: 0, max: 5000000, step: 5000, default: 5000 },
      { key: "mortgage", label: "Mortgage Balance", kind: "currency", min: 0, max: 100000000, step: 10000, default: 150000 },
      { key: "loans", label: "Other Loans", kind: "currency", min: 0, max: 10000000, step: 5000, default: 20000 },
      { key: "creditCards", label: "Credit Card Balances", kind: "currency", min: 0, max: 1000000, step: 1000, default: 5000 },
      { key: "otherLiabilities", label: "Other Liabilities", kind: "currency", min: 0, max: 10000000, step: 5000, default: 0 },
    ],
    compute: (v) => {
      const r = computeNetWorth({
        cash: v.cash,
        investments: v.investments,
        property: v.property,
        vehicles: v.vehicles,
        otherAssets: v.otherAssets,
        mortgage: v.mortgage,
        loans: v.loans,
        creditCards: v.creditCards,
        otherLiabilities: v.otherLiabilities,
      });
      return [
        { label: "Total Assets", value: formatMoney(r.totalAssets), kind: "currency" },
        { label: "Total Liabilities", value: formatMoney(r.totalLiabilities), kind: "currency" },
        { label: "Net Worth", value: formatMoney(r.netWorth), kind: "currency" },
        { label: "Debt-to-Assets Ratio", value: formatPercent(r.debtToAssetsRatio * 100), kind: "percent" },
      ];
    },
  },
];

export default CALCULATORS;
