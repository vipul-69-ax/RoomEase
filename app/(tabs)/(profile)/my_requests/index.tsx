import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, Stack } from "expo-router";
import usePropertyListing from "@/hooks/api/usePropertyListing";
import { useAuthStore } from "@/utils/storage/useAuthStore";
import { height, width } from "@/constants/Screen";
import HouseListing from "@/components/ListingCard";
import { ListingResponse } from "@/utils/schema/listing";
import { Image } from "expo-image";

export default function MyRequests() {
  const { get_my_requests, remove_approved_request } = usePropertyListing();
  const [visible, setVisible] = useState(false);
  const [dealerInfo, setDealerInfo] = useState<{
    photo: string;
    phone: string;
    name: string;
    property_id: any;
  }>();
  const [listings, setListings] = useState<
    (ListingResponse & {
      accepted: boolean;
      photo: string;
      phone: string;
      name: string;
      property_id: any;
    })[]
  >();
  const { userData } = useAuthStore();
  const getVisitRequests = async () => {
    if (userData.jwtToken) {
      const resp = await get_my_requests.mutateAsync(userData.jwtToken);
      setListings(resp.data);
    }
  };
  const removeApprovedRequest = async (propertyId: any) => {
    console.log(propertyId);
    if (userData.jwtToken) {
      await remove_approved_request.mutateAsync(
        {
          userId: userData.jwtToken,
          propertyId,
        },
        {
          onError: () => alert("Error removing request."),
          onSuccess: () => {
            router.back();
            alert("Request removed.");
          },
        }
      );
    }
  };
  useEffect(() => {
    getVisitRequests();
  }, []);
  return (
    <>
      <View style={{ padding: "4%", flex: 1, alignItems: "center" }}>
        <Stack.Screen
          options={{ headerShown: true, headerTitle: "My Requests" }}
        />
        <FlatList
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
              accepted={item.accepted}
              onPress={() => {
                if (item.accepted) {
                  setDealerInfo({
                    phone: item.phone,
                    photo: item.photo,
                    name: item.name,
                    property_id: item.property_id,
                  });
                  setVisible(true);
                  return;
                }
                router.push({
                  pathname: "/(tabs)/(profile)/my_requests/about_listing",
                  params: {
                    id: item._id,
                    token: item.token,
                  },
                } as any);
              }}
            />
          )}
        />
      </View>
      <Modal
        visible={visible}
        onRequestClose={() => setVisible(false)}
        transparent
        animationType="slide"
      >
        <View style={styles.modal}>
          <Image
            style={{ height: 90, width: 90, borderRadius: 60 }}
            source={{ uri: dealerInfo?.photo }}
          />
          <Text
            style={{ marginVertical: "2%", fontSize: 28, fontWeight: "600" }}
          >
            {dealerInfo?.name}
          </Text>
          <Text style={{ fontSize: 16 }}>{dealerInfo?.phone}</Text>
          <View style={{ flexDirection: "row", gap: 12, marginTop: "4%" }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                removeApprovedRequest(dealerInfo?.property_id);
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "600" }}>Remove</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setVisible(false)}
            >
              <Text style={{ fontSize: 18, fontWeight: "600" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    padding: "3%",
    borderRadius: 40,
    width: 120,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  modal: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    position: "absolute",
    height: height / 3,
    width: "100%",
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
