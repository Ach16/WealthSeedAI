import React from 'react';
import { GoalProgressBar } from './GoalProgressBar';
import { Goal } from '../../stores/goalStore';
import { Pencil, Trash2 } from 'lucide-react';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit, onDelete }) => {
  const isCompleted = goal.status === 'Completed';

  return (
    <div className={`bg-[#0f172a] rounded-xl p-5 border ${isCompleted ? 'border-emerald-500/30' : 'border-white/5'} shadow-xl relative group`}>
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(goal)} className="p-1.5 bg-[#1e293b] text-blue-400 rounded hover:bg-blue-500/20 transition-colors">
          <Pencil className="w-4 h-4" />
        </button>
        <button onClick={() => onDelete(goal.id)} className="p-1.5 bg-[#1e293b] text-red-400 rounded hover:bg-red-500/20 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-semibold text-white truncate pr-16">{goal.title}</h3>
        </div>
        <span className="text-xs px-2 py-1 bg-slate-800 text-slate-300 rounded-md border border-slate-700">
          {goal.goal_type}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-slate-400 mb-1">Target Amount</p>
          <p className="text-sm font-medium text-white">₹{goal.target_amount.toLocaleString('en-IN')}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">Current Amount</p>
          <p className="text-sm font-medium text-emerald-400">₹{goal.current_amount.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-400">Progress</span>
          <span className="font-medium text-white">{goal.progress_percentage.toFixed(1)}%</span>
        </div>
        <GoalProgressBar progress={goal.progress_percentage} />
      </div>

      <div className="flex justify-between items-center text-xs border-t border-white/5 pt-4">
        <div>
          <span className="text-slate-400">Target: </span>
          <span className="text-slate-200">{new Date(goal.target_date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full ${
            goal.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
            goal.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400' :
            goal.status === 'Paused' ? 'bg-orange-500/10 text-orange-400' :
            'bg-slate-500/10 text-slate-400'
          }`}>
            {goal.status}
          </span>
        </div>
      </div>
    </div>
  );
};
