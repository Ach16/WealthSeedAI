import { create } from 'zustand';
import { chatWithMentor, getProviderStatus } from '../services/mentorService';
import { useAuthStore } from './authStore';

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  sources?: string[];
  provider?: string;
  timestamp: Date;
}

interface MentorState {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  providerStatus: any | null;
  latestInsights: any | null;
  
  sendMessage: (message: string) => Promise<void>;
  fetchProviderStatus: () => Promise<void>;
  clearHistory: () => void;
}

export const useMentorStore = create<MentorState>((set, get) => ({
  messages: [
    {
      id: 'welcome-msg',
      role: 'ai',
      content: 'Hello! I am your AI Wealth Mentor. I have analyzed your goals, risk profile, and portfolio. How can I help you build wealth today?',
      timestamp: new Date()
    }
  ],
  loading: false,
  error: null,
  providerStatus: null,
  latestInsights: null,

  sendMessage: async (message: string) => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    // Add user message optimistically
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    set((state) => ({ 
      messages: [...state.messages, userMsg],
      loading: true,
      error: null
    }));

    try {
      const response = await chatWithMentor(token, message);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: response.answer,
        sources: response.sources,
        provider: response.provider,
        timestamp: new Date()
      };

      set((state) => ({
        messages: [...state.messages, aiMsg],
        latestInsights: response.insights || null,
        loading: false
      }));
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchProviderStatus: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return;
    try {
      const status = await getProviderStatus(token);
      set({ providerStatus: status });
    } catch (err) {
      console.error("Failed to fetch provider status", err);
    }
  },

  clearHistory: () => {
    set({
      messages: [
        {
          id: 'welcome-msg',
          role: 'ai',
          content: 'Hello! I am your AI Wealth Mentor. I have analyzed your goals, risk profile, and portfolio. How can I help you build wealth today?',
          timestamp: new Date()
        }
      ],
      error: null
    });
  }
}));
