import { Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Listing from "@/components/Listing";
import { router, useLocalSearchParams } from "expo-router";
import usePropertyListing from "@/hooks/api/usePropertyListing";
import { ListingResponse } from "@/utils/schema/listing";
import { Colors } from "@/constants/Colors";
import { useAuthStore } from "@/utils/storage/useAuthStore";

export default function AboutListing() {
  const [listing, setListing] = useState<ListingResponse & { rent: string }>();
  const { id, token } = useLocalSearchParams();
  const { get_listing, reject_property_request } = usePropertyListing();
  const { userData } = useAuthStore();
  const fetchListing = async () => {
    if (!id || !token) return;
    const res = await get_listing.mutateAsync({
      id: id as string,
      token: token as string,
    });
    const rent = res.data?.requests.filter(
      (i:any) => i.requestFrom == userData?.jwtToken
    );
    setListing({
      ...res.data,
      rent: rent ? rent[0].rent : "",
    });
  };

  const removeRequest = async () => {
    await reject_property_request.mutateAsync(
      {
        userId: userData?.jwtToken as string,
        propertyId: listing?._id,
      },
      {
        onSuccess: () => {
          router.navigate("/(tabs)/(profile)");
        },
        onError: () => {
          alert("Error removing request");
        },
      }
    );
  };
  useEffect(() => {
    fetchListing();
  }, []);
  return (
    <View style={{ flex: 1, paddingBottom: 10 }}>
      <View
        style={{
          width: "92%",
          padding: "2%",
          margin: "2%",
          marginTop: "4%",
          backgroundColor: "#fff",
          borderRadius: 4,
          alignSelf: "center",
          borderBottomWidth:0.8,
          borderColor:"#aaa"
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: "2%",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "600" }}>Proposed Rent</Text>
          <Text style={{ fontSize: 18 }}>{listing?.rent}</Text>
        </View>
        <Text
          onPress={removeRequest}
          style={{
            alignSelf: "center",
            marginTop: "4%",
            color: Colors.primary,
            fontSize: 17,
          }}
        >
          Cancel Request
        </Text>
      </View>
      <Listing listing={listing} />
    </View>
  );
}
