import { create } from "zustand";

interface User {
  _id: string;
  username: string;
  email: string;
  photo: string;
}

interface UserState {
  authorData: User;
  setAuthorData: (authorData: User | {}) => void;
}

export const useAuthorDataStore = create<UserState>((set) => ({
  authorData: {} as User,
  setAuthorData: (authorData: User | {}) =>
    set({ authorData: authorData as User }),
}));
