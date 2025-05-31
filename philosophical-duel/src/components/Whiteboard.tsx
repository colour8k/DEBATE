import React, { useRef, useState } from 'react';
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Eraser, 
  Pen, 
  Undo, 
  Redo, 
  Download, 
  Trash2
} from 'lucide-react';

interface WhiteboardProps {
  title: string;
  philosopher: string;
  color: string;
}

export default function Whiteboard({ title, philosopher, color }: WhiteboardProps) {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [strokeColor, setStrokeColor] = useState(color);
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [eraseMode, setEraseMode] = useState(false);

  const handleClearCanvas = () => {
    canvasRef.current?.clearCanvas();
  };

  const handleUndo = () => {
    canvasRef.current?.undo();
  };

  const handleRedo = () => {
    canvasRef.current?.redo();
  };

  const handleDownload = () => {
    canvasRef.current?.exportImage('png')
      .then((data) => {
        const link = document.createElement('a');
        link.download = `${philosopher}-whiteboard.png`;
        link.href = data;
        link.click();
      });
  };

  const toggleEraseMode = () => {
    setEraseMode(!eraseMode);
    canvasRef.current?.eraseMode(!eraseMode);
  };

  const colors = [
    { name: 'Primary', value: color },
    { name: 'Black', value: '#000000' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Pink', value: '#ec4899' }
  ];

  const strokeWidths = [1, 2, 3, 5, 8, 12];

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{title}</CardTitle>
        <div className="flex flex-wrap gap-2">
          {/* Drawing Tools */}
          <div className="flex items-center gap-1">
            <Button
              variant={!eraseMode ? "default" : "outline"}
              size="sm"
              onClick={() => setEraseMode(false)}
            >
              <Pen className="w-4 h-4" />
            </Button>
            <Button
              variant={eraseMode ? "default" : "outline"}
              size="sm"
              onClick={toggleEraseMode}
            >
              <Eraser className="w-4 h-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Colors */}
          <div className="flex items-center gap-1">
            {colors.map((color) => (
              <button
                key={color.value}
                className={`w-6 h-6 rounded-full border-2 ${
                  strokeColor === color.value ? 'border-gray-800' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() => setStrokeColor(color.value)}
                title={color.name}
              />
            ))}
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Stroke Width */}
          <div className="flex items-center gap-1">
            {strokeWidths.map((width) => (
              <button
                key={width}
                className={`w-8 h-8 rounded flex items-center justify-center border ${
                  strokeWidth === width ? 'border-gray-800 bg-gray-100' : 'border-gray-300'
                }`}
                onClick={() => setStrokeWidth(width)}
                title={`${width}px`}
              >
                <div
                  className="rounded-full bg-gray-800"
                  style={{ width: `${width * 2}px`, height: `${width * 2}px` }}
                />
              </button>
            ))}
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={handleUndo}>
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleRedo}>
              <Redo className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleClearCanvas}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-white">
          <ReactSketchCanvas
            ref={canvasRef}
            strokeWidth={strokeWidth}
            strokeColor={strokeColor}
            canvasColor="white"
            height="500px"
            width="100%"
            allowOnlyPointerType="all"
          />
        </div>
        
        <div className="mt-3 text-sm text-muted-foreground text-center">
          Draw anything to illustrate your point - from an apple to the universe!
        </div>
      </CardContent>
    </Card>
  );
}