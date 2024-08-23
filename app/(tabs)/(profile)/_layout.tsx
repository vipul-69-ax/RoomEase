import { Stack } from "expo-router";

export default function Profile() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: "white",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Profile",
        }}
      />
      <Stack.Screen
        name="my_listing"
        options={{
          headerTitle: "My listings",
        }}
      />
      <Stack.Screen
        name="edit_profile"
        options={{
          headerTitle: "Edit Profile",
        }}
      />
    </Stack>
  );
}
