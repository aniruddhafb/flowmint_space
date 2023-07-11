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
import axios from "axios";
// import Image from "next/image.js";
import defaultAvatar from "../../public/avatar.png";

const MainPage = () => {
  const storage = new ThirdwebStorage();
  const [user, set_user] = useState();
  const [nft_name, set_nft_name] = useState("");
  const [nft_link, set_nft_link] = useState("");
  const [nft_cost, set_nft_cost] = useState("");
  const [nft_iniNFTCord, set_IniNFTCord] = useState("");
  const [nftHeight, set_nftHeight] = useState("");
  const [nftWidth, set_nftWidth] = useState("");
  const [file, set_file] = useState();

  const [isMintingModal, setIsMinting] = useState(false);
  const [isNFTMinting, setNFTMinting] = useState(false);
  const [myNFTs, setMyNFTs] = useState(false);

  const canvasRef = useRef(null);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [allWalletNFTs, setAllWalletNFTs] = useState([]);
  const [allContractNFTs, setContractNFTs] = useState([]);
  const [startTile, setStartTile] = useState(null);
  const [tileColors, setTileColors] = useState({});
  const tileSize = 10;
  const numColumns = 100;
  const numRows = 100;

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

  // updating the canvas frequently on select
  useEffect(() => {
    renderImages();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    for (let y = 0; y < numRows; y++) {
      for (let x = 0; x < numColumns; x++) {
        const tileKey = `${x}-${y}`;
        const color = tileColors[tileKey] || "#21004b";
        ctx.fillStyle = color;
        ctx.strokeStyle = "#7000ff";
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }
  }, [tileColors]);


  // getting nfts and rendering it initially
  useEffect(() => {
    // getUserNFTs();
    renderImages();
  }, [user?.addr]);

  // getting all users nfts from wallet
  const getUserNFTs = async () => {
    if (!user?.addr) return;
    const result = await fcl
      .send([fcl.script(getNFTs), fcl.args([fcl.arg(user?.addr, t.Address)])])
      .then(fcl.decode);
    setAllWalletNFTs(result);
    renderImages();
  };

  // setting up a collection for user
  const setupUser = async () => {
    const transactionId = await fcl
      .send([
        fcl.transaction(setupUserTx),
        fcl.args([]),
        fcl.payer(fcl.authz),
        fcl.proposer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(9999),
      ])
      .then(fcl.decode);

    return fcl.tx(transactionId).onceSealed();
  };

  // minting nft segment
  const mint = async () => {
    setNFTMinting(true);
    try {
      const ipfs_hash = await storage.upload(file);
      const nft_data = JSON.stringify({
        ipfs_hash,
        nft_name,
        nft_link,
        selectedTiles,
        nft_iniNFTCord,
        nftHeight,
        nftWidth,
      });

      const txn_id = await fcl
        .send([
          fcl.transaction(mintNFT),
          fcl.args([
            fcl.arg(ipfs_hash, t.String),
            fcl.arg(nft_data, t.String),
            fcl.arg(JSON.stringify(selectedTiles), t.String),
          ]),
          fcl.payer(fcl.authz),
          fcl.proposer(fcl.authz),
          fcl.authorizations([fcl.authz]),
          fcl.limit(9999),
        ])
        .then(fcl.decode);

      const save_nft = await axios({
        url: "/api/nft",
        method: "POST",
        data: {
          metadata: nft_data,
        },
      });

      const save_coordinate = await axios({
        url: "/api/coordinates",
        method: "POST",
        data: {
          new_coordinate: JSON.stringify(selectedTiles),
        },
      });

      setTimeout(() => {
        window.location.reload();
      }, 1000);
      return fcl.tx(txn_id).onceSealed();
    } catch (error) {
      console.log(error.message);
    }
  };

  // rendering nft images and fetching
  const renderImages = async () => {
    if (!user?.addr) return;
    // fetching nfts from wallet later do it from collection
    const result = await fcl
      .send([fcl.script(getNFTs), fcl.args([fcl.arg(user?.addr, t.Address)])])
      .then(fcl.decode);
    setAllWalletNFTs(result);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Loop through the images array and load each image
    result.forEach((e) => {
      const nft_info = JSON.parse(e.metadata.name);
      const imageObj = new Image();
      imageObj.src = nft_info.ipfs_hash.replace(
        "ipfs://",
        "https://ipfs.io/ipfs/"
      );

      imageObj.onload = () => {
        ctx.drawImage(
          imageObj,
          nft_info.nft_iniNFTCord.row * 10,
          nft_info.nft_iniNFTCord.column * 10,
          nft_info.nftWidth,
          nft_info.nftHeight
        );
      };
    });
  };

  // when mouse cursor is triggered
  const handleMouseDown = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    const startColumn = Math.floor(offsetX / tileSize);
    const startRow = Math.floor(offsetY / tileSize);
    setStartTile({ column: startColumn, row: startRow });
    setTileColors({});
  };

  // when mouse cursor moves
  const handleMouseMove = (event) => {
    if (!startTile) return;

    const { offsetX, offsetY } = event.nativeEvent;
    const endColumn = Math.floor(offsetX / tileSize);
    const endRow = Math.floor(offsetY / tileSize);

    const selected = [];
    for (
      let row = Math.min(startTile.row, endRow);
      row <= Math.max(startTile.row, endRow);
      row++
    ) {
      for (
        let column = Math.min(startTile.column, endColumn);
        column <= Math.max(startTile.column, endColumn);
        column++
      ) {
        selected.push({ column, row });
      }
    }

    // shravan change
    let lowest_col;
    let lowest_row;
    let new_arr = [];
    for (let i = 0; i < selected.length; i++) {
      lowest_col =
        selected[i]["column"] > selected[i]["column"] + 1
          ? selected[i]["column"] + 1
          : selected[i]["column"];
      lowest_row =
        selected[i]["row"] > selected[i]["row"] + 1
          ? selected[i]["row"] + 1
          : selected[i]["row"];

      new_arr.push({ column: lowest_col, row: lowest_row });
    }
    console.log(new_arr);

    setSelectedTiles(selected);
    const uniqueColumnsY = [...new Set(selected.map((q) => q.row))];
    const uniqueRowsX = [...new Set(selected.map((q) => q.column))];

    // data to take in metadata
    set_IniNFTCord(selectedTiles[0]);

    set_nftHeight(uniqueColumnsY.length * 10);

    set_nftWidth(uniqueRowsX.length * 10);

    if (selectedTiles.length > 100) {
      const updatedColors = {};
      selected.forEach((tile) => {
        const tileKey = `${tile.column}-${tile.row}`;
        updatedColors[tileKey] = "red";
      });
      setTileColors(updatedColors);
    } else {
      const updatedColors = {};
      selected.forEach((tile) => {
        const tileKey = `${tile.column}-${tile.row}`;
        updatedColors[tileKey] = "gold";
      });
      setTileColors(updatedColors);
    }
  };

  // when mouse cursor is released
  const handleMouseUp = () => {
    setStartTile(null);
    if (selectedTiles.length > 100) {
      setTileColors({});
      setSelectedTiles([]);
    }
  };

  return (
    <>
      <Navbar
        userAddress={user?.addr}
        logIn={logIn}
        logOut={logOut}
        setMyNFTs={setMyNFTs}
        myNFTs={myNFTs}
      />
      {/* <button onClick={setupUser}>setup user</button> */}

      <div
        style={{
          backgroundColor: "#3b0087",
          padding: "35px 0",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <div>
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            width={1000}
            height={1000}
          />
        </div>

        {myNFTs && (
          <div
            style={{
              height: "91vh",
              width: "400px",
              border: "2px solid #7000ff",
            }}
            className="fixed right-0 top-[60px] py-2 mt-3 overflow-hidden origin-top-right bg-[#21004b] shadow-xl z-20"
          >
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => setMyNFTs(false)}
              style={{ position: "absolute", right: "5px" }}
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

            <div className="max-w-sm rounded overflow-hidden shadow-2xl">
              <img className="w-[100%] h-[200px] p-[10px]" src="avatar.png" height={100} width={100} />
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">The Coldest Sunset</div>
                <p className="text-gray-400 text-base">
                  block.com
                </p>
              </div>
              <div className="px-6 pt-4 pb-2">
                <a href="#" target="_blank">
                  <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">View on explorer 🡥</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {selectedTiles != "" && (
          <div style={{ marginTop: "30px" }}>
            <button
              onClick={() => {
                setIsMinting(true);
              }}
              className="w-full px-5 py-2 mr-4 text-sm tracking-wider text-white uppercase transition-colors duration-300 transform bg-blue-600 rounded-lg lg:w-auto hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
            >
              Mint Segment
            </button>
          </div>
        )}

        {isMintingModal && (
          <>
            <div className="backdrop-blur-lg fixed w-[100%] h-[200%] z-10"></div>
            <div
              className="fixed py-2 overflow-hidden origin-top-right bg-[#21004b] rounded-md shadow-xl z-50"
              id="transformMod"
              style={{ border: "6px solid #7000ff" }}
            >
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

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    mint();
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "22px 0 0 0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <p>Title - </p>
                    <input
                      type="text"
                      className="text-black"
                      required
                      onChange={(e) => set_nft_name(e.target.value)}
                      placeholder="eg - Steady Rocks"
                      style={{
                        margin: "12px 4px",
                        padding: "4px",
                        border: "2px solid #7000ff",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <p>Link - </p>
                    <input
                      type="text"
                      className="text-black"
                      required
                      onChange={(e) => set_nft_link(e.target.value)}
                      placeholder="eg - https://steadyrocks.com"
                      style={{
                        margin: "12px 4px",
                        padding: "4px",
                        border: "2px solid #7000ff",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <p style={{ marginRight: "6px" }}>Select Image - </p>
                    <input
                      type="file"
                      className="text"
                      required
                      onChange={(e) => set_file(e.target.files[0])}
                      style={{ margin: "12px 0", padding: "4px" }}
                    />
                  </div>
                  {isNFTMinting ? (
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
                  ) : (
                    <button
                      type="submit"
                      className="w-full px-5 py-2 mr-4 text-sm tracking-wider text-white uppercase transition-colors duration-300 transform bg-blue-600 rounded-lg lg:w-auto hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
                      style={{ marginTop: "30px" }}
                    >
                      Mint Segment
                    </button>
                  )}
                </form>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
};

export default MainPage;
