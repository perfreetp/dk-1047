import { create } from 'zustand';
import { FileTransfer } from '../data/mockData';
import { fileApi } from '../services/mockApi';

interface FileStore {
  files: FileTransfer[];
  loading: boolean;
  uploading: boolean;
  error: string | null;
  fetchFiles: () => Promise<void>;
  uploadFile: (file: File) => Promise<void>;
  deliverFile: (fileId: string, deviceIds: string[]) => Promise<void>;
  deleteFile: (id: string) => Promise<void>;
}

export const useFileStore = create<FileStore>((set, get) => ({
  files: [],
  loading: false,
  uploading: false,
  error: null,

  fetchFiles: async () => {
    set({ loading: true, error: null });
    try {
      const files = await fileApi.getAll();
      set({ files, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  uploadFile: async (file) => {
    set({ uploading: true, error: null });
    try {
      const newFile = await fileApi.upload(file);
      set((state) => ({
        files: [newFile, ...state.files],
        uploading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, uploading: false });
    }
  },

  deliverFile: async (fileId, deviceIds) => {
    try {
      const updated = await fileApi.deliver(fileId, deviceIds);
      set((state) => ({
        files: state.files.map(f => f.id === fileId ? updated : f)
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  deleteFile: async (id) => {
    try {
      await fileApi.delete(id);
      set((state) => ({
        files: state.files.filter(f => f.id !== id)
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  }
}));
