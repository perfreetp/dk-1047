import { useEffect, useState } from 'react';
import Header from '../components/Layout/Header';
import FileUploader from '../components/FileDelivery/FileUploader';
import FileList from '../components/FileDelivery/FileList';
import DeviceSelector from '../components/FileDelivery/DeviceSelector';
import LogExportModal from '../components/FileDelivery/LogExportModal';
import { useFileStore } from '../contexts/fileStore';
import { useSessionStore } from '../contexts/sessionStore';
import { useDeviceStore } from '../contexts/deviceStore';
import { FileTransfer } from '../data/mockData';
import { Download } from 'lucide-react';

export default function FileDeliveryPage() {
  const { files, fetchFiles, deliverFile } = useFileStore();
  const { fetchSessions } = useSessionStore();
  const { fetchDevices } = useDeviceStore();
  const [selectedFile, setSelectedFile] = useState<FileTransfer | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    fetchFiles();
    fetchSessions();
    fetchDevices();
  }, []);

  const handleSelectFile = (file: FileTransfer) => {
    setSelectedFile(file);
  };

  const handleDeliver = async (deviceIds: string[]) => {
    if (selectedFile) {
      await deliverFile(selectedFile.id, deviceIds);
      setSelectedFile(null);
    }
  };

  return (
    <>
      <Header title="文件投递" subtitle="上传和投递安装包、日志文件到目标设备" />

      <div className="flex-1 overflow-auto p-8">
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
          >
            <Download className="w-5 h-5" />
            导出日志
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <FileUploader onUploadComplete={fetchFiles} />
          </div>

          <div className="lg:col-span-2">
            <FileList
              onSelectFile={handleSelectFile}
              selectedFile={selectedFile}
            />
          </div>
        </div>
      </div>

      {selectedFile && (
        <DeviceSelector
          selectedFile={selectedFile}
          onClose={() => setSelectedFile(null)}
          onDeliver={handleDeliver}
        />
      )}

      {showExportModal && (
        <LogExportModal
          onClose={() => setShowExportModal(false)}
          onExportComplete={fetchFiles}
        />
      )}
    </>
  );
}
