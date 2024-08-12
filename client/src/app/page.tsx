import Image from "next/image";
import Link from "next/link";
import favicon from "./favicon.ico";
import HomeBtn from "./(home)/home-btn";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Navbar here */}
      <div className="flex flex-row justify-between items-center px-3 py-4 border-b-2 w-full">
        {/* Logo */}
        <div className="flex flex-row items-center gap-2">
          <Image src={favicon} alt="logo" />
          <p className="font-medium font-sans text-xl">Airchat</p>
        </div>
        {/* buttons and options */}
        <div className="flex flex-row gap-4 text-cyan-600">
          <Link href={"/auth/signup"}>Signup</Link>
          <Link href={"/auth/login"}>Login</Link>
        </div>
      </div>

      {/* Main body */}
      <div className="flex xs:flex-row flex-col justify-center items-center px-2 w-full h-[80vh] xs:h-[90vh]">
        <div className="flex xs:hidden">
          <Image
            alt="background"
            width={600}
            height={400}
            src={"/svgs/background.jpg"}
            className="w-auto"
          />
        </div>
        <div className="flex flex-col gap-5 max-w-60">
          <h2 className="font-medium text-2xl xs:text-3xl">
            Connecting people using{" "}
            <span className="font-semibold text-cyan-600">Airchat</span>
          </h2>
          <HomeBtn />
        </div>
        <div className="xs:flex hidden">
          <Image
            alt="background"
            width={600}
            height={400}
            src={"/svgs/background.jpg"}
            className="w-auto"
          />
        </div>
      </div>
    </div>
  );
}
