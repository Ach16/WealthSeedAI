import React from 'react';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { Activity } from 'lucide-react';

export function PortfolioHealthGauge() {
  const { health } = usePortfolioStore();

  if (!health) return null;

  const score = health.health_score;
  const rotation = (score / 100) * 180 - 90; // -90 to 90 degrees

  return (
    <div className="bg-[#0f172a] rounded-xl p-6 border border-white/5 shadow-lg flex flex-col items-center justify-center">
      <div className="w-full flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          Health Gauge
        </h2>
      </div>

      <div className="relative w-48 h-24 overflow-hidden mt-4">
        {/* Gauge Background */}
        <div className="absolute top-0 left-0 w-48 h-48 rounded-full border-[16px] border-slate-800" />
        
        {/* Colored Segments */}
        <div className="absolute top-0 left-0 w-48 h-48 rounded-full border-[16px] border-transparent border-t-red-500 border-l-red-500 rotate-[-45deg]" />
        <div className="absolute top-0 left-0 w-48 h-48 rounded-full border-[16px] border-transparent border-t-yellow-400 border-r-yellow-400 rotate-[45deg]" />
        <div className="absolute top-0 left-0 w-48 h-48 rounded-full border-[16px] border-transparent border-r-emerald-500 border-b-emerald-500 rotate-[45deg]" />
        
        {/* Needle */}
        <div 
          className="absolute bottom-0 left-1/2 w-1 h-24 bg-white origin-bottom rounded-t-full transition-transform duration-1000 ease-out"
          style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
        >
          <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full" />
        </div>
      </div>

      <div className="mt-4 text-center">
        <span className="text-4xl font-bold text-white">{score}</span>
        <div className="flex gap-4 mt-2 text-xs font-medium uppercase tracking-wider">
          <span className={score <= 40 ? 'text-red-400 font-bold' : 'text-slate-500'}>Poor</span>
          <span className={score > 40 && score <= 70 ? 'text-yellow-400 font-bold' : 'text-slate-500'}>Avg</span>
          <span className={score > 70 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>Exc</span>
        </div>
      </div>
    </div>
  );
}
