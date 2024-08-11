"use client";
import config from "@/constants/config";
import {
  GroupsType,
  useChatStore,
  useSelectedChatStore,
} from "@/states/chat-state";
import useSocketStore from "@/states/socket-state";
import { useUserStore } from "@/states/user-state";
import { Mail, UserPlus } from "lucide-react";
import React from "react";
import { Socket } from "socket.io-client";

type Props = {
  searched_id: number;
  setOpen: (open: boolean) => void;
};

const BACKEND = config.server;

const AddOrMessage = ({ searched_id, setOpen }: Props) => {
  const groups = useChatStore((state) => state.groups);
  const setGroups = useChatStore((state) => state.setGroups);
  const user = useUserStore((state) => state.user);
  const setSelectedChat = useSelectedChatStore(
    (state) => state.setSelectedChat
  );

  const socket = useSocketStore((state) => state.socket);

  const handleText = () => {
    const group = groups?.find((group) => {
      if (group.personal) {
        return group.GroupMembers.find(
          (member) => member.user_id === searched_id
        );
      }
    });
    if (group) {
      setSelectedChat(group);
      setOpen(false);
    } else {
      console.log("No group found");
      // raise a toast here
    }
  };

  const handleAdd = async () => {
    try {
      const res = await fetch(`${BACKEND}/group/add-friend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ friend_id: searched_id }),
      });
      const data = (await res.json()) as { message: string; data: GroupsType };

      if (res.ok) {
        console.log(data.message);

        // Join Group socket
        socket.emit("join", data.data.id);

        // Set groups
        if (groups) setGroups([data.data, ...groups]);
        else setGroups([data.data]);

        // Set selected chat
        setSelectedChat(data.data);

        // Close dialog
        setOpen(false);
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {user?.friends?.includes(searched_id) ? (
        <button onClick={handleText}>
          <Mail fill="yellow" />
        </button>
      ) : (
        <button>
          <UserPlus fill="blue" onClick={handleAdd} />
        </button>
      )}
    </>
  );
};

export default AddOrMessage;
