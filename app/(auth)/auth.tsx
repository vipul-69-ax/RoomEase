import { Colors } from "@/constants/Colors";
import { body, h2 } from "@/constants/Screen";
import useAuth from "@/hooks/api/useAuth";
import { useProfile } from "@/hooks/api/useProfile";
import { useProfileStore } from "@/utils/storage/useProfileStore";
import { AuthFormSchema, AuthFormType } from "@/utils/schema/auth";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function Auth() {
  const { control, handleSubmit } = useForm<AuthFormType>();
  const { authenticate } = useAuth();
  const { setProfileData } = useProfileStore();
  const { get_profile } = useProfile();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const onFormSubmit = async (data: AuthFormType) => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      AuthFormSchema.parse(data);
      const res = await authenticate.mutateAsync(data);
      const profile_res = await get_profile.mutateAsync(res.token);
      console.log("response", res);
      if (profile_res.status) {
        const _data = profile_res.data;
        setProfileData({
          name: _data?.name,
          phone: _data?.phone,
          photo: _data?.photo,
        });
      }
      if (!res.user) {
        alert(`Cannot login due to ${res.code}`);
        return;
      }
      router.replace("/(tabs)");
    } catch (_) {
      console.log(_)
      alert("Login failed.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView style={{ margin: "5%", flex: 1 }}>
      <Text style={styles.title}>Login/ Signup</Text>
      <Text style={{ fontSize: body, marginTop: "2.4%", color: "gray" }}>
        You will get a verification email on your email.
      </Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { value, onChange, onBlur } }) => (
          <>
            <Text style={styles.input_label}>Email</Text>
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
        name="password"
        render={({ field: { value, onChange, onBlur } }) => (
          <>
            <Text style={styles.input_label}>Password</Text>
            <TextInput
              value={value}
              style={styles.input}
              secureTextEntry
              onChangeText={onChange}
              onBlur={onBlur}
            />
          </>
        )}
      />
      <Text
        style={{
          color: "gray",
          alignSelf: "center",
          marginVertical: "8%",
          fontSize: 18,
        }}
        onPress={() => {
          router.push("/(auth)/password");
        }}
      >
        Forgot Password?
      </Text>
      <TouchableOpacity
        onPress={handleSubmit(onFormSubmit)}
        style={styles.button}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.button_text}>Continue</Text>
        )}
      </TouchableOpacity>
      {/* <Controller control={control} name="password" /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: h2,
    fontWeight: "bold",
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
  },
  button_text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
