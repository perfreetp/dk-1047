export interface Device {
  id: string;
  name: string;
  ipAddress: string;
  storeId: string;
  storeName: string;
  status: 'online' | 'offline' | 'busy';
  remark: string;
  lastSeen: string;
  screens: Screen[];
}

export interface Screen {
  id: string;
  name: string;
  width: number;
  height: number;
}

export interface Session {
  id: string;
  deviceId: string;
  deviceName: string;
  operator: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: 'completed' | 'failed' | 'rejected';
  result: 'resolved' | 'pending' | 'onsite' | '';
  tags: string[];
  remark: string;
}

export interface FileTransfer {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  targetDevices: string[];
  status: 'pending' | 'uploading' | 'sending' | 'completed' | 'failed';
  uploadProgress: number;
  sendProgress: number;
  createTime: string;
}

export interface Settings {
  security: {
    tempAuthCode: string;
    authCodeExpiry: string;
    unattendedMode: boolean;
    blacklist: string[];
  };
  connection: {
    timeoutReminder: number;
    confirmSensitiveOps: boolean;
  };
  notification: {
    soundEnabled: boolean;
    desktopNotifications: boolean;
  };
}

export const initialDevices: Device[] = [
  {
    id: '1',
    name: '收银机-朝阳店01',
    ipAddress: '192.168.1.101',
    storeId: 'store1',
    storeName: '朝阳门店',
    status: 'online',
    remark: '主收银机,日常使用',
    lastSeen: '2026-06-12 10:30:00',
    screens: [
      { id: 'screen1', name: '主屏', width: 1920, height: 1080 }
    ]
  },
  {
    id: '2',
    name: '排队屏-朝阳店01',
    ipAddress: '192.168.1.102',
    storeId: 'store1',
    storeName: '朝阳门店',
    status: 'online',
    remark: '叫号显示屏',
    lastSeen: '2026-06-12 10:28:00',
    screens: [
      { id: 'screen2', name: '显示面板', width: 1280, height: 720 }
    ]
  },
  {
    id: '3',
    name: '办公电脑-朝阳店',
    ipAddress: '192.168.1.103',
    storeId: 'store1',
    storeName: '朝阳门店',
    status: 'busy',
    remark: '店长办公电脑',
    lastSeen: '2026-06-12 10:25:00',
    screens: [
      { id: 'screen3a', name: '主屏', width: 1920, height: 1080 },
      { id: 'screen3b', name: '副屏', width: 1920, height: 1080 }
    ]
  },
  {
    id: '4',
    name: '收银机-海淀店01',
    ipAddress: '192.168.2.101',
    storeId: 'store2',
    storeName: '海淀门店',
    status: 'online',
    remark: '主收银机,高频使用',
    lastSeen: '2026-06-12 10:29:00',
    screens: [
      { id: 'screen4', name: '主屏', width: 1920, height: 1080 }
    ]
  },
  {
    id: '5',
    name: '排队屏-海淀店01',
    ipAddress: '192.168.2.102',
    storeId: 'store2',
    storeName: '海淀门店',
    status: 'offline',
    remark: '等待维修',
    lastSeen: '2026-06-12 09:15:00',
    screens: [
      { id: 'screen5', name: '显示面板', width: 1280, height: 720 }
    ]
  },
  {
    id: '6',
    name: '收银机-西单店01',
    ipAddress: '192.168.3.101',
    storeId: 'store3',
    storeName: '西单门店',
    status: 'online',
    remark: '新装设备',
    lastSeen: '2026-06-12 10:31:00',
    screens: [
      { id: 'screen6', name: '主屏', width: 1920, height: 1080 }
    ]
  },
  {
    id: '7',
    name: '办公电脑-总部',
    ipAddress: '192.168.0.10',
    storeId: 'store0',
    storeName: '总部',
    status: 'online',
    remark: '总部财务电脑',
    lastSeen: '2026-06-12 10:32:00',
    screens: [
      { id: 'screen7a', name: '主屏', width: 2560, height: 1440 },
      { id: 'screen7b', name: '副屏', width: 1920, height: 1080 }
    ]
  }
];

export const initialSessions: Session[] = [
  {
    id: 'session1',
    deviceId: '1',
    deviceName: '收银机-朝阳店01',
    operator: '张工',
    startTime: '2026-06-12 09:00:00',
    endTime: '2026-06-12 09:25:00',
    duration: 25,
    status: 'completed',
    result: 'resolved',
    tags: ['软件问题'],
    remark: 'POS系统更新后无法打印小票,重新安装驱动后解决'
  },
  {
    id: 'session2',
    deviceId: '4',
    deviceName: '收银机-海淀店01',
    operator: '李工',
    startTime: '2026-06-12 08:30:00',
    endTime: '2026-06-12 08:45:00',
    duration: 15,
    status: 'completed',
    result: 'resolved',
    tags: ['网络问题'],
    remark: '网络连接不稳定,检查网线后恢复'
  },
  {
    id: 'session3',
    deviceId: '2',
    deviceName: '排队屏-朝阳店01',
    operator: '张工',
    startTime: '2026-06-11 16:00:00',
    endTime: '2026-06-11 16:20:00',
    duration: 20,
    status: 'completed',
    result: 'resolved',
    tags: ['硬件故障'],
    remark: '显示屏闪烁,更换信号线后正常'
  },
  {
    id: 'session4',
    deviceId: '5',
    deviceName: '排队屏-海淀店01',
    operator: '王工',
    startTime: '2026-06-11 10:00:00',
    endTime: '',
    duration: 0,
    status: 'rejected',
    result: '',
    tags: ['配置问题'],
    remark: '设备离线,无法连接'
  },
  {
    id: 'session5',
    deviceId: '7',
    deviceName: '办公电脑-总部',
    operator: '李工',
    startTime: '2026-06-10 14:00:00',
    endTime: '2026-06-10 14:30:00',
    duration: 30,
    status: 'completed',
    result: 'resolved',
    tags: ['软件问题', '配置问题'],
    remark: '财务软件无法启动,检查权限后修复'
  }
];

export const initialFileTransfers: FileTransfer[] = [
  {
    id: 'file1',
    fileName: 'pos-update-v2.3.1.exe',
    fileSize: 52428800,
    fileType: 'exe',
    targetDevices: ['1', '4'],
    status: 'completed',
    uploadProgress: 100,
    sendProgress: 100,
    createTime: '2026-06-12 08:00:00'
  },
  {
    id: 'file2',
    fileName: 'queue-screen-log-20260612.zip',
    fileSize: 10485760,
    fileType: 'zip',
    targetDevices: ['2'],
    status: 'completed',
    uploadProgress: 100,
    sendProgress: 100,
    createTime: '2026-06-12 09:30:00'
  },
  {
    id: 'file3',
    fileName: 'driver-pack-2026.exe',
    fileSize: 209715200,
    fileType: 'exe',
    targetDevices: ['1', '4', '6'],
    status: 'sending',
    uploadProgress: 100,
    sendProgress: 65,
    createTime: '2026-06-12 10:00:00'
  }
];

export const initialSettings: Settings = {
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
};

export const stores = [
  { id: 'store0', name: '总部' },
  { id: 'store1', name: '朝阳门店' },
  { id: 'store2', name: '海淀门店' },
  { id: 'store3', name: '西单门店' }
];

export const problemTags = [
  { label: '硬件故障', color: 'red' },
  { label: '软件问题', color: 'blue' },
  { label: '网络问题', color: 'yellow' },
  { label: '配置问题', color: 'purple' },
  { label: '其他', color: 'gray' }
];
