import { useState } from 'react';
import { Screen } from '../../data/mockData';

interface ScreenViewerProps {
  screens: Screen[];
  currentQuality: 'low' | 'medium' | 'high';
}

export default function ScreenViewer({ screens, currentQuality }: ScreenViewerProps) {
  const [activeScreen, setActiveScreen] = useState(0);

  if (screens.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-900">
        <p className="text-slate-400">无可用屏幕</p>
      </div>
    );
  }

  const qualityOverlay = {
    low: 'opacity-30',
    medium: 'opacity-60',
    high: 'opacity-100'
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
      {screens.length > 1 && (
        <div className="flex gap-2 p-3 bg-slate-800">
          {screens.map((screen, index) => (
            <button
              key={screen.id}
              onClick={() => setActiveScreen(index)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeScreen === index
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {screen.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
        <div className="relative bg-slate-800 rounded-lg shadow-2xl overflow-hidden">
          <div className={`transition-opacity duration-300 ${qualityOverlay[currentQuality]}`}>
            <svg
              width={screens[activeScreen]?.width || 800}
              height={screens[activeScreen]?.height || 600}
              viewBox={`0 0 ${screens[activeScreen]?.width || 800} ${screens[activeScreen]?.height || 600}`}
              className="block"
            >
              <rect width="100%" height="100%" fill="#1e293b" />
              
              <g transform="translate(50, 50)">
                <rect x="0" y="0" width="200" height="80" rx="4" fill="#3b82f6" opacity="0.8" />
                <text x="100" y="50" textAnchor="middle" fill="white" fontSize="14" fontFamily="Arial">
                  POS收银系统
                </text>
              </g>

              <g transform="translate(50, 150)">
                <rect x="0" y="0" width="300" height="200" rx="4" fill="#475569" opacity="0.8" />
                <text x="150" y="100" textAnchor="middle" fill="#cbd5e1" fontSize="12" fontFamily="Arial">
                  商品列表
                </text>
              </g>

              <g transform="translate(370, 150)">
                <rect x="0" y="0" width="180" height="200" rx="4" fill="#475569" opacity="0.8" />
                <text x="90" y="100" textAnchor="middle" fill="#cbd5e1" fontSize="12" fontFamily="Arial">
                  购物车
                </text>
              </g>

              <g transform="translate(50, 370)">
                <rect x="0" y="0" width="500" height="80" rx="4" fill="#334155" opacity="0.8" />
                <text x="250" y="45" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="Arial">
                  底部状态栏
                </text>
              </g>

              <circle cx="750" cy="30" r="15" fill="#22c55e" opacity="0.8" />
              <circle cx="720" cy="30" r="15" fill="#f59e0b" opacity="0.8" />
              <circle cx="690" cy="30" r="15" fill="#ef4444" opacity="0.8" />
            </svg>
          </div>

          <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-3 py-1 rounded">
            {screens[activeScreen]?.width}x{screens[activeScreen]?.height}
            {' | '}
            {currentQuality === 'low' ? '流畅' : currentQuality === 'medium' ? '标准' : '清晰'}
          </div>
        </div>
      </div>
    </div>
  );
}
