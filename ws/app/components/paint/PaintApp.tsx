"use client";

import { useState, useCallback } from "react";
import { TitleBar } from "./TitleBar";
import { Ribbon } from "./Ribbon";
import { Canvas } from "./Canvas";
import { StatusBar } from "./StatusBar";
import { Tool } from "./types";

export function PaintApp() {
  // Tool state
  const [activeTool, setActiveTool] = useState<Tool>("pencil");
  const [brushSize, setBrushSize] = useState(5);
  
  // Color state
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [secondaryColor, setSecondaryColor] = useState("#ffffff");
  
  // Canvas state
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | undefined>();
  const [zoom, setZoom] = useState(100);

  const handleCanvasSizeChange = useCallback((width: number, height: number) => {
    setCanvasSize({ width, height });
  }, []);

  const handleCursorPositionChange = useCallback((x: number, y: number) => {
    setCursorPosition({ x, y });
  }, []);

  const handleNewCanvas = () => {
    if (confirm("Reset the canvas? Unsaved changes will be lost.")) {
      window.location.reload();
    }
  };

  const handleSave = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const link = document.createElement("a");
      link.download = "paint-image.png";
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleUndo = () => {
    // TODO: Implement undo
  };

  const handleRedo = () => {
    // TODO: Implement redo
  };

  const handleColorPick = (color: string) => {
    setPrimaryColor(color);
    setActiveTool("pencil");
  };

  return (
    <div className="flex flex-col h-screen bg-[#f0f0f0] font-['Segoe_UI',sans-serif]">
      {/* Title Bar */}
      <TitleBar 
        onNew={handleNewCanvas}
        onSave={handleSave}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />
      
      {/* Ribbon */}
      <Ribbon
        activeTool={activeTool}
        onToolChange={setActiveTool}
        brushSize={brushSize}
        onBrushSizeChange={setBrushSize}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        onPrimaryColorChange={setPrimaryColor}
        onSecondaryColorChange={setSecondaryColor}
      />
      
      {/* Canvas Area */}
      <Canvas
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        activeTool={activeTool}
        brushSize={brushSize}
        onColorPick={handleColorPick}
        onSizeChange={handleCanvasSizeChange}
        onCursorMove={handleCursorPositionChange}
        overlayText="hello!"
        overlayText2="welcome to my personal website inspired by the legacy microsoft paint app."
      />
      
      {/* Status Bar */}
      <StatusBar
        canvasWidth={canvasSize.width}
        canvasHeight={canvasSize.height}
        cursorPosition={cursorPosition}
        zoom={zoom}
        onZoomChange={setZoom}
      />
    </div>
  );
}
