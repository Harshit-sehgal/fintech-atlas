/**
 * Pure math for the personal-finance calculators, extracted so the
 * calculations are unit-testable without React.
 *
 * All rates are annual percentages (e.g. 12 = 12% per year) and all amounts
 * are in a single currency (default USD). Functions return `null` for
 * mathematically undefined inputs (non-positive principals, zero time, etc.)
 * so the UI can show a graceful message instead of NaN/Infinity.
 *
 * NOTE: These are simplified, illustrative models — they do not model taxes,
 * fees, inflation on contributions, lump-sum compounding quirks, or
 * variability of returns. Verify assumptions with a qualified advisor.
 */

function monthlyRate(annualPercent: number): number {
  return annualPercent / 100 / 12;
}

function clampNonNegative(value: number): number {
  return Math.max(0, value);
}

export interface SipResult {
  /** Amount invested over the period. */
  invested: number;
  /** Projected corpus value at the end of the period. */
  futureValue: number;
  /** Growth over invested principal. */
  gains: number;
  /** Number of months in the period. */
  months: number;
}

/**
 * Systematic Investment Plan (SIP) — fixed monthly contribution invested at
 * the start of each month, compounded monthly at the annual return.
 *
 *   FV = P × [((1+i)^n − 1) / i] × (1+i)
 */
export function computeSip(
  monthlyContribution: number,
  annualReturnPercent: number,
  years: number,
): SipResult | null {
  if (monthlyContribution <= 0 || years <= 0) return null;
  const months = Math.round(years * 12);
  const i = monthlyRate(annualReturnPercent);
  const invested = monthlyContribution * months;
  const futureValue = i > 0
    ? monthlyContribution * ((Math.pow(1 + i, months) - 1) / i) * (1 + i)
    : invested;
  return { invested, futureValue, gains: futureValue - invested, months };
}

export interface SwpResult {
  /** Total withdrawn over the lifetime of the corpus, or null if it never depletes. */
  totalWithdrawn: number | null;
  /** Months until the corpus is exhausted, or null if it never runs out. */
  monthsUntilDepleted: number | null;
  /** Human-readable lifetime (e.g. "24.3 years") or an assumption-qualified indefinite label. */
  lifetimeLabel: string;
}

/**
 * Systematic Withdrawal Plan (SWP) — an initial corpus supports a fixed
 * monthly withdrawal, compounded at the annual return. If monthly income from
 * the corpus (return on the balance) covers the withdrawal, the corpus never
 * depletes and `monthsUntilDepleted` is `null`.
 */
export function computeSwp(
  corpus: number,
  monthlyWithdrawal: number,
  annualReturnPercent: number,
): SwpResult | null {
  if (corpus <= 0 || monthlyWithdrawal <= 0) return null;
  const i = monthlyRate(annualReturnPercent);

  if (i > 0 && monthlyWithdrawal <= corpus * i) {
    return {
      totalWithdrawn: null,
      monthsUntilDepleted: null,
      lifetimeLabel: "Indefinite under this fixed-return assumption",
    };
  }

  const months =
    i > 0
      ? Math.log(monthlyWithdrawal / (monthlyWithdrawal - corpus * i)) / Math.log(1 + i)
      : Math.ceil(corpus / monthlyWithdrawal);

  const wholeMonths = Math.ceil(months);
  const years = months / 12;
  return {
    totalWithdrawn: wholeMonths * monthlyWithdrawal,
    monthsUntilDepleted: wholeMonths,
    lifetimeLabel: `${years.toFixed(1)} years`,
  };
}

export interface EmiResult {
  /** Monthly installment. */
  emi: number;
  /** Total paid over the full term. */
  totalPayment: number;
  /** Interest paid over the full term. */
  totalInterest: number;
}

/**
 * Equated Monthly Installment (EMI) for a fixed-rate amortizing loan.
 *
 *   EMI = P × i × (1+i)^n / ((1+i)^n − 1)
 */
export function computeEmi(
  principal: number,
  annualRatePercent: number,
  years: number,
): EmiResult | null {
  if (principal <= 0 || years <= 0) return null;
  const i = monthlyRate(annualRatePercent);
  const months = Math.round(years * 12);

  const emi = i > 0
    ? (principal * i * Math.pow(1 + i, months)) / (Math.pow(1 + i, months) - 1)
    : principal / months;
  const totalPayment = emi * months;
  return { emi, totalPayment, totalInterest: totalPayment - principal };
}

