import { create } from "zustand";

export const useAuthorDataStore = create((set) => ({
  authorData: {},
  setAuthorData: (authorData: object) => set({ authorData: authorData }),
}));
