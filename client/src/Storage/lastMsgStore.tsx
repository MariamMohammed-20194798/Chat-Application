import { create } from "zustand";

interface LastMsgStore {
  id: string;
  text: string;
}

interface LastMsgState {
  lastMsg: LastMsgStore;
  setLastMsg: (lastMsg: LastMsgStore | {}) => void;
}

export const useLastMsgStore = create<LastMsgState>((set) => ({
  lastMsg: {} as LastMsgStore,
  setLastMsg: (lastMsg: LastMsgStore | {}) =>
    set({ lastMsg: lastMsg as LastMsgStore }),
}));
