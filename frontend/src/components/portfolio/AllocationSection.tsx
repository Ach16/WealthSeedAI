import React from 'react';
import { usePortfolioStore } from '../../stores/portfolioStore';

const ASSET_COLORS: Record<string, string> = {
  'Stock': 'bg-blue-500',
  'ETF': 'bg-emerald-500',
  'Mutual Fund': 'bg-indigo-500',
  'Bond': 'bg-orange-500',
  'Crypto': 'bg-purple-500',
  'Cash': 'bg-teal-500'
};

export const AllocationSection = () => {
  const { holdings, summary } = usePortfolioStore();

  if (!summary) return null;

  // Group allocations
  const allocationMap: Record<string, number> = {
    'Cash': summary.cash_balance
  };

  holdings.forEach(h => {
    allocationMap[h.asset_type] = (allocationMap[h.asset_type] || 0) + h.market_value;
  });

  const totalValue = summary.portfolio_value;
  
  const allocations = Object.entries(allocationMap).map(([type, value]) => ({
    type,
    value,
    percentage: totalValue > 0 ? (value / totalValue) * 100 : 0
  })).filter(a => a.percentage > 0).sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="bg-[#1e293b] rounded-xl p-6 border border-white/5 mb-8">
      <h3 className="text-lg font-semibold text-white mb-6">Asset Allocation</h3>
      
      {/* Visual Bar */}
      <div className="w-full h-4 rounded-full flex overflow-hidden mb-6">
        {allocations.map((a) => (
          <div 
            key={a.type}
            className={`h-full ${ASSET_COLORS[a.type] || 'bg-slate-500'} transition-all`}
            style={{ width: `${a.percentage}%` }}
            title={`${a.type}: ${a.percentage.toFixed(1)}%`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {allocations.map((a) => (
          <div key={a.type} className="flex items-center justify-between p-3 rounded-lg bg-[#0f172a] border border-white/5">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${ASSET_COLORS[a.type] || 'bg-slate-500'}`} />
              <span className="text-sm text-slate-300">{a.type}</span>
            </div>
            <span className="text-sm font-medium text-white">{a.percentage.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
