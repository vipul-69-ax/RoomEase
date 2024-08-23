import { z } from "zod";
import { FilterSchema } from "../schema/listing";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type FilterData = Partial<z.infer<typeof FilterSchema>>;

type FilterStore = {
  filters: FilterData;
  updateFilters: (data: Partial<FilterData>) => void;
  resetFilters: () => void;
};

const useFilterStore = create<FilterStore>()(
  persist(
    (set) => ({
      filters: {
        distanceRadius: "10",
        budget: "5000",
        occupants: "2",
        facilities: [],
        utilities: [],
      },
      updateFilters: (data: Partial<FilterData>) => {
        set((state) => ({
          filters: { ...state.filters, ...data },
        }));
      },
      resetFilters: () => {
        set((state) => ({
          filters: {
            distanceRadius: "10",
            budget: "5000",
            occupants: "2",
            facilities: [],
            utilities: [],
          },
        }));
      },
    }),
    {
      name: "filter-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useFilterStore