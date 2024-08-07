"use client";
import { useSelectedChatStore } from "@/states/chat-state";
import React, { useEffect } from "react";
import GroupNotSelected from "./group-not-selected";
import MiniLoader from "@/components/loader/mini-loader";
import config from "@/constants/config";

const BACKEND = config.server;

type Props = {};

const ChatPanel = (props: Props) => {
  const SelectedChat = useSelectedChatStore((state) => state.SelectedChat);
  const setSelectedChat = useSelectedChatStore(
    (state) => state.setSelectedChat
  );

  const fetchChat = async () => {
    if (!SelectedChat) return;
    if (SelectedChat && SelectedChat.chat) return;
    try {
      const res = await fetch(`${BACKEND}/`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (SelectedChat && !SelectedChat.chat) {
      // setSelectedChat({...SelectedChat});
    }
  }, [SelectedChat]);

  if (SelectedChat && !SelectedChat.chat)
    return (
      <div className="flex justify-center items-center w-full h-full">
        <MiniLoader />
      </div>
    );

  return (
    <div className="w-full h-full">
      {SelectedChat ? (
        <div className="flex flex-col w-full h-full">Chat</div>
      ) : (
        <GroupNotSelected />
      )}
    </div>
  );
};

export default ChatPanel;
