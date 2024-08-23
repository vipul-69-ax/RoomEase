import {
  FlatList,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { Image } from "expo-image";
import { height, width } from "@/constants/Screen";
import { ListingResponse } from "@/utils/schema/listing";
import MapView, { Marker } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
export default function Listing({
  listing,
}: {
  listing: ListingResponse | undefined;
}) {
  const facilityData =
    listing?.facilities && listing.utilities
      ? [...listing.facilities, ...listing.utilities]
      : listing?.utilities
      ? listing.utilities
      : listing?.facilities
      ? listing.facilities
      : [];
  if (!listing) return <></>;
  const listing_image_data = listing?.listing_images.map((i, index) => {
    return {
      id: index.toString(),
      key:index.toString(),
      image: i,
    };
  });
  if (!listing)
    return (
      <View>
        <Text>Try again after sometime!</Text>
      </View>
    );
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ padding: 12, flex: 1, backgroundColor: "white", paddingBottom:24 }}
    >
      <FlatList
        horizontal
        data={listing_image_data}
        pagingEnabled
        renderItem={({ item, index }) => (
          <Image key={index} source={{ uri: item.image }} style={styles.image}>
            <View style={styles.imageTextBox}>
              <View style={styles.imageTextBoxInner}></View>
              <Text style={styles.imageText}>
                {index + 1}/{listing_image_data?.length}
              </Text>
            </View>
          </Image>
        )}
      />
      <View style={{ marginHorizontal: 10 }}>
        <View
          style={{
            marginTop: "8%",
            gap: 15,
            flexDirection: "row",
          }}
        >
          <Text
            onPress={() => {
              alert(`${listing.full_address}, ${listing.city}, ${listing.pincode}
          ${listing.state}`);
            }}
            style={styles.address}
            numberOfLines={3}
          >
            {listing.full_address}, {listing.city}, {listing.pincode}{" "}
            {listing.state}
          </Text>
          {true && (
            <View
              style={{
                height: "100%",
                width: "40%",
                minHeight: 100,
                backgroundColor: "#f7f7f7",
              }}
            >
              <MapView
                onPress={() => {
                  const fullAddress = `${listing.full_address},${listing.city},${listing.state}`;
                  const url = Platform.select({
                    ios: `maps:0,0?q=${fullAddress}`,
                    android: `geo:0,0?q=${fullAddress}`,
                  });
                  if (url) {
                    Linking.openURL(url);
                  }
                }}
                showsBuildings
                showsIndoors
                showsTraffic
                loadingEnabled
                legalLabelInsets={{ top: 100, bottom: 0, right: 0, left: 0 }}
                initialRegion={{
                  latitude: listing.latitude,
                  longitude: listing.longitude,
                  latitudeDelta: 0.00822,
                  longitudeDelta: 0.00821,
                }}
                style={styles.map}
              >
                <Marker
                  coordinate={{
                    latitude: listing.latitude,
                    longitude: listing.longitude,
                  }}
                />
              </MapView>
            </View>
          )}
        </View>
        <View style={{ flexDirection: "row", gap: 24, marginTop: "8%" }}>
          <View style={styles.houseInfoBox}>
            <MaterialIcons name="bedroom-parent" color={"#444"} size={28} />
            <Text style={styles.houseInfo}>{listing.rooms} Rooms</Text>
          </View>
          <View style={styles.houseInfoBox}>
            <MaterialIcons name="bathroom" color={"#444"} size={28} />
            <Text style={styles.houseInfo}>
              {listing.bathrooms} Bath{listing.bathrooms > 1 ? "s" : ""}
            </Text>
          </View>
          <View style={styles.houseInfoBox}>
            <MaterialIcons name="room-service" color={"#444"} size={28} />
            <Text style={styles.houseInfo}>{listing.kitchen} Kitchen</Text>
          </View>
        </View>
        <View style={styles.line} />
        <View style={styles.infoBox}>
          <Text style={{ fontSize: 18, marginVertical: "2%" }}>
            {listing.information}
          </Text>
          <View
            style={{
              marginTop: "2%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "500" }}>
              Available for rent
            </Text>
            <Text style={{ fontSize: 18, fontWeight: "500" }}>
              {listing.isActive ? "Yes" : "No"}
            </Text>
          </View>
          <View
            style={{
              marginTop: "4%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "500" }}>
              Maximum Occupancy
            </Text>
            <Text style={{ fontSize: 18, fontWeight: "500" }}>
              {listing.max_occupancy}
            </Text>
          </View>
          <View
            style={{
              marginTop: "4%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "500" }}>
              Available Space
            </Text>
            <Text style={{ fontSize: 18, fontWeight: "500" }}>
              {listing.max_occupancy - listing.occupied}
            </Text>
          </View>
        </View>
        {facilityData.length > 0 && (
          <View style={{ marginTop: "4%" }}>
            <Text style={{ fontSize: 18, fontWeight: "500" }}>Facilities</Text>
            <FlatList
              horizontal
              style={{ marginVertical: "2%" }}
              data={facilityData}
              renderItem={({ item }) => (
                <View
                  key={item}
                  style={{
                    margin: 4,
                    backgroundColor: "#f7f7f7",
                    padding: 8,
                    borderRadius: 4,
                  }}
                >
                  <Text>{item}</Text>
                </View>
              )}
            />
          </View>
        )}
      </View>
      {listing.blueprint && (
        <>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "500",
              margin: 8,
              marginHorizontal: "4%",
            }}
          >
            Blueprint
          </Text>
          <Image
            source={{ uri: listing.blueprint }}
            style={[
              styles.image,
              {
                height: 250,
                marginTop: 4,
              },
            ]}
          />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  image: {
    height: height / 3,
    width: width - 32,
    borderRadius: 16,
    margin: 4,
  },
  imageText: {
    position: "absolute",
    fontSize: 18,
    color: "white",
    fontWeight: "600",
  },
  imageTextBox: {
    height: 40,
    width: 60,
    borderRadius: 24,
    position: "absolute",
    bottom: 20,
    right: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  imageTextBoxInner: {
    width: "100%",
    height: "100%",
    backgroundColor: "black",
    borderRadius: 10,
    opacity: 0.5,
  },
  address: {
    fontSize: 24,
    fontWeight: "bold",
    width: "55%",
    alignSelf: "center",
  },
  map: {
    flex: 1,
    borderRadius: 16,
  },
  houseInfoBox: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  houseInfo: {
    fontSize: 16,
    color: "#000",
    opacity: 0.8,
  },
  line: {
    borderWidth: 0.5,
    borderColor: "#aaa",
    marginVertical: "4%",
    borderStyle: "dashed",
  },
  infoBox: {},
});
