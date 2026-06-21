import React, { useEffect, useState } from 'react';
import { Target, TrendingUp } from 'lucide-react';
import { useGoalStore } from '../../stores/goalStore';

export function GoalForecastWidget() {
  const { goals } = useGoalStore();
  const [forecast, setForecast] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    if (goals.length > 0) {
      const goal = goals[0];
      const remaining = goal.target_amount - goal.current_amount;
      
      if (remaining > 0) {
        // Recreation of backend dynamic projection logic
        const baseRate = Math.max(500, Math.floor((remaining * 0.01) / 500) * 500);
        const rates = [baseRate, baseRate * 2, baseRate * 5].map(r => Math.max(1000, r));
        
        const newForecast: Record<string, string> = {};
        rates.forEach(rate => {
          const months = remaining / rate;
          newForecast[`${rate}_per_month`] = `${months.toFixed(1)} months`;
        });
        
        setForecast(newForecast);
      } else {
        setForecast(null);
      }
    }
  }, [goals]);

  if (!forecast || goals.length === 0 || goals[0].target_amount - goals[0].current_amount <= 0) {
    return (
      <div className="bg-[#0f172a] rounded-xl p-6 border border-white/5 shadow-lg flex flex-col h-full justify-center items-center">
        <Target className="w-12 h-12 text-slate-500 mb-4 opacity-50" />
        <h2 className="text-xl font-bold text-slate-300 mb-2">No Forecast Available</h2>
        <p className="text-sm text-slate-500 text-center">Set a goal target higher than your current progress to see AI projections.</p>
      </div>
    );
  }

  const goal = goals[0];

  return (
    <div className="bg-[#0f172a] rounded-xl p-6 border border-white/5 shadow-lg flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <Target className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Goal Forecast</h2>
          <p className="text-sm text-slate-400">AI Projected scenarios for {goal.title}</p>
        </div>
      </div>

      <div className="flex-1">
        <div className="overflow-hidden rounded-lg border border-white/5 bg-[#1e293b]/50">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-slate-400">
                <th className="px-4 py-3 font-medium">Monthly Investment</th>
                <th className="px-4 py-3 font-medium text-right">Time To Goal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {Object.entries(forecast).map(([key, value], idx) => {
                const amount = key.split('_')[0];
                const isFastest = idx === Object.entries(forecast).length - 1;
                
                return (
                  <tr key={key} className={`group ${isFastest ? 'bg-emerald-500/5' : ''}`}>
                    <td className="px-4 py-3 text-slate-300 font-medium">
                      ₹{parseInt(amount).toLocaleString('en-IN')}
                      {isFastest && (
                        <span className="ml-2 inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                          <TrendingUp className="w-3 h-3" /> Fastest
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-white text-right font-medium">
                      {value.replace('months', 'mo')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
