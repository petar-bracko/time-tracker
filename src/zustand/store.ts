import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserStore } from "../types";

const initUser: User = {
  username: "",
  isAuthenitacted: false,
  id: "",
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: initUser,
      authUser: (username: string, id: string) =>
        set(() => ({
          user: {
            isAuthenitacted: true,
            username,
            id,
          },
        })),
      clearUser: () =>
        set(() => ({
          user: { ...initUser },
        })),
    }),
    { name: "user-storage" }
  )
);
