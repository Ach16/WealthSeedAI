import React, { useMemo } from 'react';
import { BrainCircuit, Lightbulb, BookOpen } from 'lucide-react';
import { useMentorStore } from '../../stores/mentorStore';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { useAuthStore } from '../../stores/authStore';

export function BehavioralInsightsCard() {
  const { latestInsights } = useMentorStore();
  const { health } = usePortfolioStore();
  const { user } = useAuthStore();

  const insight = useMemo(() => {
    if (latestInsights) {
      return {
        emotion: latestInsights.emotion,
        confidence: Math.round(latestInsights.emotion_confidence * 100),
        recommendation: `Your recent chat indicates ${latestInsights.emotion}. AI analysis suggests focusing on your long-term goals.`,
        topics: latestInsights.recommended_topics || ["Risk Management", "Diversification"]
      };
    }
    
    // Fallback if no chat has happened yet, use real profile data
    const riskScore = health?.risk_score || 0;
    const isHighRisk = riskScore > 60;
    
    return {
      emotion: isHighRisk ? "Overconfident (Derived)" : "Neutral",
      confidence: 50,
      recommendation: isHighRisk 
        ? "Your portfolio risk is high compared to average benchmarks. Ensure your allocation aligns with your stated risk profile."
        : "Your portfolio risk is balanced. Keep up the disciplined approach and continue your financial education.",
      topics: ["Asset Allocation", "Risk Management", "Goal Planning"]
    };
  }, [latestInsights, health, user]);

  const getEmotionColor = (emotion: string) => {
    switch(emotion.toLowerCase()) {
      case 'greed':
      case 'overconfident (derived)':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'fear':
      case 'fomo':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default:
        return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    }
  };

  return (
    <div className="bg-[#0f172a] rounded-xl p-6 border border-white/5 shadow-lg flex flex-col h-full relative overflow-hidden">
      <div className="absolute -top-10 -right-10 opacity-5 blur-2xl">
        <BrainCircuit className="w-48 h-48 text-indigo-400" />
      </div>

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2 bg-indigo-500/10 rounded-lg">
          <BrainCircuit className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Behavioral Insights</h2>
          <p className="text-sm text-slate-400">AI psychological analysis</p>
        </div>
      </div>

      <div className="mb-6 flex justify-between items-end relative z-10">
        <div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1 block">Detected State</span>
          <div className={`px-4 py-1.5 rounded-full border inline-flex items-center gap-2 ${getEmotionColor(insight.emotion)}`}>
            <span className="font-semibold">{insight.emotion}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1 block">AI Confidence</span>
          <span className="text-xl font-bold text-white">{insight.confidence}%</span>
        </div>
      </div>

      <div className="bg-[#1e293b]/50 border border-white/5 rounded-lg p-4 mb-6 relative z-10 flex-1">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-slate-300 leading-relaxed">
            {insight.recommendation}
          </p>
        </div>
      </div>

      {/* Section 7: Learning Recommendations */}
      <div className="relative z-10 mt-auto">
        <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4" /> Recommended Topics
        </h3>
        <div className="flex flex-wrap gap-2">
          {insight.topics.map(topic => (
            <button key={topic} className="text-xs font-medium px-3 py-1.5 rounded-md bg-white/5 text-slate-300 hover:bg-indigo-500/20 hover:text-indigo-300 transition-colors border border-white/5 hover:border-indigo-500/30">
              {topic}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
