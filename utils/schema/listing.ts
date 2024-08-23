import { z } from "zod";

export type FacilityType =
  | "Air Conditioning"
  | "Kitchen"
  | "Parking"
  | "Internet"
  | "Gym";

export type UtilityType =
  | "Gas Supply"
  | "Electricity Backup"
  | "Water Supply"
  | "Washing Machine";

export const ListingFacilities = z.array(
  z.enum(["Air Conditioning", "Kitchen", "Parking", "Internet", "Gym"])
);

export const ListingUtilites = z.array(
  z.enum([
    "Gas Supply",
    "Electricity Backup",
    "Water Supply",
    "Washing Machine",
  ])
);

export const NewListingSchema = z.object({
  full_address: z
    .string()
    .min(5, { message: "Full address must be at least 5 characters long" })
    .max(200, { message: "Full address must be at most 200 characters long" }),
  pincode: z
    .string()
    .min(6, { message: "Pincode must be exactly 6 characters long" })
    .max(6, { message: "Pincode must be exactly 6 characters long" }),
  city: z
    .string()
    .min(2, { message: "City must be at least 2 characters long" })
    .max(50, { message: "City must be at most 50 characters long" }),
  state: z
    .string()
    .min(2, { message: "State must be at least 2 characters long" })
    .max(50, { message: "State must be at most 50 characters long" }),
  rooms: z
    .string()
    .max(3, { message: "Rooms must be at most 3 characters long" }),
  bathrooms: z
    .string()
    .max(3, { message: "Bathrooms must be at most 3 characters long" }),
  kitchen: z
    .string()
    .max(2, { message: "Kitchen must be at most 2 characters long" }),
  information: z
    .string()
    .min(0)
    .max(2000, { message: "Information must be at most 2000 characters long" }),
  monthly_rent: z
    .string()
    .max(8, { message: "Monthly rent must be at most 8 characters long" }),
  type: z.enum(["Flat", "PG", "Bunglow", "House"], {
    errorMap: () => ({
      message: "Type must be one of: Flat, PG, Bunglow, House",
    }),
  }),
  max_occupancy: z
    .string()
    .max(2, { message: "Max occupancy must be at most 2 characters long" }),
  occupied: z
    .string()
    .max(2, { message: "Occupied must be at most 2 characters long" }),
  facilities: ListingFacilities,
  utilities: ListingUtilites,
});

export type ListingResponse = {
  __v: number;
  _id: string;
  bathrooms: number;
  blueprint: string;
  city: string;
  createdAt: string;
  full_address: string;
  information: string;
  isActive: boolean;
  kitchen: number;
  listing_images: string[]; // Assuming it's an array of strings
  max_occupancy: number;
  monthly_rent: number;
  occupied: number;
  pincode: string;
  rooms: number;
  state: string;
  token: string;
  type: string;
  updatedAt: string;
  latitude: number;
  longitude: number;
  facilities: string[];
  utilities: string[];
  requests: ListingRequestType[];
};

export type ListingRequestType = {
  requestFrom: string;
  occupants: number;
  rent: string;
};

export type ProcessedRequestType = {
  occupants: number;
  rent: string;
  photo: string;
  phoneNumber: string;
  fullName: string;
  userId: string;
};

export const FilterSchema = z.object({
  position: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
  distanceRadius: z.string().optional(),
  budget: z.string().optional(),
  facilities: ListingFacilities.optional(),
  occupants: z.string().optional(),
  utilities: ListingUtilites.optional(),
});

export const OptionsFormSchema = z.object({
  rent: z.string(),
  information: z.string(),
  spaceLeft: z.string(),
  availableForListing: z.boolean(),
});


