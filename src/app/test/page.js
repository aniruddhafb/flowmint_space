"use client";
import { useEffect, useRef, useState } from "react";

const Test = () => {
  const CanvasComponent = () => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const isDrawing = useRef(false);
    const startX = useRef(0);
    const startY = useRef(0);
    const selectedPixels = useRef([]);

    useEffect(() => {
      const canvas = canvasRef.current;
      canvas.width = 999;
      canvas.height = 999;
      const context = canvas.getContext("2d");
      contextRef.current = context;
    }, []);

    const handleMouseDown = (event) => {
      isDrawing.current = true;
      const { offsetX, offsetY } = event.nativeEvent;
      startX.current = offsetX;
      startY.current = offsetY;
      selectedPixels.current = [];
    };

    const handleMouseMove = (event) => {

      if (!isDrawing.current) return;

      const { offsetX, offsetY } = event.nativeEvent;
      const ctx = contextRef.current;

      const minX = Math.min(startX.current, offsetX);
      const minY = Math.min(startY.current, offsetY);
      const maxX = Math.max(startX.current, offsetX);
      const maxY = Math.max(startY.current, offsetY);

      const pixelsToFill = [];
      for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
          const pixel = { x, y };
          pixelsToFill.push(pixel);
        }
      }

      selectedPixels.current = pixelsToFill;
      drawSelection(minX, minY, maxX - minX, maxY - minY);
    };

    const handleMouseUp = () => {
      isDrawing.current = false;
    };

    const drawSelection = (x, y, width, height) => {
      const ctx = contextRef.current;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fillStyle = "rgba(255, 0, 0, 0.2)"; // Modify the selection color as needed
      ctx.fillRect(x, y, width, height);
    };

    useEffect(() => {
      const ctx = contextRef.current;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      for (let i = 0; i < selectedPixels.current.length; i++) {
        const { x, y } = selectedPixels.current[i];
        ctx.fillStyle = "rgba(0, 255, 0, 1)"; // Modify the pixel fill color as needed
        ctx.fillRect(x, y, 1, 1);
      }
    }, [selectedPixels.current]);



    return (
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ border: "1px solid black" }}
      />
    );
  };

  return (
    <>
      <CanvasComponent />
    </>
  );
};

export default Test;
