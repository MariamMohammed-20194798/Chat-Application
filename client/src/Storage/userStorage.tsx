import { create } from "zustand";
interface User {
  _id: string;
  userName: string;
  email: string;
}

interface UserState {
  data: User;
  setData: (data: User | {}) => void;
}
export const useDataStore = create<UserState>((set) => ({
  data: {} as User,
  setData: (data: User | {}) => set({ data: data as User }),
}));
