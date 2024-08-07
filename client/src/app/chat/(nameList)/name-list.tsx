"use client";
import {
  GroupsType,
  useChatStore,
  useSelectedChatStore,
} from "@/states/chat-state";
import { useUserStore } from "@/states/user-state";
import Image from "next/image";
import React, { useState } from "react";
import AddFriendsBtn from "./add-btn";

type Props = {};

const NameList = () => {
  const user = useUserStore((state) => state.user);
  const groups = useChatStore((state) => state.groups);
  const setSelectedChat = useSelectedChatStore(
    (state) => state.setSelectedChat
  );

  const resolveName = (group: GroupsType) => {
    if (group.personal) {
      const name = group.name.split(" ").filter((name) => name !== user?.name);
      return name;
    }
    return group.name;
  };

  const resolveDate = (date: string) => {
    const d = new Date(date);
    return d.toDateString();
  };

  const resolveDP = (group: GroupsType): string => {
    if (!group.personal) return `/avatars/group-icon.png`;
    const friend = group.GroupMembers.find(
      (member) => member.user_id !== user?.id
    );
    return `/avatars/${friend?.user.avatar || 1}.jpeg`;
  };

  const handleSelectChat = async (group: GroupsType) => {
    setSelectedChat(group);
  };

  return (
    <div className="relative flex flex-col gap-2 border-slate-400 px-2 py-2 border-r w-full h-full overflow-y-auto">
      {groups?.map((group) => (
        <div
          key={group.id}
          onClick={() => handleSelectChat(group)}
          className="flex flex-col gap-4 border-slate-600 hover:bg-slate-50 hover:shadow-md px-3 py-2 border rounded-md cursor-pointer"
        >
          <div className="flex flex-row items-center gap-2">
            <Image
              src={resolveDP(group)}
              height={50}
              width={50}
              alt="Profile icon"
              className="rounded-full"
            />
            <p className="font-semibold text-cyan-600 text-lg">
              {resolveName(group)}
            </p>
          </div>
          <p className="ml-2">{resolveDate(group.updatedAt)}</p>
        </div>
      ))}

      <div className="right-7 bottom-7 absolute">
        <AddFriendsBtn />
      </div>
    </div>
  );
};

export default NameList;
