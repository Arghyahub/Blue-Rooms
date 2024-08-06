"use client";
import { PlusIcon, User, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { FindFriendDialog } from "./find-friend-dialog";
import { GroupsType } from "@/states/chat-state";

type Props = {};

export default function AddFriendsBtn() {
  const [FindFriendOpen, setFindFriendOpen] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="ring-0 outline-none">
          <button className="bg-blue-500 shadow-md p-1 rounded-full text-white">
            <PlusIcon size={35} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="end" className="w-36">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => setFindFriendOpen(true)}
              className="cursor-pointer"
            >
              <User className="mr-2 w-4 h-4" />
              <span>Add Friend</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <Users className="mr-2 w-4 h-4" />
              <span>Create Group</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {FindFriendOpen && (
        <FindFriendDialog open={FindFriendOpen} setOpen={setFindFriendOpen} />
      )}
    </>
  );
}
