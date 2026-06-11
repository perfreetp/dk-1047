import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import ControlToolbar from '../components/RemoteControl/ControlToolbar';
import ScreenViewer from '../components/RemoteControl/ScreenViewer';
import ScreenshotTool from '../components/RemoteControl/ScreenshotTool';
import ClipboardSync from '../components/RemoteControl/ClipboardSync';
import { useDeviceStore } from '../contexts/deviceStore';
import { useSessionStore } from '../contexts/sessionStore';

export default function RemoteControlPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { devices, fetchDevices } = useDeviceStore();
  const { createSession } = useSessionStore();
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'failed'>('connecting');
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [showScreenshot, setShowScreenshot] = useState(false);
  const [showClipboard, setShowClipboard] = useState(false);
  const [inputLocked, setInputLocked] = useState(false);

  const device = devices.find(d => d.id === id);

  useEffect(() => {
    if (devices.length === 0) {
      fetchDevices();
    }
  }, [devices.length, fetchDevices]);

  useEffect(() => {
    if (device) {
      const timer = setTimeout(() => {
        if (device.status !== 'offline') {
          setConnectionStatus('connected');
        } else {
          setConnectionStatus('failed');
        }
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [device]);

  useEffect(() => {
    if (connectionStatus === 'connected' && device) {
      createSession({
        deviceId: device.id,
        deviceName: device.name,
        operator: '张工',
        startTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        endTime: '',
        duration: 0,
        status: 'completed',
        tags: [],
        remark: ''
      });
    }
  }, [connectionStatus]);

  const handleSendKey = (key: string) => {
    alert(`发送快捷键: ${key}`);
  };

  const handleLockInput = (locked: boolean) => {
    setInputLocked(locked);
    alert(locked ? '已锁定远程设备输入' : '已解锁远程设备输入');
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
      <div className="bg-slate-800 text-white px-6 py-3 flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </button>
        <span className="text-slate-400">|</span>
        <span className="text-sm">远程控制会话</span>
      </div>

      <div className="flex-1 flex flex-col bg-slate-900">
        <ControlToolbar
          deviceName={device.name}
          connectionStatus={connectionStatus}
          quality={quality}
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
