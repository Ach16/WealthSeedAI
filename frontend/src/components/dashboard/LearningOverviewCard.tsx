import React, { useEffect } from 'react';
import Link from 'next/link';
import { useLearningStore } from '../../stores/learningStore';
import { useAuthStore } from '../../stores/authStore';
import { GraduationCap, Target, Trophy, Star } from 'lucide-react';

export const LearningOverviewCard = () => {
  const { score, recommendation, loading, fetchDashboardData } = useLearningStore();

  const { hasHydrated, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      fetchDashboardData();
    }
  }, [fetchDashboardData, hasHydrated, isAuthenticated]);

  if (loading && !score) {
    return (
      <div className="bg-[#1e293b] rounded-xl p-6 border border-white/5 animate-pulse h-[200px]"></div>
    );
  }

  return (
    <div className="bg-[#1e293b]/50 rounded-2xl p-6 border border-slate-700 backdrop-blur shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 h-full min-h-[260px] flex flex-col justify-start">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <GraduationCap className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Wealth Academy</h2>
        </div>
        <Link href="/learning" className="text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
          Learn
        </Link>
      </div>

      <div className="flex items-center gap-6 mb-6">
        <div className="relative">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle cx="40" cy="40" r="36" className="stroke-[#0f172a] stroke-[8]" fill="none" />
            <circle 
              cx="40" cy="40" r="36" 
              className="stroke-emerald-400 stroke-[8] transition-all duration-1000 ease-out" 
              fill="none" 
              strokeDasharray={226} 
              strokeDashoffset={226 - (226 * (score?.score || 0)) / 100}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-xl font-bold text-white leading-none">{score?.score || 0}</span>
          </div>
        </div>
        <div>
          <div className="text-sm text-slate-400 mb-1">Literacy Level</div>
          <div className="text-lg font-bold text-white">{score?.level || 'Beginner'}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-auto">
        <div className="bg-[#0f172a] p-3 rounded-lg border border-white/5 flex items-center gap-3">
          <Trophy className="w-5 h-5 text-indigo-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Completed</div>
            <div className="font-semibold text-white text-sm">{score?.total_modules_completed || 0} Modules</div>
          </div>
        </div>
        <div className="bg-[#0f172a] p-3 rounded-lg border border-white/5 flex items-center gap-3">
          <Target className="w-5 h-5 text-orange-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Next Up</div>
            <div className="font-semibold text-white text-xs truncate max-w-[80px]" title={recommendation?.title}>
              {recommendation?.title || 'None'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
