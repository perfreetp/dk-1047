import { create } from 'zustand';
import { Settings } from '../data/mockData';
import { settingsApi } from '../services/mockApi';

interface SettingsStore {
  settings: Settings;
  loading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
  generateAuthCode: () => Promise<string>;
  addToBlacklist: (deviceId: string) => Promise<void>;
  removeFromBlacklist: (deviceId: string) => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: {
    security: {
      tempAuthCode: '',
      authCodeExpiry: '',
      unattendedMode: false,
      blacklist: []
    },
    connection: {
      timeoutReminder: 30,
      confirmSensitiveOps: true
    },
    notification: {
      soundEnabled: true,
      desktopNotifications: true
    }
  },
  loading: false,
  error: null,

  fetchSettings: async () => {
    set({ loading: true, error: null });
    try {
      const settings = await settingsApi.get();
      set({ settings, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateSettings: async (updates) => {
    try {
      const updated = await settingsApi.update(updates);
      set({ settings: updated });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  generateAuthCode: async () => {
    try {
      const code = await settingsApi.generateAuthCode();
      const settings = get().settings;
      set({
        settings: {
          ...settings,
          security: {
            ...settings.security,
            tempAuthCode: code,
            authCodeExpiry: new Date(Date.now() + 30 * 60 * 1000).toISOString()
          }
        }
      });
      return code;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  addToBlacklist: async (deviceId) => {
    try {
      await settingsApi.addToBlacklist(deviceId);
      set((state) => ({
        settings: {
          ...state.settings,
          security: {
            ...state.settings.security,
            blacklist: [...state.settings.security.blacklist, deviceId]
          }
        }
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  removeFromBlacklist: async (deviceId) => {
    try {
      await settingsApi.removeFromBlacklist(deviceId);
      set((state) => ({
        settings: {
          ...state.settings,
          security: {
            ...state.settings.security,
            blacklist: state.settings.security.blacklist.filter(id => id !== deviceId)
          }
        }
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  }
}));
