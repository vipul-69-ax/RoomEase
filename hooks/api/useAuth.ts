import React from "react";
import { QueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "@/utils/storage/useAuthStore";
import { IPCONFIG } from "@/constants/API";

type AuthData = {
  email: string;
  password: string;
};

type PasswordRecoverData = {
  email: string;
};

const queryClient = new QueryClient();

const useAuth = () => {
  const { updateData, userData } = useAuthStore();
  const authenticate = useMutation({
    mutationKey: ["authenticate"],
    mutationFn: async (data: AuthData) => {
      const res = await axios.post(
        `${IPCONFIG}/auth/authenticate`,
        data,
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data.user) {
        updateData({
          jwtToken: data.token,
        });
      }
      queryClient.invalidateQueries({ queryKey: ["authenticate"] });
    },
    onError: (error) => {
      queryClient.cancelQueries({ queryKey: ["authenticate"] });
    },
  });

  const recover_password = useMutation({
    mutationKey: ["recover_password"],
    mutationFn: async (data: PasswordRecoverData) => {
      const res = await axios.post(
        `${IPCONFIG}/auth/generate-recovery-mail`,
        data,
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authenticate"] });
    },
    onError: (error) => {
      queryClient.cancelQueries({ queryKey: ["authenticate"] });
    },
  });
  return { authenticate, recover_password };
};

export default useAuth;
