import { create } from 'zustand';
import { getPortfolio, getPortfolioSummary, getHoldings, getTransactions, buyAsset, sellAsset, getPortfolioHealth, simulateTransaction, updateBalance } from '../services/portfolioService';
import { useAuthStore } from './authStore';

export interface PortfolioData {
  id: string;
  name: string;
  starting_balance: number;
  cash_balance: number;
  total_value: number;
  portfolio_return: number;
  portfolio_return_percentage: number;
  created_at: string;
}

export interface PortfolioSummaryData {
  portfolio_value: number;
  cash_balance: number;
  invested_amount: number;
  holdings_count: number;
  portfolio_return: number;
  portfolio_return_percentage: number;
}

export interface PortfolioHealthData {
  health_score: number;
  risk_score: number;
  diversification_score: number;
  goal_alignment_score: number;
  largest_holding: string | null;
  largest_holding_percent: number;
}

export interface HoldingData {
  id: string;
  symbol: string;
  asset_name: string;
  asset_type: string;
  quantity: number;
  average_cost: number;
  current_price: number;
  market_value: number;
  allocation_percentage: number;
  notes?: string;
}

export interface TransactionData {
  id: string;
  transaction_type: string;
  status: string;
  symbol?: string;
  quantity?: number;
  price?: number;
  amount: number;
  notes?: string;
  created_at: string;
}

interface PortfolioState {
  portfolio: PortfolioData | null;
  summary: PortfolioSummaryData | null;
  health: PortfolioHealthData | null;
  holdings: HoldingData[];
  transactions: TransactionData[];
  loading: boolean;
  error: string | null;
  fetchPortfolio: () => Promise<void>;
  fetchSummary: () => Promise<void>;
  fetchHealth: () => Promise<void>;
  fetchHoldings: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  buyAsset: (data: any) => Promise<any>;
  sellAsset: (data: any) => Promise<any>;
  simulateTransaction: (data: any) => Promise<any>;
  updateBalance: (new_balance: number) => Promise<void>;
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  portfolio: null,
  summary: null,
  health: null,
  holdings: [],
  transactions: [],
  loading: false,
  error: null,

  fetchPortfolio: async () => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("No token");
      const data = await getPortfolio(token);
      set({ portfolio: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchSummary: async () => {
    try {
      const token = useAuthStore.getState().token;
      if (!token) return;
      const data = await getPortfolioSummary(token);
      set({ summary: data });
    } catch (err: any) {
      console.error("Failed to fetch portfolio summary", err);
    }
  },

  fetchHealth: async () => {
    try {
      const token = useAuthStore.getState().token;
      if (!token) return;
      const data = await getPortfolioHealth(token);
      set({ health: data });
    } catch (err: any) {
      console.error("Failed to fetch portfolio health", err);
    }
  },

  fetchHoldings: async () => {
    try {
      const token = useAuthStore.getState().token;
      if (!token) return;
      const data = await getHoldings(token);
      set({ holdings: data });
    } catch (err: any) {
      console.error("Failed to fetch holdings", err);
    }
  },

  fetchTransactions: async () => {
    try {
      const token = useAuthStore.getState().token;
      if (!token) return;
      const data = await getTransactions(token);
      set({ transactions: data });
    } catch (err: any) {
      console.error("Failed to fetch transactions", err);
    }
  },

  buyAsset: async (data: any) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("No token");
      const result = await buyAsset(token, data);
      await Promise.all([
        get().fetchPortfolio(),
        get().fetchHoldings(),
        get().fetchTransactions(),
        get().fetchSummary(),
        get().fetchHealth()
      ]);
      set({ loading: false });
      return result;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  sellAsset: async (data: any) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("No token");
      const result = await sellAsset(token, data);
      await Promise.all([
        get().fetchPortfolio(),
        get().fetchHoldings(),
        get().fetchTransactions(),
        get().fetchSummary(),
        get().fetchHealth()
      ]);
      set({ loading: false });
      return result;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },
  
  simulateTransaction: async (data: any) => {
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("No token");
      const result = await simulateTransaction(token, data);
      return result;
    } catch (err: any) {
      console.error("Failed to simulate transaction", err);
      throw err;
    }
  },

  updateBalance: async (new_balance: number) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("No token");
      await updateBalance(token, { new_balance });
      await Promise.all([
        get().fetchPortfolio(),
        get().fetchSummary(),
        get().fetchHealth()
      ]);
      set({ loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  }
}));
