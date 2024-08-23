import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { height, width } from "@/constants/Screen";
import {
  AntDesign,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Animated from "react-native-reanimated";
import { Image } from "expo-image";
import { Colors } from "@/constants/Colors";
import { ListingResponse } from "@/utils/schema/listing";

type HouseListingProps = {
  listing: ListingResponse;
  onPress?: () => void;
  accepted?: boolean;
};

export default function HouseListing(props: HouseListingProps) {
  const listing = props.listing;
  return (
    <TouchableOpacity
      onPress={props.onPress}
      activeOpacity={1}
      style={styles.container}
    >
      <Image
        source={{
          uri: listing.listing_images[0],
        }}
        style={styles.image}
      />
      <View style={{ padding: "4%" }}>
        <Text style={styles.streetAddress} numberOfLines={1}>
          {listing.full_address}
        </Text>
        <Text style={styles.city}>
          {listing.city}, {listing.state}
        </Text>
        <Text style={styles.price}>
          ₹{listing.monthly_rent}{" "}
          <Text style={{ fontSize: 18, fontWeight: "normal" }}>/ month</Text>
        </Text>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>Read More</Text>
        </View>
      </View>
      {props.accepted !== undefined && (
        <View
          style={{
            width: "100%",
            backgroundColor: "#f7f7f7",
            padding: "3%",
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "600" }}>
            Property Request {props.accepted?"Accepted":"Not Accepted"}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - 40,
    backgroundColor: "white",
    borderRadius: 12,
    marginVertical: "3%",
    shadowColor: "#d7d7d7",
    shadowOffset: { height: 4, width: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
  },
  image: {
    width: "100%",
    height: height / 3.5,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  streetAddress: {
    fontSize: 28,
    fontWeight: "bold",
  },
  city: {
    marginTop: "2%",
    fontSize: 16,
    color: "gray",
  },
  price: {
    fontSize: 28,
    marginTop: "8%",
    fontWeight: "bold",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginVertical: "5%",
    marginBottom: "2%",
  },
  iconText: { fontSize: 16, color: "gray" },
});
