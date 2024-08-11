"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import config from "@/constants/config";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import AddOrMessage from "./add-message-btn";
import { GroupsType, useSelectedChatStore } from "@/states/chat-state";

const BACKEND = config.server;

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface SearchResult {
  users: {
    id: number;
    name: string;
    avatar: number;
    about: string;
  }[];
  tagUsers: {
    id: number;
    name: string;
    avatar: number;
    about: string;
    Tags: {
      id: number;
      tag: string;
    }[];
  }[];
  emailUsers: {
    id: number;
    name: string;
    email: string;
    avatar: number;
    about: string;
  }[];
}

export function FindFriendDialog({ open, setOpen }: Props) {
  const [CurrentTab, setCurrentTab] = useState<"Name" | "Email" | "Tags">(
    "Name"
  );
  const [SearchedResult, setSearchedResult] = useState<SearchResult | null>(
    null
  );

  const handleSearch = async (
    e: FormEvent<HTMLFormElement> & { target: { query: HTMLInputElement } }
  ) => {
    e.preventDefault();
    const query = e.target.query.value;
    try {
      const res = await fetch(`${BACKEND}/user/search`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = (await res.json()) as SearchResult;
      setSearchedResult(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddFriend = async (id: number) => {
    try {
      const res = await fetch(`${BACKEND}/group/add-friend`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friend_id: id }),
      });

      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      {/* <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger> */}
      <DialogContent className="flex flex-col min-w-[80vw] min-h-[75vh] max-h-[75vh]">
        <DialogHeader>
          <DialogTitle>Search Profile</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 ring-0 h-full outline-none">
          <form onSubmit={handleSearch} className="flex flex-row items-center">
            <input
              type="text"
              name="query"
              placeholder="Search by username or email or tag"
              className="border-slate-400 mr-2 p-2 border rounded-md md:w-96"
            />
            <Button>Search</Button>
          </form>

          <div className="flex flex-row justify-between items-center gap-4">
            <button
              onClick={() => setCurrentTab("Name")}
              className={cn(
                "bg-slate-50 px-2 py-1 rounded-t-md rounded-b-sm w-full text-start",
                { "border-b border-black": CurrentTab === "Name" }
              )}
            >
              Name
            </button>
            <button
              onClick={() => setCurrentTab("Email")}
              className={cn(
                "bg-slate-50 px-2 py-1 rounded-t-md rounded-b-sm w-full text-start",
                { "border-b border-black": CurrentTab === "Email" }
              )}
            >
              Email
            </button>
            <button
              onClick={() => setCurrentTab("Tags")}
              className={cn(
                "bg-slate-50 px-2 py-1 rounded-t-md rounded-b-sm w-full text-start",
                { "border-b border-black": CurrentTab === "Tags" }
              )}
            >
              Tags
            </button>
          </div>
          <div className="flex flex-col gap-4 h-full overflow-y-auto">
            {SearchedResult === null && (
              <p className="text-sm">
                You can search for a friend by their username or email or you
                can search people by their tags.
              </p>
            )}
            {((SearchedResult?.users?.length === 0 && CurrentTab == "Name") ||
              (SearchedResult?.emailUsers.length == 0 &&
                CurrentTab == "Email") ||
              (SearchedResult?.tagUsers.length == 0 &&
                CurrentTab == "Tags")) && <p>Oh o! No users found.</p>}

            {/* Users */}
            {CurrentTab == "Name" &&
              SearchedResult?.users.map((searchUsers) => (
                <div
                  key={searchUsers.id}
                  className="flex flex-col gap-3 border-slate-500 p-2 border rounded-md"
                >
                  <div className="flex flex-row items-center gap-2">
                    <Image
                      src={`/avatars/${searchUsers.avatar || 1}.jpeg`}
                      alt="profile image"
                      width={45}
                      height={45}
                      className="rounded-full"
                    />
                    <p className="font-medium text-cyan-600 text-lg">
                      {searchUsers.name}
                    </p>
                    <div className="mr-2 ml-auto">
                      <AddOrMessage
                        searched_id={searchUsers.id}
                        setOpen={setOpen}
                      />
                    </div>
                  </div>
                  <p>{searchUsers.about}</p>
                </div>
              ))}

            {/* Email */}
            {CurrentTab == "Email" &&
              SearchedResult?.emailUsers.map((searchUsers) => (
                <div
                  key={searchUsers.id}
                  className="flex flex-col gap-3 border-slate-500 p-2 border rounded-md"
                >
                  <div className="flex flex-row items-center gap-2">
                    <Image
                      src={`/avatars/${searchUsers.avatar || 1}.jpeg`}
                      alt="profile image"
                      width={45}
                      height={45}
                      className="rounded-full"
                    />
                    <p className="font-medium text-cyan-600 text-lg">
                      {searchUsers.name}
                    </p>
                    <div className="mr-2 ml-auto">
                      <AddOrMessage
                        searched_id={searchUsers.id}
                        setOpen={setOpen}
                      />
                    </div>
                  </div>
                  <p>{searchUsers.about}</p>
                  <a
                    href={`mailto:${searchUsers.email}`}
                    className="text-cyan-500"
                  >
                    {searchUsers.email}
                  </a>
                </div>
              ))}

            {/* Tags */}
            {CurrentTab == "Tags" &&
              SearchedResult?.tagUsers.map((searchUsers) => (
                <div
                  key={searchUsers.id}
                  className="flex flex-col gap-3 border-slate-500 p-2 border rounded-md"
                >
                  <div className="flex flex-row items-center gap-2">
                    <Image
                      src={`/avatars/${searchUsers.avatar || 1}.jpeg`}
                      alt="profile image"
                      width={45}
                      height={45}
                      className="rounded-full"
                    />
                    <p className="font-medium text-cyan-600 text-lg">
                      {searchUsers.name}
                    </p>
                    <div className="mr-2 ml-auto">
                      <AddOrMessage
                        searched_id={searchUsers.id}
                        setOpen={setOpen}
                      />
                    </div>
                  </div>
                  <p>{searchUsers.about}</p>
                  <div className="flex flex-row gap-2">
                    <p className="text-cyan-600">Tags:</p>
                    <div className="flex flex-row gap-2">
                      {searchUsers.Tags.map((tag) => (
                        <div
                          key={tag.id}
                          className="bg-blue-400 px-2 rounded-md text-white"
                        >
                          {tag.tag}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        {/* <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
