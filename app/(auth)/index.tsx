import { Colors } from "@/constants/Colors";
import { button, h1, h3, height, width } from "@/constants/Screen";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInLeft, FadeOutDown } from "react-native-reanimated";

export default function LandingPage() {
  return (
    <Animated.View
      entering={FadeInLeft.duration(700)}
      exiting={FadeOutDown}
      style={styles.container}
    >
      <Image
        source={require("@/assets/images/homepage.jpg")}
        style={styles.vector}
      />
      <View
        style={{
          padding: "5%",
        }}
      >
        <Text style={styles.tagline}>
          Discover Nearby PG Rooms Effortlessly.
        </Text>
        <Text style={{ fontSize: h3, marginTop: 32, color: "#333" }}>
          Eliminate the fuss with RoomEase in few steps.
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/auth")}
          activeOpacity={0.8}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  vector: {
    width: width,
    height: height / 3,
  },
  tagline: {
    fontSize: h1 + 12,
    fontWeight: "900",
  },
  button: {
    width: "100%",
    backgroundColor: Colors.primary,
    marginTop: 16,
    padding: "5%",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: button,
    fontWeight: "700",
  },
});
