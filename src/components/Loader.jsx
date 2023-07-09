import React from "react";
import { BiLoaderCircle, BiLoaderAlt } from "react-icons/bi";
const Loader = () => {
    return (
        // old loader
        <div className="absolute h-full w-full flex justify-center items-center bg-white ">
            <BiLoaderAlt className="h-52 w-[70px] animate-spin" />
        </div>
    );
};

export default Loader;
