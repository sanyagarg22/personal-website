"use client";

interface TitleBarProps {
  onNew: () => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
}

export function TitleBar({ onNew, onSave, onUndo, onRedo }: TitleBarProps) {
  return (
    <div className="flex items-center h-7 bg-[#dce8f5] border-b border-[#b8d0ec] text-xs">
      {/* App Icon */}
      <div className="w-5 h-5 ml-1 mr-1 flex items-center justify-center">
        <span className="text-sm">🎨</span>
      </div>

      {/* Quick Access Toolbar */}
      <div className="flex items-center gap-0.5 px-1 border-r border-[#b8d0ec]">
        <button
          onClick={onSave}
          className="w-5 h-5 flex items-center justify-center hover:bg-[#c4daf3] rounded"
          title="Save (Ctrl+S)"
        >
          💾
        </button>
        <button
          onClick={onUndo}
          className="w-5 h-5 flex items-center justify-center hover:bg-[#c4daf3] rounded"
          title="Undo (Ctrl+Z)"
        >
          ↩
        </button>
        <button
          onClick={onRedo}
          className="w-5 h-5 flex items-center justify-center hover:bg-[#c4daf3] rounded"
          title="Redo (Ctrl+Y)"
        >
          ↪
        </button>
        <span className="text-[10px] text-gray-500 ml-1">▼</span>
      </div>

      {/* Title */}
      <div className="flex-1 text-center text-[11px] text-gray-700">
        Untitled - Paint
      </div>

      {/* Window Controls */}
      <div className="flex items-center">
        <button className="w-11 h-7 flex items-center justify-center hover:bg-[#c4daf3] text-gray-600">
          ─
        </button>
        <button className="w-11 h-7 flex items-center justify-center hover:bg-[#c4daf3] text-gray-600">
          □
        </button>
        <button className="w-11 h-7 flex items-center justify-center hover:bg-[#e81123] hover:text-white text-gray-600">
          ✕
        </button>
      </div>
    </div>
  );
}

