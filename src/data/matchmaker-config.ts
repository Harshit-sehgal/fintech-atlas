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
    },
    saas: {
      stripe: 4,
      adyen: 3,
      paypal: 2,
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
    },
    personal: {
      chime: 4,
      robinhood: 3,
      wise: 3,
      revolut: 3,
    },
  },
  priority: {
    api: {
      stripe: 3,
      plaid: 4,
      adyen: 2,
    },
    low_fee: {
      wise: 4,
      chime: 3,
      brex: 3,
    },
    trust: {
      paypal: 4,
      nubank: 3,
    },
    all_in_one: {
      square: 4,
      paypal: 3,
      wise: 3,
      chime: 2,
    },
  },
  globalNeed: {
    high: {
      wise: 4,
      revolut: 4,
      adyen: 3,
    },
    low: {
      chime: 3,
      wise: 3,
      square: 2,
    },
  },
  scale: {
    early: {
      square: 3,
      wise: 3,
      stripe: 2,
    },
    growing: {
      stripe: 4,
      brex: 3,
      gusto: 3,
    },
    enterprise: {
      adyen: 5,
      stripe: 4,
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