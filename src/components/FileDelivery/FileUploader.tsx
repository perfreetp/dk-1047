import { useState, useRef } from 'react';
import { Upload, File, X } from 'lucide-react';
import { useFileStore } from '../../contexts/fileStore';

interface FileUploaderProps {
  onUploadComplete?: () => void;
}

export default function FileUploader({ onUploadComplete }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, uploading } = useFileStore();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    for (const file of files) {
      await uploadFile(file);
    }
    onUploadComplete?.();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      await uploadFile(file);
    }
    onUploadComplete?.();

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`
        border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all
        ${isDragging
          ? 'border-blue-600 bg-blue-50 scale-105'
          : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
        }
        ${uploading ? 'pointer-events-none opacity-50' : ''}
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".exe,.msi,.log,.zip"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex flex-col items-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
          isDragging ? 'bg-blue-100' : 'bg-slate-100'
        }`}>
          <Upload className={`w-8 h-8 ${isDragging ? 'text-blue-600' : 'text-slate-600'}`} />
        </div>

        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          {isDragging ? '释放以上传文件' : '拖拽文件到此处上传'}
        </h3>

        <p className="text-sm text-slate-600 mb-4">
          支持的文件类型: .exe, .msi, .log, .zip
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          disabled={uploading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
        >
          {uploading ? '上传中...' : '选择文件'}
        </button>
      </div>
    </div>
  );
}
