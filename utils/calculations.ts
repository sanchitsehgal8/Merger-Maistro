import { CompanyMetrics, DealStructure, SimulationResult } from '../types';

export const calculateEPS = (netIncome: number, shares: number) => {
  return shares === 0 ? 0 : netIncome / shares;
};

export const runSimulation = (
  acquirer: CompanyMetrics,
  target: CompanyMetrics,
  deal: DealStructure
): SimulationResult => {
  
  // 1. Deal Valuation
  const offerPricePerShare = target.sharePrice * (1 + deal.offerPremium / 100);
  const totalDealValue = offerPricePerShare * target.sharesOutstanding;
  
  // 2. Consideration Mix
  const cashRequired = totalDealValue * (deal.cashConsideration / 100);
  const stockRequired = totalDealValue * ((100 - deal.cashConsideration) / 100);
  
  // 3. Stock Issuance
  const newSharesIssued = stockRequired / acquirer.sharePrice;
  
  // 4. Standalone EPS
  const acquirerEPS = calculateEPS(acquirer.netIncome, acquirer.sharesOutstanding);
  const targetEPS = calculateEPS(target.netIncome, target.sharesOutstanding);
  
  // 5. Adjustments for Pro Forma Net Income
  // (A) Synergies (Tax affected)
  const afterTaxSynergies = deal.synergies * (1 - deal.taxRate / 100);
  
  // (B) Interest Expense on New Debt / Foregone Interest on Cash (Tax affected)
  // Assuming cash used has an opportunity cost equal to the debt rate for simplicity
  const preTaxInterestExpense = cashRequired * (deal.interestRateOnDebt / 100);
  const afterTaxInterestExpense = preTaxInterestExpense * (1 - deal.taxRate / 100);
  
  // (C) One-time fees (Assumed amortized or ignored for run-rate EPS, but usually removed from cash. 
  // For simpliciy, we ignore one-off impact on run-rate EPS).

  // 6. Pro Forma Calculation
  const proFormaNetIncome = 
    acquirer.netIncome + 
    target.netIncome + 
    afterTaxSynergies - 
    afterTaxInterestExpense;
    
  const proFormaShares = acquirer.sharesOutstanding + newSharesIssued;
  const proFormaEPS = calculateEPS(proFormaNetIncome, proFormaShares);
  
  // 7. Accretion / Dilution
  const accretionDilutionAmount = proFormaEPS - acquirerEPS;
  const accretionDilutionPercent = (accretionDilutionAmount / acquirerEPS) * 100;

  // 8. Breakeven Synergies (Solve for Synergies where Accretion = 0)
  // PF EPS = Acquirer EPS => (NI_A + NI_B + Synergies_AT - Int_AT) / Shares_PF = NI_A / Shares_A
  // This is a derived heuristic for the dashboard
  const requiredPFNetIncome = acquirerEPS * proFormaShares;
  const currentPFNetIncomeExSynergies = acquirer.netIncome + target.netIncome - afterTaxInterestExpense;
  const requiredSynergiesAfterTax = requiredPFNetIncome - currentPFNetIncomeExSynergies;
  const breakevenSynergies = requiredSynergiesAfterTax / (1 - deal.taxRate / 100);

  return {
    offerPricePerShare,
    totalDealValue,
    cashRequired,
    stockRequired,
    newSharesIssued,
    acquirerEPS,
    targetEPS,
    proFormaNetIncome,
    proFormaShares,
    proFormaEPS,
    accretionDilutionAmount,
    accretionDilutionPercent,
    impliedPE: totalDealValue / target.netIncome,
    breakevenSynergies: Math.max(0, breakevenSynergies)
  };
};

export const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
};

export const formatLargeNumber = (val: number) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(val);
};

export const formatPercent = (val: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(val / 100);
};
