import React from "react";
import Spinner from "./spinner.svg";
import Image from "next/image";

const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-black opacity-80 w-full h-screen">
      <Image src={Spinner} alt="Loading" height={100} width={100} />
      <p className="mt-4 ml-2 text-white text-xl">Loading...</p>
    </div>
  );
};

export default Loader;
