import React from 'react';
import { RiskAssessmentData } from '../../stores/riskStore';
import { RefreshCcw, ShieldCheck, TrendingUp, Zap } from 'lucide-react';

export const RiskResults: React.FC<{ assessment: RiskAssessmentData, onRetake: () => void }> = ({ assessment, onRetake }) => {
  const getProfileTheme = (profile: string) => {
    switch(profile) {
      case 'Conservative': return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: ShieldCheck };
      case 'Moderate': return { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: TrendingUp };
      case 'Aggressive': return { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', icon: Zap };
      default: return { color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30', icon: ShieldCheck };
    }
  };

  const theme = getProfileTheme(assessment.risk_profile || 'Moderate');
  const Icon = theme.icon;

  return (
    <div className="bg-[#0f172a] rounded-2xl p-8 border border-white/5 shadow-2xl max-w-2xl mx-auto text-center">
      <div className={`inline-flex p-4 rounded-2xl ${theme.bg} ${theme.color} mb-6`}>
        <Icon className="w-12 h-12" />
      </div>
      
      <h2 className="text-3xl font-bold text-white mb-2">Your Risk Profile</h2>
      <div className={`text-2xl font-bold ${theme.color} mb-6`}>
        {assessment.risk_profile}
      </div>

      <div className="bg-[#1e293b] rounded-xl p-6 border border-white/5 mb-8 text-left">
        <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-4">
          <span className="text-slate-400">Risk Score</span>
          <span className="text-xl font-bold text-white">{assessment.score}/25</span>
        </div>
        <div>
          <h3 className="text-sm font-medium text-slate-400 mb-2">What this means:</h3>
          <p className="text-slate-200 leading-relaxed">
            {assessment.risk_explanation}
          </p>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onRetake}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1e293b] text-slate-300 hover:bg-white/5 transition-colors font-medium border border-white/5"
        >
          <RefreshCcw className="w-4 h-4" />
          Retake Assessment
        </button>
      </div>
    </div>
  );
};
