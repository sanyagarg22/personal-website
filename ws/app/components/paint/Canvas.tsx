"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Tool } from "./types";

interface CanvasProps {
  primaryColor: string;
  secondaryColor: string;
  activeTool: Tool;
  brushSize: number;
  activeTab: string;
  onColorPick?: (color: string) => void;
  onSizeChange?: (width: number, height: number) => void;
  onCursorMove?: (x: number, y: number) => void;
}

export function Canvas({ 
  primaryColor, 
  secondaryColor, 
  activeTool, 
  brushSize,
  onColorPick,
  onSizeChange,
  onCursorMove,
  activeTab,
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
      const baseHeight = container.clientHeight - padding;
      const height = activeTab === "About Me" ? Math.max(baseHeight, 500) : baseHeight;
      
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
  }, [activeTab]);

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
    
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    
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

    color = activeTool === "eraser" ? "#ffffff" : color;

    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

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
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const targetColor = getPixelColor(Math.floor(x), Math.floor(y));
    if (!targetColor) return;
    
    // if clicking on the same color, don't do anything
    if (targetColor === color) return;

    const queue: { x: number; y: number }[] = [];
    const visited: Set<string> = new Set();
    queue.push({ x: Math.floor(x), y: Math.floor(y) });
    visited.add(`${Math.floor(x)},${Math.floor(y)}`);

    const xshift = [0, 0, 1, -1];
    const yshift = [1, -1, 0, 0];
    ctx.fillStyle = color;

    while (queue.length > 0) {
      const curr = queue.shift();
      if (!curr) continue;
      
      if (curr.x < 0 || curr.x >= canvas.width || curr.y < 0 || curr.y >= canvas.height) continue;
      
      ctx.fillRect(curr.x, curr.y, 1, 1);
      
      for (let i = 0; i < 4; i++) {
        const newx = curr.x + xshift[i];
        const newy = curr.y + yshift[i];
        const key = `${newx},${newy}`;
        
        if (visited.has(key) || newx < 0 || newx >= canvas.width || newy < 0 || newy >= canvas.height) continue;

        if (getPixelColor(newx, newy) === targetColor) {
          queue.push({ x: newx, y: newy });
          visited.add(key);
        }
      }
    }
  }, [getPixelColor]);

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
    onCursorMove?.(Math.round(x), Math.round(y));
    if (!isDrawing) return;
    draw(x, y, currentColor);
    setLastPos({ x, y });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setLastPos(null);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };


  return (
    <>
      <div 
        ref={containerRef} 
        className={`flex-1 bg-[#c0c0c0] p-4 ${activeTab === "About Me" ? "overflow-auto min-h-[600px]" : "overflow-hidden"}`}
      >
        <div className={`relative ${activeTab === "About Me" ? "min-h-[500px]" : "inline-block"}`}>
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
          {activeTab === "Home" && <Home />}
          {activeTab === "About Me" && <AboutMe />}
          {activeTab === "Free Paint" && <FreePaint />}
        </div>
      </div>
      {activeTab === "About Me" && <Art />}
    </>
  );
}

export function Home(){
  return (
    <div className="absolute top-1/4 left-1/16 pointer-events-none p-4">

    <div className="text-7xl font-bold pointer-events-none">
        <img 
          src="/hello.png" 
          alt="hello doodle" 
          className="w-60 h-35 object-cover"
        />
      </div>
        <div className="text-gray-600 text-xl mt-2 pointer-events-none">
          welcome to my personal website inspired by the legacy microsoft paint app.
        </div>
        <div className="text-gray-600 text-xl mt-2 pointer-events-none" style={{ color: "#c8bfe7" }}>
          feel free to make a doodle or two while you're here :)
        </div>
        <Icons />
    </div>
  )
}

export function Icons(){
  return (
    <div className="flex items-center gap-4 mt-6 pointer-events-auto z-10">
      <a 
        href="https://www.linkedin.com/in/sanya-garg/" 
        target="_blank" 
        className="w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity text-gray-600"
        title="LinkedIn"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </a>
      <a 
        href="mailto:sanya.garg@gmail.com" 
        className="w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity text-gray-600"
        title="Email"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
      </a>
      <a 
        href="/resume.pdf" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity text-gray-600"
        title="Resume"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
        </svg>
      </a>
      <a 
        href="https://github.com/sanyagarg22" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity text-gray-600"
        title="GitHub"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      </a>
    </div>
  )
}

export function AboutMe(){
  return (
    <div className="absolute top-1/6 left-1/16 pointer-events-none p-4 flex items-start gap-29">
      <div className="flex-1">
        <div className="text-7xl font-bold" style={{ color: "#7092be" }}>
          about me
        </div>
        <div className="text-gray-600 text-xl mt-8 max-w-2xl">
          I'm a software engineer and recent graduate from Rice University currently based in the SF bay area. In addition to doodling in Microsoft Paint, I like to dabble in many forms of art, try new foods and restaurants (and keep track of them on Beli), and play pickleball and squash. Feel free to check out some of my art and other projects below!
        </div>
      </div>
      <div className="flex-shrink-0 ">
        <img 
          src="/pfp.jpg" 
          alt="Profile Picture" 
          className="w-80 h-100 object-cover rounded-[50%]"
          style={{ borderRadius: "50% 50% 50% 50% / 50% 50% 50% 50%" }}
        />
      </div>
    </div>
  )
}

export function Art(){
  return (
    <div className="bg-[#dce8f5] p-8 border-t-2 border-[#b8d0ec]">
      <div className="max-w-7xl mx-auto">
        <div className="text-6xl font-bold mb-10 mt-12 text-gray-600">
          my art
        </div>
        <div className="grid grid-cols-3 gap-6">
          {/* Placeholder art images - replace with your actual art */}
          <div>
            <img 
              src="/art1.jpg" 
              alt="Art piece 1" 
              className="w-full h-auto object-cover rounded border-2 border-gray-300"
            />
          </div>
          <div>
            <img 
              src="/art2.jpg" 
              alt="Art piece 2" 
              className="w-full h-auto object-cover rounded border-2 border-gray-300"
            />
          </div>
          <div>
            <img 
              src="/art3.jpg" 
              alt="Art piece 3" 
              className="w-full h-auto object-cover rounded border-2 border-gray-300"
            />
          </div>
          <div>
            <img 
              src="/art4.jpg" 
              alt="Art piece 4" 
              className="w-full h-auto object-cover rounded border-2 border-gray-300"
            />
          </div>
          <div>
            <img 
              src="/art5.jpg" 
              alt="Art piece 5" 
              className="w-full h-auto object-cover rounded border-2 border-gray-300"
            />
          </div>
          <div>
            <img 
              src="/art6.jpg" 
              alt="Art piece 6" 
              className="w-full h-auto object-cover rounded border-2 border-gray-300"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export function FreePaint(){
  return (
    <div className="absolute top-1/3 left-1/16 pointer-events-none p-4">
    </div>
  )
}