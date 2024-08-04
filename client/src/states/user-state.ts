import { create } from "zustand";

export interface UserType {
  id: number;
  is_varified: boolean;
  otp: number;
  name: string;
  email: string;
  avatar: number;
  about: string;
  tags?: string[];
}

interface UserStoreType {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
}

export const useUserStore = create<UserStoreType>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
