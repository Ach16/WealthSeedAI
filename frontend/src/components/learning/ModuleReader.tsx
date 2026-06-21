import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useLearningStore, LearningModule } from '../../stores/learningStore';
import { BookOpen, CheckCircle } from 'lucide-react';

export const ModuleReader = ({ module, onComplete }: { module: LearningModule, onComplete: () => void }) => {
  const { progress, markCompleted } = useLearningStore();
  const modProgress = progress[module.id];
  const isCompleted = modProgress?.completed;
  
  const [timeSpent, setTimeSpent] = React.useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1); // rough seconds
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleComplete = async () => {
    if (!isCompleted) {
      await markCompleted(module.id, Math.ceil(timeSpent / 60));
    }
    onComplete();
  };

  return (
    <div className="bg-[#1e293b] rounded-xl border border-white/5 overflow-hidden">
      <div className="p-8 md:p-12 border-b border-white/5">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-white/10">
            {module.category}
          </span>
          <span className="text-sm text-slate-400 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> {module.estimated_minutes} min read
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">{module.title}</h1>
        <p className="text-lg text-slate-400">{module.description}</p>
      </div>
      
      <div className="p-8 md:p-12 prose prose-invert prose-emerald max-w-none">
        <ReactMarkdown>{module.content}</ReactMarkdown>
      </div>

      <div className="p-8 border-t border-white/5 bg-[#0f172a] flex justify-between items-center">
        <div className="text-sm text-slate-400">
          {isCompleted && (
            <span className="flex items-center gap-2 text-emerald-400">
              <CheckCircle className="w-5 h-5" /> Module completed
            </span>
          )}
        </div>
        <button
          onClick={handleComplete}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium hover:from-emerald-400 hover:to-cyan-400 transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2"
        >
          {isCompleted ? 'Proceed to Quiz' : 'Mark as Read & Continue'}
        </button>
      </div>
    </div>
  );
};
