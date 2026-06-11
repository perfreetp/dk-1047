import { Shield, Key, Ban, Eye, EyeOff } from 'lucide-react';
import { useSettingsStore } from '../../contexts/settingsStore';
import { useState } from 'react';

export default function SecuritySettings() {
  const { settings, updateSettings, generateAuthCode, addToBlacklist, removeFromBlacklist } = useSettingsStore();
  const [showAuthCode, setShowAuthCode] = useState(false);
  const [blacklistInput, setBlacklistInput] = useState('');

  const handleGenerateCode = async () => {
    try {
      const code = await generateAuthCode();
      alert(`授权码已生成: ${code}\n有效期30分钟`);
    } catch (error) {
      alert('生成授权码失败');
    }
  };

  const handleAddBlacklist = async () => {
    if (blacklistInput.trim()) {
      await addToBlacklist(blacklistInput.trim());
      setBlacklistInput('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">安全设置</h3>
          <p className="text-sm text-slate-600">配置授权码和访问控制</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            临时授权码
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showAuthCode ? 'text' : 'password'}
                value={settings.security.tempAuthCode}
                readOnly
                placeholder="点击生成授权码"
                className="w-full pl-11 pr-11 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-900"
              />
              <button
                onClick={() => setShowAuthCode(!showAuthCode)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showAuthCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <button
              onClick={handleGenerateCode}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-600/30"
            >
              生成授权码
            </button>
          </div>
          {settings.security.authCodeExpiry && (
            <p className="text-xs text-slate-500 mt-2">
              过期时间: {new Date(settings.security.authCodeExpiry).toLocaleString('zh-CN')}
            </p>
          )}
        </div>

        <div>
          <label className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-slate-700">无人值守模式</span>
              <p className="text-xs text-slate-500">允许在设备不在线时自动连接</p>
            </div>
            <button
              onClick={() => updateSettings({
                security: {
                  ...settings.security,
                  unattendedMode: !settings.security.unattendedMode
                }
              })}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                settings.security.unattendedMode ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                settings.security.unattendedMode ? 'translate-x-8' : 'translate-x-1'
              }`}></div>
            </button>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            <div className="flex items-center gap-2 mb-1">
              <Ban className="w-4 h-4" />
              黑名单管理
            </div>
          </label>
          <div className="flex gap-3 mb-3">
            <input
              type="text"
              value={blacklistInput}
              onChange={(e) => setBlacklistInput(e.target.value)}
              placeholder="输入设备ID添加到黑名单"
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddBlacklist}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              添加
            </button>
          </div>
          <div className="space-y-2">
            {settings.security.blacklist.length === 0 ? (
              <p className="text-sm text-slate-500 italic">暂无黑名单设备</p>
            ) : (
              settings.security.blacklist.map((deviceId) => (
                <div
                  key={deviceId}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <span className="text-sm text-slate-700 font-mono">{deviceId}</span>
                  <button
                    onClick={() => removeFromBlacklist(deviceId)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    移除
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
