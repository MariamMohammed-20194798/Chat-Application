import { create } from "zustand";

interface Online {
  isOnline: boolean;
}

interface UserState {
  onlineUser: Online;
  setOnlineUser: (onlineUser: Online) => void;
}

export const useOnlineUser = create<UserState>((set) => ({
  onlineUser: {} as Online,
  setOnlineUser: (onlineUser: Online | {}) =>
    set({ onlineUser: onlineUser as Online }),
}));
