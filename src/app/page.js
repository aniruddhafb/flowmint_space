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
  const [nft_link, set_nft_link] = useState("");
  const [nft_cost, set_nft_cost] = useState("");
  const [file, set_file] = useState();

  const [isMintingModal, setIsMinting] = useState(false);
  const [isNFTMinting, setNFTMinting] = useState(false);

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
    renderImages();
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
    setNFTMinting(true);
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
    setNFTMinting(false);
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

  // rendering nft images
  const renderImages = () => {
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
  }

  // handling calcuating selected canvas pixels 
  const calculateSelectedCanvas = () => {

  }

  // Function to render the canvas
  const renderSelectedCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    selectedTiles.forEach((tile) => {
      const { x, y } = tile;
      ctx.fillStyle = "gold";
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    });
  };

  useEffect(() => {
    renderSelectedCanvas();
  }, [selectedTiles]);

  return (
    <>
      <Navbar userAddress={user?.addr} logIn={logIn} logOut={logOut} />

      <div style={{ backgroundColor: "#3b0087", padding: "35px 0", display: "flex", flexDirection: "column", justifyContent: 'center', alignItems: "center", overflow: "hidden" }}>

        <div>
          <canvas
            ref={canvasRef}
            onClick={handleTileClick}
            onMouseMove={handleTileDrag}
            width={1000}
            height={1000}
          />
        </div>

        {selectedTiles != "" &&
          <div style={{ marginTop: "30px" }}>
            <button
              onClick={() => setIsMinting(true)}
              className="w-full px-5 py-2 mr-4 text-sm tracking-wider text-white uppercase transition-colors duration-300 transform bg-blue-600 rounded-lg lg:w-auto hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
            >
              Mint Segment
            </button>
          </div>
        }

        {isMintingModal &&
          <>
            <div className="backdrop-blur-lg absolute w-[100%] h-[100%] z-10"></div>
            <div className="fixed py-2 overflow-hidden origin-top-right bg-[#21004b] rounded-md shadow-xl z-50" style={{ marginBottom: "180px", border: "6px solid #7000ff" }}>
              <div style={{ padding: "20px 40px" }}>
                <h3>Mint your segment</h3>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setIsMinting(false)}
                  style={{ position: "absolute", right: "5px", top: "7px" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="h-6 w-6 fill-jacarta-700 dark:fill-white"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
                  </svg>
                </button>

                <form onSubmit={mint} style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: 'center', padding: "22px 0 0 0" }}>
                  <div style={{ display: "flex", justifyContent: "row", alignItems: "center", justifyContent: "center" }}>
                    <p>Title - </p>
                    <input
                      type="text"
                      className="text-black"
                      required
                      onChange={(e) => set_nft_name(e.target.value)}
                      placeholder="eg - Steady Rocks"
                      style={{ margin: "12px 4px", padding: "4px", border: "2px solid #7000ff", outline: "none" }}
                    />
                  </div>
                  <div style={{ display: "flex", justifyContent: "row", alignItems: "center", justifyContent: "center" }}>
                    <p>Link - </p>
                    <input
                      type="text"
                      className="text-black"
                      required
                      onChange={(e) => set_nft_link(e.target.value)}
                      placeholder="eg - https://steadyrocks.com"
                      style={{ margin: "12px 4px", padding: "4px", border: "2px solid #7000ff", outline: "none" }}
                    />
                  </div>
                  <div style={{ display: "flex", justifyContent: "row", alignItems: "center", justifyContent: "center" }}>
                    <p style={{ marginRight: "6px" }}>Select Image - </p>
                    <input
                      type="file"
                      className="text"
                      required
                      onChange={(e) => set_file(e.target.files[0])}
                      style={{ margin: "12px 0", padding: "4px" }}
                    />
                  </div>
                  {isNFTMinting ?
                    <button
                      type="button"
                      className="w-full px-5 py-2 mr-4 text-sm tracking-wider text-white uppercase transition-colors duration-300 transform bg-blue-600 rounded-lg lg:w-auto hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
                      style={{ marginTop: "30px" }}
                    >
                      Minting
                      <svg
                        aria-hidden="true"
                        className="inline w-6 h-6 ml-3 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                    </button>
                    :
                    <button
                      type="submit"
                      className="w-full px-5 py-2 mr-4 text-sm tracking-wider text-white uppercase transition-colors duration-300 transform bg-blue-600 rounded-lg lg:w-auto hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
                      style={{ marginTop: "30px" }}
                    >
                      Mint Segment
                    </button>
                  }
                </form>
              </div>
            </div>
          </>
        }

      </div>

      <Footer />
    </>
  );
};

export default MainPage;
