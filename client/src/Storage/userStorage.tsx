import { create } from "zustand";

export const useDataStore = create((set) => ({
  data: {},
  setData: (data: object) => set({ data: data }),
}));
