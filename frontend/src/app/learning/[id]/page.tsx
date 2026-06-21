'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../../stores/authStore';
import { useLearningStore } from '../../../stores/learningStore';
import { ModuleReader } from '../../../components/learning/ModuleReader';
import { QuizEngine } from '../../../components/learning/QuizEngine';

export default function LearningModulePage() {
  const router = useRouter();
  const params = useParams();
  const moduleId = params.id as string;
  
  const { isAuthenticated, hasHydrated } = useAuthStore();
  const { modules, fetchAllData, loading } = useLearningStore();
  
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!isAuthenticated) {
      router.push('/login');
    } else if (modules.length === 0) {
      fetchAllData();
    }
  }, [hasHydrated, isAuthenticated, router, modules.length, fetchAllData]);

  if (!hasHydrated || loading && modules.length === 0) {
    return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-slate-400">Loading module...</div>;
  }

  if (!isAuthenticated) return null;

  const module = modules.find(m => m.id === moduleId);

  if (loading && !module) {
    return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-slate-400">Loading module...</div>;
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-slate-400">
        Module not found. <Link href="/learning" className="ml-2 text-indigo-400">Go back</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/learning"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            &larr; Back to Academy
          </Link>
        </div>

        {!showQuiz ? (
          <ModuleReader module={module} onComplete={() => setShowQuiz(true)} />
        ) : (
          module.quiz ? (
            <QuizEngine quiz={module.quiz} moduleId={module.id} />
          ) : (
            <div className="text-center py-12 text-slate-400">No quiz available for this module.</div>
          )
        )}
      </div>
    </div>
  );
}
