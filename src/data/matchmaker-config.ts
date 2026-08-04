/**
 * FinTech Matchmaker Quiz — scoring matrix and question definitions.
 *
 * The quiz uses a weighted scoring system where each answer adds points to
 * relevant companies. Update weights when adding/removing questions or when
 * adjusting the relative importance of answer choices.
 */

export interface MatchmakerQuestion {
  id: keyof QuizState;
  title: string;
  description: string;
  options: MatchmakerOption[];
}

export interface MatchmakerOption {
  id: string;
  title: string;
  description: string;
}

/**
 * State collected during the quiz. Stored in React state and used to compute
 * the final company scores.
 */
export interface QuizState {
  userType: string;
  priority: string;
  globalNeed: string;
  scale: string;
}

/** Weight matrix: [questionId][optionId][companySlug] = points */
export const SCORE_WEIGHTS: Record<
  keyof QuizState,
  Record<string, Record<string, number>>
> = {
  userType: {
    ecommerce: {
      stripe: 4,
      adyen: 3,
      paypal: 2,
      razorpay: 4,
      cashfree: 3,
    },
    saas: {
      stripe: 4,
      adyen: 3,
      paypal: 2,
      razorpay: 4,
      cashfree: 2,
    },
    retail: {
      square: 5,
      stripe: 2,
    },
    startup: {
      brex: 4,
      gusto: 3,
      stripe: 2,
      revolut: 2,
      razorpay: 3,
    },
    personal: {
      chime: 4,
      robinhood: 3,
      wise: 3,
      revolut: 3,
      phonepe: 3,
      paytm: 2,
    },
    freelancer: {
      payoneer: 4,
      wise: 3,
      paypal: 2,
    },
  },
  priority: {
    api: {
      stripe: 3,
      plaid: 4,
      adyen: 2,
      razorpay: 3,
      cashfree: 3,
    },
    low_fee: {
      wise: 4,
      chime: 3,
      brex: 3,
      razorpay: 2,
      cashfree: 2,
      payoneer: 2,
    },
    trust: {
      paypal: 4,
      nubank: 3,
      paytm: 2,
    },
    all_in_one: {
      square: 4,
      paypal: 3,
      wise: 3,
      chime: 2,
      phonepe: 3,
      paytm: 3,
    },
  },
  globalNeed: {
    high: {
      wise: 4,
      revolut: 4,
      adyen: 3,
      payoneer: 3,
      razorpay: 2,
    },
    low: {
      chime: 3,
      wise: 3,
      square: 2,
      razorpay: 3,
      cashfree: 3,
      phonepe: 2,
    },
  },
  scale: {
    early: {
      square: 3,
      wise: 3,
      stripe: 2,
      razorpay: 3,
      cashfree: 2,
      payoneer: 2,
    },
    growing: {
      stripe: 4,
      brex: 3,
      gusto: 3,
      razorpay: 3,
      cashfree: 2,
    },
    enterprise: {
      adyen: 5,
      stripe: 4,
      razorpay: 2,
    },
  },
};

export const QUESTIONS: MatchmakerQuestion[] = [
  {
    id: "userType",
    title: "Who are you or what is your business?",
    description: "Select the option that best describes your primary identity or use case.",
    options: [
      {
        id: "saas",
        title: "Online Business / SaaS",
        description: "Digital products, subscriptions, global customers",
      },
      {
        id: "ecommerce",
        title: "E-Commerce Store",
        description: "Physical goods checkout, carts, online payments",
      },
      {
        id: "freelancer",
        title: "Freelancer / Independent",
        description: "International client payments, FX payouts, invoices",
      },
      {
        id: "retail",
        title: "In-Person Store / POS",
        description: "Physical storefront, card reader, hardware",
      },
      {
        id: "startup",
        title: "Startup / Tech Business",
        description: "Corporate cards, business banking, expenses",
      },
      {
        id: "personal",
        title: "Individual / Personal",
        description: "Personal banking, investing, money transfers",
      },
    ],
  },
  {
    id: "priority",
    title: "What is your top priority?",
    description: "Choose the factor that matters most when evaluating FinTech services.",
    options: [
      {
        id: "api",
        title: "Developer APIs & Customization",
        description: "Complete code control, custom workflows",
      },
      {
        id: "low_fee",
        title: "Lowest Possible Fees",
        description: "Maximum savings on transactions & FX",
      },
      {
        id: "trust",
        title: "Max Customer Conversion & Trust",
        description: "Recognized brand checkout (e.g. PayPal)",
      },
      {
        id: "all_in_one",
        title: "Ease of Use / All-in-One",
        description: "Simple setup with no code required",
      },
    ],
  },
  {
    id: "globalNeed",
    title: "Do you need multi-currency or international capabilities?",
    description: "Assess whether your operations require cross-border functionality.",
    options: [
      {
        id: "high",
        title: "Yes — High International Need",
        description: "Selling abroad, multi-currency balances, cross-border payouts",
      },
      {
        id: "low",
        title: "No — Domestic Focus Only",
        description: "Operating primarily within one country/currency",
      },
    ],
  },
  {
    id: "scale",
    title: "What is your volume or operation scale?",
    description: "Estimate your typical monthly transaction volume or business scale.",
    options: [
      {
        id: "early",
        title: "Early Stage / Individual",
        description: "Starting out, low initial volume",
      },
      {
        id: "growing",
        title: "Growing Business",
        description: "$10k to $100k monthly volume",
      },
      {
        id: "enterprise",
        title: "Enterprise / High Volume",
        description: "$100k+ monthly processing, custom contracts",
      },
    ],
  },
];

