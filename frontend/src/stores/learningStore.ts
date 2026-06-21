import { create } from 'zustand';
import { getModules, getProgress, getLiteracyScore, getRecommendation, completeModule, submitQuiz } from '../services/learningService';
import { useAuthStore } from './authStore';

export interface QuizQuestion {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimated_minutes: number;
  content: string;
  order_index: number;
  is_featured: boolean;
  quiz?: Quiz;
}

export interface LearningProgress {
  id: string;
  module_id: string;
  completed: boolean;
  score: number;
  attempts: number;
  time_spent_minutes: number;
}

export interface LiteracyScore {
  score: number;
  level: string;
  total_modules_completed: number;
  total_quizzes_passed: number;
}

interface LearningState {
  modules: LearningModule[];
  progress: Record<string, LearningProgress>; // keyed by module_id
  score: LiteracyScore | null;
  recommendation: LearningModule | null;
  loading: boolean;
  error: string | null;
  
  fetchDashboardData: () => Promise<void>;
  fetchAllData: () => Promise<void>;
  markCompleted: (moduleId: string, timeSpent: number) => Promise<void>;
  submitQuizAnswers: (quizId: string, moduleId: string, answers: Record<string, string>, timeSpent: number) => Promise<any>;
}

export const useLearningStore = create<LearningState>((set, get) => ({
  modules: [],
  progress: {},
  score: null,
  recommendation: null,
  loading: false,
  error: null,

  fetchDashboardData: async () => {
    try {
      const token = useAuthStore.getState().token;
      if (!token) return;
      
      const [scoreData, recData] = await Promise.all([
        getLiteracyScore(token),
        getRecommendation(token)
      ]);
      
      set({ score: scoreData, recommendation: recData });
    } catch (err: any) {
      console.error("Failed to fetch dashboard learning data", err);
    }
  },

  fetchAllData: async () => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("No token");
      
      const [modulesData, progressData, scoreData, recData] = await Promise.all([
        getModules(token),
        getProgress(token),
        getLiteracyScore(token),
        getRecommendation(token)
      ]);
      
      const progressMap = progressData.reduce((acc: any, p: any) => {
        acc[p.module_id] = p;
        return acc;
      }, {});

      set({ 
        modules: modulesData, 
        progress: progressMap, 
        score: scoreData, 
        recommendation: recData,
        loading: false 
      });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  markCompleted: async (moduleId: string, timeSpent: number) => {
    try {
      const token = useAuthStore.getState().token;
      if (!token) return;
      await completeModule(token, moduleId, timeSpent);
      await get().fetchAllData(); // Refresh to update score & progress
    } catch (err: any) {
      console.error("Failed to mark complete", err);
      throw err;
    }
  },

  submitQuizAnswers: async (quizId: string, moduleId: string, answers: Record<string, string>, timeSpent: number) => {
    try {
      const token = useAuthStore.getState().token;
      if (!token) return;
      const result = await submitQuiz(token, quizId, answers, timeSpent);
      await get().fetchAllData(); // Refresh to update score & progress
      return result;
    } catch (err: any) {
      console.error("Failed to submit quiz", err);
      throw err;
    }
  }
}));
