import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type UserData = {
  jwtToken?: string;
};

type AuthStore = {
  userData: UserData;
  updateData: (data: object) => void;
  clear: () => void;
};

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      userData: {
        jwtToken: "",
      },
      updateData: (value: UserData) => {
        set((state) => ({
          userData: { ...state.userData, ...value },
        }));
      },
      clear: () => {
        set((state) => ({
          userData: {
            jwtToken: "",
          },
        }));
      },
    }),
    { name: "auth-store", storage: createJSONStorage(() => AsyncStorage) },
  ),
);

export { useAuthStore };
