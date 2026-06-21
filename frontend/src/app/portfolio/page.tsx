'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { PortfolioSummary } from '../../components/portfolio/PortfolioSummary';
import { HoldingsTable } from '../../components/portfolio/HoldingsTable';
import { AllocationSection } from '../../components/portfolio/AllocationSection';
import { TransactionHistory } from '../../components/portfolio/TransactionHistory';
import { BuyAssetModal } from '../../components/portfolio/BuyAssetModal';
import { SellAssetModal } from '../../components/portfolio/SellAssetModal';

export default function PortfolioPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { fetchPortfolio, fetchHoldings, fetchTransactions, fetchSummary, error } = usePortfolioStore();

  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [sellHoldingId, setSellHoldingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      fetchPortfolio();
      fetchHoldings();
      fetchTransactions();
      fetchSummary();
    }
  }, [isAuthenticated, router, fetchPortfolio, fetchHoldings, fetchTransactions, fetchSummary]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#020617] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Virtual Portfolio</h1>
            <p className="mt-2 text-sm text-slate-400">
              Manage your assets, track performance, and practice investing risk-free.
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <Link
              href="/dashboard"
              className="text-sm text-slate-400 hover:text-white transition-colors mr-4"
            >
              &larr; Dashboard
            </Link>
            <Link
              href="/analytics"
              className="text-sm text-slate-400 hover:text-white transition-colors mr-4 flex items-center gap-1"
            >
              Analytics View &rarr;
            </Link>
            <button
              onClick={() => setIsBuyModalOpen(true)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium hover:from-emerald-400 hover:to-cyan-400 transition-all shadow-lg shadow-emerald-500/25"
            >
              <Plus className="w-4 h-4" />
              Buy Asset
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        <PortfolioSummary />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-4">Your Holdings</h2>
            <HoldingsTable onSellClick={(id) => setSellHoldingId(id)} />
          </div>
          <div>
            <AllocationSection />
          </div>
        </div>

        <div className="mt-8">
          <TransactionHistory />
        </div>
      </div>

      <BuyAssetModal 
        isOpen={isBuyModalOpen} 
        onClose={() => setIsBuyModalOpen(false)} 
      />
      
      <SellAssetModal 
        isOpen={!!sellHoldingId} 
        onClose={() => setSellHoldingId(null)} 
        holdingId={sellHoldingId}
      />
    </div>
  );
}
