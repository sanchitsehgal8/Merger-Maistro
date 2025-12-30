import React from 'react';
import { CompanyMetrics, DealStructure } from '../types';
import { RefreshCw, TrendingUp, DollarSign, Percent, Building2, Globe } from 'lucide-react';

interface InputSectionProps {
  acquirer: CompanyMetrics;
  setAcquirer: React.Dispatch<React.SetStateAction<CompanyMetrics>>;
  target: CompanyMetrics;
  setTarget: React.Dispatch<React.SetStateAction<CompanyMetrics>>;
  deal: DealStructure;
  setDeal: React.Dispatch<React.SetStateAction<DealStructure>>;
}

const InputSection: React.FC<InputSectionProps> = ({
  acquirer, setAcquirer,
  target, setTarget,
  deal, setDeal
}) => {

  const handleAcquirerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAcquirer(prev => ({ 
      ...prev, 
      [name]: (name === 'name' || name === 'domain') ? value : parseFloat(value) || 0 
    }));
  };

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTarget(prev => ({ 
      ...prev, 
      [name]: (name === 'name' || name === 'domain') ? value : parseFloat(value) || 0 
    }));
  };

  const handleDealChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeal(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const LogoPlaceholder = ({ domain, fallbackIcon }: { domain?: string, fallbackIcon: React.ReactNode }) => {
    const [error, setError] = React.useState(false);
    
    if (domain && !error) {
      return (
        <div className="w-8 h-8 rounded-md bg-white p-0.5 overflow-hidden flex items-center justify-center">
           <img 
            src={`https://logo.clearbit.com/${domain}`} 
            alt="logo" 
            className="w-full h-full object-contain"
            onError={() => setError(true)}
          />
        </div>
      );
    }
    return <div className="p-1.5 rounded-md bg-zinc-800 text-zinc-400">{fallbackIcon}</div>;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Acquirer Inputs */}
      <div className="group bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 shadow-lg backdrop-blur-sm transition-all duration-300">
        <div className="flex items-center gap-3 mb-5 border-b border-zinc-800/50 pb-3">
          <LogoPlaceholder domain={acquirer.domain} fallbackIcon={<Building2 size={18} />} />
          <h3 className="font-semibold text-sm text-zinc-300 tracking-wide uppercase">Acquirer Profile</h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputGroup label="Company Name" name="name" value={acquirer.name} onChange={handleAcquirerChange} type="text" />
            <InputGroup label="Domain (Logo)" name="domain" value={acquirer.domain || ''} onChange={handleAcquirerChange} type="text" icon={<Globe size={10} />} />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <InputGroup label="Share Price ($)" name="sharePrice" value={acquirer.sharePrice} onChange={handleAcquirerChange} />
             <InputGroup label="Shares Out. (M)" name="sharesOutstanding" value={acquirer.sharesOutstanding} onChange={handleAcquirerChange} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputGroup label="Net Income ($M)" name="netIncome" value={acquirer.netIncome} onChange={handleAcquirerChange} />
            <InputGroup label="EBITDA ($M)" name="ebitda" value={acquirer.ebitda} onChange={handleAcquirerChange} />
          </div>
        </div>
      </div>

      {/* Target Inputs */}
      <div className="group bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 shadow-lg backdrop-blur-sm transition-all duration-300">
        <div className="flex items-center gap-3 mb-5 border-b border-zinc-800/50 pb-3">
          <LogoPlaceholder domain={target.domain} fallbackIcon={<TrendingUp size={18} />} />
          <h3 className="font-semibold text-sm text-zinc-300 tracking-wide uppercase">Target Profile</h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputGroup label="Company Name" name="name" value={target.name} onChange={handleTargetChange} type="text" />
            <InputGroup label="Domain (Logo)" name="domain" value={target.domain || ''} onChange={handleTargetChange} type="text" icon={<Globe size={10} />} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputGroup label="Share Price ($)" name="sharePrice" value={target.sharePrice} onChange={handleTargetChange} />
            <InputGroup label="Shares Out. (M)" name="sharesOutstanding" value={target.sharesOutstanding} onChange={handleTargetChange} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputGroup label="Net Income ($M)" name="netIncome" value={target.netIncome} onChange={handleTargetChange} />
            <InputGroup label="EBITDA ($M)" name="ebitda" value={target.ebitda} onChange={handleTargetChange} />
          </div>
        </div>
      </div>

      {/* Deal Structure Inputs */}
      <div className="group bg-zinc-900/60 border border-zinc-800 hover:border-amber-500/30 rounded-xl p-5 shadow-lg backdrop-blur-sm transition-all duration-300 relative overflow-hidden">
        {/* Decorative top accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/0 via-amber-500/50 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <div className="flex items-center gap-3 mb-5 border-b border-zinc-800/50 pb-3">
          <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-500">
            <DollarSign size={18} />
          </div>
          <h3 className="font-semibold text-sm text-amber-100 tracking-wide uppercase">Transaction Structure</h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputGroup label="Premium (%)" name="offerPremium" value={deal.offerPremium} onChange={handleDealChange} icon={<Percent size={10}/>} accent />
            <InputGroup label="Cash Split (%)" name="cashConsideration" value={deal.cashConsideration} onChange={handleDealChange} icon={<Percent size={10}/>} accent />
          </div>
          <InputGroup label="Synergies ($M)" name="synergies" value={deal.synergies} onChange={handleDealChange} icon={<DollarSign size={10}/>} accent />
          <div className="grid grid-cols-2 gap-4">
            <InputGroup label="Int. Rate (%)" name="interestRateOnDebt" value={deal.interestRateOnDebt} onChange={handleDealChange} icon={<Percent size={10}/>} />
            <InputGroup label="Tax Rate (%)" name="taxRate" value={deal.taxRate} onChange={handleDealChange} icon={<Percent size={10}/>} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Component for inputs
const InputGroup = ({ 
  label, 
  name, 
  value, 
  onChange, 
  type = "number",
  icon,
  accent = false
}: { 
  label: string, 
  name: string, 
  value: string | number, 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  type?: string,
  icon?: React.ReactNode,
  accent?: boolean
}) => (
  <div className="flex flex-col">
    <label className="text-[10px] text-zinc-500 mb-1.5 font-semibold tracking-wider uppercase ml-0.5">{label}</label>
    <div className="relative group/input">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full bg-zinc-950 border ${accent ? 'border-zinc-700 focus:border-amber-500/50' : 'border-zinc-800 focus:border-zinc-600'} rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 ${accent ? 'focus:ring-amber-500' : 'focus:ring-zinc-600'} transition-all font-mono shadow-sm truncate`}
      />
      {icon && <div className={`absolute right-3 top-3 ${accent ? 'text-amber-500/50' : 'text-zinc-600'} pointer-events-none`}>{icon}</div>}
    </div>
  </div>
);

export default InputSection;