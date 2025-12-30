import React, { useState, useEffect } from 'react';
import InputSection from './components/InputSection';
import ResultsDashboard from './components/ResultsDashboard';
import InvestmentMemo from './components/InvestmentMemo';
import { CompanyMetrics, DealStructure, SimulationResult } from './types';
import { DEFAULT_ACQUIRER, DEFAULT_TARGET, DEFAULT_DEAL } from './constants';
import { runSimulation } from './utils/calculations';
import { Landmark, Info, TrendingUp } from 'lucide-react';

const App: React.FC = () => {
  const [acquirer, setAcquirer] = useState<CompanyMetrics>(DEFAULT_ACQUIRER);
  const [target, setTarget] = useState<CompanyMetrics>(DEFAULT_TARGET);
  const [deal, setDeal] = useState<DealStructure>(DEFAULT_DEAL);
  
  // Initial run
  const [result, setResult] = useState<SimulationResult>(() => 
    runSimulation(DEFAULT_ACQUIRER, DEFAULT_TARGET, DEFAULT_DEAL)
  );

  // Recalculate whenever inputs change
  useEffect(() => {
    const newResult = runSimulation(acquirer, target, deal);
    setResult(newResult);
  }, [acquirer, target, deal]);

  return (
    <div className="min-h-screen bg-zinc-950 pb-20 relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-900/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* Header / Nav */}
      <header className="bg-zinc-950/80 border-b border-zinc-800 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-amber-500 to-yellow-600 p-2 rounded-lg shadow-lg shadow-amber-900/20">
              <Landmark className="text-white h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-100 tracking-tight">
                Merger<span className="text-amber-500">Maestro</span>
              </h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-semibold">Institutional Analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              Live Model
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro Banner */}
        <div className="mb-8 p-5 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-900/50 border border-zinc-800/50 shadow-sm flex items-start gap-4">
          <div className="p-2 bg-zinc-800 rounded-lg text-amber-500">
            <TrendingUp size={20} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-200">Deal Simulation Environment</h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed max-w-3xl">
              Model complex M&A scenarios with institutional-grade precision. Adjust leverage, synergies, and offer premiums to instantly visualize pro forma impacts.
            </p>
          </div>
        </div>

        {/* Financial Inputs */}
        <InputSection 
          acquirer={acquirer} setAcquirer={setAcquirer}
          target={target} setTarget={setTarget}
          deal={deal} setDeal={setDeal}
        />

        {/* Results Visualization */}
        <ResultsDashboard 
          result={result} 
          deal={deal} 
          acquirer={acquirer} 
          target={target}
        />

        {/* AI Integration */}
        <InvestmentMemo 
          acquirer={acquirer} 
          target={target} 
          deal={deal} 
          result={result}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 mt-12 py-8 bg-zinc-950 relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-zinc-600 text-sm font-medium">
            MergerMaestro &copy; 2025. Powered by Google Gemini.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;