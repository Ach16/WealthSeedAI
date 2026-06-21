import React from 'react';
import { usePortfolioStore } from '../../stores/portfolioStore';

export const HoldingsTable = ({ onSellClick }: { onSellClick: (holdingId: string) => void }) => {
  const { holdings, loading } = usePortfolioStore();

  if (loading && holdings.length === 0) {
    return <div className="text-slate-400 py-8 text-center animate-pulse">Loading holdings...</div>;
  }

  if (holdings.length === 0) {
    return (
      <div className="bg-[#1e293b] rounded-xl p-8 border border-white/5 text-center mb-8">
        <p className="text-slate-400 mb-2">No assets in your portfolio yet.</p>
        <p className="text-sm text-slate-500">Click "Buy Asset" to make your first investment.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1e293b] rounded-xl border border-white/5 overflow-hidden mb-8">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-[#0f172a] text-xs uppercase text-slate-400 border-b border-white/5">
            <tr>
              <th className="px-6 py-4 font-medium">Symbol</th>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium text-right">Quantity</th>
              <th className="px-6 py-4 font-medium text-right">Avg Cost</th>
              <th className="px-6 py-4 font-medium text-right">Current Price</th>
              <th className="px-6 py-4 font-medium text-right">Market Value</th>
              <th className="px-6 py-4 font-medium text-right">Alloc %</th>
              <th className="px-6 py-4 font-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {holdings.map((h) => {
              const returnVal = (h.current_price - h.average_cost) / h.average_cost;
              const isPositive = returnVal >= 0;
              
              return (
                <tr key={h.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{h.symbol}</td>
                  <td className="px-6 py-4">{h.asset_name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs bg-slate-800 text-slate-300 border border-white/10">
                      {h.asset_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">{h.quantity}</td>
                  <td className="px-6 py-4 text-right">₹{h.average_cost.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span>₹{h.current_price.toLocaleString('en-IN')}</span>
                      <span className={`text-xs ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isPositive ? '+' : ''}{(returnVal * 100).toFixed(2)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-white">₹{h.market_value.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-right">{h.allocation_percentage.toFixed(2)}%</td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => onSellClick(h.id)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors border border-red-500/20"
                    >
                      Sell
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
