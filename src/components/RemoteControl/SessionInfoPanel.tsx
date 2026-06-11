import { Clock, User, Monitor, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SessionInfoPanelProps {
  startTime: string;
  deviceName: string;
  operator: string;
  onDurationUpdate?: (duration: number) => void;
}

export default function SessionInfoPanel({ startTime, deviceName, operator }: SessionInfoPanelProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const start = new Date(startTime.replace(' ', 'T')).getTime();
    
    const updateElapsed = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - start) / 1000);
      setElapsedTime(Math.max(0, elapsed));
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}小时${minutes}分${secs}秒`;
    } else if (minutes > 0) {
      return `${minutes}分${secs}秒`;
    } else {
      return `${secs}秒`;
    }
  };

  return (
    <div className="bg-slate-700 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2 text-emerald-400">
        <Activity className="w-4 h-4" />
        <span className="text-sm font-medium">会话进行中</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-300">{deviceName}</span>
        </div>

        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-300">{operator}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-300">
            开始时间: {startTime}
          </span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-600">
        <div className="text-xs text-slate-400 mb-1">已连接时长</div>
        <div className="text-2xl font-bold text-white">
          {formatDuration(elapsedTime)}
        </div>
      </div>
    </div>
  );
}
