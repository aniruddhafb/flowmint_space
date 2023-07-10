import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import defaultAvatar from "../../public/avatar.png";
import webLogo from "../../public/whitefav.png";

const Navbar = ({ userAddress, logIn, logOut }) => {

    const [showProfile, SetShowProfile] = useState(false);
    const [myNFTs, setMyNFTs] = useState(false);
    const [navDropDown, setnavDropDown] = useState(true);

    return (
        <nav
            x-data="{ isOpen: false }"
            className="relative bg-[#21004b] shadow"
        >
            <div className="container px-6 py-4 mx-auto">
                <div className="lg:flex lg:items-center lg:justify-between">
                    <div className="flex items-center justify-between text-center">
                        <Link href="/" className="flex flex-row justify-center align-middle">
                            <Image src={webLogo} height={100} width={100} />
                        </Link>

                        {/* action button  */}
                        <div className="flex lg:hidden">
                            <button
                                type="button"
                                className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400"
                                aria-label="toggle menu"
                            >
                                <svg
                                    x-show="!isOpen"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-6 h-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    onClick={() => {
                                        setnavDropDown(!navDropDown);
                                    }}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 8h16M4 16h16"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col -mx-6 lg:flex-row lg:items-center lg:mx-8">
                        <h4 className="px-3 py-2 mx-3 mt-2 text-gray-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-gray-200">
                            $1 per pixel . Own a piece of web3 history!
                        </h4>
                    </div>

                    {/* navbar drop down  */}
                    {navDropDown ? (
                        <div className="absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-[#21004b] lg:mt-0 lg:p-0 lg:top-0 lg:relative lg:bg-transparent lg:w-auto lg:opacity-100 lg:translate-x-0 lg:flex lg:items-center">


                            {userAddress ? (
                                <div className="flex flex-row">
                                    <div className="relative flex items-center mt-4 lg:mt-0">
                                        {/* profile button  */}
                                        <button
                                            type="button"
                                            className="flex items-center focus:outline-none"
                                            aria-label="toggle profile dropdown"
                                            onClick={() => SetShowProfile(!showProfile)}
                                        >
                                            <div className="w-8 h-8 overflow-hidden border-2 border-gray-400 rounded-full object-cover">
                                                <Image
                                                    src={defaultAvatar}
                                                    height={100}
                                                    width={100}
                                                    alt="avatar"
                                                    style={{
                                                        borderRadius: "50%",
                                                        width: "40px",
                                                        height: "33px",
                                                    }}
                                                />
                                            </div>
                                        </button>

                                        {showProfile && (
                                            <div className="absolute left-[5%] top-11 w-56 py-2 mt-3 overflow-hidden origin-top-right bg-[#21004b] rounded-md shadow-xl">
                                                <a
                                                    href="#"
                                                    rel="noreferrer"
                                                    className="flex items-center p-3 -mt-2 text-sm text-gray-600 transition-colors duration-300 transform"
                                                >
                                                    <Image
                                                        src={defaultAvatar}
                                                        height={80}
                                                        width={40}
                                                        alt="avatar"
                                                        style={{
                                                            borderRadius: "50%",
                                                            width: "35px",
                                                            height: "33px",
                                                            marginRight: "10px"
                                                        }}
                                                    />
                                                    <div className="mx-1">
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {userAddress.slice(0, 5) +
                                                                "..." +
                                                                userAddress.slice(16)}
                                                        </p>
                                                    </div>
                                                </a>
                                                <Link
                                                    href="#"
                                                    onClick={() => (setMyNFTs(true), SetShowProfile(false))}
                                                    className="flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300"
                                                >
                                                    <svg
                                                        className="w-5 h-5 mx-1"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M21 19H3C1.89543 19 1 18.1046 1 17V16H3V7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89543 21 7V16H23V17C23 18.1046 22.1046 19 21 19ZM5 7V16H19V7H5Z"
                                                            fill="currentColor"
                                                        ></path>
                                                    </svg>

                                                    <span className="mx-1">My Segments</span>
                                                </Link>
                                                <hr className="border-gray-200 dark:border-gray-700 " />
                                                <a
                                                    href="#"
                                                    onClick={logOut}
                                                    rel="noreferrer"
                                                    className="flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 "
                                                >
                                                    <svg
                                                        className="w-5 h-5 mx-1"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M19 21H10C8.89543 21 8 20.1046 8 19V15H10V19H19V5H10V9H8V5C8 3.89543 8.89543 3 10 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21ZM12 16V13H3V11H12V8L17 12L12 16Z"
                                                            fill="currentColor"
                                                        ></path>
                                                    </svg>

                                                    <span className="mx-1">Sign Out</span>
                                                </a>
                                            </div>
                                        )}
                                        {myNFTs && (
                                            <div style={{ height: "80vh", width: "400px" }} className="absolute top-11 w-56 py-2 mt-3 overflow-hidden origin-top-right bg-[#21004b] rounded-md shadow-xl">
                                                <button
                                                    type="button"
                                                    className="btn-close"
                                                    data-bs-dismiss="modal"
                                                    aria-label="Close"
                                                    onClick={() => (SetShowProfile(false), setMyNFTs(false))}
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
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center mt-4 lg:mt-0">
                                    <button
                                        onClick={logIn}
                                        className="w-full px-5 py-2 mr-4 text-sm tracking-wider text-white uppercase transition-colors duration-300 transform bg-blue-600 rounded-lg lg:w-auto hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
                                    >
                                        Connect Wallet
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
