import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRiskStore } from '../../stores/riskStore';
import { ShieldCheck, TrendingUp, Zap, Activity } from 'lucide-react';

export const RiskProfileCard = () => {
  const { profile, loading, fetchProfile } = useRiskStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <div className="bg-[#1e293b] rounded-xl p-6 border border-white/5 animate-pulse h-[200px]"></div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-[#1e293b] rounded-xl p-6 border border-white/5 flex flex-col justify-center items-center text-center h-full min-h-[200px]">
        <Activity className="w-10 h-10 text-slate-500 mb-3" />
        <h3 className="text-lg font-semibold text-white mb-1">No Risk Profile</h3>
        <p className="text-sm text-slate-400 mb-4">Complete the assessment to get your risk profile.</p>
        <Link
          href="/risk"
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg text-sm font-medium hover:from-emerald-400 hover:to-cyan-400 transition-all"
        >
          Take Assessment
        </Link>
      </div>
    );
  }

  const getProfileTheme = (riskProfile: string) => {
    switch(riskProfile) {
      case 'Conservative': return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: ShieldCheck };
      case 'Moderate': return { color: 'text-blue-400', bg: 'bg-blue-500/10', icon: TrendingUp };
      case 'Aggressive': return { color: 'text-orange-400', bg: 'bg-orange-500/10', icon: Zap };
      default: return { color: 'text-slate-400', bg: 'bg-slate-500/10', icon: ShieldCheck };
    }
  };

  const theme = getProfileTheme(profile.risk_profile);
  const Icon = theme.icon;

  return (
    <div className="bg-[#1e293b]/50 rounded-2xl p-6 border border-slate-700 backdrop-blur shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 h-full min-h-[260px] flex flex-col justify-start">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${theme.bg}`}>
            <Icon className={`w-6 h-6 ${theme.color}`} />
          </div>
          <h2 className="text-xl font-semibold text-white">Risk Profile</h2>
        </div>
        <Link href="/risk" className="text-xs text-emerald-400 hover:text-emerald-300">
          Retake
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-white/5">
          <span className="text-slate-400 text-sm">Classification</span>
          <span className={`font-bold ${theme.color}`}>{profile.risk_profile}</span>
        </div>
        <div className="flex justify-between items-center pb-3 border-b border-white/5">
          <span className="text-slate-400 text-sm">Score</span>
          <span className="font-bold text-white">{profile.score} <span className="text-xs font-normal text-slate-500">/ 25</span></span>
        </div>
        <div className="flex justify-between items-center pb-3 border-b border-white/5">
          <span className="text-slate-400 text-sm">Last Updated</span>
          <span className="text-sm text-slate-200">
            {profile.last_updated ? new Date(profile.last_updated).toLocaleDateString() : 'Never'}
          </span>
        </div>
        <div>
          <span className="text-slate-400 text-sm block mb-1">Recommendation</span>
          <p className="text-sm text-slate-300 leading-snug">{profile.risk_explanation}</p>
        </div>
      </div>
    </div>
  );
};
