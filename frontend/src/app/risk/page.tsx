'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../stores/authStore';
import { useRiskStore } from '../../stores/riskStore';
import { RiskWizard } from '../../components/risk/RiskWizard';
import { RiskResults } from '../../components/risk/RiskResults';

export default function RiskPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { assessment, loading, error, fetchAssessment, saveAssessment } = useRiskStore();
  
  const [retaking, setRetaking] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      fetchAssessment();
    }
  }, [isAuthenticated, router, fetchAssessment]);

  const handleComplete = async (answers: any) => {
    await saveAssessment(answers);
    setRetaking(false);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#020617] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Risk Assessment</h1>
            <p className="mt-2 text-sm text-slate-400">
              Discover your investment risk profile to get personalized recommendations.
            </p>
          </div>
          <div>
            <Link
              href="/dashboard"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              &larr; Back to Dashboard
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        {loading && !assessment ? (
          <div className="text-center py-20 text-slate-400">Loading your profile...</div>
        ) : assessment && !retaking ? (
          <RiskResults assessment={assessment} onRetake={() => setRetaking(true)} />
        ) : (
          <RiskWizard onComplete={handleComplete} isLoading={loading} />
        )}
      </div>
    </div>
  );
}
