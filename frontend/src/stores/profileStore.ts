import { create } from 'zustand';
import { getProfile, updateProfile } from '../services/profileService';
import { useAuthStore } from './authStore';

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  age: number | null;
  country: string | null;
  occupation: string | null;
  annual_income: number | null;
  investment_experience: string | null;
  financial_goal: string | null;
  literacy_score: number;
  risk_profile: string;
  virtual_balance: number;
}

interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  fetchProfile: () => Promise<void>;
  saveProfile: (data: any) => Promise<void>;
  clearMessages: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  loading: false,
  error: null,
  successMessage: null,

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("No authentication token found");
      
      const data = await getProfile(token);
      set({ profile: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  saveProfile: async (data: any) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("No authentication token found");
      
      // Ensure numeric fields are properly parsed
      const payload = {
        ...data,
        age: data.age ? parseInt(data.age, 10) : null,
        annual_income: data.annual_income ? parseFloat(data.annual_income) : null
      };

      const updatedData = await updateProfile(token, payload);
      set({ profile: updatedData, successMessage: "Profile updated successfully!", loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  clearMessages: () => {
    set({ error: null, successMessage: null });
  }
}));
