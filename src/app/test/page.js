"use client";
import React, { useState, useRef, useEffect } from 'react';

const CanvasGame = () => {
    const [selectedTiles, setSelectedTiles] = useState([]);
    const [startTile, setStartTile] = useState(null);
    const [tileColors, setTileColors] = useState({}); // State for tile colors
    const canvasRef = useRef(null);

    const tileWidth = 10; // Width of each tile in pixels
    const tileHeight = 10; // Height of each tile in pixels
    const numColumns = 100; // Number of columns in the canvas
    const numRows = 100; // Number of rows in the canvas

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Draw the tiles on the canvas and apply colors
        for (let y = 0; y < numRows; y++) {
            for (let x = 0; x < numColumns; x++) {
                const tileKey = `${x}-${y}`;
                const color = tileColors[tileKey] || 'blue'; // Get color from state or default to white
                ctx.fillStyle = color;
                ctx.fillRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
                ctx.strokeRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
            }
        }
    }, [tileColors]);

    const handleMouseDown = (event) => {
        const { offsetX, offsetY } = event.nativeEvent;
        const startColumn = Math.floor(offsetX / tileWidth);
        const startRow = Math.floor(offsetY / tileHeight);
        setStartTile({ column: startColumn, row: startRow });
    };

    const handleMouseMove = (event) => {
        if (!startTile) return;

        const { offsetX, offsetY } = event.nativeEvent;
        const endColumn = Math.floor(offsetX / tileWidth);
        const endRow = Math.floor(offsetY / tileHeight);

        // Get the selected tile coordinates within the rectangle
        const selected = [];
        for (let row = Math.min(startTile.row, endRow); row <= Math.max(startTile.row, endRow); row++) {
            for (let column = Math.min(startTile.column, endColumn); column <= Math.max(startTile.column, endColumn); column++) {
                selected.push({ column, row });
            }
        }

        setSelectedTiles(selected);

        // Update colors for selected tiles
        const updatedColors = { ...tileColors };
        selected.forEach((tile) => {
            const tileKey = `${tile.column}-${tile.row}`;
            updatedColors[tileKey] = 'white'; // Set color for selected tiles
        });
        setTileColors(updatedColors);
    };

    const handleMouseUp = () => {
        setStartTile(null);
    };

    return (
        <div>
            <canvas
                ref={canvasRef}
                width={1000}
                height={1000}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            />
            <div>Selected Tiles: {JSON.stringify(selectedTiles)}</div>
        </div>
    );
};

export default CanvasGame;
