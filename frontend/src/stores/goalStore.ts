import { create } from 'zustand';
import { getGoals, getGoalsSummary, createGoal, updateGoal, deleteGoal } from '../services/goalService';
import { useAuthStore } from './authStore';

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  goal_type: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  priority: string;
  status: string;
  notes?: string;
  is_archived: boolean;
  category_icon?: string;
  progress_percentage: number;
}

export interface GoalsSummaryData {
  total_goals: number;
  completed_goals: number;
  in_progress_goals: number;
  average_progress: number;
  upcoming_deadline?: string;
}

interface GoalState {
  goals: Goal[];
  summary: GoalsSummaryData | null;
  loading: boolean;
  error: string | null;
  fetchGoals: () => Promise<void>;
  fetchSummary: () => Promise<void>;
  addGoal: (data: any) => Promise<void>;
  editGoal: (id: string, data: any) => Promise<void>;
  removeGoal: (id: string) => Promise<void>;
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: [],
  summary: null,
  loading: false,
  error: null,

  fetchGoals: async () => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("No authentication token found");
      const data = await getGoals(token);
      set({ goals: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchSummary: async () => {
    try {
      const token = useAuthStore.getState().token;
      if (!token) return;
      const data = await getGoalsSummary(token);
      set({ summary: data });
    } catch (err: any) {
      console.error("Failed to fetch goals summary", err);
    }
  },

  addGoal: async (data: any) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("No authentication token found");
      const newGoal = await createGoal(token, data);
      set((state) => ({ goals: [newGoal, ...state.goals], loading: false }));
      await get().fetchSummary();
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  editGoal: async (id: string, data: any) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("No authentication token found");
      const updatedGoal = await updateGoal(token, id, data);
      set((state) => ({
        goals: state.goals.map((g) => (g.id === id ? updatedGoal : g)),
        loading: false
      }));
      await get().fetchSummary();
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  removeGoal: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("No authentication token found");
      await deleteGoal(token, id);
      set((state) => ({
        goals: state.goals.filter((g) => g.id !== id),
        loading: false
      }));
      await get().fetchSummary();
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  }
}));
