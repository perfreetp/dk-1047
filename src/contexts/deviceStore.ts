import { create } from 'zustand';
import { Device } from '../data/mockData';
import { deviceApi } from '../services/mockApi';

interface DeviceFilters {
  storeId: string;
  status: string;
  searchKeyword: string;
}

interface DeviceStore {
  devices: Device[];
  loading: boolean;
  error: string | null;
  filters: DeviceFilters;
  selectedDevice: Device | null;
  connectionStatus: 'idle' | 'connecting' | 'connected' | 'failed';
  setFilters: (filters: Partial<DeviceFilters>) => void;
  setSelectedDevice: (device: Device | null) => void;
  fetchDevices: () => Promise<void>;
  updateDeviceRemark: (id: string, remark: string) => Promise<void>;
  connectDevice: (id: string) => Promise<void>;
  getFilteredDevices: () => Device[];
}

export const useDeviceStore = create<DeviceStore>((set, get) => ({
  devices: [],
  loading: false,
  error: null,
  filters: {
    storeId: '',
    status: '',
    searchKeyword: ''
  },
  selectedDevice: null,
  connectionStatus: 'idle',

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters }
    }));
  },

  setSelectedDevice: (device) => {
    set({ selectedDevice: device });
  },

  fetchDevices: async () => {
    set({ loading: true, error: null });
    try {
      const devices = await deviceApi.getAll();
      set({ devices, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateDeviceRemark: async (id, remark) => {
    try {
      const updated = await deviceApi.updateRemark(id, remark);
      set((state) => ({
        devices: state.devices.map(d => d.id === id ? updated : d)
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  connectDevice: async (id) => {
    set({ connectionStatus: 'connecting' });
    try {
      await deviceApi.connect(id);
      set({ connectionStatus: 'connected' });
    } catch (error) {
      set({ connectionStatus: 'failed', error: (error as Error).message });
    }
  },

  getFilteredDevices: () => {
    const { devices, filters } = get();
    return devices.filter(device => {
      if (filters.storeId && device.storeId !== filters.storeId) return false;
      if (filters.status && device.status !== filters.status) return false;
      if (filters.searchKeyword) {
        const keyword = filters.searchKeyword.toLowerCase();
        return (
          device.name.toLowerCase().includes(keyword) ||
          device.remark.toLowerCase().includes(keyword) ||
          device.ipAddress.includes(keyword)
        );
      }
      return true;
    });
  }
}));