/**
 * Capability-based scoring (audit #30). Each selectable answer is mapped to a
 * set of capability requirements; a company scores points for each requirement
 * its capabilities satisfy. This generalises the old slug→points matrix so any
 * company described in COMPANY_CAPABILITIES can be recommended, and new
 * companies are scored automatically from their capabilities.
 */
export type CapabilityDimension = "useCases" | "customerTypes" | "channels" | "features";

export interface CapabilityRequirement {
  dimension: CapabilityDimension;
  value: string;
  points: number;
}

export const ANSWER_CAPABILITIES: Record<
  keyof QuizState,
  Record<string, CapabilityRequirement[]>
> = {
  userType: {
    saas: [
      { dimension: "customerTypes", value: "saas", points: 4 },
      { dimension: "useCases", value: "payments", points: 3 },
      { dimension: "features", value: "developer-apis", points: 3 },
    ],
    ecommerce: [
      { dimension: "useCases", value: "payments", points: 4 },
      { dimension: "customerTypes", value: "ecommerce", points: 3 },
      { dimension: "features", value: "multi-currency", points: 3 },
    ],
    freelancer: [
      { dimension: "features", value: "international", points: 4 },
      { dimension: "useCases", value: "transfers", points: 3 },
      { dimension: "features", value: "multi-currency", points: 3 },
      { dimension: "features", value: "low-fee", points: 2 },
    ],
    retail: [
      { dimension: "useCases", value: "pos", points: 4 },
      { dimension: "channels", value: "in-person", points: 3 },
      { dimension: "features", value: "hardware", points: 2 },
    ],
    startup: [
      { dimension: "customerTypes", value: "startup", points: 4 },
      { dimension: "useCases", value: "banking", points: 3 },
      { dimension: "useCases", value: "payroll", points: 2 },
    ],
    personal: [
      { dimension: "customerTypes", value: "personal", points: 4 },
      { dimension: "useCases", value: "banking", points: 3 },
      { dimension: "useCases", value: "investing", points: 2 },
    ],
  },
  priority: {
    api: [
      { dimension: "features", value: "developer-apis", points: 5 },
      { dimension: "channels", value: "api", points: 3 },
    ],
    low_fee: [
      { dimension: "features", value: "low-fee", points: 5 },
      { dimension: "features", value: "no-fees", points: 4 },
    ],
    trust: [{ dimension: "features", value: "trust", points: 5 }],
    all_in_one: [
      { dimension: "features", value: "all-in-one", points: 5 },
      { dimension: "features", value: "no-code", points: 3 },
    ],
  },
  globalNeed: {
    high: [
      { dimension: "features", value: "multi-currency", points: 4 },
      { dimension: "features", value: "international", points: 4 },
    ],
    low: [
      { dimension: "features", value: "no-fees", points: 3 },
      { dimension: "features", value: "low-fee", points: 2 },
    ],
  },
  scale: {
    early: [
      { dimension: "customerTypes", value: "startup", points: 3 },
      { dimension: "features", value: "no-code", points: 3 },
      { dimension: "useCases", value: "banking", points: 3 },
    ],
    growing: [
      { dimension: "customerTypes", value: "startup", points: 3 },
      { dimension: "features", value: "all-in-one", points: 4 },
      { dimension: "features", value: "developer-apis", points: 2 },
    ],
    enterprise: [
      { dimension: "customerTypes", value: "enterprise", points: 5 },
      { dimension: "features", value: "high-volume", points: 4 },
      { dimension: "features", value: "compliance", points: 3 },
    ],
  },
};