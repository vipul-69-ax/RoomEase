import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import Listing from "@/components/Listing";
import { useLocalSearchParams } from "expo-router";
import usePropertyListing from "@/hooks/api/usePropertyListing";
import { useAuthStore } from "@/utils/storage/useAuthStore";
import { ListingResponse } from "@/utils/schema/listing";
import { width } from "@/constants/Screen";
import { Colors } from "@/constants/Colors";
import RequestForm from "@/components/RequestForm";

export default function HouseInfo() {
  const [listing, setListing] = useState<ListingResponse>();
  const [showRequestForm, setShowReuqestForm] = useState<boolean>(false);
  const { id, token } = useLocalSearchParams();
  const { get_listing } = usePropertyListing();
  const fetchListing = async () => {
    if (!id || !token) return;
    const res = await get_listing.mutateAsync({
      id: id as string,
      token: token as string,
    });
    setListing(res.data);
  };
  useEffect(() => {
    fetchListing();
  }, []);
  return (
    <View style={{ flex: 1, paddingVertical: 60 }}>
      <Listing listing={listing} />
      <View style={styles.bottomBox}>
        <Text style={styles.price}>
          ₹{listing?.monthly_rent}
          <Text style={{ fontSize: 16, fontWeight: "normal", marginLeft: 12 }}>
            / month
          </Text>
        </Text>
        <TouchableOpacity
          onPress={() => setShowReuqestForm((s) => !s)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Request</Text>
        </TouchableOpacity>
      </View>
      <RequestForm
        visible={showRequestForm}
        onClose={() => setShowReuqestForm((s) => !s)}
        propertyDetails={{
          id: id as string,
          max_occupants:
            (listing?.max_occupancy as number) - (listing?.occupied as number),
          owner_token: token as string,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBox: {
    position: "absolute",
    width: width,
    backgroundColor: "white",
    bottom: 0,
    height: 60,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: "8%",
    justifyContent: "space-between",
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
  },
  button: {
    alignSelf: "center",
    backgroundColor: Colors.primary,
    borderRadius: 4,
    padding: "3%",
    minWidth: 128,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
