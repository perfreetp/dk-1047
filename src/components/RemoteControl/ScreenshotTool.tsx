import { useState, useRef, useEffect } from 'react';
import { X, Trash2, ArrowRight, Type, Square } from 'lucide-react';

interface ScreenshotToolProps {
  onClose: () => void;
  onSave: (annotated: boolean) => void;
}

type Tool = 'select' | 'arrow' | 'text' | 'rectangle';

export default function ScreenshotTool({ onClose, onSave }: ScreenshotToolProps) {
  const [currentTool, setCurrentTool] = useState<Tool>('select');
  const [annotations, setAnnotations] = useState<any[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(50, 50, 200, 80);

    ctx.fillStyle = '#475569';
    ctx.fillRect(50, 150, 300, 200);

    ctx.fillStyle = '#334155';
    ctx.fillRect(50, 370, 500, 80);

    annotations.forEach(ann => {
      if (ann.type === 'arrow') {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(ann.startX, ann.startY);
        ctx.lineTo(ann.endX, ann.endY);
        ctx.stroke();

        const angle = Math.atan2(ann.endY - ann.startY, ann.endX - ann.startX);
        const headLength = 15;
        ctx.lineTo(
          ann.endX - headLength * Math.cos(angle - Math.PI / 6),
          ann.endY - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(ann.endX, ann.endY);
        ctx.lineTo(
          ann.endX - headLength * Math.cos(angle + Math.PI / 6),
          ann.endY - headLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
      } else if (ann.type === 'rectangle') {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.strokeRect(ann.x, ann.y, ann.width, ann.height);
      } else if (ann.type === 'text') {
        ctx.fillStyle = '#ef4444';
        ctx.font = '16px Arial';
        ctx.fillText(ann.text, ann.x, ann.y);
      }
    });
  }, [annotations]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (currentTool === 'text') {
      const text = prompt('输入标注文字:');
      if (text) {
        setAnnotations([...annotations, { type: 'text', x, y, text }]);
      }
    } else if (currentTool === 'rectangle') {
      setAnnotations([...annotations, { type: 'rectangle', x, y, width: 100, height: 60 }]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-5xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-white">截图标注</h3>
            
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentTool('select')}
                className={`p-2 rounded-lg transition-colors ${
                  currentTool === 'select' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentTool('arrow')}
                className={`p-2 rounded-lg transition-colors ${
                  currentTool === 'arrow' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentTool('text')}
                className={`p-2 rounded-lg transition-colors ${
                  currentTool === 'text' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                <Type className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentTool('rectangle')}
                className={`p-2 rounded-lg transition-colors ${
                  currentTool === 'rectangle' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                <Square className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              取消
            </button>
            <button
              onClick={() => onSave(annotations.length > 0)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              保存截图
            </button>
          </div>
        </div>

        <div className="p-6 overflow-auto max-h-[calc(100vh-200px)]">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            onClick={handleCanvasClick}
            className="border border-slate-600 rounded-lg cursor-crosshair"
          />
        </div>
      </div>
    </div>
  );
}
