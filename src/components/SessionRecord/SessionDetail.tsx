import { X, User, Calendar, Clock, Tag, FileText, History, CheckCircle, AlertCircle, MapPin } from 'lucide-react';
import { Session } from '../../data/mockData';
import { problemTags } from '../../data/mockData';
import { useSessionStore } from '../../contexts/sessionStore';
import { useDeviceStore } from '../../contexts/deviceStore';
import { useState } from 'react';

interface SessionDetailProps {
  session: Session;
  onClose: () => void;
}

export default function SessionDetail({ session, onClose }: SessionDetailProps) {
  const { updateSession, deleteSession, sessions } = useSessionStore();
  const { devices } = useDeviceStore();
  const [remark, setRemark] = useState(session.remark);
  const [selectedTags, setSelectedTags] = useState<string[]>(session.tags);
  const [selectedResult, setSelectedResult] = useState<'resolved' | 'pending' | 'onsite' | ''>(session.result || '');
  const [showDeviceTimeline, setShowDeviceTimeline] = useState(false);

  const deviceSessions = sessions
    .filter(s => s.deviceId === session.deviceId && s.id !== session.id)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, 5);

  const handleSave = async () => {
    await updateSession(session.id, { remark, tags: selectedTags, result: selectedResult });
    alert('会话详情已保存');
  };

  const handleDelete = async () => {
    if (confirm('确定要删除这条会话记录吗？')) {
      await deleteSession(session.id);
      onClose();
    }
  };

  const handleExport = () => {
    const resultText = selectedResult === 'resolved' ? '已解决' : selectedResult === 'pending' ? '待跟进' : selectedResult === 'onsite' ? '转现场' : '未设置';
    
    const data = `会话记录导出
设备: ${session.deviceName}
操作者: ${session.operator}
开始时间: ${session.startTime}
结束时间: ${session.endTime}
持续时间: ${session.duration}分钟
状态: ${session.status === 'completed' ? '已完成' : session.status === 'failed' ? '失败' : '已拒绝'}
处理结果: ${resultText}
问题标签: ${session.tags.join(', ')}
备注: ${session.remark}
`;
    
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session_${session.id}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'resolved':
        return (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            已解决
          </span>
        );
      case 'pending':
        return (
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            待跟进
          </span>
        );
      case 'onsite':
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            转现场
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
            未设置
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 max-h-[calc(100vh-200px)] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between p-6 border-b border-slate-200">
        <h3 className="text-xl font-bold text-slate-900">会话详情</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <User className="w-4 h-4" />
              设备名称
            </label>
            <p className="text-slate-900 font-medium">{session.deviceName}</p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <User className="w-4 h-4" />
              操作者
            </label>
            <p className="text-slate-900 font-medium">{session.operator}</p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <Calendar className="w-4 h-4" />
              开始时间
            </label>
            <p className="text-slate-900">{session.startTime}</p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <Calendar className="w-4 h-4" />
              结束时间
            </label>
            <p className="text-slate-900">{session.endTime || '进行中'}</p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <Clock className="w-4 h-4" />
              持续时间
            </label>
            <p className="text-slate-900">{session.duration}分钟</p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <Tag className="w-4 h-4" />
              会话状态
            </label>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              session.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
              session.status === 'failed' ? 'bg-red-100 text-red-700' :
              'bg-amber-100 text-amber-700'
            }`}>
              {session.status === 'completed' ? '已完成' :
               session.status === 'failed' ? '失败' : '已拒绝'}
            </span>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <CheckCircle className="w-4 h-4" />
            处理结果
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedResult('resolved')}
              className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                selectedResult === 'resolved'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-slate-300 text-slate-700 hover:border-emerald-300'
              }`}
            >
              <CheckCircle className="w-4 h-4 inline mr-1" />
              已解决
            </button>
            <button
              onClick={() => setSelectedResult('pending')}
              className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                selectedResult === 'pending'
                  ? 'border-amber-500 bg-amber-50 text-amber-700'
                  : 'border-slate-300 text-slate-700 hover:border-amber-300'
              }`}
            >
              <AlertCircle className="w-4 h-4 inline mr-1" />
              待跟进
            </button>
            <button
              onClick={() => setSelectedResult('onsite')}
              className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                selectedResult === 'onsite'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-300 text-slate-700 hover:border-blue-300'
              }`}
            >
              <MapPin className="w-4 h-4 inline mr-1" />
              转现场
            </button>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <Tag className="w-4 h-4" />
            问题标签
          </label>
          <div className="flex flex-wrap gap-2">
            {problemTags.map((tag) => {
              const isSelected = selectedTags.includes(tag.label);
              const colorClass = tag.color === 'red' ? 'bg-red-100 text-red-700 border-red-300' :
                                tag.color === 'blue' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                                tag.color === 'yellow' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                                tag.color === 'purple' ? 'bg-purple-100 text-purple-700 border-purple-300' :
                                'bg-slate-100 text-slate-700 border-slate-300';

              return (
                <button
                  key={tag.label}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedTags(selectedTags.filter(t => t !== tag.label));
                    } else {
                      setSelectedTags([...selectedTags, tag.label]);
                    }
                  }}
                  className={`px-3 py-1 rounded-lg border-2 text-sm font-medium transition-all ${
                    isSelected ? colorClass + ' ring-2 ring-offset-1' : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                  }`}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <FileText className="w-4 h-4" />
            处理备注
          </label>
          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="记录问题原因、解决方案、后续建议..."
          />
        </div>

        <div className="border-t border-slate-200 pt-6">
          <button
            onClick={() => setShowDeviceTimeline(!showDeviceTimeline)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            <History className="w-5 h-5" />
            {showDeviceTimeline ? '收起' : '查看'}该设备历史会话
          </button>

          {showDeviceTimeline && (
            <div className="bg-slate-50 rounded-lg p-4 space-y-3">
              {deviceSessions.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-4">暂无其他会话记录</p>
              ) : (
                deviceSessions.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-slate-900">{s.startTime}</span>
                        {getResultBadge(s.result)}
                      </div>
                      <div className="text-xs text-slate-600">
                        操作者: {s.operator} · {s.duration}分钟 · {s.tags.join(', ') || '无标签'}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 p-6 border-t border-slate-200 bg-slate-50">
        <button
          onClick={handleDelete}
          className="px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-medium"
        >
          删除记录
        </button>
        <button
          onClick={handleExport}
          className="px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-colors font-medium"
        >
          导出报告
        </button>
        <div className="flex-1"></div>
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-600/30"
        >
          保存修改
        </button>
      </div>
    </div>
  );
}
