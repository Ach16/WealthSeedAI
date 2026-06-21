'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/authStore';
import { LogOut, ShieldCheck, User, Target } from 'lucide-react';
import Link from 'next/link';
import { GoalsOverviewCard } from '../../components/dashboard/GoalsOverviewCard';
import { RiskProfileCard } from '../../components/dashboard/RiskProfileCard';
import { PortfolioOverviewCard } from '../../components/dashboard/PortfolioOverviewCard';
import { LearningOverviewCard } from '../../components/dashboard/LearningOverviewCard';
import { AIMentorCard } from '../../components/dashboard/AIMentorCard';
import { Leaf } from 'lucide-react'; // Branding logo

export default function DashboardPage() {
  const { user, token, isAuthenticated, logout, setUser } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If we have a token but no user data, fetch user data
    const fetchUser = async () => {
      if (!token || !isAuthenticated) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          // Token invalid or expired
          logout();
          router.push('/login');
        }
      } catch (e) {
        console.error("Failed to fetch user", e);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, isAuthenticated, router, logout, setUser]);

  const handleLogout = async () => {
    try {
      if (token) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      logout();
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-emerald-400">Loading Session...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] p-8">
      {/* Global Branding Header */}
      <div className="fixed top-0 left-0 w-full bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5 z-50 px-8 py-4 flex items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              WealthSeed AI
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
              AI-Powered Financial Intelligence
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] w-full mx-auto mt-20 px-0 sm:px-4 lg:px-8">
        <div className="bg-[#0f172a] rounded-3xl p-8 border border-slate-700 shadow-2xl">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 pb-8 border-b border-white/5">
            <div className="mb-6 md:mb-0">
              <h1 className="text-3xl font-bold text-white mb-2">Welcome Back, {user?.email?.split('@')[0] || 'User'}</h1>
              <p className="text-sm text-slate-400">
                Track your financial growth and investment journey.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/goals"
                className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-colors border border-blue-500/20"
              >
                <Target className="w-4 h-4" />
                Manage Goals
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-lg transition-colors border border-emerald-500/20"
              >
                <User className="w-4 h-4" />
                Edit Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">


            <div className="bg-[#1e293b]/50 rounded-2xl p-6 border border-slate-700 backdrop-blur shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 h-full min-h-[260px] flex flex-col justify-start">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-cyan-500/10 rounded-lg">
                  <User className="w-6 h-6 text-cyan-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">Profile Data</h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Literacy Level</span>
                  <span className="text-emerald-400 font-medium px-2 py-1 bg-emerald-400/10 rounded">Beginner</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Risk Profile</span>
                  <span className="text-indigo-400 font-medium px-2 py-1 bg-indigo-400/10 rounded">{user?.profile?.risk_profile || 'Unknown'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Literacy Score</span>
                  <span className="text-white font-medium">{user?.profile?.literacy_score || '0'}</span>
                </div>
              </div>
            </div>
            
            <PortfolioOverviewCard />
            <RiskProfileCard />
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-between">
              Portfolio Intelligence
              <Link href="/analytics" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                View Full Analytics &rarr;
              </Link>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <PortfolioIntelligenceWidget type="health" />
              <PortfolioIntelligenceWidget type="risk" />
              <PortfolioIntelligenceWidget type="diversification" />
              <PortfolioIntelligenceWidget type="alignment" />
            </div>
          </div>

          <div className="mt-8">
            <AIMentorCard />
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <GoalsOverviewCard />
            <LearningOverviewCard />
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline widget for Portfolio Intelligence
import { usePortfolioStore } from '../../stores/portfolioStore';
import { HeartPulse, AlertTriangle, ShieldCheck as ShieldIcon, Target as TargetIcon } from 'lucide-react';

function PortfolioIntelligenceWidget({ type }: { type: 'health' | 'risk' | 'diversification' | 'alignment' }) {
  const { health } = usePortfolioStore();

  if (!health) {
    return (
      <div className="bg-[#1e293b]/50 rounded-2xl p-6 border border-slate-700 backdrop-blur shadow-lg h-[160px] flex flex-col justify-center items-center text-center animate-pulse">
        <span className="text-sm text-slate-500">Calculating...</span>
      </div>
    );
  }

  const getWidgetContent = () => {
    switch (type) {
      case 'health': return { title: 'Portfolio Health', value: health.health_score, color: 'text-emerald-400' };
      case 'risk': return { title: 'Risk Score', value: health.risk_score, color: 'text-yellow-400' };
      case 'diversification': return { title: 'Diversification', value: health.diversification_score, color: 'text-cyan-400' };
      case 'alignment': return { title: 'Goal Alignment', value: health.goal_alignment_score, color: 'text-purple-400' };
    }
  };

  const content = getWidgetContent();

  return (
    <div className="bg-[#1e293b]/50 rounded-2xl p-6 border border-slate-700 backdrop-blur shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 min-h-[160px] flex flex-col justify-center items-center text-center relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <h3 className="text-slate-400 font-medium mb-2 relative z-10">{content.title}</h3>
      <span className={`text-4xl font-bold ${content.color} relative z-10`}>{content.value}</span>
    </div>
  );
}
