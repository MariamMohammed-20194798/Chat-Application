import { create } from "zustand";

export const useLastmsgStore = create((set) => ({
  lastMsg: "",
  setLastMsg: (lastMsg: string) => set({ lastMsg: lastMsg }),
}));
