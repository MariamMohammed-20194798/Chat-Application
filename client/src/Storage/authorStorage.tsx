import { create } from "zustand";

interface User {
  _id: string;
  username: string;
  email: string;
  photo: string;
}

interface UserState {
  authorData: User;
  onlineUsers: Set<any>;
  updatedUsers: boolean;
  lastMessage: any;

  setOnlineUsers: (id: []) => void;
  setAuthorData: (authorData: User | {}) => void;
  setLastMessage: (message: any) => void;
  setUpdateUsers: () => void;
}

export const useAuthorDataStore = create<UserState>((set) => ({
  authorData: {} as User,
  onlineUsers: new Set(),
  updatedUsers: false,
  lastMessage: {},

  setLastMessage: (message: any) => {
    set({
      lastMessage: message,
    });
  },
  setOnlineUsers: (ids: []) => {
    set((state) => {
      ids.map((el) => state.onlineUsers.add(el));

      return {
        onlineUsers: new Set(ids),
      };
    });
  },
  setAuthorData: (authorData: User | {}) =>
    set({ authorData: authorData as User }),
  setUpdateUsers: () => {
    set((state) => ({
      updatedUsers: !state.updatedUsers,
    }));
  },
}));
