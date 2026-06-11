import { Wifi, Clock, AlertCircle } from 'lucide-react';
import { useSettingsStore } from '../../contexts/settingsStore';

export default function ConnectionSettings() {
  const { settings, updateSettings } = useSettingsStore();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <Wifi className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">连接设置</h3>
          <p className="text-sm text-slate-600">配置连接参数和操作确认</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <Clock className="w-4 h-4" />
            连接超时提醒
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="10"
              max="120"
              step="5"
              value={settings.connection.timeoutReminder}
              onChange={(e) => updateSettings({
                connection: {
                  ...settings.connection,
                  timeoutReminder: parseInt(e.target.value)
                }
              })}
              className="flex-1"
            />
            <span className="text-lg font-semibold text-slate-900 w-20 text-right">
              {settings.connection.timeoutReminder}分钟
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            设置连接超时时间,超过此时间未活动将发送提醒
          </p>
        </div>

        <div>
          <label className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">敏感操作二次确认</span>
              </div>
              <p className="text-xs text-slate-500">
                执行远程控制、文件投递等敏感操作时需要二次确认
              </p>
            </div>
            <button
              onClick={() => updateSettings({
                connection: {
                  ...settings.connection,
                  confirmSensitiveOps: !settings.connection.confirmSensitiveOps
                }
              })}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                settings.connection.confirmSensitiveOps ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                settings.connection.confirmSensitiveOps ? 'translate-x-8' : 'translate-x-1'
              }`}></div>
            </button>
          </label>
        </div>
      </div>
    </div>
  );
}
