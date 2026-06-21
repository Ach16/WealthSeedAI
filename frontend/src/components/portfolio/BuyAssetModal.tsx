import React, { useState } from 'react';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { X, Lightbulb } from 'lucide-react';

export const BuyAssetModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { buyAsset, summary } = usePortfolioStore();
  const [formData, setFormData] = useState({
    symbol: '',
    asset_name: '',
    asset_type: 'Stock',
    quantity: '',
    price: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insight, setInsight] = useState<{ message: string, risk_score: number, div_score: number } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      // First execute the transaction
      await buyAsset({
        ...formData,
        quantity: parseFloat(formData.quantity),
        price: parseFloat(formData.price)
      });
      
      // Then simulate the insight
      try {
        const simResult = await usePortfolioStore.getState().simulateTransaction({
          symbol: formData.symbol,
          asset_name: formData.asset_name,
          asset_type: formData.asset_type,
          quantity: parseFloat(formData.quantity),
          price: parseFloat(formData.price),
          transaction_type: 'BUY'
        });
        
        setInsight({
          message: simResult.message,
          risk_score: simResult.risk_score,
          div_score: simResult.diversification_score
        });
      } catch (simErr) {
        // If simulation fails, just close the modal
        onClose();
        setFormData({ symbol: '', asset_name: '', asset_type: 'Stock', quantity: '', price: '', notes: '' });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseInsight = () => {
    setInsight(null);
    setFormData({ symbol: '', asset_name: '', asset_type: 'Stock', quantity: '', price: '', notes: '' });
    onClose();
  };

  const estimatedCost = (parseFloat(formData.quantity) || 0) * (parseFloat(formData.price) || 0);
  const remainingCash = (summary?.cash_balance || 0) - estimatedCost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#0f172a] rounded-2xl w-full max-w-md border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <h2 className="text-xl font-semibold text-white">Buy Asset</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 rounded-lg bg-red-500/10 text-red-400 text-sm border border-red-500/20">{error}</div>}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Symbol</label>
              <input
                type="text"
                required
                className="w-full bg-[#1e293b] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 uppercase"
                value={formData.symbol}
                onChange={e => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                placeholder="AAPL"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Asset Type</label>
              <select
                className="w-full bg-[#1e293b] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                value={formData.asset_type}
                onChange={e => setFormData({ ...formData, asset_type: e.target.value })}
              >
                <option value="Stock">Stock</option>
                <option value="ETF">ETF</option>
                <option value="Mutual Fund">Mutual Fund</option>
                <option value="Bond">Bond</option>
                <option value="Crypto">Crypto</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Asset Name</label>
            <input
              type="text"
              required
              className="w-full bg-[#1e293b] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
              value={formData.asset_name}
              onChange={e => setFormData({ ...formData, asset_name: e.target.value })}
              placeholder="Apple Inc."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Quantity</label>
              <input
                type="number"
                step="any"
                min="0.000001"
                required
                className="w-full bg-[#1e293b] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                value={formData.quantity}
                onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Purchase Price (₹)</label>
              <input
                type="number"
                step="any"
                min="0.01"
                required
                className="w-full bg-[#1e293b] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                placeholder="150"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Notes (Optional)</label>
            <textarea
              className="w-full bg-[#1e293b] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 h-20 resize-none"
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Rationale for buying..."
            />
          </div>

          <div className="bg-[#1e293b] p-4 rounded-xl border border-white/5 space-y-2 mt-2 text-sm">
            <div className="flex justify-between text-slate-300">
              <span>Estimated Cost:</span>
              <span className="text-white font-medium">₹{estimatedCost.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Remaining Cash:</span>
              <span className={`font-medium ${remainingCash < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                ₹{remainingCash.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || remainingCash < 0 || estimatedCost <= 0}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium hover:from-emerald-400 hover:to-cyan-400 transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {isSubmitting ? 'Processing...' : 'Confirm Purchase'}
          </button>
        </form>

        {/* Educational Insight Overlay */}
        {insight && (
          <div className="absolute inset-0 bg-[#0f172a] p-6 flex flex-col justify-center animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-indigo-500/20 rounded-full mb-4">
                <Lightbulb className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Educational Insight</h3>
              <p className="text-slate-300 bg-[#1e293b]/50 p-4 rounded-lg border border-indigo-500/20 text-left">
                {insight.message}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-[#1e293b] p-4 rounded-xl text-center border border-white/5">
                <div className="text-sm text-slate-400 mb-1">New Risk Score</div>
                <div className="text-2xl font-bold text-yellow-400">{insight.risk_score}</div>
              </div>
              <div className="bg-[#1e293b] p-4 rounded-xl text-center border border-white/5">
                <div className="text-sm text-slate-400 mb-1">Diversification</div>
                <div className="text-2xl font-bold text-cyan-400">{insight.div_score}</div>
              </div>
            </div>

            <button
              onClick={handleCloseInsight}
              className="w-full py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-all"
            >
              Acknowledge & Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
