"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Tool } from "./types";

interface CanvasProps {
  primaryColor: string;
  secondaryColor: string;
  activeTool: Tool;
  brushSize: number;
  onColorPick?: (color: string) => void;
  onSizeChange?: (width: number, height: number) => void;
  onCursorMove?: (x: number, y: number) => void;
  overlayText?: string; // Optional text to display over the canvas
  overlayText2?: string; // Optional second line of text below the first
}

export function Canvas({ 
  primaryColor, 
  secondaryColor, 
  activeTool, 
  brushSize,
  onColorPick,
  onSizeChange,
  onCursorMove,
  overlayText,
  overlayText2
}: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
  const [currentColor, setCurrentColor] = useState(primaryColor);
  const [isInitialized, setIsInitialized] = useState(false);
  const padding = 32;

  // Measure container and set canvas size
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      const width = container.clientWidth - padding;
      const height = container.clientHeight - padding;
      
      if (width > 0 && height > 0) {
        // if the size is the same, don't update and don't trigger a rerender
        setCanvasSize((prev) => {
          if (prev.width === width && prev.height === height) {
            return prev;
          }
          return { width, height };
        });
      }
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  // Notify parent of size changes (in a separate effect to avoid render-time setState)
  useEffect(() => {
    if (canvasSize.width > 0 && canvasSize.height > 0) {
      onSizeChange?.(canvasSize.width, canvasSize.height);
    }
  }, [canvasSize, onSizeChange]);

  // Initialize canvas with white background 
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Only fill with white on first init, not on every resize
    // (to preserve drawing when resizing)
    if (!isInitialized && canvasSize.width > 0 && canvasSize.height > 0) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
      setIsInitialized(true);
    }
  }, [canvasSize, isInitialized]);

  const getCanvasCoords = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const getPixelColor = useCallback((x: number, y: number): string | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    
    // Get pixel data
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    
    // Convert to hex
    const r = pixel[0].toString(16).padStart(2, "0");
    const g = pixel[1].toString(16).padStart(2, "0");
    const b = pixel[2].toString(16).padStart(2, "0");
    
    return `#${r}${g}${b}`;
  }, []);

  const draw = useCallback((x: number, y: number, color: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (activeTool === "eraser") {
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#ffffff";
    }

    if (lastPos) {
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
  }, [activeTool, brushSize, lastPos]);

  const fill = useCallback((x: number, y: number, color: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // bfs over all the pixels 
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // initialize queue and visited set
    const queue: { x: number; y: number }[] = [];
    const visited: Set<string> = new Set();
    queue.push({ x, y });
    visited.add(`${x},${y}`);

    const xshift = [0, 0, 1, -1];
    const yshift = [1, -1, 0, 0];
    ctx.fillStyle = color;

    while (queue.length > 0) {
      var curr = queue.shift();
      if (!curr) continue;
      let currx = curr.x;
      let curry = curr.y;
      ctx.fillRect(currx, curry, 1, 1);
      for (let i = 0; i < 4; i++) {
        let newx = currx + xshift[i];
        let newy = curry + yshift[i];
        if (!visited.has(`${newx},${newy}`) && getPixelColor(newx, newy) === "#ffffff") {
          queue.push({ x: newx, y: newy });
          visited.add(`${newx},${newy}`);
        }
      }
    }
  }, [draw, getPixelColor]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoords(e);
    const color = e.button === 2 ? secondaryColor : primaryColor;
    setCurrentColor(color);

    if (activeTool === "picker") {
      let pickedColor: string | null = getPixelColor(x, y);
      if (!pickedColor) return;
      onColorPick?.(pickedColor);
      return;
    }

    if (activeTool === "fill") {
      fill(x, y, color);
      return;
    }

    if (activeTool === "pencil" || activeTool === "brush" || activeTool === "eraser") {
      // TODO: make the pencil and brush do different things
      setIsDrawing(true);
      setLastPos({ x, y });
      draw(x, y, color);
      return;
    }

  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoords(e);
    
    // Report cursor position
    onCursorMove?.(Math.round(x), Math.round(y));
    
    if (!isDrawing) return;
    
    // Use white for eraser, otherwise use the current color
    const color = activeTool === "eraser" ? "#ffffff" : currentColor;
    draw(x, y, color);
    setLastPos({ x, y });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setLastPos(null);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // Helper function to draw text on the canvas
  const drawText = useCallback((
    text: string, 
    x: number, 
    y: number, 
    options?: {
      fontSize?: number;
      fontFamily?: string;
      color?: string;
      align?: "left" | "center" | "right";
      baseline?: "top" | "middle" | "bottom";
    }
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const {
      fontSize = 24,
      fontFamily = "Arial",
      color = primaryColor,
      align = "left",
      baseline = "top"
    } = options || {};

    ctx.fillStyle = color;
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    ctx.fillText(text, x, y);
  }, [primaryColor]);

  // Example: Draw text when canvas is initialized
  // Uncomment and modify this to add your text:
  /*
  useEffect(() => {
    if (isInitialized && canvasSize.width > 0 && canvasSize.height > 0) {
      drawText("Hello World", 50, 50, {
        fontSize: 32,
        color: "#000000",
        fontFamily: "Arial"
      });
    }
  }, [isInitialized, canvasSize, drawText]);
  */

  return (
    <div ref={containerRef} className="flex-1 overflow-hidden bg-[#c0c0c0] p-4">
      <div className="relative inline-block">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="bg-white cursor-crosshair shadow-md"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onContextMenu={handleContextMenu}
        />
        {(overlayText || overlayText2) && (
          <div className="absolute top-1/3 left-1/16 pointer-events-none p-4">
            {overlayText && (
              <div className="text-7xl font-bold" style={{ color: "#c8bfe7" }}>
                {overlayText}
              </div>
            )}
            {overlayText2 && (
              <div>
                <div className="text-gray-600 text-xl mt-2">
                  {overlayText2}
                </div>
                <div className="text-gray-600 text-xl mt-2" style={{ color: "#7092be" }}>
                  {"feel free to make a doodle or two while you're here :)"}
                </div>
              </div>
              
            )}
          </div>
        )}
      </div>
    </div>
  );
}

