"use client";
import {
  GroupsType,
  useChatStore,
  useSelectedChatStore,
} from "@/states/chat-state";
import React, { useEffect } from "react";
import GroupNotSelected from "./group-not-selected";
import MiniLoader from "@/components/loader/mini-loader";
import config from "@/constants/config";
import { ArrowLeft, Send } from "lucide-react";
import Image from "next/image";
import { UserType, useUserStore } from "@/states/user-state";
import { resolveDP, resolveName } from "@/utils/group-utils";

const BACKEND = config.server;

type Props = {};

interface SendChatEvent {
  target: {
    message: HTMLInputElement;
  };
}

const ChatPanel = (props: Props) => {
  const SelectedChat = useSelectedChatStore((state) => state.SelectedChat);
  const setSelectedChat = useSelectedChatStore(
    (state) => state.setSelectedChat
  );
  const groups = useChatStore((state) => state.groups);
  const setGroups = useChatStore((state) => state.setGroups);
  const user = useUserStore((state) => state.user);

  const fetchChat = async () => {
    if (!SelectedChat) return;
    if (SelectedChat && SelectedChat.chat) return;
    console.log(SelectedChat);
    try {
      const res = await fetch(`${BACKEND}/chat/${SelectedChat.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      console.log(data.data);
      if (res.ok) {
        setSelectedChat({ ...SelectedChat, chat: data.data });
        const cpyGroup = groups?.map((group) => {
          if (group.id === SelectedChat.id) {
            return { ...group, chat: data.data };
          }
          return group;
        }) as GroupsType[];

        setGroups(cpyGroup);
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendChat = async (
    e: React.FormEvent<HTMLFormElement> & SendChatEvent
  ) => {
    e.preventDefault();
    const message = e.target.message.value;
    e.target.message.value = "";
    // console.log(message);
  };

  useEffect(() => {
    fetchChat();
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
        <div className="flex flex-col w-full h-full">
          {/* Chat Bar */}
          <div className="flex flex-row items-center gap-2 bg-cyan-700 px-2 py-2">
            <button onClick={() => setSelectedChat(null)} className="px-1">
              <ArrowLeft />
            </button>
            <Image
              src={resolveDP(SelectedChat, user as UserType)}
              height={35}
              width={35}
              alt="DP"
              className="rounded-full"
            />
            <p className="font-medium text-cyan-50 text-lg">
              {resolveName(SelectedChat, user as UserType)}
            </p>
          </div>
          {/* Chats section */}
          <div className="flex flex-col gap-3 w-full h-full overflow-y-auto">
            {SelectedChat.chat?.map((chat) => (
              <div key={chat.id} className="flex flex-col gap-1">
                <p>{chat.user.name}</p>
                <p>{chat.content}</p>
              </div>
            ))}
          </div>
          {/* Send Chat Section */}
          <form
            onSubmit={handleSendChat}
            className="flex flex-row gap-2 p-4 pb-3"
          >
            <input
              type="text"
              name="message"
              className="border-slate-700 px-2 py-1 border rounded-md ring-0 w-full outline-none"
            />
            <button className="bg-cyan-600 p-2 rounded-md text-white">
              <Send />
            </button>
          </form>
        </div>
      ) : (
        <GroupNotSelected />
      )}
    </div>
  );
};

export default ChatPanel;
