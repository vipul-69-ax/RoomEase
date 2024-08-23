import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  ListingRequestType,
  ProcessedRequestType,
} from "@/utils/schema/listing";
import { useProfile } from "@/hooks/api/useProfile";
import { useAuthStore } from "@/utils/storage/useAuthStore";
import { Image } from "expo-image";
import { Entypo, Feather, Ionicons } from "@expo/vector-icons";
import usePropertyListing from "@/hooks/api/usePropertyListing";

type RequestProps = {
  request: ListingRequestType[] | undefined;
  property_id: any;
};

export default function RequestsPage(props: RequestProps) {
  const { get_profile_details } = useProfile();
  const { reject_property_request, accept_property_request } =
    usePropertyListing();
  const [requests, setRequests] = useState<ProcessedRequestType[]>();
  const preprocessRequest = async () => {
    if (!props.request) return;
    const data: Promise<ProcessedRequestType>[] = props.request.map(
      async (request) => {
        const userData = await get_profile_details.mutateAsync(
          request.requestFrom
        );
        return {
          ...userData.data,
          rent: request.rent,
          occupants: request.occupants,
          userId: request.requestFrom,
        };
      }
    );
    const fetchedData = await Promise.all(data);
    setRequests(fetchedData);
  };

  const rejectRequest = async (userId: string) => {
    console.log(props.property_id);
    await reject_property_request.mutateAsync(
      {
        userId: userId,
        propertyId: props.property_id,
      },
      {
        onSuccess: (res) => alert("Refresh to see updated requests"),
        onError: (res) => alert("Unable to process request. Retry"),
      }
    );
  };
  const acceptRequest = async (userId: string) => {
    console.log(props.property_id);
    await accept_property_request.mutateAsync(
      {
        userId: userId,
        propertyId: props.property_id,
      },
      {
        onSuccess: (res) => alert("Refresh to see updated requests"),
        onError: (res) => alert("Unable to process request. Retry"),
      }
    );
  };

  useEffect(() => {
    preprocessRequest();
  }, []);
  if (!requests)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <ActivityIndicator size={32} color={"black"} />
      </View>
    );
  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: "4%" }}>
      <FlatList
        data={requests}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              Alert.alert(
                "Property request",
                `${item.fullName}'s request worth ${item.rent} per month`,
                [
                  {
                    text: "Accept Request",
                    onPress: () => acceptRequest(item.userId),
                  },
                  {
                    text: "Reject Request",
                    onPress: () => rejectRequest(item.userId),
                  },
                  {
                    text: "Close",
                  },
                ]
              );
            }}
            style={{
              flexDirection: "row",
              marginTop: 8,
              borderBottomWidth: 0.7,
              paddingVertical: 4,
              borderColor: "#d3d3d3",
            }}
          >
            <Image
              style={{ height: 50, width: 50, borderRadius: 30 }}
              source={{ uri: item.photo }}
            />
            <View style={{ marginLeft: 12, alignSelf: "center" }}>
              <Text style={{ fontSize: 18 }}>{item.fullName}</Text>
              <Text style={{ fontSize: 14, color: "#aaa", marginTop: 2 }}>
                Rent {item.rent} Occupants {item.occupants}
              </Text>
            </View>
            <View
              style={{
                gap: 5,
                position: "absolute",
                right: 10,
                alignSelf: "center",
              }}
            >
              <Feather name="arrow-up-right" size={20} />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
