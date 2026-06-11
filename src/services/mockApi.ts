import { Device, Session, FileTransfer, Settings } from '../data/mockData';

const STORAGE_KEYS = {
  DEVICES: 'remote_desk_devices',
  SESSIONS: 'remote_desk_sessions',
  FILES: 'remote_desk_files',
  SETTINGS: 'remote_desk_settings'
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to storage:', error);
  }
};

export const deviceApi = {
  async getAll(): Promise<Device[]> {
    await delay(300);
    return loadFromStorage(STORAGE_KEYS.DEVICES, []);
  },

  async getById(id: string): Promise<Device | undefined> {
    await delay(200);
    const devices = await this.getAll();
    return devices.find(d => d.id === id);
  },

  async updateRemark(id: string, remark: string): Promise<Device> {
    await delay(200);
    const devices = await this.getAll();
    const index = devices.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Device not found');
    
    devices[index] = { ...devices[index], remark };
    saveToStorage(STORAGE_KEYS.DEVICES, devices);
    return devices[index];
  },

  async connect(id: string): Promise<{ sessionId: string }> {
    await delay(500);
    const device = await this.getById(id);
    if (!device) throw new Error('Device not found');
    if (device.status === 'offline') throw new Error('Device is offline');
    
    return { sessionId: `session_${Date.now()}` };
  }
};

export const sessionApi = {
  async getAll(filters?: {
    startDate?: string;
    endDate?: string;
    operator?: string;
    tags?: string[];
  }): Promise<Session[]> {
    await delay(300);
    let sessions = loadFromStorage<Session[]>(STORAGE_KEYS.SESSIONS, []);
    
    if (filters) {
      if (filters.startDate) {
        sessions = sessions.filter(s => s.startTime >= filters.startDate!);
      }
      if (filters.endDate) {
        sessions = sessions.filter(s => s.startTime <= filters.endDate!);
      }
      if (filters.operator) {
        sessions = sessions.filter(s => 
          s.operator.toLowerCase().includes(filters.operator!.toLowerCase())
        );
      }
      if (filters.tags && filters.tags.length > 0) {
        sessions = sessions.filter(s => 
          filters.tags!.some(tag => s.tags.includes(tag))
        );
      }
    }
    
    return sessions.sort((a, b) => 
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
  },

  async create(session: Omit<Session, 'id'>): Promise<Session> {
    await delay(200);
    const sessions = await this.getAll();
    const newSession: Session = {
      ...session,
      id: `session_${Date.now()}`
    };
    sessions.unshift(newSession);
    saveToStorage(STORAGE_KEYS.SESSIONS, sessions);
    return newSession;
  },

  async update(id: string, updates: Partial<Session>): Promise<Session> {
    await delay(200);
    const sessions = await this.getAll();
    const index = sessions.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Session not found');
    
    sessions[index] = { ...sessions[index], ...updates };
    saveToStorage(STORAGE_KEYS.SESSIONS, sessions);
    return sessions[index];
  },

  async delete(id: string): Promise<void> {
    await delay(200);
    const sessions = await this.getAll();
    const filtered = sessions.filter(s => s.id !== id);
    saveToStorage(STORAGE_KEYS.SESSIONS, filtered);
  },

  async getStats(): Promise<{
    totalSessions: number;
    avgDuration: number;
    successRate: number;
  }> {
    const sessions = await this.getAll();
    const completed = sessions.filter(s => s.status === 'completed');
    
    return {
      totalSessions: sessions.length,
      avgDuration: completed.length > 0
        ? Math.round(completed.reduce((sum, s) => sum + s.duration, 0) / completed.length)
        : 0,
      successRate: sessions.length > 0
        ? Math.round((completed.length / sessions.length) * 100)
        : 0
    };
  }
};

export const fileApi = {
  async getAll(): Promise<FileTransfer[]> {
    await delay(300);
    return loadFromStorage<FileTransfer[]>(STORAGE_KEYS.FILES, []);
  },

  async upload(file: File): Promise<FileTransfer> {
    await delay(500);
    const files = await this.getAll();
    const newFile: FileTransfer = {
      id: `file_${Date.now()}`,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.name.split('.').pop() || 'unknown',
      targetDevices: [],
      status: 'pending',
      uploadProgress: 0,
      sendProgress: 0,
      createTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    
    for (let i = 0; i <= 100; i += 10) {
      await delay(50);
      newFile.uploadProgress = i;
    }
    newFile.status = 'pending';
    
    files.unshift(newFile);
    saveToStorage(STORAGE_KEYS.FILES, files);
    return newFile;
  },

  async deliver(fileId: string, deviceIds: string[]): Promise<FileTransfer> {
    await delay(300);
    const files = await this.getAll();
    const index = files.findIndex(f => f.id === fileId);
    if (index === -1) throw new Error('File not found');
    
    files[index].status = 'sending';
    files[index].targetDevices = deviceIds;
    saveToStorage(STORAGE_KEYS.FILES, files);
    
    for (let i = 0; i <= 100; i += 5) {
      await delay(100);
      files[index].sendProgress = i;
    }
    files[index].status = 'completed';
    saveToStorage(STORAGE_KEYS.FILES, files);
    
    return files[index];
  },

  async delete(id: string): Promise<void> {
    await delay(200);
    const files = await this.getAll();
    const filtered = files.filter(f => f.id !== id);
    saveToStorage(STORAGE_KEYS.FILES, filtered);
  }
};

export const settingsApi = {
  async get(): Promise<Settings> {
    await delay(200);
    return loadFromStorage<Settings>(STORAGE_KEYS.SETTINGS, {
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
    });
  },

  async update(updates: Partial<Settings>): Promise<Settings> {
    await delay(200);
    const current = await this.get();
    const updated = { ...current, ...updates };
    saveToStorage(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },

  async generateAuthCode(): Promise<string> {
    await delay(300);
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const expiry = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    
    const settings = await this.get();
    settings.security.tempAuthCode = code;
    settings.security.authCodeExpiry = expiry;
    saveToStorage(STORAGE_KEYS.SETTINGS, settings);
    
    return code;
  },

  async addToBlacklist(deviceId: string): Promise<void> {
    const settings = await this.get();
    if (!settings.security.blacklist.includes(deviceId)) {
      settings.security.blacklist.push(deviceId);
      saveToStorage(STORAGE_KEYS.SETTINGS, settings);
    }
  },

  async removeFromBlacklist(deviceId: string): Promise<void> {
    const settings = await this.get();
    settings.security.blacklist = settings.security.blacklist.filter(id => id !== deviceId);
    saveToStorage(STORAGE_KEYS.SETTINGS, settings);
  }
};

export const initializeData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.DEVICES)) {
    import('../data/mockData').then(({ initialDevices }) => {
      saveToStorage(STORAGE_KEYS.DEVICES, initialDevices);
    });
  }
  if (!localStorage.getItem(STORAGE_KEYS.SESSIONS)) {
    import('../data/mockData').then(({ initialSessions }) => {
      saveToStorage(STORAGE_KEYS.SESSIONS, initialSessions);
    });
  }
  if (!localStorage.getItem(STORAGE_KEYS.FILES)) {
    import('../data/mockData').then(({ initialFileTransfers }) => {
      saveToStorage(STORAGE_KEYS.FILES, initialFileTransfers);
    });
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    import('../data/mockData').then(({ initialSettings }) => {
      saveToStorage(STORAGE_KEYS.SETTINGS, initialSettings);
    });
  }
};
