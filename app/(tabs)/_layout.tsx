import { AntDesign } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabScren() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarLabel: "",
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <AntDesign name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <AntDesign name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
