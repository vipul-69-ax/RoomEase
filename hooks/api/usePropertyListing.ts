import { IPCONFIG } from "@/constants/API";
import uploadFile from "@/utils/functions/uploadFile";
import {
  FilterSchema,
  NewListingSchema,
  OptionsFormSchema,
} from "@/utils/schema/listing";
import { QueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ImagePickerAsset } from "expo-image-picker";
import { z } from "zod";

type FilterType = z.infer<typeof FilterSchema>;
type NewListingType = z.infer<typeof NewListingSchema>;
type ListingAdditions = {
  listing_images: (ImagePickerAsset | string)[];
  blueprint?: ImagePickerAsset | string;
  token: string;
  latitude: number;
  longitude: number;
  location: {
    type: string;
    coordinates: any[];
  };
  requests: [];
};
type ListingFilters = {
  filterData: FilterType;
  token: string;
};
type VisitBody = {
  owner_id: string;
  my_id: string;
  rent: string;
  occupants: number;
  property_id: string;
};
type UpdationData = z.infer<typeof OptionsFormSchema> & { id: any };

export type Listing = NewListingType & ListingAdditions;

const queryClient = new QueryClient();
const usePropertyListing = () => {
  const add_listing = useMutation({
    mutationKey: ["add"],
    mutationFn: async (listing_data: Listing) => {
      const uploadImages = listing_data.listing_images.map(
        async (image, index) => {
          if (typeof image === "string") return;
          const fileUri = await uploadFile(
            image.fileName || Math.random().toString(36),
            image.uri,
            `listing/${listing_data.token}`
          );
          listing_data["listing_images"][index] = fileUri;
        }
      );
      await Promise.all(uploadImages);
      if (
        listing_data.blueprint &&
        typeof listing_data.blueprint !== "string"
      ) {
        const fileUri = await uploadFile(
          listing_data.blueprint.fileName || Math.random().toString(36),
          listing_data.blueprint.uri,
          `listing/${listing_data.token}`
        );
        listing_data["blueprint"] = fileUri;
      }
      const response = await axios.post(
        `${IPCONFIG}/listing/new_listing`,
        listing_data
      );
      return response.data;
    },
    onError: (err) => {
      queryClient.cancelQueries({ queryKey: ["add"] });
      return undefined;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["add"] });
      return data;
    },
  });
  const get_listings = useMutation({
    mutationKey: ["get"],
    mutationFn: async (token: string) => {
      const res = await axios.get(
        `${IPCONFIG}/listing/my_listings?token=${token}`
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["get"] });
      return data;
    },
    onError: (err) => {
      queryClient.cancelQueries({ queryKey: ["get"] });
      return undefined;
    },
  });
  const get_listing = useMutation({
    mutationKey: ["get_one"],
    mutationFn: async ({ id, token }: { id: string; token: string }) => {
      const res = await axios.get(
        `${IPCONFIG}/listing/my_listing?token=${token}&id=${id}`
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["get_one"] });
      return data;
    },
    onError: (err) => {
      queryClient.cancelQueries({ queryKey: ["get_one"] });
      return undefined;
    },
  });
  const get_other_listings = useMutation({
    mutationKey: ["other"],
    mutationFn: async (filters: ListingFilters) => {
      const resp = await axios.get(
        `${IPCONFIG}/listing/listings?filters=${JSON.stringify(
          filters.filterData
        )}&token=${filters.token}`
      );
      return resp.data;
    },
    onSuccess: (data) => {
      console.log(data);
      return data;
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const request_property_visit = useMutation({
    mutationKey: ["visit"],
    mutationFn: async (body: VisitBody) => {
      const resp = await axios.post(`${IPCONFIG}/listing/request_visit`, body);
      return resp.data;
    },
    onSuccess: (data) => {
      console.log(data);
      return data;
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const get_my_requests = useMutation({
    mutationKey: ["requests"],
    mutationFn: async (token: string) => {
      const resp = await axios.get(
        `${IPCONFIG}/listing/get_visit_requests?token=${token}`
      );
      return resp.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      return data;
    },
    onError: () => {
      queryClient.cancelQueries({ queryKey: ["requests"] });
    },
  });

  const update_property_data = useMutation({
    mutationKey: ["updation"],
    mutationFn: async (data: UpdationData) => {
      const resp = await axios.post(
        `${IPCONFIG}/listing/update_property`,
        data
      );
      console.log(resp.data);
      return resp.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["updation"] });
      return data;
    },
    onError: () => {
      queryClient.cancelQueries({ queryKey: ["updation"] });
    },
  });

  const reject_property_request = useMutation({
    mutationFn: async ({
      userId,
      propertyId,
    }: {
      userId: string;
      propertyId: any;
    }) => {
      const resp = await axios.post(
        `${IPCONFIG}/listing/reject_property_request`,
        {
          userId: userId,
          propertyId: propertyId,
        }
      );
      return resp.data;
    },
  });

  const accept_property_request = useMutation({
    mutationFn: async ({
      userId,
      propertyId,
    }: {
      userId: string;
      propertyId: any;
    }) => {
      const resp = await axios.post(
        `${IPCONFIG}/listing/accept_property_request`,
        {
          userId: userId,
          propertyId: propertyId,
        }
      );
      return resp.data;
    }
    
  });
  const remove_approved_request = useMutation({
    mutationFn: async ({
      userId,
      propertyId,
    }: {
      userId: string;
      propertyId: any;
    }) => {
      const resp = await axios.post(
        `${IPCONFIG}/listing/remove_approved_request`,
        {
          userId: userId,
          propertyId: propertyId,
        }
      );
      return resp.data;
    }
    
  });

  return {
    add_listing,
    get_listings,
    get_listing,
    get_other_listings,
    request_property_visit,
    get_my_requests,
    update_property_data,
    reject_property_request,
    accept_property_request,
    remove_approved_request
  };
};

export default usePropertyListing;
