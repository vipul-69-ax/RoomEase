import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import HouseListing from "@/components/ListingCard";
import Animated, {
  FadeIn,
  SlideInDown,
  SlideInRight,
  SlideInUp,
  SlideOutDown,
} from "react-native-reanimated";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import usePropertyListing from "@/hooks/api/usePropertyListing";
import { useAuthStore } from "@/utils/storage/useAuthStore";
import { ListingResponse } from "@/utils/schema/listing";
import { height } from "@/constants/Screen";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

export default function MyListingsList() {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [myListings, setMyListings] = useState<ListingResponse[]>([]);
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
  const { get_listings } = usePropertyListing();
  const { userData } = useAuthStore();
  const fetchListings = async () => {
    if (userData.jwtToken) {
      const res = await get_listings.mutateAsync(userData.jwtToken);
      setMyListings(res.data);
    }
  };
  useEffect(() => {
    fetchListings();
  }, []);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    if (userData.jwtToken) {
      try{
      const res = await get_listings.mutateAsync(userData.jwtToken);
      setMyListings(res.data);
      }
      catch(err){
        setRefreshing(false)
      }
    }
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ alignSelf: "center" }}
        data={myListings}
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              height: height - 200,
            }}
          >
            <Text>You do not have any listings.</Text>
          </View>
        )}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeIn.delay(index * 20)}>
            <HouseListing
              listing={item}
              onPress={() => {
                router.push({
                  pathname: "/(tabs)/(profile)/my_listing/about_listing",
                  params: {
                    id: item._id,
                  },
                } as any);
              }}
            />
          </Animated.View>
        )}
      />
      <AnimatedTouchable
        activeOpacity={1}
        onPress={() => router.push("/(tabs)/(profile)/my_listing/new_listing")}
        entering={FadeIn.duration(1000)}
        exiting={SlideOutDown.duration(400)}
        style={styles.newListing}
      >
        <Image
          style={{
            height: 30,
            width: 30,
          }}
          source={require("@/assets/images/building.png")}
        />
        <View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            List a new property on RoomEase
          </Text>
          <Text
            style={{
              color: "#aaa",
            }}
          >
            Hassle free process.
          </Text>
        </View>
      </AnimatedTouchable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  newListing: {
    position: "absolute",
    width: "90%",
    alignSelf: "center",
    zIndex: 10,
    padding: "4%",
    bottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    flexDirection: "row",
    gap: 12,
    shadowColor: "#aaa",
    shadowOffset: { height: 4, width: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    alignItems: "center",
  },
});
