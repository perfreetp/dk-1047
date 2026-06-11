import { Bell, Volume2, Monitor } from 'lucide-react';
import { useSettingsStore } from '../../contexts/settingsStore';

export default function NotificationSettings() {
  const { settings, updateSettings } = useSettingsStore();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
          <Bell className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">通知设置</h3>
          <p className="text-sm text-slate-600">配置系统通知偏好</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-slate-600" />
              <div>
                <span className="text-sm font-medium text-slate-700">声音提醒</span>
                <p className="text-xs text-slate-500">连接、断开等事件播放提示音</p>
              </div>
            </div>
            <button
              onClick={() => updateSettings({
                notification: {
                  ...settings.notification,
                  soundEnabled: !settings.notification.soundEnabled
                }
              })}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                settings.notification.soundEnabled ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                settings.notification.soundEnabled ? 'translate-x-8' : 'translate-x-1'
              }`}></div>
            </button>
          </label>
        </div>

        <div>
          <label className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Monitor className="w-5 h-5 text-slate-600" />
              <div>
                <span className="text-sm font-medium text-slate-700">桌面通知</span>
                <p className="text-xs text-slate-500">显示系统桌面通知提醒</p>
              </div>
            </div>
            <button
              onClick={() => updateSettings({
                notification: {
                  ...settings.notification,
                  desktopNotifications: !settings.notification.desktopNotifications
                }
              })}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                settings.notification.desktopNotifications ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                settings.notification.desktopNotifications ? 'translate-x-8' : 'translate-x-1'
              }`}></div>
            </button>
          </label>
        </div>
      </div>
    </div>
  );
}
