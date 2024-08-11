"use client";
import { useUserStore } from "@/states/user-state";
import { useRouter } from "next/navigation";
import config from "@/constants/config";
import { useEffect, useState } from "react";
import Loader from "../loader/loader";

const BACKEND = config.server;

interface Props {
  children: React.ReactNode;
}

export const Protected = ({ children }: Props) => {
  const ISSERVER = typeof window === "undefined";
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [Loading, setLoading] = useState(false);
  const router = useRouter();

  const getUserData = async () => {
    if (ISSERVER) return;
    const token = localStorage.getItem("token");
    try {
      if (!token || token.length == 0) throw new Error("No token");
      setLoading(true);
      const res = await fetch(`${BACKEND}/user/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.data);
        setLoading(false);
      } else throw Error(data?.message || "Error");
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
      router.push("/auth/login");
    }
  };

  useEffect(() => {
    if (!user || user == null) {
      getUserData();
    }
  }, []);

  if (Loading) return <Loader />;
  return <>{children}</>;
};
