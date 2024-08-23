import { IPCONFIG } from "@/constants/API";
import uploadFile from "@/utils/functions/uploadFile";
import { useProfileStore } from "@/utils/storage/useProfileStore";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type CreateProfile = {
  image: {
    uri: string;
    mime: string;
    name: string;
  };
  name: string;
  phone: string;
  token: string;
};

export const useProfile = () => {
  const { setProfileData } = useProfileStore();
  const create_profile = useMutation({
    mutationKey: ["create_profile"],
    mutationFn: async (data: CreateProfile) => {
      const downloadUrl = await uploadFile(
        data.image.name,
        data.image.uri,
        "profile_image"
      );
      const requestData = {
        name: data.name,
        image: downloadUrl,
        phone: data.phone,
        token: data.token,
      };
      const response = await axios.post(
        `${IPCONFIG}/profile/profile_create`,
        requestData
      );
      console.log("response", response.data);
      return response.data;
    },
    onSuccess: (res) => {
      if (!res.status) return;
      const _data = res.data;
      setProfileData({
        name: _data?.name,
        phone: _data?.phone,
        photo: _data?.photo,
      });
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const get_profile = useMutation({
    mutationKey: ["get_profile"],
    mutationFn: async (token: string) => {
      const response = await axios.post(`${IPCONFIG}/profile/profile_get`, {
        token,
      });
      return response.data;
    },
    onSuccess: (res) => {
      console.log(res);
      if (!res.status) return;
      return res;
    },
    onError: (err) => {
      console.log(err);
      return false;
    },
  });
  const get_profile_details = useMutation({
    mutationKey: ["profile_details"],
    mutationFn: async (token: string) => {
      const response = await axios.get(
        `${IPCONFIG}/profile/profile_details?token=${token}`
      );
      return response.data;
    },
    onSuccess: (res) => {
      console.log(res);
      return res;
    },
    onError: (err) => {
      console.log(err);
      return false;
    },
  });
  const update_profile = useMutation({
    mutationFn: async (token: string) => {
      const response = await axios.post(`${IPCONFIG}/profile/update_profile`, {
        token,
      });
      return response.data;
    },
  });
  return { create_profile, get_profile, get_profile_details, update_profile };
};
