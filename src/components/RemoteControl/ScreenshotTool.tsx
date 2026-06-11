import { useState, useRef, useEffect } from 'react';
import { X, Trash2, ArrowRight, Type, Square, Eraser } from 'lucide-react';

interface ScreenshotToolProps {
  onClose: () => void;
  onSave: (annotated: boolean) => void;
}

type Tool = 'select' | 'arrow' | 'text' | 'rectangle';

interface Annotation {
  id: string;
  type: 'arrow' | 'text' | 'rectangle';
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  text?: string;
}

export default function ScreenshotTool({ onClose, onSave }: ScreenshotToolProps) {
  const [currentTool, setCurrentTool] = useState<Tool>('select');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentAnnotation, setCurrentAnnotation] = useState<Annotation | null>(null);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);
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

    const allAnnotations = currentAnnotation ? [...annotations, currentAnnotation] : annotations;
    
    allAnnotations.forEach(ann => {
      ctx.strokeStyle = ann.id === selectedAnnotation ? '#22d3ee' : '#ef4444';
      ctx.fillStyle = ann.id === selectedAnnotation ? '#22d3ee' : '#ef4444';
      ctx.lineWidth = 3;

      if (ann.type === 'arrow' && ann.startX !== undefined && ann.startY !== undefined && ann.endX !== undefined && ann.endY !== undefined) {
        ctx.beginPath();
        ctx.moveTo(ann.startX, ann.startY);
        ctx.lineTo(ann.endX, ann.endY);
        ctx.stroke();

        const angle = Math.atan2(ann.endY - ann.startY, ann.endX - ann.startX);
        const headLength = 15;
        ctx.beginPath();
        ctx.moveTo(ann.endX, ann.endY);
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
      } else if (ann.type === 'rectangle' && ann.x !== undefined && ann.y !== undefined && ann.width !== undefined && ann.height !== undefined) {
        ctx.strokeStyle = '#f59e0b';
        ctx.strokeRect(ann.x, ann.y, ann.width, ann.height);
      } else if (ann.type === 'text' && ann.x !== undefined && ann.y !== undefined && ann.text) {
        ctx.font = '16px Arial';
        ctx.fillText(ann.text, ann.x, ann.y);
      }
    });
  }, [annotations, currentAnnotation, selectedAnnotation]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool === 'select') return;
    
    const pos = getMousePos(e);
    setIsDrawing(true);

    if (currentTool === 'arrow') {
      setCurrentAnnotation({
        id: `ann_${Date.now()}`,
        type: 'arrow',
        startX: pos.x,
        startY: pos.y,
        endX: pos.x,
        endY: pos.y
      });
    } else if (currentTool === 'rectangle') {
      setCurrentAnnotation({
        id: `ann_${Date.now()}`,
        type: 'rectangle',
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentAnnotation) return;
    
    const pos = getMousePos(e);

    if (currentAnnotation.type === 'arrow') {
      setCurrentAnnotation({
        ...currentAnnotation,
        endX: pos.x,
        endY: pos.y
      });
    } else if (currentAnnotation.type === 'rectangle') {
      setCurrentAnnotation({
        ...currentAnnotation,
        width: pos.x - (currentAnnotation.x || 0),
        height: pos.y - (currentAnnotation.y || 0)
      });
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && currentAnnotation) {
      setAnnotations([...annotations, currentAnnotation]);
      setCurrentAnnotation(null);
    }
    setIsDrawing(false);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool === 'text') {
      const pos = getMousePos(e);
      const text = prompt('输入标注文字:');
      if (text) {
        setAnnotations([...annotations, {
          id: `ann_${Date.now()}`,
          type: 'text',
          x: pos.x,
          y: pos.y,
          text
        }]);
      }
    } else if (currentTool === 'select') {
      const pos = getMousePos(e);
      let found = false;
      for (let i = annotations.length - 1; i >= 0; i--) {
        const ann = annotations[i];
        if (ann.type === 'arrow' && ann.startX !== undefined && ann.endX !== undefined) {
          const minX = Math.min(ann.startX, ann.endX) - 10;
          const maxX = Math.max(ann.startX, ann.endX) + 10;
          const minY = Math.min(ann.startY || 0, ann.endY || 0) - 10;
          const maxY = Math.max(ann.startY || 0, ann.endY || 0) + 10;
          if (pos.x >= minX && pos.x <= maxX && pos.y >= minY && pos.y <= maxY) {
            setSelectedAnnotation(ann.id);
            found = true;
            break;
          }
        } else if (ann.type === 'rectangle' && ann.x !== undefined && ann.width !== undefined) {
          const x = ann.width > 0 ? ann.x : ann.x + ann.width;
          const y = ann.height > 0 ? ann.y : ann.y + ann.height;
          const w = Math.abs(ann.width);
          const h = Math.abs(ann.height);
          if (pos.x >= x - 5 && pos.x <= x + w + 5 && pos.y >= y - 5 && pos.y <= y + h + 5) {
            setSelectedAnnotation(ann.id);
            found = true;
            break;
          }
        } else if (ann.type === 'text' && ann.x !== undefined && ann.y !== undefined) {
          if (pos.x >= ann.x - 5 && pos.x <= ann.x + 100 && pos.y >= ann.y - 20 && pos.y <= ann.y + 5) {
            setSelectedAnnotation(ann.id);
            found = true;
            break;
          }
        }
      }
      if (!found) {
        setSelectedAnnotation(null);
      }
    }
  };

  const handleClearAll = () => {
    if (confirm('确定要清空所有标注吗？')) {
      setAnnotations([]);
      setCurrentAnnotation(null);
      setSelectedAnnotation(null);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedAnnotation) {
      setAnnotations(annotations.filter(a => a.id !== selectedAnnotation));
      setSelectedAnnotation(null);
    }
  };

  const handleSave = () => {
    onSave(annotations.length > 0);
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
                title="选择工具"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => { setCurrentTool('arrow'); setSelectedAnnotation(null); }}
                className={`p-2 rounded-lg transition-colors ${
                  currentTool === 'arrow' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'
                }`}
                title="箭头工具（拖拽绘制）"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => { setCurrentTool('text'); setSelectedAnnotation(null); }}
                className={`p-2 rounded-lg transition-colors ${
                  currentTool === 'text' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'
                }`}
                title="文字工具（点击添加）"
              >
                <Type className="w-5 h-5" />
              </button>
              <button
                onClick={() => { setCurrentTool('rectangle'); setSelectedAnnotation(null); }}
                className={`p-2 rounded-lg transition-colors ${
                  currentTool === 'rectangle' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'
                }`}
                title="矩形工具（拖拽绘制）"
              >
                <Square className="w-5 h-5" />
              </button>
            </div>

            <div className="h-8 w-px bg-slate-600"></div>

            <div className="flex gap-2">
              <button
                onClick={handleDeleteSelected}
                disabled={!selectedAnnotation}
                className="p-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors"
                title="删除选中"
              >
                <Eraser className="w-5 h-5" />
              </button>
              <button
                onClick={handleClearAll}
                disabled={annotations.length === 0}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors text-sm font-medium"
              >
                清空全部
              </button>
            </div>

            <div className="text-sm text-slate-400">
              {annotations.length > 0 && (
                <span className={annotations.length > 0 ? 'text-emerald-400' : ''}>
                  {annotations.length} 个标注 {selectedAnnotation && '· 已选中1个'}
                </span>
              )}
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
              onClick={handleSave}
              className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                annotations.length > 0 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                  : 'bg-slate-600 text-slate-300'
              }`}
            >
              {annotations.length > 0 ? '保存截图（带标注）' : '保存截图'}
            </button>
          </div>
        </div>

        <div className="p-6 overflow-auto max-h-[calc(100vh-200px)]">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={handleCanvasClick}
            className="border border-slate-600 rounded-lg cursor-crosshair"
          />
          
          <div className="mt-4 text-sm text-slate-400">
            <p>提示：</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>箭头/矩形工具：按住鼠标拖拽绘制</li>
              <li>文字工具：点击画布输入文字</li>
              <li>选择工具：点击选中标注后可删除</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
