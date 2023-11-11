import { create } from "zustand";

interface User {
  _id: string;
  userName: string;
  email: string;
  photo: string;
}
/* interface LastMsgStore {
  id: any;
  text: string;
} */

interface UserState {
  data: User | {};
  lastMessage: any;

  setData: (data: User | {}) => void;
  setLastMessage: (message: any) => void;
}

export const useDataStore = create<UserState>((set) => ({
  data: {},
  lastMessage: {},

  setLastMessage: (message: any) => {
    set({
      lastMessage: message,
    });
  },
  setData: (data) => set({ data }),
}));
