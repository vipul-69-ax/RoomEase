import * as Location from "expo-location";

export type Position = {
  lat: number;
  lon: number;
};

const useCurrentLocation = () => {
  const requestPermission = async () => {
    const status = await Location.requestForegroundPermissionsAsync();
    return status.granted;
  };
  const getCurrentPosition = async () => {
    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });
    return {
      lat: pos.coords.latitude,
      lon: pos.coords.longitude,
    };
  };
  const geocodePosition = async (address: string) => {
    const pos = await Location.geocodeAsync(address);
    return {
      lat: pos[0].latitude,
      lon: pos[0].longitude,
    };
  };
  const reverseGeocodePosition = async (position: Position) => {
    const pos = await Location.reverseGeocodeAsync({
      latitude: position.lat,
      longitude: position.lon,
    });
    console.log(pos[0]);
    return {
      address: pos[0].street + " " + pos[0].district,
      city: pos[0].city,
      pincode: pos[0].postalCode,
      state: pos[0].region,
    };
  };
  return {
    getCurrentPosition,
    requestPermission,
    geocodePosition,
    reverseGeocodePosition,
  };
};

export default useCurrentLocation;
