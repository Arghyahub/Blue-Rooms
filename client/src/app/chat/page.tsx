"use client";
import Navbar from "@/components/navbar/navbar";
import React, { useEffect, useState } from "react";
import NameList from "./(nameList)/name-list";
import ChatPanel from "./(chat-panel)/chat-panel";
import { cn } from "@/lib/utils";
import { Protected } from "@/components/re-comp/protected";
import {
  GroupsType,
  useChatStore,
  useSelectedChatStore,
} from "@/states/chat-state";
import config from "@/constants/config";
import Loader from "@/components/loader/loader";
import { usePathname, useRouter } from "next/navigation";

const BACKEND = config.server;

const ChatDashboard = () => {
  // const [SelectedChat, setSelectedChat] = useState<null | GroupsType>(null);
  const SelectedChat = useSelectedChatStore((state) => state.SelectedChat);
  const setSelectedChat = useSelectedChatStore(
    (state) => state.setSelectedChat
  );
  const groups = useChatStore((state) => state.groups);
  const setGroups = useChatStore((state) => state.setGroups);
  const [Loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  const fetchGroups = async () => {
    if (!localStorage.getItem("token")) return;
    try {
      const res = await fetch(`${BACKEND}/group/get-all-groups`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        // cache: "no-store",
      });
      const { data }: { data: GroupsType[] } = await res.json();
      setGroups(data);
    } catch (error) {
      console.log(error);
    }
  };

  const starter = async () => {
    // setGroups(null);
    // setSelectedChat(null);
    setLoading(true);
    await fetchGroups();
    setLoading(false);
  };
  useEffect(() => {
    starter();
  }, []);
  // useEffect(() => {
  //   starter();
  // }, [pathname]);

  if (groups == null) return <Loader />;
  return (
    <Protected>
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex flex-row w-full h-full">
          <div
            className={cn(
              "h-full",
              SelectedChat == null
                ? "md:w-1/4 w-full"
                : "md:w-1/4 md:flex hidden"
            )}
          >
            <NameList />
          </div>
          <div
            className={cn(
              "w-3/4 h-full",
              SelectedChat == null
                ? "md:w-3/4 md:flex hidden"
                : "md:w-3/4 w-full"
            )}
          >
            <ChatPanel />
          </div>
        </div>
      </div>
    </Protected>
  );
};

export default ChatDashboard;
