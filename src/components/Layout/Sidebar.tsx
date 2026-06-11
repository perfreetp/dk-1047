import { NavLink } from 'react-router-dom';
import {
  Monitor,
  Settings,
  FileText,
  FolderOutput,
  Activity
} from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { path: '/', icon: Monitor, label: '设备列表' },
  { path: '/sessions', icon: Activity, label: '会话记录' },
  { path: '/files', icon: FolderOutput, label: '文件投递' },
  { path: '/settings', icon: Settings, label: '系统设置' }
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Monitor className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg">远程值守</h1>
            <p className="text-xs text-slate-400">桌面客户端</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                    'hover:bg-slate-800',
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-300'
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
            <FileText className="w-4 h-4" />
            <span>当前版本</span>
          </div>
          <div className="text-lg font-semibold text-white">v1.0.0</div>
        </div>
      </div>
    </aside>
  );
}
