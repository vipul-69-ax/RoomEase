import { Colors } from "@/constants/Colors";
import { height, width } from "@/constants/Screen";
import { useAuthStore } from "@/utils/storage/useAuthStore";
import { useProfileStore } from "@/utils/storage/useProfileStore";
import {
  AntDesign,
  Ionicons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ReactNode } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function MyProfile() {
  const { profileData, removeProfileData } = useProfileStore();
  const { clear } = useAuthStore();
  const { name, phone, photo } = profileData;
  const onLogout = () => {
    Alert.alert("Logout", "Are you sure do you want to logout", [
      {
        text: "No",
        style: "cancel",
      },
      {
        text: "Yes",
        style: "default",
        onPress: () => {
          clear();
          removeProfileData();
          router.replace("/(auth)");
        },
      },
    ]);
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View
        style={{
          width,
          height: height / 2.5,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor:"#fff"
        }}
      >
        <Image source={{ uri: photo }} style={styles.avatar} />
        <Text
          style={{
            fontSize: 28,
            fontWeight: "600",
            marginTop: "4%",
          }}
        >
          {name}
        </Text>
        <Text style={{ fontSize: 16, color: "#aaa", marginTop: "1%" }}>
          {phone}
        </Text>
      </View>
      <Option
        onPress={() => {
          router.push("/(tabs)/(profile)/my_listing");
        }}
        name="House Listings"
        icon={<Octicons name="home" size={24} />}
      />
      <Option
        onPress={() => {
          router.push("/(tabs)/(profile)/my_requests");
        }}
        name="House Requests"
        icon={<Octicons name="moon" size={24} />}
      />
      <Option
        onPress={() => {
          clear();
          removeProfileData();
          router.replace("/(auth)");
        }}
        name="Logout"
        icon={<Octicons name="arrow-left" size={24} />}
      />
      {/* <View style={styles.infoContainer}>
        <Image source={{ uri: photo }} style={styles.avatar} />
        <View style={{}}>
          <Text style={{ fontSize: 28, fontWeight: "600" }}>{name}</Text>
          <Text style={{ fontSize: 16, color: "#aaa", marginTop: "3%" }}>
            {phone}
          </Text>
          <TouchableOpacity onPress={onLogout} style={styles.editProfile}>
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.optionContainer}>
        
        <TouchableOpacity onPress={()=>{
          router.push("/(tabs)/(profile)/my_requests")
        }} style={styles.option}>
          <View style={styles.iconBox}>
            <MaterialIcons name="bedroom-child" size={24} color="black" />
          </View>
          <Text style={styles.optionText}>My house requests</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <View style={styles.iconBox}>
            <AntDesign name="profile" size={24} color="black" />
          </View>
          <Text style={styles.optionText}>Edit profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, { borderBottomWidth: 0 }]}>
          <View style={styles.iconBox}>
            <Ionicons name="heart" size={24} color="black" />
          </View>
          <Text style={styles.optionText}>Wishlist</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
}

const Option = ({
  name,
  icon,
  onPress,
}: {
  name: string;
  icon: ReactNode;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.option}>
      <View style={styles.iconBox}>{icon}</View>
      <Text style={styles.optionText}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    flexDirection: "row",
    gap: 24,
    margin: "4%",
  },
  avatar: {
    height: 120,
    width: 120,
    borderRadius: 60,
    backgroundColor: "#aaa",
  },
  optionContainer: {
    width: "92%",
    backgroundColor: "white",
    alignSelf: "center",
    borderRadius: 16,
    paddingVertical: "2%",
  },
  option: {
    padding: "2%",
    flexDirection: "row",
    gap: 10,
    borderColor: "#d3d3d3",
    marginHorizontal: "4%",
  },
  optionText: {
    fontSize: 18,
    alignSelf: "center",
  },
  iconBox: {
    padding: "2%",
    borderRadius: 16,
  },
  editProfile: {
    borderWidth: 0.7,
    borderColor: "#d7d7d7",
    marginTop: "5%",
    borderRadius: 8,
    padding: "6%",
    justifyContent: "center",
    alignItems: "center",
  },
});
