import { 
  Monitor,
  Volume2,
  VolumeX,
  Keyboard,
  Lock,
  Unlock,
  Camera,
  Clipboard
} from 'lucide-react';
import { useState } from 'react';

interface ControlToolbarProps {
  deviceName: string;
  connectionStatus: string;
  quality: 'low' | 'medium' | 'high';
  onQualityChange: (quality: 'low' | 'medium' | 'high') => void;
  onSendKey: (key: string) => void;
  onLockInput: (locked: boolean) => void;
  onScreenshot: () => void;
  onClipboardSync: () => void;
}

export default function ControlToolbar({
  deviceName,
  connectionStatus,
  quality,
  onQualityChange,
  onSendKey,
  onLockInput,
  onScreenshot,
  onClipboardSync
}: ControlToolbarProps) {
  const [inputLocked, setInputLocked] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleLockToggle = () => {
    const newState = !inputLocked;
    setInputLocked(newState);
    onLockInput(newState);
  };

  const keyCombos = [
    { label: 'Ctrl+Alt+Del', keys: 'ctrl+alt+del' },
    { label: 'Alt+Tab', keys: 'alt+tab' },
    { label: 'Alt+F4', keys: 'alt+f4' },
    { label: 'Win+D', keys: 'win+d' },
    { label: 'Ctrl+C', keys: 'ctrl+c' },
    { label: 'Ctrl+V', keys: 'ctrl+v' }
  ];

  return (
    <div className="bg-slate-800 text-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            <span className="font-semibold">{deviceName}</span>
          </div>

          <div className="h-8 w-px bg-slate-600"></div>

          <div className={`flex items-center gap-2 ${
            connectionStatus === 'connected' ? 'text-emerald-400' : 'text-amber-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'
            } animate-pulse`}></div>
            <span className="text-sm">
              {connectionStatus === 'connected' ? '已连接' : '连接中...'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">清晰度:</span>
            <select
              value={quality}
              onChange={(e) => onQualityChange(e.target.value as 'low' | 'medium' | 'high')}
              className="bg-slate-700 text-white px-3 py-1 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">流畅</option>
              <option value="medium">标准</option>
              <option value="high">清晰</option>
            </select>
          </div>

          <div className="h-8 w-px bg-slate-600"></div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg transition-colors ${
              soundEnabled ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-600'
            }`}
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </button>

          <div className="relative group">
            <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
              <Keyboard className="w-5 h-5" />
            </button>

            <div className="absolute top-full right-0 mt-2 bg-slate-700 rounded-lg shadow-xl py-2 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              {keyCombos.map((combo) => (
                <button
                  key={combo.keys}
                  onClick={() => onSendKey(combo.keys)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-slate-600 transition-colors"
                >
                  {combo.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleLockToggle}
            className={`p-2 rounded-lg transition-colors ${
              inputLocked ? 'bg-amber-600 hover:bg-amber-700' : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            {inputLocked ? (
              <Lock className="w-5 h-5" />
            ) : (
              <Unlock className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={onScreenshot}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            <Camera className="w-5 h-5" />
          </button>

          <button
            onClick={onClipboardSync}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            <Clipboard className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