/** Compound annual growth rate over `years`, as a percentage. */
export function computeCagr(
  initialValue: number,
  finalValue: number,
  years: number,
): number | null {
  if (initialValue <= 0 || years <= 0 || finalValue < 0) return null;
  if (finalValue === 0) return -100;
  return (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;
}

/** Future value of an amount after `years` of inflation at the given rate. */
export function inflate(
  amount: number,
  annualInflationPercent: number,
  years: number,
): number {
  return amount * Math.pow(1 + annualInflationPercent / 100, years);
}

export interface RetirementResult {
  /** Inflation-adjusted annual expense at retirement age. */
  annualExpenseAtRetirement: number;
  /** Corpus required at retirement (conservative annuity model). */
  corpusNeeded: number;
  /** Monthly contribution (SIP-style, start of month) needed to reach it. */
  requiredMonthlyContribution: number;
  /** Years until retirement. */
  yearsToRetirement: number;
}

/**
 * Retirement planning — inflation-adjust current monthly expenses to the
 * retirement date, then value the retirement-income stream with a real
 * (inflation-adjusted) rate of return. The corpus is treated as an annuity
 * funding `retirementYears` of withdrawals.
 */
export function computeRetirement(
  currentMonthlyExpense: number,
  annualInflationPercent: number,
  yearsToRetirement: number,
  retirementYears: number,
  accumulationReturnPercent: number,
  retirementReturnPercent = accumulationReturnPercent,
  currentSavings = 0,
): RetirementResult | null {
  if (currentMonthlyExpense <= 0 || yearsToRetirement < 0 || retirementYears <= 0) return null;

  const annualExpenseAtRetirement =
    currentMonthlyExpense * 12 * inflate(1, annualInflationPercent, yearsToRetirement);

  const realReturnPercent =
    annualInflationPercent >= 100
      ? 0
      : ((1 + retirementReturnPercent / 100) / (1 + annualInflationPercent / 100) - 1) * 100;
  const real = realReturnPercent / 100;

  const corpusNeeded = real > 0
    ? annualExpenseAtRetirement * ((1 - Math.pow(1 + real, -retirementYears)) / real)
    : annualExpenseAtRetirement * retirementYears;

  const contribution = requiredSip(
    corpusNeeded,
    accumulationReturnPercent,
    yearsToRetirement,
    currentSavings,
  );
  return {
    annualExpenseAtRetirement,
    corpusNeeded,
    requiredMonthlyContribution: contribution,
    yearsToRetirement,
  };
}

/**
 * Monthly contribution (start-of-month SIP) needed to reach a target corpus,
 * after allowing for an optional existing lump-sum balance.
 */
export function requiredSip(
  targetCorpus: number,
  annualReturnPercent: number,
  years: number,
  currentSavings = 0,
): number {
  if (targetCorpus <= 0) return 0;
  if (years <= 0) return Math.max(0, targetCorpus - clampNonNegative(currentSavings));
  const months = Math.round(years * 12);
  const i = monthlyRate(annualReturnPercent);
  const existing = clampNonNegative(currentSavings) * Math.pow(1 + i, months);
  const remaining = Math.max(0, targetCorpus - existing);
  if (remaining === 0) return 0;
  if (i <= 0) return remaining / months;
  return remaining / (((Math.pow(1 + i, months) - 1) / i) * (1 + i));
}

export interface FireResult {
  /** The FIRE target corpus. */
  fireNumber: number;
  /** Years to reach FI with the current assets and monthly contribution. */
  yearsToFi: number;
  /** True when FI is already reached. */
  alreadyReached: boolean;
}

/**
 * FIRE (Financial Independence, Retire Early) number and time-to-FI.
 *
 *   FIRE number = annual expenses / safe withdrawal rate
 *   Months to FI = ln((T + C/i) / (A + C/i)) / ln(1+i)
 *   Years to FI  = Months to FI / 12
 */
export function computeFire(
  annualExpenses: number,
  safeWithdrawalRatePercent: number,
  currentAssets: number,
  monthlyContribution: number,
  annualReturnPercent: number,
): FireResult | null {
  if (annualExpenses <= 0 || safeWithdrawalRatePercent <= 0) return null;
  const fireNumber = annualExpenses / (safeWithdrawalRatePercent / 100);
  const assets = clampNonNegative(currentAssets);
  const contribution = clampNonNegative(monthlyContribution);
  const i = monthlyRate(annualReturnPercent);

  let yearsToFi = 0;
  let alreadyReached = assets >= fireNumber;
  if (!alreadyReached && fireNumber > assets) {
    if (i > 0 && contribution > 0) {
      yearsToFi = Math.log((fireNumber + contribution / i) / (assets + contribution / i)) / Math.log(1 + i) / 12;
    } else if (i > 0 && contribution === 0) {
      yearsToFi = assets > 0 ? Math.log(fireNumber / assets) / Math.log(1 + i) / 12 : Infinity;
    } else if (contribution > 0) {
      yearsToFi = (fireNumber - assets) / (contribution * 12);
    } else {
      yearsToFi = Infinity;
    }
  } else if (assets >= fireNumber) {
    alreadyReached = true;
  }

  if (!Number.isFinite(yearsToFi)) return null;
  return { fireNumber, yearsToFi: Math.max(0, yearsToFi), alreadyReached };
}

/** Total emergency fund needed for `months` of `monthlyExpenses`. */
export function emergencyFundNeeded(
  monthlyExpenses: number,
  months: number,
): number {
  return Math.max(0, monthlyExpenses) * Math.max(0, months);
}

/** How many months a given savings balance covers at the monthly expense rate. */
export function emergencyFundCoverage(
  savings: number,
  monthlyExpenses: number,
): number | null {
  if (monthlyExpenses <= 0) return null;
  return Math.max(0, savings) / monthlyExpenses;
}

export interface NetWorthInputs {
  cash: number;
  investments: number;
  property: number;
  vehicles: number;
  otherAssets: number;
  mortgage: number;
  loans: number;
  creditCards: number;
  otherLiabilities: number;
}

export interface NetWorthResult {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  debtToAssetsRatio: number;
}

/** Sum of assets and liabilities, plus the net figure and a debt ratio. */
export function computeNetWorth(inputs: NetWorthInputs): NetWorthResult {
  const { cash, investments, property, vehicles, otherAssets } = inputs;
  const { mortgage, loans, creditCards, otherLiabilities } = inputs;
  const totalAssets = clampNonNegative(cash) + clampNonNegative(investments) +
    clampNonNegative(property) + clampNonNegative(vehicles) + clampNonNegative(otherAssets);
  const totalLiabilities = clampNonNegative(mortgage) + clampNonNegative(loans) +
    clampNonNegative(creditCards) + clampNonNegative(otherLiabilities);
  const netWorth = totalAssets - totalLiabilities;
  const debtToAssetsRatio = totalAssets > 0 ? totalLiabilities / totalAssets : 0;
  return { totalAssets, totalLiabilities, netWorth, debtToAssetsRatio };
}
