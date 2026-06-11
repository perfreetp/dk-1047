import { Activity, Clock, CheckCircle, TrendingUp } from 'lucide-react';

interface SessionStatsProps {
  stats: {
    totalSessions: number;
    avgDuration: number;
    successRate: number;
  };
}

export default function SessionStats({ stats }: SessionStatsProps) {
  const statCards = [
    {
      label: '总会话数',
      value: stats.totalSessions,
      icon: Activity,
      color: 'blue',
      bgColor: 'bg-blue-50'
    },
    {
      label: '平均时长',
      value: `${stats.avgDuration}分钟`,
      icon: Clock,
      color: 'indigo',
      bgColor: 'bg-indigo-50'
    },
    {
      label: '成功率',
      value: `${stats.successRate}%`,
      icon: CheckCircle,
      color: 'emerald',
      bgColor: 'bg-emerald-50'
    },
    {
      label: '本週趋势',
      value: '+12%',
      icon: TrendingUp,
      color: 'amber',
      bgColor: 'bg-amber-50'
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        const colorClasses = {
          blue: 'text-blue-600',
          indigo: 'text-indigo-600',
          emerald: 'text-emerald-600',
          amber: 'text-amber-600'
        };

        return (
          <div
            key={stat.label}
            className={`${stat.bgColor} rounded-xl p-6 border border-slate-200`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-600">{stat.label}</span>
              <Icon className={`w-5 h-5 ${colorClasses[stat.color as keyof typeof colorClasses]}`} />
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
          </div>
        );
      })}
    </div>
  );
}
