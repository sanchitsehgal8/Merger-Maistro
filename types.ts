export interface CompanyMetrics {
  name: string;
  domain?: string; // for logo fetching
  sharePrice: number;
  sharesOutstanding: number; // in millions
  netIncome: number; // in millions
  revenue: number; // in millions
  ebitda: number; // in millions
  peRatio?: number; // Calculated
}

export interface DealStructure {
  offerPremium: number; // %
  cashConsideration: number; // % (remainder is stock)
  synergies: number; // in millions (Pre-tax)
  transactionFees: number; // in millions
  interestRateOnDebt: number; // % (Cost of debt/cash)
  taxRate: number; // %
}

export interface SimulationResult {
  offerPricePerShare: number;
  totalDealValue: number;
  cashRequired: number;
  stockRequired: number;
  newSharesIssued: number;
  
  acquirerEPS: number;
  targetEPS: number;
  
  proFormaNetIncome: number;
  proFormaShares: number;
  proFormaEPS: number;
  
  accretionDilutionAmount: number;
  accretionDilutionPercent: number;
  
  impliedPE: number;
  breakevenSynergies: number;
}