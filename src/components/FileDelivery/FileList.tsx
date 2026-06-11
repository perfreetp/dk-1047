import { File, Trash2, Send, CheckCircle, Loader2 } from 'lucide-react';
import { FileTransfer } from '../../data/mockData';
import { useFileStore } from '../../contexts/fileStore';

interface FileListProps {
  onSelectFile: (file: FileTransfer) => void;
  selectedFile: FileTransfer | null;
}

export default function FileList({ onSelectFile, selectedFile }: FileListProps) {
  const { files, deleteFile } = useFileStore();

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">待发送</span>;
      case 'uploading':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">上传中</span>;
      case 'sending':
        return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">发送中</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">已完成</span>;
      case 'failed':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">失败</span>;
      default:
        return null;
    }
  };

  if (files.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <File className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">暂无文件</h3>
        <p className="text-slate-500">拖拽文件到上方区域进行上传</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="divide-y divide-slate-200">
        {files.map((file) => (
          <div
            key={file.id}
            className={`p-4 hover:bg-slate-50 transition-colors ${
              selectedFile?.id === file.id ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <File className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-slate-900 truncate">{file.fileName}</h4>
                  {getStatusBadge(file.status)}
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span>{formatFileSize(file.fileSize)}</span>
                  <span>·</span>
                  <span>{file.createTime}</span>
                  {file.targetDevices.length > 0 && (
                    <>
                      <span>·</span>
                      <span>已投递至 {file.targetDevices.length} 台设备</span>
                    </>
                  )}
                </div>

                {(file.status === 'uploading' || file.status === 'sending') && (
                  <div className="mt-2">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{
                          width: file.status === 'uploading'
                            ? `${file.uploadProgress}%`
                            : `${file.sendProgress}%`
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {file.status === 'uploading' ? `上传进度: ${file.uploadProgress}%` : `发送进度: ${file.sendProgress}%`}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {file.status === 'pending' && (
                  <button
                    onClick={() => onSelectFile(file)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    投递
                  </button>
                )}

                {file.status === 'completed' && (
                  <button
                    className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-medium flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    已完成
                  </button>
                )}

                {file.status === 'failed' && (
                  <button
                    onClick={() => onSelectFile(file)}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
                  >
                    重试
                  </button>
                )}

                <button
                  onClick={() => deleteFile(file.id)}
                  className="p-2 text-slate-600 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
