import { Grid, List } from 'lucide-react';
import { useState } from 'react';
import { useDeviceStore } from '../../contexts/deviceStore';
import DeviceCard from './DeviceCard';
import { Device } from '../../data/mockData';

interface DeviceGridProps {
  onConnect: (device: Device) => void;
  onEditRemark: (device: Device) => void;
}

export default function DeviceGrid({ onConnect, onEditRemark }: DeviceGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { getFilteredDevices } = useDeviceStore();
  const devices = getFilteredDevices();

  if (devices.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Grid className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">暂无设备</h3>
        <p className="text-slate-500">没有找到符合条件的设备</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-600">
          共 <span className="font-semibold text-slate-900">{devices.length}</span> 台设备
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
      }>
        {devices.map((device) => (
          <DeviceCard
            key={device.id}
            device={device}
            onConnect={onConnect}
            onEditRemark={onEditRemark}
          />
        ))}
      </div>
    </div>
  );
}
