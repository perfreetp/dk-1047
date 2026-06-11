import { useEffect } from 'react';
import Header from '../components/Layout/Header';
import SecuritySettings from '../components/Settings/SecuritySettings';
import ConnectionSettings from '../components/Settings/ConnectionSettings';
import NotificationSettings from '../components/Settings/NotificationSettings';
import { useSettingsStore } from '../contexts/settingsStore';

export default function SettingsPage() {
  const { fetchSettings } = useSettingsStore();

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <>
      <Header title="系统设置" subtitle="配置安全策略、连接参数和通知偏好" />

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl space-y-6">
          <SecuritySettings />
          <ConnectionSettings />
          <NotificationSettings />
        </div>
      </div>
    </>
  );
}
