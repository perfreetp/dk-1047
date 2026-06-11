import { useState } from 'react';
import { X, Copy, Clipboard } from 'lucide-react';

interface ClipboardSyncProps {
  onClose: () => void;
}

export default function ClipboardSync({ onClose }: ClipboardSyncProps) {
  const [localContent, setLocalContent] = useState('');
  const [remoteContent, setRemoteContent] = useState('示例远程剪贴板内容');
  const [syncDirection, setSyncDirection] = useState<'local-to-remote' | 'remote-to-local' | 'bidirectional'>('bidirectional');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Clipboard className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-slate-900">剪贴板同步</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              同步模式
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setSyncDirection('local-to-remote')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                  syncDirection === 'local-to-remote'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-slate-300 text-slate-700 hover:border-slate-400'
                }`}
              >
                本地 → 远程
              </button>
              <button
                onClick={() => setSyncDirection('remote-to-local')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                  syncDirection === 'remote-to-local'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-slate-300 text-slate-700 hover:border-slate-400'
                }`}
              >
                远程 → 本地
              </button>
              <button
                onClick={() => setSyncDirection('bidirectional')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                  syncDirection === 'bidirectional'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-slate-300 text-slate-700 hover:border-slate-400'
                }`}
              >
                双向同步
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                本地剪贴板
              </label>
              <textarea
                value={localContent}
                onChange={(e) => setLocalContent(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="输入本地内容..."
              />
              <button className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                <Copy className="w-4 h-4" />
                复制到剪贴板
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                远程剪贴板
              </label>
              <textarea
                value={remoteContent}
                onChange={(e) => setRemoteContent(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="远程内容..."
              />
              <button className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Clipboard className="w-4 h-4" />
                同步到远程
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-slate-200 bg-slate-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-colors font-medium"
          >
            关闭
          </button>
          <button
            onClick={() => {
              alert('剪贴板同步成功！');
              onClose();
            }}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-600/30"
          >
            保存设置
          </button>
        </div>
      </div>
    </div>
  );
}
