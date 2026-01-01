"use client";

import { Tool } from "./types";

interface RibbonProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  primaryColor: string;
  secondaryColor: string;
  onPrimaryColorChange: (color: string) => void;
  onSecondaryColorChange: (color: string) => void;
}

const PRESET_COLORS = [
  // Row 1 - Dark colors
  "#000000", "#7f7f7f", "#880015", "#ed1c24", "#ff7f27", "#fff200", "#22b14c", "#00a2e8", "#3f48cc", "#a349a4",
  // Row 2 - Light colors  
  "#ffffff", "#c3c3c3", "#b97a57", "#ffaec9", "#ffc90e", "#efe4b0", "#b5e61d", "#99d9ea", "#7092be", "#c8bfe7",
];

const EXTRA_COLORS = [
  "#000000", "#7f7f7f", "#880015", "#ed1c24", "#ff7f27", "#fff200",
  "#ffffff", "#c3c3c3", "#b97a57", "#ffaec9", "#ffc90e", "#efe4b0",
];

export function Ribbon({
  activeTool,
  onToolChange,
  brushSize,
  onBrushSizeChange,
  primaryColor,
  secondaryColor,
  onPrimaryColorChange,
  onSecondaryColorChange,
}: RibbonProps) {
  const ToolButton = ({ 
    tool, 
    icon, 
    label,
    size = "small"
  }: { 
    tool: Tool; 
    icon: React.ReactNode; 
    label: string;
    size?: "small" | "large";
  }) => (
    <button
      onClick={() => onToolChange(tool)}
      className={`flex flex-col items-center justify-center rounded-sm
        ${size === "large" ? "w-12 h-14 px-1" : "w-7 h-7"}
        ${activeTool === tool
          ? "bg-[#c4daf3] border border-[#7eb4ea]"
          : "hover:bg-[#e5e5e5] border border-transparent"
        }`}
      title={label}
    >
      <span className={size === "large" ? "text-xl" : "text-sm"}>{icon}</span>
      {size === "large" && <span className="text-[9px] mt-0.5">{label}</span>}
    </button>
  );

  const GroupLabel = ({ children }: { children: React.ReactNode }) => (
    <div className="text-[10px] text-gray-500 text-center mt-auto border-t border-[#e0e0e0] pt-0.5 w-full">
      {children}
    </div>
  );

  const GroupDivider = () => (
    <div className="w-px h-16 bg-[#d0d0d0] mx-1" />
  );

  return (
    <div className="bg-[#f5f6f7] border-b border-[#d0d0d0]">
      {/* Tabs */}
      <div className="flex items-center bg-[#dce8f5]">
        <button className="px-3 py-1 text-xs font-medium text-white bg-[#2b579a] hover:bg-[#1e4174] flex items-center gap-1">
          Sanya Garg
        </button>
        <button className="px-4 py-1.5 text-xs bg-[#f5f6f7] border-x border-t border-[#d0d0d0] rounded-t -mb-px">
          Home
        </button>
        <button className="px-4 py-1.5 text-xs text-gray-600 hover:bg-[#e5e5e5]">
          About Me
        </button>
      </div>

      {/* Ribbon Content */}
      <div className="flex items-stretch px-2 py-1 h-[90px]">
        {/* Clipboard Group */}
        <div className="flex flex-col items-center h-full">
          <div className="flex items-start gap-0.5 flex-1">
            <button className="flex flex-col items-center justify-center w-11 h-14 hover:bg-[#e5e5e5] rounded-sm border border-transparent">
              <span className="text-2xl">📋</span>
              <span className="text-[9px]">Paste</span>
              <span className="text-[8px]">▼</span>
            </button>
            <div className="flex flex-col gap-0.5">
              <button className="flex items-center gap-1 px-1 h-5 hover:bg-[#e5e5e5] rounded-sm text-[10px]">
                ✂️ Cut
              </button>
              <button className="flex items-center gap-1 px-1 h-5 hover:bg-[#e5e5e5] rounded-sm text-[10px]">
                📄 Copy
              </button>
            </div>
          </div>
          <GroupLabel>Clipboard</GroupLabel>
        </div>

        <GroupDivider />

        {/* Image Group */}
        <div className="flex flex-col items-center h-full">
          <div className="flex items-start gap-0.5 flex-1">
            <button className="flex flex-col items-center justify-center w-11 h-14 hover:bg-[#e5e5e5] rounded-sm border border-transparent">
              <span className="text-lg">⬚</span>
              <span className="text-[9px]">Select</span>
              <span className="text-[8px]">▼</span>
            </button>
            <div className="flex flex-col gap-0.5">
              <button className="flex items-center gap-1 px-1 h-5 hover:bg-[#e5e5e5] rounded-sm text-[10px]">
                ✂️ Crop
              </button>
              <button className="flex items-center gap-1 px-1 h-5 hover:bg-[#e5e5e5] rounded-sm text-[10px]">
                ↔️ Resize
              </button>
              <button className="flex items-center gap-1 px-1 h-5 hover:bg-[#e5e5e5] rounded-sm text-[10px]">
                🔄 Rotate ▼
              </button>
            </div>
          </div>
          <GroupLabel>Image</GroupLabel>
        </div>

        <GroupDivider />

        {/* Tools Group */}
        <div className="flex flex-col items-center h-full">
          <div className="flex flex-wrap gap-0.5 w-24 flex-1 content-start">
            <ToolButton tool="pencil" icon="✏️" label="Pencil" />
            <ToolButton tool="fill" icon="🪣" label="Fill" />
            <ToolButton tool="text" icon={<span className="font-serif font-bold text-base">A</span>} label="Text" />
            <ToolButton tool="eraser" icon="🧹" label="Eraser" />
            <ToolButton tool="picker" icon="💧" label="Color picker" />
            <ToolButton tool="brush" icon="🔍" label="Magnifier" />
          </div>
          <div className="flex items-center gap-0.5 mb-0.5">
            <button
              onClick={() => onToolChange("brush")}
              className={`flex flex-col items-center justify-center w-12 h-9 rounded-sm
                ${activeTool === "brush"
                  ? "bg-[#fce4b0] border border-[#e5c47b]"
                  : "hover:bg-[#e5e5e5] border border-transparent"
                }`}
            >
              <span className="text-lg">🖌️</span>
              <span className="text-[8px]">Brushes ▼</span>
            </button>
          </div>
          <GroupLabel>Tools</GroupLabel>
        </div>

        <GroupDivider />

        {/* Shapes Group */}
        <div className="flex flex-col items-center h-full">
          <div className="flex gap-1 flex-1">
            <div className="grid grid-cols-4 gap-0.5 content-start">
              <ToolButton tool="line" icon="╱" label="Line" />
              <button className="w-7 h-7 flex items-center justify-center hover:bg-[#e5e5e5] rounded-sm text-sm">⌒</button>
              <button className="w-7 h-7 flex items-center justify-center hover:bg-[#e5e5e5] rounded-sm text-sm">⬭</button>
              <ToolButton tool="rectangle" icon="▭" label="Rectangle" />
              <button className="w-7 h-7 flex items-center justify-center hover:bg-[#e5e5e5] rounded-sm text-sm">△</button>
              <button className="w-7 h-7 flex items-center justify-center hover:bg-[#e5e5e5] rounded-sm text-sm">▷</button>
              <button className="w-7 h-7 flex items-center justify-center hover:bg-[#e5e5e5] rounded-sm text-sm">◇</button>
              <ToolButton tool="ellipse" icon="⬭" label="Ellipse" />
              <button className="w-7 h-7 flex items-center justify-center hover:bg-[#e5e5e5] rounded-sm text-sm">⭐</button>
              <button className="w-7 h-7 flex items-center justify-center hover:bg-[#e5e5e5] rounded-sm text-sm">💬</button>
              <button className="w-7 h-7 flex items-center justify-center hover:bg-[#e5e5e5] rounded-sm text-sm">❤️</button>
              <button className="w-7 h-7 flex items-center justify-center hover:bg-[#e5e5e5] rounded-sm text-[8px]">▼</button>
            </div>
            <div className="flex flex-col gap-0.5">
              <button className="flex items-center gap-1 px-1 h-6 hover:bg-[#e5e5e5] rounded-sm text-[10px] border border-gray-300">
                ○ Outline ▼
              </button>
              <button className="flex items-center gap-1 px-1 h-6 hover:bg-[#e5e5e5] rounded-sm text-[10px] border border-gray-300">
                ▣ Fill ▼
              </button>
            </div>
          </div>
          <GroupLabel>Shapes</GroupLabel>
        </div>

        <GroupDivider />

        {/* Size Group */}
        <div className="flex flex-col items-center h-full">
          <div className="flex flex-col items-center gap-1 flex-1 pt-1">
            <button className="w-14 h-10 flex flex-col items-center justify-center hover:bg-[#e5e5e5] rounded-sm border border-gray-300">
              <div className="flex flex-col items-center gap-0.5">
                <div className="w-10 h-[1px] bg-black"></div>
                <div className="w-10 h-[2px] bg-black"></div>
                <div className="w-10 h-[3px] bg-black"></div>
                <div className="w-10 h-[4px] bg-black"></div>
              </div>
            </button>
            <span className="text-[9px] text-gray-600">{brushSize}px</span>
          </div>
          <GroupLabel>Size</GroupLabel>
        </div>

        <GroupDivider />

        {/* Colors Group */}
        <div className="flex flex-col items-center h-full">
          <div className="flex items-start gap-2 flex-1 pt-1">
            {/* Color 1 & 2 */}
            <div className="flex gap-1">
              <div className="flex flex-col items-center">
                <div
                  className="w-7 h-7 border-2 border-gray-400 cursor-pointer shadow-inner"
                  style={{ backgroundColor: primaryColor }}
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "color";
                    input.value = primaryColor;
                    input.onchange = (e) => onPrimaryColorChange((e.target as HTMLInputElement).value);
                    input.click();
                  }}
                  title="Color 1"
                />
                <span className="text-[9px] text-gray-600 mt-0.5">Color</span>
                <span className="text-[9px] text-gray-600">1</span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className="w-7 h-7 border-2 border-gray-400 cursor-pointer shadow-inner"
                  style={{ backgroundColor: secondaryColor }}
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "color";
                    input.value = secondaryColor;
                    input.onchange = (e) => onSecondaryColorChange((e.target as HTMLInputElement).value);
                    input.click();
                  }}
                  title="Color 2"
                />
                <span className="text-[9px] text-gray-600 mt-0.5">Color</span>
                <span className="text-[9px] text-gray-600">2</span>
              </div>
            </div>

            {/* Color Palette */}
            <div className="grid grid-cols-10 gap-[1px]">
              {PRESET_COLORS.map((color, index) => (
                <button
                  key={index}
                  className="w-4 h-4 border border-gray-400 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => onPrimaryColorChange(color)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    onSecondaryColorChange(color);
                  }}
                  title={color}
                />
              ))}
            </div>

            {/* Edit Colors */}
            <div className="flex flex-col items-center">
              <button className="w-8 h-8 flex items-center justify-center hover:bg-[#e5e5e5] rounded-sm border border-gray-300">
                <span className="text-lg">🎨</span>
              </button>
              <span className="text-[8px] text-gray-600 mt-0.5">Edit</span>
              <span className="text-[8px] text-gray-600">colors</span>
            </div>
          </div>
          <GroupLabel>Colors</GroupLabel>
        </div>
      </div>
    </div>
  );
}

