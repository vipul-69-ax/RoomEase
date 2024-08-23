import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { EditProfileFormType, editProfileSchema } from "@/utils/schema/profile";
import FormInput from "@/components/FormInput";
import { Colors } from "@/constants/Colors";
import useAuth from "@/hooks/api/useAuth";
import { useProfile } from "@/hooks/api/useProfile";
import { useAuthStore } from "@/utils/storage/useAuthStore";

export default function EditProfile() {
  const { control, handleSubmit } = useForm<EditProfileFormType>();
  const { userData } = useAuthStore();
  const { update_profile } = useProfile();
  const onFormSubmit = async (data: EditProfileFormType) => {
    const resp = await editProfileSchema.safeParseAsync(data);
    if (resp.error) {
      alert("Enter valid data");
      return;
    }
    if (userData.jwtToken) {
      await update_profile.mutateAsync(userData.jwtToken, {
        onSuccess: () => {},
        onError:(err)=>console.log(err)
      });
    }
  };
  return (
    <View style={{ padding: "4%" }}>
      <Controller
        name="phone"
        control={control}
        render={({ field: { onChange, value } }) => {
          return (
            <FormInput
              onChange={onChange}
              value={value}
              label="Phone Number"
              labelAbout="Shared upon request approval"
            />
          );
        }}
      />
      <Controller
        name="office"
        control={control}
        render={({ field: { onChange, value } }) => {
          return (
            <FormInput
              onChange={onChange}
              value={value}
              label="Office Address"
              labelAbout="Shared upon request approval"
            />
          );
        }}
      />
      <Text
        onPress={handleSubmit(onFormSubmit)}
        style={{
          alignSelf: "center",
          marginTop: "5%",
          fontSize: 18,
        }}
      >
        Update Profile
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({});
