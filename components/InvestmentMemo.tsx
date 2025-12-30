import React, { useState } from 'react';
import { generateInvestmentMemo } from '../services/geminiService';
import { CompanyMetrics, DealStructure, SimulationResult } from '../types';
import { Sparkles, FileText, Loader2, Copy, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface InvestmentMemoProps {
  acquirer: CompanyMetrics;
  target: CompanyMetrics;
  deal: DealStructure;
  result: SimulationResult;
}

const InvestmentMemo: React.FC<InvestmentMemoProps> = ({ acquirer, target, deal, result }) => {
  const [memo, setMemo] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerate = async () => {
    setLoading(true);
    const text = await generateInvestmentMemo(acquirer, target, deal, result);
    setMemo(text);
    setLoading(false);
  };

  return (
    <div className="mt-8 bg-zinc-900/60 rounded-xl border border-zinc-800 overflow-hidden shadow-2xl relative">
      {/* Decorative top border */}
      <div className="h-1 w-full bg-gradient-to-r from-zinc-800 via-amber-600 to-zinc-800"></div>
      
      <div className="bg-zinc-900/80 p-5 border-b border-zinc-800 flex justify-between items-center backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/10 p-2 rounded-lg">
             <Bot size={20} className="text-amber-500" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-zinc-100 tracking-tight">Investment Committee Memo</h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">AI Generated Executive Summary</p>
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="group flex items-center gap-2 px-5 py-2.5 bg-zinc-100 hover:bg-white text-zinc-900 text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-zinc-900/20 active:scale-95"
        >
          {loading ? <Loader2 size={16} className="animate-spin text-amber-600" /> : <Sparkles size={16} className="text-amber-600 group-hover:text-amber-500 transition-colors" />}
          {loading ? 'Drafting Analysis...' : 'Generate Memo'}
        </button>
      </div>

      <div className="p-8 min-h-[250px] bg-zinc-950/40">
        {!memo && !loading && (
          <div className="flex flex-col items-center justify-center h-48 text-zinc-600 gap-4">
            <div className="p-4 bg-zinc-900 rounded-full border border-zinc-800">
               <FileText size={32} className="opacity-40" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-zinc-400">Ready to draft</p>
              <p className="text-xs text-zinc-600">Click "Generate Memo" to synthesize financial data into a deal summary.</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center h-48 gap-4">
            <Loader2 size={32} className="animate-spin text-amber-500" />
            <p className="text-sm font-mono text-amber-500/80 animate-pulse">Running Gemini 2.0 financial models...</p>
          </div>
        )}

        {memo && !loading && (
          <div className="prose prose-invert prose-sm max-w-none prose-headings:text-zinc-100 prose-p:text-zinc-400 prose-strong:text-amber-400 prose-li:text-zinc-300">
            <ReactMarkdown
               components={{
                h2: ({node, ...props}) => <h2 className="text-lg font-bold text-zinc-100 border-b border-zinc-800 pb-2 mb-4 mt-6 tracking-tight uppercase" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-sm font-bold text-zinc-300 mt-4 mb-2 uppercase tracking-wide" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-2 text-zinc-400 my-4" {...props} />,
                li: ({node, ...props}) => <li className="pl-1" {...props} />,
                strong: ({node, ...props}) => <strong className="text-amber-400 font-semibold" {...props} />,
                p: ({node, ...props}) => <p className="leading-relaxed mb-4 text-zinc-400" {...props} />
              }}
            >
              {memo}
            </ReactMarkdown>
            
            <div className="mt-8 pt-4 border-t border-zinc-800 flex justify-end">
               <button 
                onClick={() => navigator.clipboard.writeText(memo)}
                className="text-xs font-medium text-zinc-500 hover:text-amber-400 flex items-center gap-1.5 transition-colors uppercase tracking-wider"
               >
                 <Copy size={12} /> Copy to Clipboard
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentMemo;