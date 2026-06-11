import { useEffect, useState } from 'react';
import Header from '../components/Layout/Header';
import FileUploader from '../components/FileDelivery/FileUploader';
import FileList from '../components/FileDelivery/FileList';
import DeviceSelector from '../components/FileDelivery/DeviceSelector';
import { useFileStore } from '../contexts/fileStore';
import { FileTransfer } from '../data/mockData';

export default function FileDeliveryPage() {
  const { files, fetchFiles, deliverFile } = useFileStore();
  const [selectedFile, setSelectedFile] = useState<FileTransfer | null>(null);

  useEffect(() => {
    fetchFiles();
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <FileUploader onUploadComplete={fetchFiles} />
          </div>

          <div className="lg:col-span-2">
            <FileList
              files={files}
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
    </>
  );
}
