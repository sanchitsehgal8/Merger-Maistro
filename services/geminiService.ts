import { GoogleGenAI } from "@google/genai";
import { CompanyMetrics, DealStructure, SimulationResult } from '../types';

export const generateInvestmentMemo = async (
  acquirer: CompanyMetrics,
  target: CompanyMetrics,
  deal: DealStructure,
  result: SimulationResult
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "## API Key Missing\n\nPlease ensure the `API_KEY` environment variable is set to generate the AI Investment Memo.";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    You are a Managing Director at a top-tier Investment Bank (Goldman Sachs / Morgan Stanley). 
    Write a concise, professional Executive Summary for an M&A model.
    
    **Deal Overview:**
    Acquirer: ${acquirer.name}
    Target: ${target.name}
    
    **Financials:**
    - Offer Price: $${result.offerPricePerShare.toFixed(2)} (${deal.offerPremium}% Premium)
    - Total Transaction Value: $${(result.totalDealValue / 1000).toFixed(2)} Billion
    - Consideration: ${deal.cashConsideration}% Cash, ${100 - deal.cashConsideration}% Stock
    
    **Accretion/Dilution Analysis:**
    - Status: ${result.accretionDilutionAmount >= 0 ? 'ACCRETIVE' : 'DILUTIVE'}
    - Impact: ${result.accretionDilutionPercent.toFixed(2)}% to FY EPS
    - Pro Forma EPS: $${result.proFormaEPS.toFixed(2)} (vs Standalone $${result.acquirerEPS.toFixed(2)})
    - Synergies Included: $${deal.synergies}M
    - Breakeven Synergies Needed: $${result.breakevenSynergies.toFixed(1)}M
    
    **Instructions:**
    1. Start with a "Strategic Rationale" section analyzing why this deal might make sense (invent plausible strategic reasons based on a Tech Giant buying a Streamer scenario, or generic if names are generic).
    2. Provide a "Financial Impact" section summarizing the accretion/dilution and valuation.
    3. End with a "Risk Factors" bullet list (e.g., integration risk, synergy realization).
    4. Keep it crisp, use professional finance terminology, and format in Markdown.
    5. Do NOT include greetings. Go straight to the content.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text || "Unable to generate analysis.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating investment memo. Please check API Key and quotas.";
  }
};
