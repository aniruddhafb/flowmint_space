'use client'
import React, { useEffect, useRef, useState } from 'react';

const GameComponent = () => {
  const canvasRef = useRef(null);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const tileSize = 10;

  // Function to handle tile selection
  const handleTileClick = (event) => {
    const tileX = Math.floor(event.nativeEvent.offsetX / tileSize);
    const tileY = Math.floor(event.nativeEvent.offsetY / tileSize);

    const isTileSelected = selectedTiles.some(
      (tile) => tile.x === tileX && tile.y === tileY
    );

    if (!isTileSelected) {
      setSelectedTiles([...selectedTiles, { x: tileX, y: tileY }]);
    }
    console.log({ clickSelect: selectedTiles })

  };

  // Function to handle dragging and selecting multiple tiles
  const handleTileDrag = (event) => {
    if (event.buttons === 1) {
      const tileX = Math.floor(event.nativeEvent.offsetX / tileSize);
      const tileY = Math.floor(event.nativeEvent.offsetY / tileSize);

      // Checking if the dragged tile is already selected
      const isTileSelected = selectedTiles.some(
        (tile) => tile.x === tileX && tile.y === tileY
      );

      // If the tile is not already selected, add it to the selectedTiles array
      if (!isTileSelected) {
        setSelectedTiles([...selectedTiles, { x: tileX, y: tileY }]);
      }
      console.log({ dragSelect: selectedTiles })
    }
  };

  // Function to render the canvas and fetch images 
  const renderCanvas = () => {
    // rendering image 
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const images = [
      { src: "../logo_bg.png", x: 25, y: 10 },
      { src: "../logo_bg.png", x: 91, y: 70 }
    ];

    // Set the desired width and height for each image
    const imageWidth = 50;
    const imageHeight = 50;

    // Loop through the images array and load each image
    images.forEach((imageData) => {
      const imageObj = new Image();
      imageObj.src = imageData.src;

      imageObj.onload = () => {
        ctx.drawImage(imageObj, imageData.x * 10, imageData.y * 10, imageWidth, imageHeight);
      };
    });


    // to show selected tiles color 
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    selectedTiles.forEach((tile) => {
      const { x, y } = tile;
      ctx.fillStyle = 'gold';
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    });
  };

  useEffect(() => {
    renderCanvas();
  }, [selectedTiles]);


  return (
    <div style={{ backgroundColor: "black" }}>
      <canvas ref={canvasRef} onClick={handleTileClick} onMouseMove={handleTileDrag} width={1000} height={1000} />
    </div>
  );
};

export default GameComponent;
