import React from 'react';
import Link from 'next/link';
import { useLearningStore } from '../../stores/learningStore';
import { BookOpen, CheckCircle, Clock, Star } from 'lucide-react';

export const ModuleList = () => {
  const { modules, progress, loading } = useLearningStore();

  if (loading && modules.length === 0) {
    return <div className="text-slate-400 py-8 text-center animate-pulse">Loading modules...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {modules.map(module => {
        const modProgress = progress[module.id];
        const isCompleted = modProgress?.completed;
        const quizPassed = (modProgress?.score || 0) > 0;

        return (
          <Link href={`/learning/${module.id}`} key={module.id}>
            <div className={`bg-[#1e293b] rounded-xl p-6 border transition-all h-full flex flex-col ${
              module.is_featured ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/10 hover:border-indigo-400' : 'border-white/5 hover:border-white/20'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  module.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400' :
                  module.difficulty === 'Intermediate' ? 'bg-orange-500/10 text-orange-400' :
                  'bg-red-500/10 text-red-400'
                }`}>
                  {module.difficulty}
                </span>
                
                <div className="flex items-center gap-2 text-xs">
                  {module.is_featured && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                  {isCompleted && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{module.title}</h3>
              <p className="text-slate-400 text-sm mb-6 flex-grow">{module.description}</p>
              
              <div className="flex items-center justify-between text-xs text-slate-500 mt-auto pt-4 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{module.estimated_minutes} min read</span>
                </div>
                {quizPassed ? (
                  <span className="text-indigo-400 font-medium flex items-center gap-1">
                    Quiz Passed
                  </span>
                ) : isCompleted ? (
                  <span className="text-emerald-400 font-medium">Read</span>
                ) : (
                  <span className="text-slate-400 flex items-center gap-1">
                    <BookOpen className="w-4 h-4" /> Start
                  </span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
