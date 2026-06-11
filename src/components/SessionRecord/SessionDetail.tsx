import { X, User, Calendar, Clock, Tag, FileText } from 'lucide-react';
import { Session } from '../../data/mockData';
import { problemTags } from '../../data/mockData';
import { useSessionStore } from '../../contexts/sessionStore';
import { useState } from 'react';

interface SessionDetailProps {
  session: Session;
  onClose: () => void;
}

export default function SessionDetail({ session, onClose }: SessionDetailProps) {
  const { updateSession, deleteSession } = useSessionStore();
  const [remark, setRemark] = useState(session.remark);
  const [selectedTags, setSelectedTags] = useState<string[]>(session.tags);

  const handleSave = async () => {
    await updateSession(session.id, { remark, tags: selectedTags });
    alert('会话详情已保存');
  };

  const handleDelete = async () => {
    if (confirm('确定要删除这条会话记录吗？')) {
      await deleteSession(session.id);
      onClose();
    }
  };

  const handleExport = () => {
    const data = `会话记录导出
设备: ${session.deviceName}
操作者: ${session.operator}
开始时间: ${session.startTime}
结束时间: ${session.endTime}
持续时间: ${session.duration}分钟
状态: ${session.status === 'completed' ? '已完成' : session.status === 'failed' ? '失败' : '已拒绝'}
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between p-6 border-b border-slate-200">
        <h3 className="text-xl font-bold text-slate-900">会话详情</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      <div className="p-6 space-y-6">
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
      </div>

      <div className="flex gap-3 p-6 border-t border-slate-200 bg-slate-50 rounded-b-xl">
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
