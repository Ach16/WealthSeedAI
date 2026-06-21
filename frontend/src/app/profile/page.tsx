'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../stores/authStore';
import { useProfileStore } from '../../stores/profileStore';
import { AchievementsBadgeSection } from '../../components/profile/AchievementsBadgeSection';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, token } = useAuthStore();
  const { profile, loading, error, successMessage, fetchProfile, saveProfile, clearMessages } = useProfileStore();

  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    country: '',
    occupation: '',
    annual_income: '',
    investment_experience: '',
    financial_goal: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      fetchProfile();
    }
  }, [isAuthenticated, router, fetchProfile]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        age: profile.age ? profile.age.toString() : '',
        country: profile.country || '',
        occupation: profile.occupation || '',
        annual_income: profile.annual_income ? profile.annual_income.toString() : '',
        investment_experience: profile.investment_experience || '',
        financial_goal: profile.financial_goal || '',
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    clearMessages();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveProfile(formData);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#020617] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Your Profile</h1>
            <p className="mt-2 text-sm text-slate-400">
              Manage your personal information and financial goals.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            &larr; Back to Dashboard
          </Link>
        </div>

        <div className="bg-[#0f172a] shadow-xl border border-white/5 sm:rounded-2xl backdrop-blur-sm overflow-hidden">
          <div className="px-4 py-5 sm:p-8">
            
            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm">
                {error}
              </div>
            )}
            
            {successMessage && (
              <div className="mb-6 bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-4 rounded-xl text-sm">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                
                <div className="sm:col-span-2">
                  <label htmlFor="full_name" className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    id="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full bg-[#1e293b] border border-white/5 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-slate-300 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    id="age"
                    min="18"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full bg-[#1e293b] border border-white/5 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    placeholder="e.g. 30"
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-slate-300 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    id="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full bg-[#1e293b] border border-white/5 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    placeholder="United States"
                  />
                </div>

                <div>
                  <label htmlFor="occupation" className="block text-sm font-medium text-slate-300 mb-2">
                    Occupation
                  </label>
                  <input
                    type="text"
                    name="occupation"
                    id="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    className="w-full bg-[#1e293b] border border-white/5 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    placeholder="Software Engineer"
                  />
                </div>

                <div>
                  <label htmlFor="annual_income" className="block text-sm font-medium text-slate-300 mb-2">
                    Annual Income (INR)
                  </label>
                  <input
                    type="number"
                    name="annual_income"
                    id="annual_income"
                    min="0"
                    step="1000"
                    value={formData.annual_income}
                    onChange={handleChange}
                    className="w-full bg-[#1e293b] border border-white/5 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    placeholder="500000"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="investment_experience" className="block text-sm font-medium text-slate-300 mb-2">
                    Investment Experience
                  </label>
                  <select
                    name="investment_experience"
                    id="investment_experience"
                    value={formData.investment_experience}
                    onChange={handleChange}
                    className="w-full bg-[#1e293b] border border-white/5 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  >
                    <option value="" disabled>Select experience level</option>
                    <option value="Beginner">Beginner (0-2 years)</option>
                    <option value="Intermediate">Intermediate (3-5 years)</option>
                    <option value="Advanced">Advanced (5+ years)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="financial_goal" className="block text-sm font-medium text-slate-300 mb-2">
                    Primary Financial Goal
                  </label>
                  <select
                    name="financial_goal"
                    id="financial_goal"
                    value={formData.financial_goal}
                    onChange={handleChange}
                    className="w-full bg-[#1e293b] border border-white/5 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  >
                    <option value="" disabled>Select your main goal</option>
                    <option value="Retirement">Retirement Planning</option>
                    <option value="Wealth Accumulation">Wealth Accumulation</option>
                    <option value="Passive Income">Generate Passive Income</option>
                    <option value="Education">Save for Education</option>
                    <option value="House">Buy a House</option>
                  </select>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-emerald-500/25 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0f172a] focus:ring-emerald-500 transition-all disabled:opacity-50"
                >
                  {loading ? 'Saving Changes...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8">
          <AchievementsBadgeSection />
        </div>
      </div>
    </div>
  );
}
