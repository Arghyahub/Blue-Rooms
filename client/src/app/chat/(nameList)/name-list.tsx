"use client";
import {
  GroupsType,
  useChatStore,
  useSelectedChatStore,
} from "@/states/chat-state";
import { UserType, useUserStore } from "@/states/user-state";
import Image from "next/image";
import React, { useState } from "react";
import AddFriendsBtn from "./add-btn";
import { resolveDate, resolveDP, resolveName } from "@/utils/group-utils";

type Props = {};

const NameList = () => {
  const user = useUserStore((state) => state.user);
  const groups = useChatStore((state) => state.groups);
  const setSelectedChat = useSelectedChatStore(
    (state) => state.setSelectedChat
  );

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
              src={resolveDP(group, user as UserType)}
              height={50}
              width={50}
              alt="Profile icon"
              className="rounded-full"
            />
            <p className="font-semibold text-cyan-600 text-lg">
              {resolveName(group, user as UserType)}
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
