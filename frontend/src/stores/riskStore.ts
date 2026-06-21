import { create } from 'zustand';
import { submitAssessment, getAssessment, getRiskProfile } from '../services/riskService';
import { useAuthStore } from './authStore';

export interface RiskAssessmentData {
  id?: string;
  investment_horizon: string;
  risk_tolerance: string;
  income_stability: string;
  emergency_fund: string;
  market_experience: string;
  score?: number;
  risk_profile?: string;
  risk_explanation?: string;
  completed_at?: string;
}

export interface RiskProfileData {
  score: number;
  risk_profile: string;
  risk_explanation: string;
  last_updated: string;
}

interface RiskState {
  assessment: RiskAssessmentData | null;
  profile: RiskProfileData | null;
  loading: boolean;
  error: string | null;
  fetchAssessment: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  saveAssessment: (data: any) => Promise<void>;
}

export const useRiskStore = create<RiskState>((set, get) => ({
  assessment: null,
  profile: null,
  loading: false,
  error: null,

  fetchAssessment: async () => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("No token");
      const data = await getAssessment(token);
      set({ assessment: data, loading: false });
    } catch (err: any) {
      if (err.message !== "Risk assessment not found") {
        set({ error: err.message });
      }
      set({ loading: false });
    }
  },

  fetchProfile: async () => {
    try {
      const token = useAuthStore.getState().token;
      if (!token) return;
      const data = await getRiskProfile(token);
      set({ profile: data });
    } catch (err: any) {
      console.error("Failed to fetch risk profile", err);
    }
  },

  saveAssessment: async (data: any) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("No token");
      const newAssessment = await submitAssessment(token, data);
      set({ assessment: newAssessment, loading: false });
      await get().fetchProfile();
      
      // Update the user profile dynamically if the authStore exposes it or we can just fetch it again
      // We assume user profile will be fetched on next dashboard load, or we could update it directly
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  }
}));
