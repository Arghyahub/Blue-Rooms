import { create } from "zustand";
import socket from "../utils/socket";

interface SocketState {
  socket: typeof socket;
  //   connected: boolean;
  //   groups: string[];
  //   messages: Record<string, string[]>;
  //   connect: () => void;
  //   disconnect: () => void;
  joinGroup: (groupId: number) => void;
  //   leaveGroup: (groupId: number) => void;
  // sendMessage: (
  //   groupId: number,
  //   senderId: number,
  //   senderName: number,
  //   message: string,
  //   cb: () => void
  // ) => void;
  // receiveMessage: (
  //   cb: (
  //     groupId: number,
  //     senderId: number,
  //     senderName: string,
  //     message: string
  //   ) => void
  // ) => void;
  initialize: () => void;
  cleanup: () => void;
}

const useSocketStore = create<SocketState>((set, get) => ({
  socket: socket,
  //   connected: false,
  //   groups: [],
  //   messages: {},

  //   connect: () => {
  //     // get().socket.on("connect", () => set({ connected: true }));
  //     // get().socket.on("disconnect", () => set({ connected: false }));
  //   },

  //   disconnect: () => {
  //     get().socket.disconnect();
  //   },

  joinGroup: (groupId: number) => {
    get().socket.emit("join", groupId);
    // set((state) => ({
    //   groups: [...state.groups, groupName],
    //   messages: { ...state.messages, [groupName]: [] },
    // }));
  },

  //   leaveGroup: (groupName: string) => {
  //     get().socket.emit("leaveGroup", groupName);
  //     // set((state) => ({
  //     // //   groups: state.groups.filter((g) => g !== groupName),
  //     //   messages: Object.fromEntries(
  //     //     Object.entries(state.messages).filter(([key]) => key !== groupName)
  //     //   ),
  //     // }));
  //   },

  // sendMessage: (
  //   groupId: number,
  //   senderId: number,
  //   senderName,
  //   message: string,
  //   cb: () => void
  // ) => {
  //   cb();
  //   get().socket.emit("message", groupId, senderId, senderName, message);
  // },

  // receiveMessage: (cb) => {
  //   get().socket.on(
  //     "receive-message",
  //     (groupId, senderId, senderName, message) => {
  //       cb(groupId, senderId, senderName, message);
  //     }
  //   );
  // },

  initialize: () => {
    // get().connect();
    get().socket.connect();
    // get().socket.on("message", get().receiveMessage);
  },

  cleanup: () => {
    // get().socket.off("message", get().receiveMessage);
    get().socket.disconnect();
    // get().disconnect();
  },
}));

export default useSocketStore;
