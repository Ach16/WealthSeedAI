'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../stores/authStore';
import { useLearningStore } from '../../stores/learningStore';
import { ModuleList } from '../../components/learning/ModuleList';
import { GraduationCap, Trophy, Target, Star } from 'lucide-react';

export default function LearningPage() {
  const router = useRouter();
  const { isAuthenticated, hasHydrated } = useAuthStore();
  const { fetchAllData, score, recommendation, loading, error } = useLearningStore();

  useEffect(() => {
    if (!hasHydrated) return; // Wait for Zustand to load from localStorage

    if (!isAuthenticated) {
      router.push('/login');
    } else {
      fetchAllData();
    }
  }, [hasHydrated, isAuthenticated, router, fetchAllData]);

  if (!hasHydrated || loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-indigo-400 font-medium">Loading Wealth Academy...</div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#020617] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-indigo-400" />
              Wealth Academy
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Master the principles of finance, level up your skills, and build lasting wealth.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            &larr; Dashboard
          </Link>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Score Card */}
          <div className="bg-gradient-to-br from-indigo-900 to-[#1e293b] rounded-xl p-6 border border-indigo-500/30 flex items-center gap-6">
            <div className="w-16 h-16 rounded-full border-4 border-indigo-500 flex items-center justify-center bg-[#0f172a] shrink-0">
              <span className="text-2xl font-bold text-white">{score?.score || 0}</span>
            </div>
            <div>
              <div className="text-sm text-indigo-300 font-medium mb-1">Literacy Level</div>
              <div className="text-2xl font-bold text-white tracking-tight">{score?.level || 'Beginner'}</div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-[#1e293b] rounded-xl p-6 border border-white/5 flex items-center gap-6">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Trophy className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-1">Modules Completed</div>
              <div className="text-2xl font-bold text-white">{score?.total_modules_completed || 0}</div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-[#1e293b] rounded-xl p-6 border border-white/5 flex items-center gap-6">
            <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
              <Target className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-1 flex items-center gap-1">
                <Star className="w-3 h-3 text-orange-400" /> Up Next
              </div>
              <div className="text-lg font-bold text-white truncate max-w-[150px]">
                {recommendation?.title || 'Loading...'}
              </div>
              {recommendation && (
                <Link href={`/learning/${recommendation.id}`} className="text-xs text-indigo-400 hover:text-indigo-300 mt-1 inline-block">
                  Start module &rarr;
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Curriculum</h2>
          <ModuleList />
        </div>
      </div>
    </div>
  );
}
