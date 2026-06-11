import { useState, useEffect } from 'react';
import { Monitor, Check } from 'lucide-react';
import { useDeviceStore } from '../../contexts/deviceStore';
import { useSettingsStore } from '../../contexts/settingsStore';
import { FileTransfer } from '../../data/mockData';

interface DeviceSelectorProps {
  selectedFile: FileTransfer;
  onClose: () => void;
  onDeliver: (deviceIds: string[]) => void;
}

export default function DeviceSelector({ selectedFile, onClose, onDeliver }: DeviceSelectorProps) {
  const { devices, fetchDevices } = useDeviceStore();
  const { settings, fetchSettings } = useSettingsStore();
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [isDelivering, setIsDelivering] = useState(false);

  useEffect(() => {
    if (devices.length === 0) {
      fetchDevices();
    }
    if (!settings) {
      fetchSettings();
    }
  }, []);

  const toggleDevice = (deviceId: string) => {
    if (selectedDevices.includes(deviceId)) {
      setSelectedDevices(selectedDevices.filter(id => id !== deviceId));
    } else {
      setSelectedDevices([...selectedDevices, deviceId]);
    }
  };

  const handleDeliver = async () => {
    if (selectedDevices.length === 0) {
      alert('请至少选择一台设备');
      return;
    }

    if (settings?.connection.confirmSensitiveOps) {
      const deviceNames = selectedDevices
        .map(id => devices.find(d => d.id === id)?.name)
        .filter(Boolean)
        .join(', ');
      
      const confirmed = confirm(
        `确定要将文件 "${selectedFile.fileName}" 投递到以下 ${selectedDevices.length} 台设备吗？\n\n设备列表：${deviceNames}\n\n此操作可能涉及敏感操作，请确认是否继续。`
      );
      
      if (!confirmed) {
        return;
      }
    }

    setIsDelivering(true);
    await onDeliver(selectedDevices);
    setIsDelivering(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 mb-2">选择目标设备</h3>
          <p className="text-slate-600">选择要投递 "<span className="font-medium">{selectedFile.fileName}</span>" 的设备</p>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-2 gap-4">
            {devices.filter(d => d.status === 'online').map((device) => {
              const isSelected = selectedDevices.includes(device.id);
              const alreadyDelivered = selectedFile.targetDevices.includes(device.id);

              return (
                <div
                  key={device.id}
                  onClick={() => !alreadyDelivered && toggleDevice(device.id)}
                  className={`
                    p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${alreadyDelivered
                      ? 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                      : isSelected
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-300 hover:border-blue-400'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-blue-600' : 'bg-slate-300'
                    }`}>
                      <Monitor className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 mb-1">{device.name}</h4>
                      <p className="text-sm text-slate-600">{device.ipAddress}</p>
                      <p className="text-xs text-slate-500">{device.storeName}</p>
                    </div>
                    {alreadyDelivered && (
                      <div className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
                        已投递
                      </div>
                    )}
                    {isSelected && !alreadyDelivered && (
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {devices.filter(d => d.status === 'online').length === 0 && (
            <div className="text-center py-12">
              <Monitor className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">暂无可用设备</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-200 bg-slate-50 rounded-b-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-600">
              已选择 <span className="font-semibold text-slate-900">{selectedDevices.length}</span> 台设备
            </span>
            {selectedDevices.length > 0 && (
              <button
                onClick={() => setSelectedDevices([])}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                清除选择
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isDelivering}
              className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-colors font-medium disabled:opacity-50"
            >
              取消
            </button>
            <button
              onClick={handleDeliver}
              disabled={selectedDevices.length === 0 || isDelivering}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDelivering ? '投递中...' : `投递到 ${selectedDevices.length} 台设备`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
