import { create } from 'zustand';
import { Session } from '../data/mockData';
import { sessionApi } from '../services/mockApi';

interface SessionFilters {
  startDate: string;
  endDate: string;
  operator: string;
  tags: string[];
}

interface SessionStats {
  totalSessions: number;
  avgDuration: number;
  successRate: number;
}

interface SessionStore {
  sessions: Session[];
  loading: boolean;
  error: string | null;
  filters: SessionFilters;
  selectedSession: Session | null;
  stats: SessionStats;
  setFilters: (filters: Partial<SessionFilters>) => void;
  setSelectedSession: (session: Session | null) => void;
  fetchSessions: () => Promise<void>;
  createSession: (session: Omit<Session, 'id'>) => Promise<Session>;
  updateSession: (id: string, updates: Partial<Session>) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  fetchStats: () => Promise<void>;
  getFilteredSessions: () => Session[];
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  sessions: [],
  loading: false,
  error: null,
  filters: {
    startDate: '',
    endDate: '',
    operator: '',
    tags: []
  },
  selectedSession: null,
  stats: {
    totalSessions: 0,
    avgDuration: 0,
    successRate: 0
  },

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters }
    }));
  },

  setSelectedSession: (session) => {
    set({ selectedSession: session });
  },

  fetchSessions: async () => {
    set({ loading: true, error: null });
    try {
      const sessions = await sessionApi.getAll();
      set({ sessions, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createSession: async (session) => {
    try {
      const sessionWithResult = {
        ...session,
        result: session.result || '' as const
      };
      const newSession = await sessionApi.create(sessionWithResult);
      set((state) => ({
        sessions: [newSession, ...state.sessions]
      }));
      return newSession;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  updateSession: async (id, updates) => {
    try {
      const updated = await sessionApi.update(id, updates);
      set((state) => ({
        sessions: state.sessions.map(s => s.id === id ? updated : s)
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  deleteSession: async (id) => {
    try {
      await sessionApi.delete(id);
      set((state) => ({
        sessions: state.sessions.filter(s => s.id !== id)
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  fetchStats: async () => {
    try {
      const stats = await sessionApi.getStats();
      set({ stats });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  getFilteredSessions: () => {
    const { sessions, filters } = get();
    return sessions.filter(session => {
      if (filters.startDate && session.startTime < filters.startDate) return false;
      if (filters.endDate && session.startTime > filters.endDate) return false;
      if (filters.operator && !session.operator.toLowerCase().includes(filters.operator.toLowerCase())) return false;
      if (filters.tags.length > 0 && !filters.tags.some(tag => session.tags.includes(tag))) return false;
      return true;
    });
  }
}));
