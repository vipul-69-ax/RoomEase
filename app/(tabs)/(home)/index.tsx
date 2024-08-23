import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/utils/storage/useAuthStore";
import HouseListing from "@/components/ListingCard";
import { height, width } from "@/constants/Screen";
import usePropertyListing from "@/hooks/api/usePropertyListing";
import { ListingResponse } from "@/utils/schema/listing";
import { RefreshControl } from "react-native-gesture-handler";
import { FilterScreen } from "@/components/FilterScreen";
import { Ionicons } from "@expo/vector-icons";
import useFilterStore from "@/utils/storage/useFilterStore";
import { router } from "expo-router";

export default function Home() {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { filters } = useFilterStore();
  const [listings, setListings] = useState<ListingResponse[]>();
  const { get_other_listings } = usePropertyListing();
  const { userData } = useAuthStore();
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const fetchListings = async () => {
    if (userData.jwtToken) {
      const resp = await get_other_listings.mutateAsync({
        filterData: filters,
        token: userData.jwtToken,
      });
      setListings(resp.data);
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchListings();
    } catch (err) {
      console.log(err)
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    fetchListings();
  }, [filters]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="filter"
          size={24}
          color={"black"}
          onPress={() => setShowFilters((s) => !s)}
        />
        <Text style={styles.app}>RoomEase</Text>
        <Ionicons name="notifications" size={0} color={"white"} />
      </View>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View style={{ marginTop: "10%" }}>
            <Text style={{ fontSize: 18, color: "gray" }}>
              No listings around you
            </Text>
          </View>
        )}
        style={{ flex: 1, width: width }}
        contentContainerStyle={{ alignItems: "center" }}
        data={listings}
        renderItem={({ item }) => (
          <HouseListing
            listing={item}
            onPress={() => {
              router.push({
                pathname: "/(tabs)/(home)/listing_info",
                params: {
                  id: item._id,
                  token: item.token,
                },
              } as any);
            }}
          />
        )}
      />
      <FilterScreen
        visible={showFilters}
        onClose={() => setShowFilters((s) => !s)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  label: {
    fontSize: 18,
    color: "#555",
  },
  map: {
    width: "100%",
    height: height / 3,
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
  },
  input: {
    backgroundColor: "#f7f7f7",
    padding: "4%",
    marginTop: "2%",
  },
  header: {
    height: 40,
    width: "100%",
    backgroundColor: "white",
    marginBottom: "4%",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: "5%",
    justifyContent: "space-evenly",
  },
  app: {
    fontSize: 24,
    fontWeight: "500",
    marginHorizontal: "24%",
  },
});
