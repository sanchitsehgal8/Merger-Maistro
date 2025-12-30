import React from 'react';
import { SimulationResult, DealStructure, CompanyMetrics } from '../types';
import { formatCurrency, formatPercent, formatLargeNumber } from '../utils/calculations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Scale, PieChart, Wallet, Activity, Plus, ArrowRight } from 'lucide-react';

interface ResultsDashboardProps {
  result: SimulationResult;
  deal: DealStructure;
  acquirer: CompanyMetrics;
  target: CompanyMetrics;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, deal, acquirer, target }) => {
  const isAccretive = result.accretionDilutionAmount >= 0;
  
  const epsData = [
    { name: 'Standalone', eps: result.acquirerEPS },
    { name: 'Pro Forma', eps: result.proFormaEPS },
  ];

  const CompanyLogo = ({ domain, name }: { domain?: string, name: string }) => {
    const [error, setError] = React.useState(false);
    if (domain && !error) {
      return (
        <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center p-1 overflow-hidden">
          <img 
            src={`https://logo.clearbit.com/${domain}`} 
            alt={name} 
            onError={() => setError(true)}
            className="w-full h-full object-contain"
          />
        </div>
      );
    }
    return (
      <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700 text-zinc-400 font-bold text-lg">
        {name.substring(0, 1)}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Visual Deal Header */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 py-4 mb-4">
         <div className="flex items-center gap-4">
            <CompanyLogo domain={acquirer.domain} name={acquirer.name} />
            <div className="text-right">
              <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Acquirer</div>
              <div className="text-lg font-bold text-zinc-200">{acquirer.name}</div>
            </div>
         </div>
         
         <div className="flex items-center gap-2 text-zinc-600 px-4">
            <Plus size={24} />
         </div>

         <div className="flex items-center gap-4 flex-row-reverse md:flex-row">
            <CompanyLogo domain={target.domain} name={target.name} />
            <div className="text-left">
              <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Target</div>
              <div className="text-lg font-bold text-zinc-200">{target.name}</div>
            </div>
         </div>
         
         <div className="hidden md:flex items-center gap-2 text-amber-500 px-4">
            <ArrowRight size={24} />
         </div>

         <div className="hidden md:block">
            <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Transaction Value</div>
            <div className="text-2xl font-mono font-bold text-amber-400">${(result.totalDealValue / 1000).toFixed(1)}B</div>
         </div>
      </div>

      {/* Top Level KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Accretion / (Dilution)" 
          value={formatPercent(result.accretionDilutionPercent * 100)}
          subValue={`${result.accretionDilutionAmount > 0 ? '+' : ''}${formatCurrency(result.accretionDilutionAmount)} / share`}
          trend={isAccretive ? 'up' : 'down'}
          highlight={true}
          icon={<Activity size={16} />}
        />
        <KPICard 
          title="Total Deal Value" 
          value={`$${(result.totalDealValue / 1000).toFixed(1)}B`}
          subValue={`$${result.offerPricePerShare.toFixed(2)} per share`}
          icon={<Scale size={16} />}
        />
        <KPICard 
          title="Pro Forma EPS" 
          value={formatCurrency(result.proFormaEPS)}
          subValue={`vs. ${formatCurrency(result.acquirerEPS)} Standalone`}
          icon={<Wallet size={16} />}
        />
        <KPICard 
          title="Implied P/E (Target)" 
          value={`${result.impliedPE.toFixed(1)}x`}
          subValue="Price / Earnings"
          icon={<PieChart size={16} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* EPS Bridge Chart */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 shadow-lg backdrop-blur-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">EPS Impact</h3>
             <div className="px-2 py-1 bg-zinc-800 rounded text-[10px] text-zinc-400 font-mono">FY2025E</div>
          </div>
          
          <div className="flex-grow min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={epsData} layout="vertical" margin={{ top: 5, right: 40, left: 20, bottom: 5 }} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                <XAxis type="number" domain={[0, 'auto']} stroke="#71717a" tickFormatter={(val) => `$${val}`} tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#a1a1aa" width={90} tick={{fontSize: 12, fontWeight: 500}} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#27272a'}}
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', color: '#f4f4f5', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#e4e4e7', fontFamily: 'monospace' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'EPS']}
                />
                <Bar dataKey="eps" radius={[0, 4, 4, 0]}>
                  {epsData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 0 ? '#52525b' : (isAccretive ? '#f59e0b' : '#ef4444')} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sources & Uses / Sensitivity */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 shadow-lg backdrop-blur-sm overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Deal Mechanics</h3>
             <div className="px-2 py-1 bg-zinc-800 rounded text-[10px] text-zinc-400 font-mono">Sources & Uses</div>
          </div>
          
          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-sm text-left text-zinc-300">
              <thead className="text-[10px] text-zinc-500 uppercase bg-zinc-950/50 border-b border-zinc-800">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold tracking-wider">Metric</th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold tracking-wider">Output</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                <tr className="group hover:bg-zinc-800/20 transition-colors">
                  <td className="px-4 py-3.5 font-medium text-zinc-400 group-hover:text-zinc-200">New Shares Issued</td>
                  <td className="px-4 py-3.5 text-right font-mono text-zinc-200">{formatLargeNumber(result.newSharesIssued)} M</td>
                </tr>
                <tr className="group hover:bg-zinc-800/20 transition-colors">
                  <td className="px-4 py-3.5 font-medium text-zinc-400 group-hover:text-zinc-200">Cash Consideration</td>
                  <td className="px-4 py-3.5 text-right font-mono text-zinc-200">${formatLargeNumber(result.cashRequired)} M</td>
                </tr>
                <tr className="group hover:bg-zinc-800/20 transition-colors">
                  <td className="px-4 py-3.5 font-medium text-zinc-400 group-hover:text-zinc-200">Stock Consideration</td>
                  <td className="px-4 py-3.5 text-right font-mono text-zinc-200">${formatLargeNumber(result.stockRequired)} M</td>
                </tr>
                <tr className="bg-amber-900/10 hover:bg-amber-900/20 transition-colors border-l-2 border-amber-500">
                  <td className="px-4 py-3.5 font-medium text-amber-500">Breakeven Synergies</td>
                  <td className="px-4 py-3.5 text-right font-mono text-amber-400 font-bold">${formatLargeNumber(result.breakevenSynergies)} M</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// KPI Card Component
const KPICard = ({ title, value, subValue, trend, highlight, icon }: any) => (
  <div className={`
    relative p-6 rounded-xl border transition-all duration-300 group
    ${highlight && trend === 'up' ? 'bg-gradient-to-br from-zinc-900 to-zinc-900 border-amber-500/50 shadow-lg shadow-amber-900/10' : 
      highlight && trend === 'down' ? 'bg-zinc-900 border-rose-500/50' : 
      'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'}
  `}>
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-2">
        <h4 className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">{title}</h4>
      </div>
      {icon && <div className={`${highlight ? 'text-amber-500' : 'text-zinc-600'} opacity-80`}>{icon}</div>}
    </div>
    
    <div className="flex items-baseline gap-2">
       <div className={`text-2xl font-bold font-mono tracking-tight ${highlight ? (trend === 'up' ? 'text-amber-400' : 'text-rose-400') : 'text-zinc-100'}`}>
        {value}
      </div>
    </div>
    
    <div className="flex items-center gap-2 mt-2">
      {trend && (
        <div className={`flex items-center text-xs font-bold ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
          {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        </div>
      )}
      <div className="text-xs text-zinc-500 font-medium">{subValue}</div>
    </div>
  </div>
);

export default ResultsDashboard;