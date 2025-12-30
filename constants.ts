import { CompanyMetrics, DealStructure } from './types';

// Scenario: Tech Giant (Acquirer) buying Streaming Platform (Target)
export const DEFAULT_ACQUIRER: CompanyMetrics = {
  name: "OmniCorp",
  domain: "microsoft.com",
  sharePrice: 150.00,
  sharesOutstanding: 2000, // 2B shares
  netIncome: 12000, // $12B Net Income
  revenue: 45000,
  ebitda: 18000,
};

export const DEFAULT_TARGET: CompanyMetrics = {
  name: "StreamLine",
  domain: "spotify.com",
  sharePrice: 45.00,
  sharesOutstanding: 400, // 400M shares
  netIncome: 800, // $800M Net Income
  revenue: 5500,
  ebitda: 1200,
};

export const DEFAULT_DEAL: DealStructure = {
  offerPremium: 25, // 25% Premium
  cashConsideration: 40, // 40% Cash / 60% Stock
  synergies: 300, // $300M Run-rate Synergies
  transactionFees: 50, // $50M Fees
  interestRateOnDebt: 5.5, // 5.5% Cost of Debt
  taxRate: 21, // 21% Corporate Tax
};