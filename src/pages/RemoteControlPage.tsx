import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import ControlToolbar from '../components/RemoteControl/ControlToolbar';
import ScreenViewer from '../components/RemoteControl/ScreenViewer';
import ScreenshotTool from '../components/RemoteControl/ScreenshotTool';
import ClipboardSync from '../components/RemoteControl/ClipboardSync';
import { useDeviceStore } from '../contexts/deviceStore';
import { useSessionStore } from '../contexts/sessionStore';
import { useSettingsStore } from '../contexts/settingsStore';

export default function RemoteControlPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { devices, fetchDevices } = useDeviceStore();
  const { createSession } = useSessionStore();
  const { settings, fetchSettings } = useSettingsStore();
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'failed'>('connecting');
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [showScreenshot, setShowScreenshot] = useState(false);
  const [showClipboard, setShowClipboard] = useState(false);
  const [inputLocked, setInputLocked] = useState(false);
  
  const connectionStartTimeRef = useRef<string | null>(null);
  const hasCreatedSessionRef = useRef(false);
  const deviceRef = useRef<typeof devices[0] | null>(null);

  const device = devices.find(d => d.id === id);
  deviceRef.current = device || null;

  useEffect(() => {
    fetchDevices();
    fetchSettings();
  }, []);

  useEffect(() => {
    if (device) {
      const timer = setTimeout(() => {
        if (device.status !== 'offline') {
          setConnectionStatus('connected');
          connectionStartTimeRef.current = new Date().toISOString().replace('T', ' ').substring(0, 19);
        } else {
          setConnectionStatus('failed');
        }
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [device]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (connectionStatus === 'connected' && connectionStartTimeRef.current && deviceRef.current && !hasCreatedSessionRef.current) {
        const startTime = connectionStartTimeRef.current;
        const endTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
        const startTimeDate = new Date(startTime.replace(' ', 'T'));
        const endTimeDate = new Date(endTime.replace(' ', 'T'));
        const duration = Math.round((endTimeDate.getTime() - startTimeDate.getTime()) / 60000);

        const sessionData = {
          deviceId: deviceRef.current.id,
          deviceName: deviceRef.current.name,
          operator: '张工',
          startTime,
          endTime,
          duration: Math.max(duration, 1),
          status: 'completed' as const,
          tags: [],
          remark: ''
        };

        localStorage.setItem('pending_session', JSON.stringify(sessionData));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [connectionStatus]);

  useEffect(() => {
    const pendingSession = localStorage.getItem('pending_session');
    if (pendingSession && connectionStatus === 'connected') {
      const sessionData = JSON.parse(pendingSession);
      localStorage.removeItem('pending_session');
      createSession(sessionData);
      hasCreatedSessionRef.current = true;
    }
  }, [connectionStatus]);

  const handleDisconnect = async () => {
    if (connectionStatus === 'connected' && connectionStartTimeRef.current && device && !hasCreatedSessionRef.current) {
      const startTime = connectionStartTimeRef.current;
      const endTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const startTimeDate = new Date(startTime.replace(' ', 'T'));
      const endTimeDate = new Date(endTime.replace(' ', 'T'));
      const duration = Math.round((endTimeDate.getTime() - startTimeDate.getTime()) / 60000);

      await createSession({
        deviceId: device.id,
        deviceName: device.name,
        operator: '张工',
        startTime,
        endTime,
        duration: Math.max(duration, 1),
        status: 'completed',
        tags: [],
        remark: ''
      });

      hasCreatedSessionRef.current = true;
    }
    navigate('/');
  };

  const handleSendKey = (key: string) => {
    if (settings?.connection.confirmSensitiveOps) {
      if (!confirm(`确定要发送快捷键 "${key}" 吗？`)) {
        return;
      }
    }
    alert(`发送快捷键: ${key}`);
  };

  const handleLockInput = (locked: boolean) => {
    if (settings?.connection.confirmSensitiveOps) {
      if (!confirm(`确定要${locked ? '锁定' : '解锁'}远程设备输入吗？`)) {
        return;
      }
    }
    setInputLocked(locked);
  };

  const handleScreenshot = () => {
    setShowScreenshot(true);
  };

  const handleClipboardSync = () => {
    setShowClipboard(true);
  };

  if (!device) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-900">
        <div className="text-center text-white">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-amber-500" />
          <h2 className="text-2xl font-bold mb-2">设备未找到</h2>
          <p className="text-slate-400 mb-6">无法找到指定的设备</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回设备列表
          </button>
        </div>
      </div>
    );
  }

  if (connectionStatus === 'failed') {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-900">
        <div className="text-center text-white">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold mb-2">连接失败</h2>
          <p className="text-slate-400 mb-6">设备不在线或无法连接</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回设备列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-slate-800 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleDisconnect}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            断开连接
          </button>
          <span className="text-slate-400">|</span>
          <span className="text-sm">远程控制会话</span>
          {connectionStartTimeRef.current && (
            <span className="text-xs text-slate-500">
              开始时间: {connectionStartTimeRef.current}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-slate-900">
        <ControlToolbar
          deviceName={device.name}
          connectionStatus={connectionStatus}
          quality={quality}
          inputLocked={inputLocked}
          onQualityChange={setQuality}
          onSendKey={handleSendKey}
          onLockInput={handleLockInput}
          onScreenshot={handleScreenshot}
          onClipboardSync={handleClipboardSync}
        />

        <ScreenViewer screens={device.screens} currentQuality={quality} />

        {inputLocked && (
          <div className="bg-amber-600 text-white px-6 py-3 flex items-center justify-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">远程输入已锁定 - 对方无法操作</span>
          </div>
        )}
      </div>

      {showScreenshot && (
        <ScreenshotTool
          onClose={() => setShowScreenshot(false)}
          onSave={(annotated) => {
            alert(annotated ? '截图已保存（带标注）' : '截图已保存');
            setShowScreenshot(false);
          }}
        />
      )}

      {showClipboard && (
        <ClipboardSync onClose={() => setShowClipboard(false)} />
      )}
    </>
  );
}
