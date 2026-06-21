import React from 'react';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

export const TransactionHistory = () => {
  const { transactions, loading } = usePortfolioStore();

  if (loading && transactions.length === 0) {
    return <div className="text-slate-400 py-8 text-center animate-pulse">Loading history...</div>;
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-[#1e293b] rounded-xl p-8 border border-white/5 text-center">
        <p className="text-slate-400">No transactions recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1e293b] rounded-xl border border-white/5 overflow-hidden">
      <div className="p-6 border-b border-white/5">
        <h3 className="text-lg font-semibold text-white">Transaction History</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-[#0f172a] text-xs uppercase text-slate-400 border-b border-white/5">
            <tr>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Symbol</th>
              <th className="px-6 py-4 font-medium text-right">Quantity</th>
              <th className="px-6 py-4 font-medium text-right">Price</th>
              <th className="px-6 py-4 font-medium text-right">Total Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions.map((tx) => {
              const isBuy = tx.transaction_type === 'BUY';
              return (
                <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(tx.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      isBuy ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {isBuy ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                      {tx.transaction_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-white">{tx.symbol || '-'}</td>
                  <td className="px-6 py-4 text-right">{tx.quantity || '-'}</td>
                  <td className="px-6 py-4 text-right">{tx.price ? `₹${tx.price.toLocaleString('en-IN')}` : '-'}</td>
                  <td className={`px-6 py-4 text-right font-medium ${isBuy ? 'text-red-400' : 'text-emerald-400'}`}>
                    {isBuy ? '-' : '+'}₹{tx.amount.toLocaleString('en-IN')}
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
