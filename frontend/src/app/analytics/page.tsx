'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../stores/authStore';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { PortfolioIntelligenceCards } from '../../components/analytics/PortfolioIntelligenceCards';
import { PortfolioAllocationChart } from '../../components/analytics/PortfolioAllocationChart';
import { GoalForecastWidget } from '../../components/analytics/GoalForecastWidget';
import { BehavioralInsightsCard } from '../../components/analytics/BehavioralInsightsCard';
import { PortfolioHealthGauge } from '../../components/analytics/PortfolioHealthGauge';
import { GoalProgressTracker } from '../../components/analytics/GoalProgressTracker';
import { TrendCharts } from '../../components/analytics/TrendCharts';

export default function AnalyticsDashboardPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { fetchPortfolio, fetchHoldings, fetchSummary, fetchHealth, error } = usePortfolioStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      fetchPortfolio();
      fetchHoldings();
      fetchSummary();
      fetchHealth();
    }
  }, [isAuthenticated, router, fetchPortfolio, fetchHoldings, fetchSummary, fetchHealth]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#020617] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Portfolio Analytics</h1>
            <p className="mt-2 text-sm text-slate-400">
              AI-driven insights, health metrics, and goal forecasting.
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <Link
              href="/dashboard"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              &larr; Dashboard
            </Link>
            <Link
              href="/portfolio"
              className="text-sm text-slate-400 hover:text-white transition-colors mr-4"
            >
              Portfolio &rarr;
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Section 1: Portfolio Intelligence Cards */}
        <PortfolioIntelligenceCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Section 2: Portfolio Allocation Chart & Section 5: Health Gauge */}
          <div className="lg:col-span-1 space-y-8">
            <PortfolioHealthGauge />
            <PortfolioAllocationChart />
          </div>

          {/* Section 9: Trend Charts */}
          <div className="lg:col-span-2">
            <TrendCharts />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Section 3 & 6: Goal Forecast Widget & Progress Tracker */}
          <div className="flex flex-col gap-8">
            <GoalProgressTracker />
            <GoalForecastWidget />
          </div>

          {/* Section 4 & 7: AI Behavioral Insights & Learning Recommendations */}
          <BehavioralInsightsCard />
        </div>
      </div>
    </div>
  );
}
