"use client";
import ReMultiImageCarousel from "@/components/re-comp/multi-Image-carousel";
import { Protected } from "@/components/re-comp/protected";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/states/user-state";
import { X, Plus, Router } from "lucide-react";
import React, { useEffect, useState } from "react";
import config from "@/constants/config";
import { useRouter } from "next/navigation";

const BACKEND = config.server;

const UpdateDetails = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [Avatar, setAvatar] = useState<number>(1);
  const [Tags, setTags] = useState<string[]>(["hot", "cute", "sweet"]);

  useEffect(() => {
    if (user) {
      setAvatar(user.avatar || 1);
      setTags(user?.tags?.length ? user.tags : ["hot", "cute", "sweet"]);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = {
        avatar: Avatar,
        about: e.currentTarget.about.value,
        tags: Tags,
      };
      console.log(payload);
      const res = await fetch(`${BACKEND}/user/update-details`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        console.log(data?.message);
        router.push("/chat");
      } else {
        console.log(data?.message);
        return new Error(data?.message || "error fetching data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTagChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    e.preventDefault();
    const newTags = [...Tags];
    newTags[index] = e.target.value;
    setTags(newTags);
  };

  const handleTagDelete = (index: number) => {
    const newTag = Tags.filter((_, ind) => ind !== index);
    setTags(newTag);
  };

  return (
    <Protected>
      <div className="flex flex-col justify-center items-center gap-4 w-full h-screen">
        <h1 className="font-semibold text-3xl">Update details</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-2">
          {/* avatar selection */}
          <label>Click to select an avatar</label>
          <div className="flex flex-row justify-center w-full">
            <ReMultiImageCarousel State={Avatar} setState={setAvatar} />
          </div>

          {/* about */}
          <label htmlFor="about" className="mt-4">
            About
          </label>
          <textarea
            placeholder="About"
            name="about"
            defaultValue={user?.about || "Hey there!"}
            className="p-2 border"
          />

          <label htmlFor="tags" className="mt-4">
            Tags
          </label>

          <div className="flex flex-row flex-wrap gap-2 p-2 border w-full">
            {Tags.map((tag, ind) => (
              <Badge
                key={ind}
                className="bg-blue-400 hover:bg-blue-400 px-3 py-1"
              >
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => handleTagChange(e, ind)}
                  className="bg-blue-400 border-none ring-0 max-w-9 outline-none"
                />
                <X
                  className="ml-1 w-4 h-4 hover:text-red-400"
                  onClick={() => handleTagDelete(ind)}
                />
              </Badge>
            ))}
            {Tags.length < 4 && (
              <button
                type="button"
                onClick={() => setTags((prev) => [...prev, "new"])}
              >
                <Plus className="text-blue-400" />
              </button>
            )}
          </div>

          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="bg-blue-500 mt-4 px-4 py-2 rounded-md text-white"
            >
              Update details
            </button>
          </div>
        </form>
      </div>
    </Protected>
  );
};

export default UpdateDetails;
