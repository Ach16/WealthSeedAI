import React, { useEffect } from 'react';
import { useGoalStore } from '../../stores/goalStore';
import { useAuthStore } from '../../stores/authStore';
import { Target, CheckCircle2, Clock, CalendarDays, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const GoalsOverviewCard = () => {
  const { summary, loading, fetchSummary } = useGoalStore();
  const [topGoals, setTopGoals] = React.useState<any[]>([]);

  useEffect(() => {
    fetchSummary();
    const token = useAuthStore.getState().token;
    if (token) {
      import('../../services/goalService').then(({ getGoals }) => {
        getGoals(token, 3).then(setTopGoals).catch(console.error);
      });
    }
  }, [fetchSummary]);

  if (loading || !summary) {
    return (
      <div className="bg-[#1e293b] rounded-xl p-6 border border-white/5 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-1/3 mb-4"></div>
        <div className="h-20 bg-slate-700 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#1e293b]/50 rounded-2xl p-6 border border-slate-700 backdrop-blur shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 h-full flex flex-col justify-start">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <Target className="w-5 h-5 text-emerald-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Top Goals</h2>
        </div>
        <Link href="/goals" className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
          View All <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      
      {topGoals.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 min-h-[120px]">
          <p className="text-sm">No active goals yet.</p>
        </div>
      ) : (
        <div className="space-y-4 flex-1">
          {topGoals.map((goal) => (
            <div key={goal.id} className="bg-[#0f172a] p-4 rounded-xl border border-white/5">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-white">{goal.title}</p>
                <span className="text-xs font-bold text-emerald-400">{goal.progress_percentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-1.5 rounded-full" 
                  style={{ width: `${Math.min(goal.progress_percentage, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-wider">
                <span>₹{goal.current_amount.toLocaleString('en-IN')}</span>
                <span>Target: ₹{goal.target_amount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
