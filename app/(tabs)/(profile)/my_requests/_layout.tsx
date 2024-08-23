import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

export default function _layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        contentStyle:{
            backgroundColor:"white"
        }
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "My requests",
        }}
      />
      <Stack.Screen
        name="about_listing"
        options={{
          title: "About Request",
          headerBackTitle:"Back"
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({});
