import React from "react";
import { Stack } from "expo-router";
import { Colors } from "@/constants/Colors";

export default function Auth() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: "RoomEase",
        headerBackVisible: false,
        contentStyle: {
          backgroundColor: Colors.light.background,
        },
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
