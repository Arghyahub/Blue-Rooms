import { create } from "zustand";

export interface ChatType {
  id: number;
  user_id: number;
  group_id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
  };
}

export interface GroupsType {
  id: number;
  personal: boolean;
  name: string;
  createdAt: string;
  updatedAt: string;
  chat: ChatType[] | undefined;
  GroupMembers: {
    id: number;
    user_id: number;
    group_id: number;
    createdAt: string;
    updatedAt: string;
    user: {
      id: number;
      name: string;
      avatar: number;
      about: string;
      Tags: {
        id: number;
        tag: string;
        createdAt: string;
        updatedAt: string;
      };
    };
  }[];
}

interface ChatStoreType {
  groups: GroupsType[] | null;
  setGroups: (groups: GroupsType[] | null) => void;
}

export const useChatStore = create<ChatStoreType>((set) => ({
  groups: null,
  setGroups: (groups) => set({ groups: groups || [] }),
}));

interface SelectedChatType {
  SelectedChat: GroupsType | null;
  setSelectedChat: (SelectedChat: GroupsType | null) => void;
}

export const useSelectedChatStore = create<SelectedChatType>((set) => ({
  SelectedChat: null,
  setSelectedChat: (SelectedChat) => set({ SelectedChat }),
}));
