import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type UserData = {
  name: string;
  phone: string;
  photo: string;
};

type ProfileStore = {
  profileData: UserData;
  setProfileData: (data: UserData) => void;
  removeProfileData: () => void;
  profileExists: () => boolean;
};

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      profileData: {
        name: "",
        phone: "",
        photo: "",
      },
      profileExists: () => {
        const data = get().profileData;
        if (!data.name && !data.phone && !data.photo) return false;
        return true;
      },
      setProfileData: (data) => {
        set((state) => ({
          profileData: data,
        }));
      },
      removeProfileData: () => {
        set(() => ({
          profileData: {
            name: "",
            phone: "",
            photo: "",
          },
        }));
      },
    }),
    { name: "profile-store", storage: createJSONStorage(() => AsyncStorage) },
  ),
);
