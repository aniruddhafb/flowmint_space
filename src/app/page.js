"use client";
import React, { useEffect, useRef, useState } from "react";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import { ThirdwebStorage } from "@thirdweb-dev/storage";

import { mintNFT } from "../../cadence/transactions/mint_nfts.js";
import { setupUserTx } from "../../cadence/transactions/setup_user.js";

import { getNFTs } from "../../cadence/scripts/get_nfts.js";
import Footer from "@/components/Footer.jsx";
import Navbar from "@/components/Navbar.jsx";

const MainPage = () => {
  const storage = new ThirdwebStorage();

  const [user, set_user] = useState();
  const [nft_name, set_nft_name] = useState("");
  const [file, set_file] = useState();
  const [selected_pixels, set_selected_pixels] = useState();

  const canvasRef = useRef(null);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const tileSize = 10;

  fcl
    .config()
    .put("accessNode.api", " https://rest-testnet.onflow.org")
    .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn");

  // login 
  const logIn = () => {
    fcl.authenticate();
  };

  // logout 
  const logOut = () => {
    fcl.unauthenticate();
  };

  //sets user to logged in user
  useEffect(() => {
    fcl.currentUser().subscribe(set_user);
  }, []);

  // getting nfts 
  useEffect(() => {
    if (!user?.addr) return;
    getUserNFTs();
  }, [user?.addr]);

  // getting all users nfts 
  const getUserNFTs = async () => {
    const result = await fcl
      .send([
        fcl.script(getNFTs),
        fcl.args([fcl.arg("0xae768da09c4cec20", t.Address)]),
      ])
      .then(fcl.decode);
    console.log({ result });
  };

  const setupUser = async () => {
    const txn_id = await fcl
      .send([
        fcl.transaction(setupUserTx),
        fcl.args([]),
        fcl.payer(fcl.authz),
        fcl.proposer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(9999),
      ])
      .then(fcl.decode);

    console.log(txn_id);

    return fcl.tx(txn_id).onceSealed();
  };


  // minting nft segment 
  const mint = async () => {
    try {
      const ipfs_hash = await storage.upload(file);
      const nft_data = JSON.stringify({
        ipfs_hash,
        nft_name,
        selectedTiles,
      });

      // const added = await client.add(file);
      // const hash = added.path;
      // console.log(hash);

      const txn_id = await fcl
        .send([
          fcl.transaction(mintNFT),
          fcl.args([fcl.arg(ipfs_hash, t.String), fcl.arg(nft_data, t.String)]),
          fcl.payer(fcl.authz),
          fcl.proposer(fcl.authz),
          fcl.authorizations([fcl.authz]),
          fcl.limit(9999),
        ])
        .then(fcl.decode);

      console.log(txn_id);
      getUserNFTs();
      return fcl.tx(txn_id).onceSealed();
    } catch (error) {
      console.log("Error uploading image to ipfs");
    }
  };

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
    console.log({ clickSelect: selectedTiles });
    set_selected_pixels(selectedTiles);
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
      console.log({ dragSelect: selectedTiles });
    }
  };

  // Function to render the canvas and fetch images
  const renderCanvas = () => {
    // rendering image
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const images = [
      { src: "../logo_bg.png", x: 25, y: 10 },
      { src: "../logo_bg.png", x: 91, y: 70 },
    ];

    // Set the desired width and height for each image
    const imageWidth = 50;
    const imageHeight = 50;

    // Loop through the images array and load each image
    images.forEach((imageData) => {
      const imageObj = new Image();
      imageObj.src = imageData.src;

      imageObj.onload = () => {
        ctx.drawImage(
          imageObj,
          imageData.x * 10,
          imageData.y * 10,
          imageWidth,
          imageHeight
        );
      };
    });

    // to show selected tiles color
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    selectedTiles.forEach((tile) => {
      const { x, y } = tile;
      ctx.fillStyle = "#00ef8b";
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    });
  };

  useEffect(() => {
    renderCanvas();
  }, [selectedTiles]);

  return (
    <>
      <Navbar userAddress={user?.addr} logIn={logIn} logOut={logOut} />

      {/* <div>
        <div>
          <input
            type="text"
            className="text-black"
            onChange={(e) => set_nft_name(e.target.value)}
          />
          <input
            type="file"
            className="text"
            onChange={(e) => set_file(e.target.files[0])}
          />
          <button onClick={() => mint()}>Mint</button>
        </div>
        <div>all nfts </div>
      </div> */}

      <div style={{ backgroundColor: "black" }}>
        <canvas
          ref={canvasRef}
          onClick={handleTileClick}
          onMouseMove={handleTileDrag}
          width={1000}
          height={1000}
        />
      </div>

      <Footer />
    </>
  );
};

export default MainPage;
