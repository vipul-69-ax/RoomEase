import { Colors } from "@/constants/Colors";
import { body, h2 } from "@/constants/Screen";
import useAuth from "@/hooks/api/useAuth";
import {
  PasswordRecoverFormSchema,
  PasswordRecoverFormType,
} from "@/utils/schema/auth";
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
  const { control, handleSubmit } = useForm<PasswordRecoverFormType>();
  const { recover_password } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const onFormSubmit = async (data: PasswordRecoverFormType) => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      PasswordRecoverFormSchema.parse(data);
      const res = await recover_password.mutateAsync(data);
      if (res.code === 200) {
        alert("Password reset email sent.");
        router.back();
      }
    } catch (_) {
      alert("Password reset failed.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView style={{ margin: "5%", flex: 1 }}>
      <Text style={styles.title}>Recover Password</Text>
      <Text style={{ fontSize: body, marginTop: "2.4%", color: "gray" }}>
        You will get a recovery email on your email.
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
              keyboardType="email-address"
            />
          </>
        )}
      />
      <TouchableOpacity
        onPress={handleSubmit(onFormSubmit)}
        style={styles.button}
      >
        {isLoading ? (
          <ActivityIndicator color={"white"} />
        ) : (
          <Text style={styles.button_text}>Continue</Text>
        )}
      </TouchableOpacity>
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
    marginTop: "8%",
  },
  button_text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
