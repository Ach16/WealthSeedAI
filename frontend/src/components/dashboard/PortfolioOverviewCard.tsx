import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { PieChart, TrendingUp, TrendingDown, IndianRupee, Briefcase, Edit2, Check, X } from 'lucide-react';

export const PortfolioOverviewCard = () => {
  const { summary, loading, fetchSummary, updateBalance } = usePortfolioStore();
  const [isEditing, setIsEditing] = useState(false);
  const [newBalance, setNewBalance] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  if (loading && !summary) {
    return (
      <div className="bg-[#1e293b] rounded-xl p-6 border border-white/5 animate-pulse h-[200px]"></div>
    );
  }

  if (!summary) {
    return null; // or loading state
  }

  const isPositive = summary.portfolio_return >= 0;

  const handleSave = async () => {
    try {
      setError(null);
      setIsSaving(true);
      const val = parseFloat(newBalance);
      if (isNaN(val) || val <= 0) throw new Error("Invalid amount");
      await updateBalance(val);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Failed to update balance");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[#1e293b]/50 rounded-2xl p-6 border border-slate-700 backdrop-blur shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 h-full min-h-[260px] flex flex-col justify-start">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10">
            <Briefcase className="w-6 h-6 text-indigo-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Portfolio Overview</h2>
        </div>
        <Link href="/portfolio" className="text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20">
          Manage
        </Link>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="text-sm text-slate-400">Total Value</div>
          {!isEditing && (
            <button onClick={() => { setIsEditing(true); setNewBalance(summary.portfolio_value.toString()); }} className="text-slate-500 hover:text-white transition-colors">
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-slate-400">₹</span>
              <input 
                type="number" 
                value={newBalance}
                onChange={e => setNewBalance(e.target.value)}
                className="bg-[#0f172a] border border-slate-600 rounded-lg px-3 py-1 text-white font-bold w-full max-w-[150px] focus:outline-none focus:border-indigo-500"
                placeholder="New value"
              />
              <button disabled={isSaving} onClick={handleSave} className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors">
                <Check className="w-4 h-4" />
              </button>
              <button disabled={isSaving} onClick={() => { setIsEditing(false); setError(null); }} className="p-1.5 bg-slate-700/50 text-slate-400 rounded-lg hover:bg-slate-700 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            {error && <span className="text-xs text-red-400">{error}</span>}
          </div>
        ) : (
          <>
            <div className="text-3xl font-bold text-white tracking-tight">
              ₹{summary.portfolio_value.toLocaleString('en-IN')}
            </div>
            <div className={`text-sm mt-1 flex items-center gap-1 font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {isPositive ? '+' : ''}₹{summary.portfolio_return.toLocaleString('en-IN')} ({summary.portfolio_return_percentage.toFixed(2)}%)
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-auto">
        <div className="bg-[#0f172a] p-3 rounded-lg border border-white/5">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs">Cash Balance</span>
          </div>
          <div className="font-semibold text-white">₹{summary.cash_balance.toLocaleString('en-IN')}</div>
        </div>
        <div className="bg-[#0f172a] p-3 rounded-lg border border-white/5">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <PieChart className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs">Holdings</span>
          </div>
          <div className="font-semibold text-white">{summary.holdings_count} Assets</div>
        </div>
      </div>
    </div>
  );
};
