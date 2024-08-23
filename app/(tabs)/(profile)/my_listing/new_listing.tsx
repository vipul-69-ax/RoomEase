import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Image } from "expo-image";
import {
  ImagePickerAsset,
  MediaTypeOptions,
  launchImageLibraryAsync,
  requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";
import { height, width } from "@/constants/Screen";
import { Entypo } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import {
  FacilityType,
  ListingFacilities,
  NewListingSchema,
  UtilityType,
} from "@/utils/schema/listing";
import FormInput from "@/components/FormInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import usePropertyListing, { Listing } from "@/hooks/api/usePropertyListing";
import useCurrentLocation, { Position } from "@/hooks/useCurrentLocation";
import { useAuthStore } from "@/utils/storage/useAuthStore";
import { router } from "expo-router";
import MapView, { Marker, MarkerAnimated } from "react-native-maps";
import { facilities, utilities } from "@/utils/constants";

const MemoizedImageItem = React.memo(
  ({
    item,
    onRemove,
  }: {
    item: ImagePickerAsset;
    onRemove: (assetId: string | null | undefined) => void;
  }) => {
    return (
      <Animated.View
        layout={LinearTransition.springify()}
        entering={FadeIn}
        exiting={FadeOut}
      >
        <Image source={{ uri: item.uri }} style={styles.image}>
          <TouchableOpacity
            onPress={() => onRemove(item.assetId)}
            style={styles.cross}
          >
            <Entypo name="cross" color="white" size={16} />
          </TouchableOpacity>
        </Image>
      </Animated.View>
    );
  }
);
type NewListingType = z.infer<typeof NewListingSchema>;

export default function NewListing() {
  const [images, setImages] = useState<ImagePickerAsset[]>([]);
  const [blueprint, setBlueprint] = useState<ImagePickerAsset>();
  const [loading, setLoading] = useState<boolean>(false);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [coords, setCoords] = useState<Position & { address: any }>();
  const [addedItems, setAddedItems] = useState<string[]>([]);
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
  const { control, handleSubmit, setValue, getValues } =
    useForm<NewListingType>();

  const { add_listing } = usePropertyListing();
  const { getCurrentPosition, reverseGeocodePosition, requestPermission } =
    useCurrentLocation();
  const { userData } = useAuthStore();

  const prevImagesRef = useRef(images);

  useEffect(() => {
    prevImagesRef.current = images;
  });

  const handleAddImage = async () => {
    try {
      const perm = await requestMediaLibraryPermissionsAsync();
      if (perm.granted) {
        const image = await launchImageLibraryAsync({
          mediaTypes: MediaTypeOptions.Images,
          allowsMultipleSelection: true,
          selectionLimit: 15 - images.length,
        });
        if (!image.canceled) {
          let filteredImages = [...images, ...image.assets].filter(
            (i) => i.type === "image"
          );

          filteredImages = filteredImages.filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.assetId === item.assetId)
          );

          setImages(filteredImages);
        }
      }
    } catch (err) {}
  };

  const handleAddBlueprint = async () => {
    const perm = await requestMediaLibraryPermissionsAsync();
    if (perm.granted) {
      const image = await launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        selectionLimit: 1,
      });
      if (!image.canceled) {
        setBlueprint(image.assets[0]);
      }
    }
  };

  const handleRemoveImage = useCallback(
    (assetId: string | null | undefined) => {
      setImages((currentImages) =>
        currentImages.filter((img) => img.assetId !== assetId)
      );
    },
    []
  );
  const renderItem = useCallback(
    ({ item }: { item: ImagePickerAsset }) => {
      return (
        <MemoizedImageItem
          item={item}
          onRemove={(assetId) => {
            handleRemoveImage(assetId);
          }}
        />
      );
    },
    [handleRemoveImage]
  );

  const onFormSubmit = async (data: NewListingType) => {
    setShowMap(false);
    if (loading) return;
    try {
      // if (images.length < 5) {
      //   alert("You need to add atleast 5 images of your property.");
      //   return;
      // }
      const parseResult = NewListingSchema.safeParse(data);
      if (!parseResult.success) {
        alert(`Please enter a valid ${parseResult.error.errors[0].path[0]}`);
        return;
      }
      if (!userData.jwtToken) {
        alert("User does not exist");
        return;
      }
      if (!coords) return;
      setLoading(true);
      const body: Listing = {
        ...data,
        listing_images: images,
        blueprint,
        token: userData.jwtToken,
        latitude: coords?.lat,
        longitude: coords?.lon,
        location: {
          type: "Point",
          coordinates: [coords?.lon, coords?.lat],
        },
        requests: [],
      };
      const res = await add_listing.mutateAsync(body);
      if (res?.status) {
        router.back();
      } else {
        alert("Some error occured while listing. Try again after sometime.");
      }
    } catch (err) {
      alert("Some error occured while listing. Try again after sometime.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentLocation = async () => {
    if (loading) return;
    try {
      const perm = await requestPermission();
      if (perm) {
        const pos = await getCurrentPosition();
        const address = await reverseGeocodePosition(pos);
        setCoords({
          ...pos,
          address: {
            full_address: address.address,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
          },
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFacility = (data: FacilityType) => {
    if (getValues("facilities") && getValues("facilities").includes(data)) {
      const updatedValues = getValues("facilities").filter((i) => i !== data);
      setValue("facilities", updatedValues);
      setAddedItems((s) => s.filter((i) => i != data));
      return;
    }
    setAddedItems((s) => [...s, data]);
    if (!getValues("facilities")) {
      setValue("facilities", [data]);
    } else {
      const existing = getValues("facilities");
      setValue("facilities", [...existing, data]);
    }
    console.log(getValues("facilities"));
  };

  const handleAddUtility = (data: UtilityType) => {
    if (getValues("utilities") && getValues("utilities").includes(data)) {
      const updatedValues = getValues("utilities").filter((i) => i !== data);
      setValue("utilities", updatedValues);
      setAddedItems((s) => s.filter((i) => i != data));
      return;
    }
    setAddedItems((s) => [...s, data]);
    if (getValues("utilities") === undefined) {
      setValue("utilities", [data]);
    } else {
      const existing = getValues("utilities");
      setValue("utilities", [...existing, data]);
    }
    console.log(getValues("utilities"));
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);
  return (
    <>
      <KeyboardAwareScrollView
        style={{ flex: 1, backgroundColor: "#fff", marginBottom: "8%" }}
      >
        <View style={styles.box}>
          {images.length <= 15 && (
            <AnimatedTouchable
              activeOpacity={1}
              onPress={() =>
                images.length <= 15
                  ? handleAddImage()
                  : alert("Please remove some images first.")
              }
              entering={FadeIn.duration(600)}
              exiting={FadeOut.duration(600)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Upload Images</Text>
            </AnimatedTouchable>
          )}

          <Text
            style={{
              marginVertical: "4%",
              textAlign: "center",
              fontSize: 16,
              color: "#aaa",
            }}
          >
            You can upload upto 15 images and need to upload atleast 5 images to
            register your property.
          </Text>
          <FlatList
            data={images}
            horizontal
            extraData={images}
            renderItem={renderItem}
          />
        </View>
        <View style={styles.box}>
          <AnimatedTouchable
            activeOpacity={1}
            onPress={handleAddBlueprint}
            entering={FadeIn.duration(600)}
            exiting={FadeOut.duration(600)}
            style={[styles.button]}
          >
            <Text style={styles.buttonText}>Add blueprint</Text>
          </AnimatedTouchable>
          <Text
            style={{
              marginVertical: "4%",
              textAlign: "center",
              fontSize: 16,
              color: "#aaa",
            }}
          >
            This is optional to upload but is recommended for big properties
            like mansions.
          </Text>
          <Image
            source={{ uri: blueprint?.uri }}
            style={{
              width: "100%",
              height: height / 4,
              backgroundColor: "#f7f7f7",
              borderRadius: 4,
            }}
          />
        </View>
        <View style={styles.box}>
          <Text style={{ fontSize: 20, fontWeight: "600" }}>Facilities</Text>
          <FlatList
            data={facilities}
            horizontal
            style={{ marginTop: 8 }}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  onPress={() => handleAddFacility(item.name as FacilityType)}
                  key={index}
                  style={[
                    styles.touchable,
                    {
                      backgroundColor: addedItems.includes(item.name)
                        ? "#d7d7d7"
                        : "transparent",
                    },
                  ]}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
        <View style={styles.box}>
          <Text style={{ fontSize: 20, fontWeight: "600" }}>Utilities</Text>
          <FlatList
            data={utilities}
            horizontal
            style={{ marginTop: 8 }}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  onPress={() => handleAddUtility(item.name as UtilityType)}
                  key={index}
                  style={[
                    styles.touchable,
                    {
                      backgroundColor: addedItems.includes(item.name)
                        ? "#d7d7d7"
                        : "transparent",
                    },
                  ]}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
        <View style={styles.box}>
          <Text style={{ fontSize: 20, fontWeight: "600" }}>
            Property details
          </Text>
          <Controller
            control={control}
            name="full_address"
            render={({ field: { onChange, value } }) => {
              return (
                <FormInput
                  onChange={onChange}
                  value={value}
                  label="Full Address"
                  labelAbout="Enter exact address information for better listing."
                  inputProps={{
                    multiline: true,
                    style: {
                      height: 80,
                      backgroundColor: "#f7f7f7",
                      borderRadius: 4,
                      marginTop: 8,
                      padding: "3%",
                    },
                    onFocus: () => {
                      if (
                        getValues("full_address")?.trim() === "" ||
                        !getValues("full_address")
                      ) {
                        Alert.alert(
                          "Location",
                          "Do you want to use your current location?",
                          [
                            {
                              text: "Yes",
                              onPress: () => {
                                if (coords?.address) {
                                  setValue(
                                    "full_address",
                                    coords.address.full_address
                                  );
                                  setValue("city", coords.address.city || "");
                                  setValue("state", coords.address.state || "");
                                  setValue(
                                    "pincode",
                                    coords.address.pincode || ""
                                  );
                                }
                              },
                            },
                            { text: "No" },
                          ]
                        );
                      }
                    },
                  }}
                />
              );
            }}
          />
          <Controller
            control={control}
            name="city"
            render={({ field: { onChange, value } }) => {
              return (
                <FormInput onChange={onChange} value={value} label="City" />
              );
            }}
          />
          <Controller
            control={control}
            name="state"
            render={({ field: { onChange, value } }) => {
              return (
                <FormInput onChange={onChange} value={value} label="State" />
              );
            }}
          />
          <Controller
            control={control}
            name="pincode"
            render={({ field: { onChange, value } }) => {
              return (
                <FormInput onChange={onChange} value={value} label="Pincode" />
              );
            }}
          />
          <Controller
            control={control}
            name="rooms"
            render={({ field: { onChange, value } }) => {
              return (
                <FormInput
                  onChange={onChange}
                  value={value}
                  label="Rooms"
                  labelAbout="Number of rooms"
                />
              );
            }}
          />
          <Controller
            control={control}
            name="max_occupancy"
            render={({ field: { onChange, value } }) => {
              return (
                <FormInput
                  onChange={onChange}
                  value={value}
                  label="Maximum Occupancy"
                  labelAbout="Maximum number of people allowed."
                />
              );
            }}
          />
          <Controller
            control={control}
            name="occupied"
            render={({ field: { onChange, value } }) => {
              return (
                <FormInput
                  onChange={onChange}
                  value={value}
                  label="People occupied"
                  labelAbout="Number of people already living"
                />
              );
            }}
          />
          <Controller
            control={control}
            name="bathrooms"
            render={({ field: { onChange, value } }) => {
              return (
                <FormInput
                  onChange={onChange}
                  value={value}
                  label="Bathrooms"
                  labelAbout="Number of bathrooms"
                />
              );
            }}
          />
          <Controller
            control={control}
            name="kitchen"
            render={({ field: { onChange, value } }) => {
              return (
                <FormInput
                  onChange={onChange}
                  value={value}
                  label="Kitchen"
                  labelAbout="Number of kitchen"
                />
              );
            }}
          />
          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, value } }) => {
              return (
                <FormInput
                  onChange={onChange}
                  value={value}
                  label="Type"
                  labelAbout="PG / Flat / Bunglow / House"
                />
              );
            }}
          />
          <Controller
            control={control}
            name="monthly_rent"
            render={({ field: { onChange, value } }) => {
              return (
                <FormInput
                  onChange={onChange}
                  value={value}
                  label="Monthly rent"
                  labelAbout="Per person rent"
                />
              );
            }}
          />
          <Controller
            control={control}
            name="information"
            render={({ field: { onChange, value } }) => {
              return (
                <FormInput
                  onChange={onChange}
                  value={value}
                  label="Information"
                  labelAbout="Anything extra you want to mention."
                  inputProps={{
                    multiline: true,
                    style: {
                      height: 150,
                      backgroundColor: "#f7f7f7",
                      borderRadius: 4,
                      marginTop: 8,
                      padding: "3%",
                    },
                  }}
                />
              );
            }}
          />
        </View>
      </KeyboardAwareScrollView>
      <View style={styles.submitBox}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            setShowMap(true);
          }}
          style={styles.button}
        >
          {loading ? (
            <ActivityIndicator size={16} color="white" />
          ) : (
            <Text style={styles.buttonText}>List Property</Text>
          )}
        </TouchableOpacity>
      </View>

      <Modal animationType="slide" visible={showMap}>
        <View style={{ flex: 1 }}>
          {coords && (
            <MapView
              style={{ flex: 1 }}
              showsBuildings
              showsTraffic
              initialRegion={{
                latitude: coords?.lat,
                longitude: coords?.lon,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
            >
              <MarkerAnimated
                draggable
                onDragEnd={(event) => {
                  console.log(event.nativeEvent.coordinate);
                  setCoords({
                    ...coords,
                    lat: event.nativeEvent.coordinate.latitude,
                    lon: event.nativeEvent.coordinate.longitude,
                  });
                }}
                coordinate={{
                  latitude: coords.lat,
                  longitude: coords.lon,
                }}
              />
            </MapView>
          )}
          <TouchableOpacity
            onPress={handleSubmit(onFormSubmit)}
            style={[
              styles.button,
              {
                position: "absolute",
                bottom: 50,
              },
            ]}
          >
            <Text style={styles.buttonText}>Set Location</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 0.7,
    borderColor: "#d3d3d3",
    padding: "2%",
    margin: "2%",
    borderStyle: "dotted",
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
  image: {
    height: 120,
    width: width / 3 - 10,
    borderRadius: 8,
    backgroundColor: "#d7d7d7",
    margin: 4,
  },
  cross: {
    margin: "3%",
    backgroundColor: "#333",
    opacity: 0.7,
    alignSelf: "flex-start",
    borderRadius: 4,
    padding: "1%",
  },
  submitBox: {
    width,
    padding: "4%",
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
  },
  touchable: {
    borderWidth: 0.7,
    alignSelf: "flex-start",
    padding: 12,
    margin: 4,
    borderRadius: 32,
    borderColor: "#d7d7d7",
  },
});
