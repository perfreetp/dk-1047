import { useState } from 'react';
import { X, Calendar, Download } from 'lucide-react';
import { useDeviceStore } from '../../contexts/deviceStore';
import { useSessionStore } from '../../contexts/sessionStore';

interface LogExportModalProps {
  onClose: () => void;
  onExportComplete: () => void;
}

export default function LogExportModal({ onClose, onExportComplete }: LogExportModalProps) {
  const { devices } = useDeviceStore();
  const { sessions } = useSessionStore();
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!selectedDeviceId || !startDate || !endDate) {
      alert('请填写完整的筛选条件');
      return;
    }

    setIsExporting(true);

    const device = devices.find(d => d.id === selectedDeviceId);
    const filteredSessions = sessions.filter(s => {
      const sessionDate = s.startTime.split(' ')[0];
      return (
        s.deviceId === selectedDeviceId &&
        sessionDate >= startDate &&
        sessionDate <= endDate
      );
    });

    await new Promise(resolve => setTimeout(resolve, 1500));

    const logContent = `设备日志导出
=====================================
设备名称: ${device?.name || '未知设备'}
设备IP: ${device?.ipAddress || '未知'}
导出时间: ${new Date().toLocaleString('zh-CN')}
时间范围: ${startDate} 至 ${endDate}
会话数量: ${filteredSessions.length}
=====================================

会话详情:
${filteredSessions.map((s, i) => `
${i + 1}. 会话ID: ${s.id}
   开始时间: ${s.startTime}
   结束时间: ${s.endTime || '进行中'}
   持续时间: ${s.duration}分钟
   操作者: ${s.operator}
   状态: ${s.status === 'completed' ? '已完成' : s.status === 'failed' ? '失败' : '已拒绝'}
   问题标签: ${s.tags.join(', ') || '无'}
   备注: ${s.remark || '无'}
`).join('\n')}

=====================================
总计: ${filteredSessions.length} 条会话记录
平均时长: ${filteredSessions.length > 0 ? Math.round(filteredSessions.reduce((sum, s) => sum + s.duration, 0) / filteredSessions.length) : 0} 分钟
=====================================
`;

    const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `device_log_${device?.name || 'unknown'}_${startDate}_${endDate}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsExporting(false);
    alert(`日志导出成功！共 ${filteredSessions.length} 条会话记录`);
    onExportComplete();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">导出日志</h3>
              <p className="text-sm text-slate-600">选择设备和时间范围</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              选择设备
            </label>
            <select
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">请选择设备</option>
              {devices.map(device => (
                <option key={device.id} value={device.id}>
                  {device.name} ({device.ipAddress})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                开始日期
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                结束日期
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {selectedDeviceId && startDate && endDate && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                将导出设备 <span className="font-semibold">{devices.find(d => d.id === selectedDeviceId)?.name}</span> 
                在 <span className="font-semibold">{startDate}</span> 至 <span className="font-semibold">{endDate}</span> 
                时间范围内的所有会话记录。
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3 p-6 border-t border-slate-200 bg-slate-50 rounded-b-xl">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-colors font-medium disabled:opacity-50"
          >
            取消
          </button>
          <button
            onClick={handleExport}
            disabled={!selectedDeviceId || !startDate || !endDate || isExporting}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isExporting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                导出中...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                导出日志
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
