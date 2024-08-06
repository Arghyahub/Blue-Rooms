import React from "react";
import favicon from "@/app/favicon.ico";
import Image from "next/image";
import Link from "next/link";
import NavDropdownMenu from "./navdrop-down";

type Props = {};

const Navbar = (props: Props) => {
  return (
    <div className="flex flex-row justify-between items-center border-slate-400 px-4 py-4 border-b-2 w-full">
      {/* Logo */}
      <Link href={"/"} className="flex flex-row items-center gap-2">
        <Image src={favicon} alt="logo" />
        <p className="font-medium font-sans text-xl">Airchat</p>
      </Link>

      {/* Right menu */}
      <div className="flex flex-row gap-4">
        <NavDropdownMenu />
      </div>
    </div>
  );
};

export default Navbar;
