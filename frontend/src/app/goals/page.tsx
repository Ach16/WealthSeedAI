'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../stores/authStore';
import { useGoalStore, Goal } from '../../stores/goalStore';
import { GoalCard } from '../../components/goals/GoalCard';
import { GoalModal } from '../../components/goals/GoalModal';
import { Plus } from 'lucide-react';

export default function GoalsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { goals, loading, error, fetchGoals, addGoal, editGoal, removeGoal } = useGoalStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      fetchGoals();
    }
  }, [isAuthenticated, router, fetchGoals]);

  const handleOpenNew = () => {
    setEditingGoal(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const handleSave = async (data: any) => {
    if (editingGoal) {
      await editGoal(editingGoal.id, data);
    } else {
      await addGoal(data);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      await removeGoal(id);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#020617] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Your Financial Goals</h1>
            <p className="mt-2 text-sm text-slate-400">
              Track and manage your path to financial freedom.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              &larr; Back to Dashboard
            </Link>
            <button
              onClick={handleOpenNew}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-cyan-400 transition-all font-medium"
            >
              <Plus className="w-4 h-4" />
              New Goal
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        {loading && goals.length === 0 ? (
          <div className="text-center py-20 text-slate-400">Loading goals...</div>
        ) : goals.length === 0 ? (
          <div className="text-center py-20 bg-[#0f172a] rounded-2xl border border-white/5 shadow-xl">
            <h3 className="text-xl font-medium text-white mb-2">No goals yet</h3>
            <p className="text-slate-400 mb-6">Create your first financial goal to start tracking your progress.</p>
            <button
              onClick={handleOpenNew}
              className="px-6 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500 hover:text-white transition-colors"
            >
              Create Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map(goal => (
              <GoalCard 
                key={goal.id} 
                goal={goal} 
                onEdit={handleOpenEdit} 
                onDelete={handleDelete} 
              />
            ))}
          </div>
        )}

        <GoalModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          goal={editingGoal}
        />
      </div>
    </div>
  );
}
