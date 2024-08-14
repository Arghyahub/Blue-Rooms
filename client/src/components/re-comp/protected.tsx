"use client";
import { useUserStore } from "@/states/user-state";
import { useRouter } from "next/navigation";
import config from "@/constants/config";
import { useEffect, useState } from "react";
import Loader from "../loader/loader";
import { toast } from "sonner";
import useSocketStore from "@/states/socket-state";

const BACKEND = config.server as string;

interface Props {
  children: React.ReactNode;
}

export const Protected = ({ children }: Props) => {
  const ISSERVER = typeof window === "undefined";
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [Loading, setLoading] = useState(false);
  const router = useRouter();
  const joinGroup = useSocketStore((state) => state.joinGroup);

  const getUserData = async () => {
    if (ISSERVER) return;
    const token = localStorage.getItem("token");
    try {
      if (!token || token.length == 0) return;
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
        joinGroup(data.data.id);
        setLoading(false);
      } else throw Error(data?.message || "Error");
    } catch (error) {
      console.log(error);
      toast("Oops something went wrong");
      localStorage.removeItem("token");
      setUser(null);
      router.push("/auth/login");
    }
  };

  useEffect(() => {
    if (!user || user == null) {
      getUserData();
    }
    try {
      // blank call for the server to wake up
      fetch(BACKEND);
    } catch (error) {
      toast("Oops something went wrong");
    }
  }, []);

  if (Loading) return <Loader />;
  else return <>{children}</>;
};
