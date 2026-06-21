import React from 'react';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { HeartPulse, AlertTriangle, ShieldCheck, Target } from 'lucide-react';

export function PortfolioIntelligenceCards() {
  const { health } = usePortfolioStore();

  if (!health) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-[#0f172a] rounded-xl p-6 border border-white/5 h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  const getHealthColor = (score: number) => {
    if (score >= 71) return 'text-emerald-400';
    if (score >= 41) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskLabel = (score: number) => {
    if (score <= 40) return { label: 'Conservative', color: 'text-emerald-400' };
    if (score <= 60) return { label: 'Moderate', color: 'text-yellow-400' };
    return { label: 'Aggressive', color: 'text-red-400' };
  };

  const riskInfo = getRiskLabel(health.risk_score);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <div className="bg-[#0f172a] rounded-xl p-6 border border-white/5 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <HeartPulse className="w-16 h-16 text-emerald-400" />
        </div>
        <div className="flex items-center gap-3 mb-2">
          <HeartPulse className="w-5 h-5 text-emerald-400" />
          <h3 className="text-slate-400 font-medium">Portfolio Health</h3>
        </div>
        <div className="mt-4 flex items-end gap-2">
          <span className={`text-4xl font-bold ${getHealthColor(health.health_score)}`}>{health.health_score}</span>
          <span className="text-slate-500 mb-1">/100</span>
        </div>
        <p className="mt-2 text-sm text-slate-400">
          {health.health_score >= 71 ? 'Excellent Health' : health.health_score >= 41 ? 'Average Health' : 'Poor Health'}
        </p>
      </div>

      <div className="bg-[#0f172a] rounded-xl p-6 border border-white/5 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <AlertTriangle className={`w-16 h-16 ${riskInfo.color}`} />
        </div>
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className={`w-5 h-5 ${riskInfo.color}`} />
          <h3 className="text-slate-400 font-medium">Risk Score</h3>
        </div>
        <div className="mt-4 flex items-end gap-2">
          <span className={`text-4xl font-bold ${riskInfo.color}`}>{health.risk_score}</span>
          <span className="text-slate-500 mb-1">/100</span>
        </div>
        <p className="mt-2 text-sm text-slate-400">{riskInfo.label} Exposure</p>
      </div>

      <div className="bg-[#0f172a] rounded-xl p-6 border border-white/5 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <ShieldCheck className="w-16 h-16 text-cyan-400" />
        </div>
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <h3 className="text-slate-400 font-medium">Diversification</h3>
        </div>
        <div className="mt-4 flex items-end gap-2">
          <span className="text-4xl font-bold text-cyan-400">{health.diversification_score}</span>
          <span className="text-slate-500 mb-1">/100</span>
        </div>
        <p className="mt-2 text-sm text-slate-400">
          {health.diversification_score >= 70 ? 'Good Diversification' : 'Needs Diversification'}
        </p>
      </div>

      <div className="bg-[#0f172a] rounded-xl p-6 border border-white/5 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Target className="w-16 h-16 text-purple-400" />
        </div>
        <div className="flex items-center gap-3 mb-2">
          <Target className="w-5 h-5 text-purple-400" />
          <h3 className="text-slate-400 font-medium">Goal Alignment</h3>
        </div>
        <div className="mt-4 flex items-end gap-2">
          <span className="text-4xl font-bold text-purple-400">{health.goal_alignment_score}</span>
          <span className="text-slate-500 mb-1">/100</span>
        </div>
        <p className="mt-2 text-sm text-slate-400">
          {health.goal_alignment_score >= 90 ? 'Excellent Alignment' : 'Misaligned'}
        </p>
      </div>
    </div>
  );
}
