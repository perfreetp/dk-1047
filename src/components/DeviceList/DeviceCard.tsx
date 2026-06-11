import { Monitor, Wifi, WifiOff, Clock, MapPin, Play, Edit2 } from 'lucide-react';
import { Device } from '../../data/mockData';
import { useState } from 'react';

interface DeviceCardProps {
  device: Device;
  onConnect: (device: Device) => void;
  onEditRemark: (device: Device) => void;
}

export default function DeviceCard({ device, onConnect, onEditRemark }: DeviceCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = () => {
    switch (device.status) {
      case 'online':
        return 'bg-emerald-500';
      case 'busy':
        return 'bg-amber-500';
      case 'offline':
        return 'bg-slate-400';
      default:
        return 'bg-slate-400';
    }
  };

  const getStatusText = () => {
    switch (device.status) {
      case 'online':
        return '在线';
      case 'busy':
        return '忙碌';
      case 'offline':
        return '离线';
      default:
        return '未知';
    }
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
            <Monitor className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{device.name}</h3>
            <p className="text-sm text-slate-500">{device.ipAddress}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
          <span className="text-sm font-medium text-slate-700">{getStatusText()}</span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <MapPin className="w-4 h-4" />
          <span>{device.storeName}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Clock className="w-4 h-4" />
          <span>最后在线: {device.lastSeen}</span>
        </div>

        {device.screens.length > 1 && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Monitor className="w-4 h-4" />
            <span>多屏幕 ({device.screens.length}个)</span>
          </div>
        )}

        {device.remark && (
          <div className="text-sm text-slate-500 bg-slate-50 p-2 rounded-lg">
            {device.remark}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onConnect(device)}
          disabled={device.status === 'offline'}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            device.status === 'offline'
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30 hover:shadow-blue-700/40'
          }`}
        >
          <Play className="w-4 h-4" />
          连接
        </button>

        <button
          onClick={() => onEditRemark(device)}
          className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
