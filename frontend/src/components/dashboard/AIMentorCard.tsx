import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bot, Sparkles, Send, BrainCircuit, MessageSquare } from 'lucide-react';
import { useMentorStore } from '../../stores/mentorStore';

export const AIMentorCard = () => {
  const router = useRouter();
  const { latestInsights } = useMentorStore();

  return (
    <div className="bg-[#1e293b]/50 rounded-2xl p-6 border border-slate-700 backdrop-blur shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 h-full min-h-[420px] flex flex-col relative overflow-hidden group">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors"></div>

      <div className="flex items-start justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/30 shadow-inner">
            <Bot className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              AI Mentor <Sparkles className="w-5 h-5 text-indigo-400" />
            </h2>
            <div className="text-sm font-medium text-indigo-300/90 mt-1">
              Personalized Wealth Guidance
            </div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">
              Powered by AI, Portfolio Analytics & Goal Intelligence
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center relative z-10 space-y-6">
        <div className="bg-[#0f172a]/60 border border-white/5 rounded-xl p-4 relative">
          <MessageSquare className="w-4 h-4 text-slate-500 absolute top-4 left-4" />
          <p className="text-sm text-slate-300 pl-8 italic">
            "I have analyzed your profile and recent activity. How can I help you grow your wealth today?"
          </p>
        </div>

        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <BrainCircuit className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Latest Insight</h3>
          </div>
          <p className="text-sm text-indigo-100/80">
            {latestInsights?.recommendation || "Your portfolio is looking balanced. Keep up the disciplined approach."}
          </p>
        </div>
      </div>

      <div className="mt-6 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          "What is SIP?",
          "Analyze My Portfolio",
          "How Can I Reach My Goal Faster?",
          "What Investment Mistakes Should I Avoid?"
        ].map((q, idx) => (
          <button
            key={idx}
            onClick={() => router.push(`/mentor?q=${encodeURIComponent(q)}`)}
            className="text-left px-4 py-3 bg-[#0f172a]/80 hover:bg-indigo-500/20 border border-white/5 hover:border-indigo-500/30 rounded-xl text-sm text-slate-300 hover:text-white transition-all duration-200"
          >
            {q}
          </button>
        ))}
      </div>

      <div className="mt-8 relative z-10">
        <button
          onClick={() => router.push('/mentor')}
          className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 text-lg"
        >
          Open Mentor Chat
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
