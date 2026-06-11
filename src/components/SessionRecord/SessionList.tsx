import { Calendar, User, Tag, CheckCircle, AlertCircle, MapPin } from 'lucide-react';
import { problemTags } from '../../data/mockData';
import { Session } from '../../data/mockData';

interface SessionListProps {
  sessions: Session[];
  onSelect: (session: Session) => void;
  selectedSession: Session | null;
}

export default function SessionList({ sessions, onSelect, selectedSession }: SessionListProps) {
  const getResultBadge = (result: string) => {
    switch (result) {
      case 'resolved':
        return (
          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            已解决
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            待跟进
          </span>
        );
      case 'onsite':
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            转现场
          </span>
        );
      default:
        return null;
    }
  };

  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Tag className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">暂无会话记录</h3>
        <p className="text-slate-500">没有找到符合条件的会话</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="divide-y divide-slate-200">
        {sessions.map((session) => (
          <div
            key={session.id}
            onClick={() => onSelect(session)}
            className={`p-6 hover:bg-slate-50 cursor-pointer transition-colors ${
              selectedSession?.id === session.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{session.deviceName}</h3>
                  <p className="text-sm text-slate-500">{session.operator}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getResultBadge(session.result)}
                <div className={`w-2 h-2 rounded-full ${
                  session.status === 'completed' ? 'bg-emerald-500' :
                  session.status === 'failed' ? 'bg-red-500' : 'bg-amber-500'
                }`}></div>
                <span className="text-sm text-slate-600">
                  {session.status === 'completed' ? '已完成' :
                   session.status === 'failed' ? '失败' : '已拒绝'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{session.startTime}</span>
              </div>
              <span>·</span>
              <span>{session.duration}分钟</span>
            </div>

            {session.tags.length > 0 && (
              <div className="flex gap-2">
                {session.tags.map((tag) => {
                  const tagInfo = problemTags.find(t => t.label === tag);
                  const colorClass = tagInfo?.color === 'red' ? 'bg-red-100 text-red-700' :
                                    tagInfo?.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                                    tagInfo?.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                                    tagInfo?.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                                    'bg-slate-100 text-slate-700';
                  return (
                    <span
                      key={tag}
                      className={`px-2 py-1 rounded text-xs font-medium ${colorClass}`}
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
            )}

            {session.remark && (
              <p className="mt-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                {session.remark}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
