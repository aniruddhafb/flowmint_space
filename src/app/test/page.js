"use client";
import React, { useState, useRef, useEffect } from 'react';

const CanvasGame = () => {
    const [selectedTiles, setSelectedTiles] = useState([]);
    const [startTile, setStartTile] = useState(null);
    const [tileColors, setTileColors] = useState({});
    const canvasRef = useRef(null);

    const tileWidth = 10; // Width of each tile in pixels
    const tileHeight = 10; // Height of each tile in pixels
    const numColumns = 100; // Number of columns in the canvas
    const numRows = 100; // Number of rows in the canvas


    // coloring the canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Draw the tiles on the canvas and apply colors
        for (let y = 0; y < numRows; y++) {
            for (let x = 0; x < numColumns; x++) {
                const tileKey = `${x}-${y}`;
                const color = tileColors[tileKey] || 'blue';
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
        setTileColors({});
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
        const uniqueColumnsY = [...new Set(selected.map(q => q.row))];
        const uniqueRowsX = [...new Set(selected.map(q => q.column))];

        console.log({ startTile: selectedTiles[0] })
        console.log({ EndTile: selectedTiles[selectedTiles.length - 1] })
        console.log({ SelectedHeightY: uniqueColumnsY.length * 10 })
        console.log({ SelectedWidthX: uniqueRowsX.length * 10 })


        if (selectedTiles.length > 100) {
            const updatedColors = {};
            selected.forEach((tile) => {
                const tileKey = `${tile.column}-${tile.row}`;
                updatedColors[tileKey] = 'red';
            });
            setTileColors(updatedColors);
        }
        else {
            // Update colors for selected tiles
            const updatedColors = {};
            selected.forEach((tile) => {
                const tileKey = `${tile.column}-${tile.row}`;
                updatedColors[tileKey] = 'white';
            });
            setTileColors(updatedColors);
        }
    };

    const handleMouseUp = () => {
        setStartTile(null);
        if (selectedTiles.length > 100) {
            setTileColors({});
            setSelectedTiles([]);
        }
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
            {selectedTiles.length}
            <div>Selected Tiles: {JSON.stringify(selectedTiles)}</div>
        </div>
    );
};

export default CanvasGame;
