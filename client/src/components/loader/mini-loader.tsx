import React from "react";
import miniLoaderSvg from "./mini-loader.svg";
import Image from "next/image";

type Props = {};

const MiniLoader = (props: Props) => {
  return (
    <>
      <Image src={miniLoaderSvg} height={100} width={100} alt="loader" />
    </>
  );
};

export default MiniLoader;
