import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ProfileCreationFormSchema,
  ProfileCreationFormType,
} from "@/utils/schema/profile";
import { Colors } from "@/constants/Colors";
import {
  requestMediaLibraryPermissionsAsync,
  launchImageLibraryAsync,
  MediaTypeOptions,
  ImagePickerAsset,
} from "expo-image-picker";
import { Image } from "expo-image";
import { useProfile } from "@/hooks/api/useProfile";
import { useAuthStore } from "@/utils/storage/useAuthStore";
import { useProfileStore } from "@/utils/storage/useProfileStore";
import MyProfile from "./my_profile";
import { router } from "expo-router";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

export default function Profile() {
  const { userData, clear } = useAuthStore();
  const [profileImage, setProfileImage] = useState<ImagePickerAsset>();
  const { handleSubmit, control } = useForm<ProfileCreationFormType>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { create_profile } = useProfile();
  const { profileExists, removeProfileData } = useProfileStore();
  const launchImagePicker = async () => {
    try {
      const perm = await requestMediaLibraryPermissionsAsync();
      if (perm.granted) {
        const image = await launchImageLibraryAsync({
          mediaTypes: MediaTypeOptions.Images,
          selectionLimit: 1,
        });
        if (!image.canceled) {
          setProfileImage(image.assets[0]);
        }
      }
    } catch (err) {}
  };
  const onFormSubmit = async (data: ProfileCreationFormType) => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      ProfileCreationFormSchema.parse(data);
      if (!profileImage) throw "Provide a profile image";
      const res = await create_profile.mutateAsync({
        image: {
          uri: profileImage.uri,
          mime: profileImage.mimeType ? profileImage.mimeType : "image/jpeg",
          name:
            profileImage.fileName || `profile_image${userData.jwtToken}.jpg`,
        },
        name: data.name,
        phone: data.phone,
        token: userData.jwtToken as string,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  if (profileExists()) return <MyProfile />;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginHorizontal: "5%",
        backgroundColor: "white",
      }}
    >
      <Text style={styles.title}>Profile</Text>
      <Text style={{ marginVertical: "4%", color: "#d7d7d7", fontSize: 18 }}>
        The details required to book a room or upload your own rental room.
      </Text>
      <View style={{ alignItems: "center", marginTop: "4%" }}>
        {profileImage ? (
          <TouchableOpacity activeOpacity={1} onPress={launchImagePicker}>
            <Image
              style={{
                height: 120,
                width: 120,
                borderRadius: 60,
                backgroundColor: "#f7f7f7",
              }}
              source={{ uri: profileImage.uri }}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={launchImagePicker}
            style={{
              height: 120,
              width: 120,
              borderRadius: 60,
              backgroundColor: "#f7f7f7",
            }}
          />
        )}
      </View>
      <Controller
        control={control}
        name="name"
        render={({ field: { value, onChange, onBlur } }) => (
          <>
            <Text style={styles.input_label}>Full Name</Text>
            <TextInput
              value={value}
              style={styles.input}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          </>
        )}
      />
      <Controller
        control={control}
        name="phone"
        render={({ field: { value, onChange, onBlur } }) => (
          <>
            <Text style={styles.input_label}>Phone Number</Text>
            <TextInput
              value={value}
              style={styles.input}
              keyboardType="phone-pad"
              onChangeText={onChange}
              onBlur={onBlur}
            />
          </>
        )}
      />
      <TouchableOpacity
        onPress={handleSubmit(onFormSubmit)}
        style={styles.button}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.button_text}>Submit</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 36,
    fontWeight: "700",
  },
  input_label: {
    fontSize: 18,
    color: "gray",
    marginTop: "5%",
  },
  input: {
    padding: "4%",
    borderRadius: 4,
    backgroundColor: "#f7f7f7",
    marginTop: "2%",
  },
  button: {
    backgroundColor: Colors.primary,
    width: "60%",
    alignSelf: "center",
    padding: "4%",
    borderRadius: 8,
    alignItems: "center",
    marginTop: "8%",
  },
  button_text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
