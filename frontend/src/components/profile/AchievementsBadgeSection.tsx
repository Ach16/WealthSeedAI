import React, { useEffect } from 'react';
import { useLearningStore } from '../../stores/learningStore';
import { Award, Star, BookOpen, Zap, ShieldCheck } from 'lucide-react';

export const AchievementsBadgeSection = () => {
  const { score, fetchDashboardData } = useLearningStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const badges = [
    {
      id: 'first-lesson',
      title: 'First Step',
      description: 'Completed your first lesson.',
      icon: <BookOpen className="w-8 h-8 text-emerald-400" />,
      earned: (score?.total_modules_completed || 0) >= 1,
      bg: 'bg-emerald-500/10 border-emerald-500/30 shadow-emerald-500/10'
    },
    {
      id: 'first-quiz',
      title: 'Quiz Ace',
      description: 'Passed your first quiz.',
      icon: <Zap className="w-8 h-8 text-amber-400" />,
      earned: (score?.total_quizzes_passed || 0) >= 1,
      bg: 'bg-amber-500/10 border-amber-500/30 shadow-amber-500/10'
    },
    {
      id: 'five-lessons',
      title: 'Dedicated Learner',
      description: 'Completed 5 lessons.',
      icon: <Star className="w-8 h-8 text-indigo-400" />,
      earned: (score?.total_modules_completed || 0) >= 5,
      bg: 'bg-indigo-500/10 border-indigo-500/30 shadow-indigo-500/10'
    },
    {
      id: 'advanced',
      title: 'Wealth Master',
      description: 'Reached Advanced literacy level.',
      icon: <ShieldCheck className="w-8 h-8 text-rose-400" />,
      earned: score?.level === 'Advanced',
      bg: 'bg-rose-500/10 border-rose-500/30 shadow-rose-500/10'
    }
  ];

  return (
    <div className="bg-[#1e293b] rounded-xl border border-white/5 overflow-hidden">
      <div className="p-6 border-b border-white/5 flex items-center gap-3">
        <Award className="w-6 h-6 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">Achievements & Badges</h3>
      </div>
      <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
        {badges.map((badge) => (
          <div 
            key={badge.id} 
            className={`flex flex-col items-center p-4 rounded-xl border text-center transition-all ${
              badge.earned 
              ? `${badge.bg} shadow-lg opacity-100 scale-100` 
              : 'bg-[#0f172a] border-white/5 opacity-50 grayscale hover:grayscale-0 transition-all'
            }`}
          >
            <div className="mb-3">
              {badge.icon}
            </div>
            <h4 className="font-bold text-white text-sm mb-1">{badge.title}</h4>
            <p className="text-xs text-slate-400">{badge.description}</p>
            {badge.earned && (
              <div className="mt-3 text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                Unlocked
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
