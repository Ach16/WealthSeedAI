import React, { useEffect } from 'react';
import { Trophy, TrendingUp } from 'lucide-react';
import { useGoalStore } from '../../stores/goalStore';

export function GoalProgressTracker() {
  const { goals, fetchGoals } = useGoalStore();

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  if (goals.length === 0) {
    return (
      <div className="bg-[#0f172a] rounded-xl p-6 border border-white/5 shadow-lg mb-8">
        <div className="flex flex-col items-center justify-center py-8">
          <Trophy className="w-12 h-12 text-slate-500 mb-4 opacity-50" />
          <h2 className="text-xl font-bold text-slate-300 mb-2">No Active Goals</h2>
          <p className="text-sm text-slate-500">Create a financial goal to track your progress.</p>
        </div>
      </div>
    );
  }

  const goal = goals[0];
  const progressPercent = Math.min(100, (goal.current_amount / goal.target_amount) * 100);

  return (
    <div className="bg-[#0f172a] rounded-xl p-6 border border-white/5 shadow-lg mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-500/10 rounded-lg">
          <Trophy className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Goal Progress Tracker</h2>
          <p className="text-sm text-slate-400">Primary Financial Goal: {goal.title}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-3xl font-bold text-white">₹{goal.current_amount.toLocaleString('en-IN')}</span>
            <span className="text-slate-400 ml-2">/ ₹{goal.target_amount.toLocaleString('en-IN')}</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-purple-400">{progressPercent.toFixed(1)}%</span>
          </div>
        </div>

        <div className="relative h-4 bg-[#1e293b] rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-1000 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex justify-between text-sm text-slate-400 pt-2 border-t border-white/5">
          <span className="flex items-center gap-1"><TrendingUp className="w-4 h-4" /> Remaining: ₹{Math.max(0, goal.target_amount - goal.current_amount).toLocaleString('en-IN')}</span>
          <span>Target: {new Date(goal.target_date).getFullYear()}</span>
        </div>
      </div>
    </div>
  );
}
