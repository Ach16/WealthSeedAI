import React, { useState } from 'react';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { X, Lightbulb } from 'lucide-react';

export const SellAssetModal = ({ isOpen, onClose, holdingId }: { isOpen: boolean, onClose: () => void, holdingId: string | null }) => {
  const { sellAsset, holdings } = usePortfolioStore();
  const holding = holdings.find(h => h.id === holdingId);
  
  const [formData, setFormData] = useState({
    quantity: '',
    price: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insight, setInsight] = useState<{ message: string, risk_score: number, div_score: number } | null>(null);

  if (!isOpen || !holding) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      // First execute the transaction
      await sellAsset({
        holding_id: holding.id,
        quantity: parseFloat(formData.quantity),
        price: parseFloat(formData.price),
        notes: formData.notes
      });
      
      // Then simulate the insight
      try {
        const simResult = await usePortfolioStore.getState().simulateTransaction({
          symbol: holding.symbol,
          asset_name: holding.asset_name,
          asset_type: holding.asset_type,
          quantity: parseFloat(formData.quantity),
          price: parseFloat(formData.price),
          transaction_type: 'SELL'
        });
        
        setInsight({
          message: simResult.message,
          risk_score: simResult.risk_score,
          div_score: simResult.diversification_score
        });
      } catch (simErr) {
        // If simulation fails, just close the modal
        onClose();
        setFormData({ quantity: '', price: '', notes: '' });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseInsight = () => {
    setInsight(null);
    setFormData({ quantity: '', price: '', notes: '' });
    onClose();
  };

  const proceedEstimate = (parseFloat(formData.quantity) || 0) * (parseFloat(formData.price) || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#0f172a] rounded-2xl w-full max-w-md border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <h2 className="text-xl font-semibold text-white">Sell {holding.symbol}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 rounded-lg bg-red-500/10 text-red-400 text-sm border border-red-500/20">{error}</div>}
          
          <div className="bg-[#1e293b] p-4 rounded-xl border border-white/5 mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Owned Quantity:</span>
              <span className="text-white font-bold">{holding.quantity}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Current Market Price:</span>
              <span className="text-white font-bold">₹{holding.current_price.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-end mb-1">
                <label className="block text-sm font-medium text-slate-300">Quantity</label>
                <button type="button" onClick={() => setFormData({ ...formData, quantity: holding.quantity.toString() })} className="text-[10px] text-emerald-400 hover:underline">MAX</button>
              </div>
              <input
                type="number"
                step="any"
                min="0.000001"
                max={holding.quantity}
                required
                className="w-full bg-[#1e293b] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
                value={formData.quantity}
                onChange={e => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Sale Price (₹)</label>
              <input
                type="number"
                step="any"
                min="0.01"
                required
                className="w-full bg-[#1e293b] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                placeholder={holding.current_price.toString()}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Notes (Optional)</label>
            <textarea
              className="w-full bg-[#1e293b] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500 h-20 resize-none"
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Rationale for selling..."
            />
          </div>

          <div className="bg-[#1e293b] p-4 rounded-xl border border-white/5 space-y-2 mt-2 text-sm">
            <div className="flex justify-between text-slate-300">
              <span>Estimated Proceeds:</span>
              <span className="text-emerald-400 font-medium">+₹{proceedEstimate.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || proceedEstimate <= 0 || parseFloat(formData.quantity) > holding.quantity}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-medium hover:from-red-400 hover:to-rose-400 transition-all shadow-lg shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {isSubmitting ? 'Processing...' : 'Confirm Sale'}
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
