import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import Header from '../components/Layout/Header';
import DeviceFilter from '../components/DeviceList/DeviceFilter';
import DeviceGrid from '../components/DeviceList/DeviceGrid';
import { useDeviceStore } from '../contexts/deviceStore';
import { Device } from '../data/mockData';
import { initializeData } from '../services/mockApi';
import EditRemarkModal from '../components/DeviceList/EditRemarkModal';

export default function DeviceListPage() {
  const navigate = useNavigate();
  const { fetchDevices, loading, updateDeviceRemark } = useDeviceStore();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  useEffect(() => {
    initializeData();
    fetchDevices();
  }, []);

  const handleConnect = (device: Device) => {
    navigate(`/remote/${device.id}`);
  };

  const handleEditRemark = (device: Device) => {
    setSelectedDevice(device);
    setEditModalOpen(true);
  };

  const handleSaveRemark = async (remark: string) => {
    if (selectedDevice) {
      await updateDeviceRemark(selectedDevice.id, remark);
      setEditModalOpen(false);
      setSelectedDevice(null);
    }
  };

  return (
    <>
      <Header title="设备列表" subtitle="管理所有门店设备" />

      <div className="flex-1 overflow-auto p-8">
        <DeviceFilter />

        <div className="mb-4 flex justify-end">
          <button
            onClick={() => fetchDevices()}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            刷新列表
          </button>
        </div>

        <DeviceGrid onConnect={handleConnect} onEditRemark={handleEditRemark} />
      </div>

      {editModalOpen && selectedDevice && (
        <EditRemarkModal
          device={selectedDevice}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedDevice(null);
          }}
          onSave={handleSaveRemark}
        />
      )}
    </>
  );
}
