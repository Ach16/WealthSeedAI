import React from 'react';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { IndianRupee, PieChart, Activity, TrendingUp, TrendingDown } from 'lucide-react';

export const PortfolioSummary = () => {
  const { summary } = usePortfolioStore();

  if (!summary) return null;

  const isPositive = summary.portfolio_return >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-[#1e293b] rounded-xl p-6 border border-white/5">
        <div className="flex items-center gap-3 mb-2 text-slate-400">
          <PieChart className="w-5 h-5 text-indigo-400" />
          <span className="text-sm">Total Value</span>
        </div>
        <div className="text-2xl font-bold text-white mb-2">
          ₹{summary.portfolio_value.toLocaleString('en-IN')}
        </div>
        <div className={`text-sm flex items-center gap-1 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {isPositive ? '+' : ''}₹{summary.portfolio_return.toLocaleString('en-IN')} ({summary.portfolio_return_percentage.toFixed(2)}%)
        </div>
      </div>

      <div className="bg-[#1e293b] rounded-xl p-6 border border-white/5">
        <div className="flex items-center gap-3 mb-2 text-slate-400">
          <IndianRupee className="w-5 h-5 text-emerald-400" />
          <span className="text-sm">Cash Balance</span>
        </div>
        <div className="text-2xl font-bold text-white">
          ₹{summary.cash_balance.toLocaleString('en-IN')}
        </div>
      </div>

      <div className="bg-[#1e293b] rounded-xl p-6 border border-white/5">
        <div className="flex items-center gap-3 mb-2 text-slate-400">
          <Activity className="w-5 h-5 text-cyan-400" />
          <span className="text-sm">Invested Amount</span>
        </div>
        <div className="text-2xl font-bold text-white">
          ₹{summary.invested_amount.toLocaleString('en-IN')}
        </div>
      </div>

      <div className="bg-[#1e293b] rounded-xl p-6 border border-white/5">
        <div className="flex items-center gap-3 mb-2 text-slate-400">
          <PieChart className="w-5 h-5 text-orange-400" />
          <span className="text-sm">Holdings</span>
        </div>
        <div className="text-2xl font-bold text-white">
          {summary.holdings_count}
        </div>
      </div>
    </div>
  );
};
