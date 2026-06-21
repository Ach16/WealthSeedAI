import React, { useState, useEffect } from 'react';
import { Goal } from '../../stores/goalStore';
import { X } from 'lucide-react';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  goal?: Goal | null;
}

export const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose, onSave, goal }) => {
  const [formData, setFormData] = useState({
    title: '',
    goal_type: 'Wealth Growth',
    target_amount: '',
    current_amount: '0',
    target_date: '',
    priority: 'Medium',
    status: 'Not Started',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title,
        goal_type: goal.goal_type,
        target_amount: goal.target_amount.toString(),
        current_amount: goal.current_amount.toString(),
        target_date: goal.target_date,
        priority: goal.priority,
        status: goal.status,
        notes: goal.notes || ''
      });
    } else {
      setFormData({
        title: '',
        goal_type: 'Wealth Growth',
        target_amount: '',
        current_amount: '0',
        target_date: '',
        priority: 'Medium',
        status: 'Not Started',
        notes: ''
      });
    }
    setError('');
  }, [goal, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const payload = {
        ...formData,
        target_amount: parseFloat(formData.target_amount),
        current_amount: parseFloat(formData.current_amount)
      };
      await onSave(payload);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#0f172a] rounded-2xl w-full max-w-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">{goal ? 'Edit Goal' : 'Create New Goal'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form id="goal-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Goal Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-[#1e293b] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  placeholder="e.g. Save for a new car"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Goal Type</label>
                <select
                  name="goal_type"
                  value={formData.goal_type}
                  onChange={handleChange}
                  className="w-full bg-[#1e293b] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 transition-all"
                >
                  <option value="Emergency Fund">Emergency Fund</option>
                  <option value="Retirement">Retirement</option>
                  <option value="House Purchase">House Purchase</option>
                  <option value="Education">Education</option>
                  <option value="Wealth Growth">Wealth Growth</option>
                  <option value="Vacation">Vacation</option>
                  <option value="Vehicle Purchase">Vehicle Purchase</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Target Date</label>
                <input
                  type="date"
                  name="target_date"
                  required
                  value={formData.target_date}
                  onChange={handleChange}
                  className="w-full bg-[#1e293b] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Target Amount (INR)</label>
                <input
                  type="number"
                  name="target_amount"
                  required
                  min="1"
                  step="0.01"
                  value={formData.target_amount}
                  onChange={handleChange}
                  className="w-full bg-[#1e293b] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  placeholder="100000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Current Amount (INR)</label>
                <input
                  type="number"
                  name="current_amount"
                  required
                  min="0"
                  step="0.01"
                  value={formData.current_amount}
                  onChange={handleChange}
                  className="w-full bg-[#1e293b] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full bg-[#1e293b] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 transition-all"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-[#1e293b] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 transition-all"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Paused">Paused</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-[#1e293b] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  placeholder="Any extra details..."
                />
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-white/5 bg-[#0b1120] flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-slate-300 hover:bg-white/5 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="goal-form"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium hover:from-emerald-400 hover:to-cyan-400 transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Goal'}
          </button>
        </div>
      </div>
    </div>
  );
};
