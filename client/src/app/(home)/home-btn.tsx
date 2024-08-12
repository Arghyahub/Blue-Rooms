"use client";
import config from "@/constants/config";
import { UserType } from "@/states/user-state";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const BACKEND = config.server as string;

const HomeBtn = () => {
  const ISSERVER = typeof window === "undefined";
  const [Data, setData] = useState<null | UserType>(null);

  const getUserData = async () => {
    if (ISSERVER) return;
    const token = localStorage.getItem("token");
    try {
      if (!token || token.length == 0) throw new Error("No token");
      const res = await fetch(`${BACKEND}/user/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) setData(data.data);
      else throw Error(data?.message || "Server error");
    } catch (error) {
      localStorage.removeItem("token");
      setData(null);
    }
  };

  useEffect(() => {
    getUserData();
    try {
      // blank call for the server to wake up
      fetch(BACKEND);
    } catch (error) {}
  }, []);
  return (
    <>
      {Data ? (
        <Link
          href={"/chat"}
          className="inline-block justify-center bg-cyan-500 p-2 rounded-md w-auto text-white"
        >
          Chat Now{" "}
          <span className="font-semibold text-lg text-slate-100">
            @{Data.name}
          </span>
        </Link>
      ) : (
        <div className="flex flex-row gap-3 text-cyan-500">
          <Link href={"/auth/signup"}>Signup</Link>
          <Link href={"/auth/login"}>Login</Link>
        </div>
      )}
    </>
  );
};

export default HomeBtn;
