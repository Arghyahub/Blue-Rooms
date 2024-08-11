"use client";
import {
  GroupsType,
  useChatStore,
  useSelectedChatStore,
} from "@/states/chat-state";
import React, { useEffect, useRef } from "react";
import GroupNotSelected from "./group-not-selected";
import MiniLoader from "@/components/loader/mini-loader";
import config from "@/constants/config";
import { ArrowLeft, Send } from "lucide-react";
import Image from "next/image";
import { UserType, useUserStore } from "@/states/user-state";
import { resolveDP, resolveName } from "@/utils/group-utils";
import useSocketStore from "@/states/socket-state";
import { cn } from "@/lib/utils";

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

  const socket = useSocketStore((state) => state.socket);
  const chatsDiv = useRef<HTMLDivElement>(null);

  const fetchChat = async () => {
    if (!SelectedChat) return;
    if (SelectedChat && SelectedChat.chat) return;
    // console.log(SelectedChat);
    try {
      const res = await fetch(`${BACKEND}/chat/${SelectedChat.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      // console.log(data.data);
      if (res.ok) {
        // Set current open chat
        setSelectedChat({ ...SelectedChat, chat: data.data });
        const cpyGroup = groups?.map((group) => {
          if (group.id === SelectedChat.id) {
            return { ...group, chat: data.data };
          }
          return group;
        }) as GroupsType[];

        // Update entire groups object
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

    if (SelectedChat && user) {
      const cpySelectedChat = { ...SelectedChat };
      const currTime = new Date().toISOString();
      cpySelectedChat.chat?.push({
        content: message,
        createdAt: currTime,
        group_id: cpySelectedChat.id,
        id: Math.random(),
        updatedAt: currTime,
        user: { id: user?.id, name: user?.name },
        user_id: user.id,
      });

      setSelectedChat(cpySelectedChat);
    }

    try {
      socket.emit("message", SelectedChat?.id, user?.id, user?.name, message);
      // db call
      const res = await fetch(`${BACKEND}/chat/post-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          group_id: SelectedChat?.id,
          message,
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchChat();
  }, [SelectedChat]);

  useEffect(() => {
    chatsDiv.current?.scrollTo(0, chatsDiv.current.scrollHeight);
    socket.on("receive-message", (groupId, senderId, senderName, message) => {
      // alert(message);
      if (!groups) return;
      const findGroup = groups.find((group) => group.id === groupId);
      if (!findGroup) return;
      const cpyGroups = groups.filter((group) => group.id !== groupId);
      const currTime = new Date().toISOString();

      //1.  If Group.chat is not fetched, just put the group to the top
      if (findGroup.chat === undefined) {
        cpyGroups.unshift(findGroup);
        return;
      }

      //2. If fetched put the group to the top and also insert the chat at the bottom of Group.chat
      findGroup.chat.push({
        content: message,
        createdAt: currTime,
        updatedAt: currTime,
        group_id: groupId,
        id: Math.random(),
        user: { id: senderId, name: senderName },
        user_id: senderId,
      });

      //3 If Group is selected, insert the chat into both Selected chat and Group.chat and also move Group.chat to top
      if (SelectedChat && SelectedChat.id === groupId) {
        setSelectedChat(findGroup);
      }

      // Finally update the groups
      cpyGroups.unshift(findGroup);
      setGroups(cpyGroups);
    });
    return () => {
      socket.off("receive-message");
    };
  }, [SelectedChat]);

  if (SelectedChat && !SelectedChat.chat)
    return (
      <div className="flex justify-center items-center w-full h-full">
        <MiniLoader />
      </div>
    );

  return (
    <>
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
          <div
            ref={chatsDiv}
            className="flex flex-col gap-2 px-3 py-2 w-full h-full overflow-y-auto"
          >
            {SelectedChat.chat?.map((chat) => (
              <div
                key={chat.id}
                className={cn(
                  "flex flex-col",
                  chat.user_id === user?.id ? "self-end " : "self-start"
                )}
              >
                <p
                  className={cn(
                    "text-sm",
                    chat.user_id === user?.id ? "self-end" : "self-start"
                  )}
                >
                  {chat.user_id === user?.id ? "You" : chat.user.name}
                </p>
                <p
                  className={cn(
                    "px-3 py-1 rounded-b-md text-slate-800 font-medium",
                    chat.user_id === user?.id
                      ? "bg-green-400 rounded-tl-md"
                      : "bg-cyan-400 rounded-tr-md"
                  )}
                >
                  {chat.content}
                </p>
              </div>
            ))}
          </div>
          {/* Send Chat Section */}
          <form
            onSubmit={handleSendChat}
            className="flex flex-row gap-2 bg-zinc-50 p-4 pb-3"
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
    </>
  );
};

export default ChatPanel;
