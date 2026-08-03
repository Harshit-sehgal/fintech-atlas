import { Category } from "./types";

// FinTech industry categories — domains that group companies by what they do.
// All descriptions are synthesized from official sources and review aggregators.

export const categories: Category[] = [
  {
    slug: "payments",
    name: "Payments & Processing",
    short: "The rails that move money between buyers, sellers, and banks.",
    description:
      "Payment processors sit between a business and the card networks (Visa, Mastercard) and banks. When a customer pays online, the processor authorizes the card, moves the money, settles it into the merchant's bank account, and handles fraud checks and chargebacks. This is the foundational layer of modern commerce — companies here charge a small percentage of each transaction.",
    icon: "card",
    accent: "#635BFF",
  },
  {
    slug: "neobanks",
    name: "Digital Banks (Neobanks)",
    short: "Mobile-first banks built without physical branches.",
    description:
      "Neobanks are financial apps that offer checking accounts, debit cards, and often credit — entirely through a smartphone, with no physical branches. Most partner with chartered banks to hold customer deposits under FDIC or equivalent deposit insurance. Their advantage is low fees, smooth app UX, and fast account opening.",
    icon: "bank",
    accent: "#00C389",
  },
  {
    slug: "investing",
    name: "Investing & Wealth",
    short: "Apps that let individuals buy stocks, ETFs, crypto, and more.",
    description:
      "Investing platforms democratize access to financial markets. They replaced $7–$10 stock trade commissions with zero-fee models, introduced fractional shares, and simplified interfaces so beginners can start with $1. They earn through payment for order flow, margin lending, subscriptions, and spreads.",
    icon: "chart",
    accent: "#FBB66B",
  },
  {
    slug: "cross-border",
    name: "Cross-Border & Foreign Exchange",
    short: "Sending money across countries without the bank markup.",
    description:
      "Traditional banks hide a fee inside a poor exchange rate when you send money abroad (the FX margin). Cross-border specialists quote the real mid-market rate and show fees transparently, making transfers dramatically cheaper and faster.",
    icon: "globe",
    accent: "#65a30d",
  },
  {
    slug: "bnpl",
    name: "Buy Now, Pay Later",
    short: "Split a purchase into interest-free installments at checkout.",
    description:
      "BNPL providers pay the merchant in full at the time of sale, then collect the amount from the shopper in fixed installments (often four payments). Merchants pay a fee because BNPL increases conversion and average order value.",
    icon: "tag",
    accent: "#FFA8CD",
  },
  {
    slug: "infrastructure",
    name: "Financial Infrastructure & APIs",
    short: "The plumbing other fintechs and banks build on.",
    description:
      "These companies provide the invisible building blocks: open banking APIs connecting apps to bank accounts, programmable card issuing, core ledger systems, and compliance rails.",
    icon: "api",
    accent: "#0F6FFF",
  },
  {
    slug: "spend-management",
    name: "Corporate Spend & Cards",
    short: "Corporate cards, expense tracking, and automated accounts payable.",
    description:
      "Automating corporate expenses and vendor payments. Platforms provide physical and virtual corporate cards with built-in spending limits, automated receipt matching, and real-time expense reporting.",
    icon: "card",
    accent: "#8B5CF6",
  },
  {
    slug: "lending",
    name: "Lending & Business Finance",
    short: "Alternative credit, working capital, and revenue-based financing.",
    description:
      "Fintech lenders use real-time transaction data and banking metrics to underwrite loans in minutes instead of weeks, offering working capital, merchant advances, and peer-to-peer loans.",
    icon: "bank",
    accent: "#EC4899",
  },
  {
    slug: "payroll-hr",
    name: "Payroll & Global HR",
    short: "Automated payroll, tax withholding, and global employment.",
    description:
      "Platforms that handle payroll, tax filings, benefits administration, and international EOR (Employer of Record) services for global remote teams.",
    icon: "api",
    accent: "#10B981",
  },
  {
    slug: "fraud-security",
    name: "Identity & Risk Management",
    short: "Automated KYC, AML compliance, and AI fraud prevention.",
    description:
      "Securing financial transactions through identity verification, biometrics, sanction screening, and machine-learning fraud detection.",
    icon: "api",
    accent: "#EF4444",
  },
  {
    slug: "insurtech",
    name: "InsurTech",
    short: "Digital insurance underwriting, policy management, and claims.",
    description:
      "Reinventing insurance with instant online quotes, AI-driven underwriting, digital claims processing, and parametric coverage.",
    icon: "tag",
    accent: "#3B82F6",
  },
  {
    slug: "proptech",
    name: "Real Estate & Mortgage FinTech",
    short: "Digital mortgages, home equity, and property investment.",
    description:
      "Streamlining mortgage pre-approval, closing documents, fractional real estate investment, and tech-enabled home buying.",
    icon: "globe",
    accent: "#F59E0B",
  },
] as const;

export default categories;
