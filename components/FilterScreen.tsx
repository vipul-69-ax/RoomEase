import { height } from "@/constants/Screen";
import useCurrentLocation, { Position } from "@/hooks/useCurrentLocation";
import {
  FacilityType,
  FilterSchema,
  UtilityType,
} from "@/utils/schema/listing";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Animated, { FadeIn } from "react-native-reanimated";
import { z } from "zod";
import FormInput from "./FormInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Colors } from "@/constants/Colors";
import useFilterStore from "@/utils/storage/useFilterStore";
import { Entypo } from "@expo/vector-icons";

type FilterScreenProps = {
  visible: boolean;
  onClose?: () => void;
};

type FilterForm = z.infer<typeof FilterSchema>;

export const FilterScreen = (props: FilterScreenProps) => {
  const [addedItems, setAddedItems] = useState<string[]>([]);
  const modalRef = useRef<Modal>(null);
  const { filters, updateFilters } = useFilterStore();
  const { control, getValues, setValue, handleSubmit } = useForm<FilterForm>();
  const { getCurrentPosition, requestPermission, geocodePosition } =
    useCurrentLocation();
  const [location, setLocation] = useState<Position | null>();
  const getMyPosition = async () => {
    try {
      if (filters.position) {
        const pos = filters.position;
        setLocation({
          lat: pos.latitude,
          lon: pos.longitude,
        });
        return;
      }
      const req = await requestPermission();
      if (!req) {
        setLocation(null);
        return;
      }
      const resp = await getCurrentPosition();
      setLocation(resp);
    } catch (err) {
      setLocation(null);
    }
  };
  const moveMarker = async (address: string) => {
    try {
      const resp = await geocodePosition(address);
      if (!resp) return;
      setLocation(resp);
      console.log(getValues("position"));
    } catch (err) {}
  };

  const onFormSubmit = async (data: FilterForm) => {
    try {
      const res = await FilterSchema.safeParseAsync(data);
      if (res.error) {
        alert(`Please enter a valid ${res.error?.issues[0].path[0]}`);
        return;
      }
      updateFilters({
        position: location?{
          latitude: location?.lat,
          longitude: location?.lon,
        }:undefined,
        budget: data.budget,
        distanceRadius: data.distanceRadius,
        facilities: data.facilities,
        utilities: data.utilities,
        occupants: data.occupants,
      });
      if (props.onClose) {
        props.onClose();
      }
    } catch (err) {}
  };

  const handleAddFacility = (data: FacilityType) => {
    if (getValues("facilities") && getValues("facilities")?.includes(data)) {
      const updatedValues = getValues("facilities")?.filter((i) => i !== data);
      setValue("facilities", updatedValues);
      setAddedItems((s) => s.filter((i) => i != data));
      return;
    }
    setAddedItems((s) => [...s, data]);
    if (!getValues("facilities")) {
      setValue("facilities", [data]);
    } else {
      const existing = getValues("facilities");
      if (existing) {
        setValue("facilities", [...existing, data]);
      }
    }
    console.log(getValues("facilities"));
  };

  const handleAddUtility = (data: UtilityType) => {
    if (getValues("utilities") && getValues("utilities")?.includes(data)) {
      const updatedValues = getValues("utilities")?.filter((i) => i !== data);
      setValue("utilities", updatedValues);
      setAddedItems((s) => s.filter((i) => i != data));
      return;
    }
    setAddedItems((s) => [...s, data]);
    if (getValues("utilities") === undefined) {
      setValue("utilities", [data]);
    } else {
      const existing = getValues("utilities");
      if (existing) {
        setValue("utilities", [...existing, data]);
      }
    }
    console.log(getValues("utilities"));
  };

  useEffect(() => {
    getMyPosition();
    setValue("distanceRadius", filters.distanceRadius);
    setValue("budget", filters.budget);
    setValue("occupants", filters.occupants);
    setValue("facilities", filters.facilities);
    setValue("utilities", filters.utilities);
    const facilityData =
      filters?.facilities && filters.utilities
        ? [...filters.facilities, ...filters.utilities]
        : filters?.utilities
        ? filters.utilities
        : filters?.facilities
        ? filters.facilities
        : [];
    setAddedItems(facilityData);
  }, []);
  return (
    <Modal
      ref={modalRef}
      visible={props.visible}
      animationType="slide"
      style={{ marginHorizontal: 10 }}
      onRequestClose={props.onClose}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Entypo
          onPress={props.onClose}
          name="cross"
          size={32}
          color={"black"}
          style={{ alignSelf: "flex-start", marginBottom: "4%", margin: "2%" }}
        />
        <KeyboardAwareScrollView
          style={{
            flex: 1,
            paddingHorizontal: "4%",
          }}
        >
          {!location && (
            <View
              style={[
                styles.map,
                { justifyContent: "center", alignItems: "center" },
              ]}
            >
              {location === null ? (
                <Text style={{ textAlign: "center" }}>
                  Cannot display map right now. Please enable location
                  permissions or retry later to use filters.
                </Text>
              ) : (
                <ActivityIndicator size={32} color={"black"} />
              )}
            </View>
          )}
          {location && (
            <MapView
              moveOnMarkerPress
              initialRegion={{
                latitude: location.lat,
                longitude: location.lon,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
              style={styles.map}
            >
              <Marker
                draggable
                onDragEnd={(event) => {
                  const coords = event.nativeEvent.coordinate;
                  console.log(coords);
                  setLocation({
                    lat: coords.latitude,
                    lon: coords.longitude,
                  });
                }}
                coordinate={{
                  latitude: location.lat,
                  longitude: location.lon,
                }}
              />
            </MapView>
          )}
          {location && (
            <Animated.View entering={FadeIn}>
              <FormInput
                label="Position marker"
                inputProps={{
                  onEndEditing: (e) => {
                    moveMarker(e.nativeEvent.text);
                  },
                }}
              />
            </Animated.View>
          )}
          <Controller
            control={control}
            name="distanceRadius"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Search radius"
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="budget"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Budget (min 1000)"
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="occupants"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Occupants per room"
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="facilities"
            render={() => (
              <View>
                <Text style={{ fontSize: 18, color: "#aaa" }}>Facilities</Text>
                <FlatList
                  data={[
                    { id: "Air Conditioning" },
                    { id: "Kitchen" },
                    { id: "Parking" },
                    { id: "Internet" },
                    { id: "Gym" },
                  ]}
                  horizontal
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleAddFacility(item.id as FacilityType)}
                      style={[
                        styles.listItem,
                        {
                          backgroundColor: !addedItems.includes(item.id)
                            ? "#f7f7f7"
                            : "#d3d3d3",
                        },
                      ]}
                    >
                      <Text>{item.id}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          />
          <Controller
            control={control}
            name="utilities"
            render={() => (
              <View style={{ marginTop: "2%" }}>
                <Text style={{ fontSize: 18, color: "#aaa" }}>Utilities</Text>
                <FlatList
                  data={[
                    { id: "Gas Supply" },
                    { id: "Electricity Backup" },
                    { id: "Water Supply" },
                    { id: "Washing Machine" },
                  ]}
                  horizontal
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleAddUtility(item.id as UtilityType)}
                      style={[
                        styles.listItem,
                        {
                          backgroundColor: !addedItems.includes(item.id)
                            ? "#f7f7f7"
                            : "#d3d3d3",
                        },
                      ]}
                    >
                      <Text>{item.id}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          />
          {location && (
            <TouchableOpacity
              onPress={handleSubmit(onFormSubmit)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Apply Filters</Text>
            </TouchableOpacity>
          )}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
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
    marginBottom:"4%"
  },
  input: {
    backgroundColor: "#f7f7f7",
    padding: "4%",
    marginTop: "2%",
  },
  listItem: {
    margin: 4,
    backgroundColor: "#f7f7f7",
    padding: 12,
    borderRadius:4
  },
  button: {
    width: "50%",
    backgroundColor: Colors.primary,
    padding: "3%",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: "8%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
