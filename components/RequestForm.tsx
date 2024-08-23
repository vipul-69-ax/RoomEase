import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import Animated, { SlideInDown, SlideInUp } from "react-native-reanimated";
import FormInput from "./FormInput";
import { Colors } from "@/constants/Colors";
import { useAuthStore } from "@/utils/storage/useAuthStore";
import usePropertyListing from "@/hooks/api/usePropertyListing";

type RequestFormProps = {
  visible: boolean;
  onClose?: () => void;
  propertyDetails: {
    id: string;
    max_occupants: number;
    owner_token: string;
  };
};

export default function RequestForm(props: RequestFormProps) {
  const { request_property_visit } = usePropertyListing();
  const [occupants, setOccupants] = useState(1);
  const [rent, setRent] = useState("");
  const { jwtToken: my_token } = useAuthStore().userData;
  const handleChangeOccupants = (type: "add" | "sub") => {
    if (type == "add") {
      setOccupants((s) => Math.min(s + 1, props.propertyDetails.max_occupants));
      return;
    } else {
      setOccupants((s) => Math.max(s - 1, 1));
      return;
    }
  };
  const onFormSubmit: () => void = async () => {
    if (!my_token) return;
    try {
      const resp = await request_property_visit.mutateAsync({
        owner_id: props.propertyDetails.owner_token,
        property_id: props.propertyDetails.id,
        my_id: my_token,
        rent,
        occupants,
      });
      if(props.onClose){
        props.onClose()
      }
      if (!resp.status) {
        alert("You have already requested to visit this property");
      }
    } catch (err) {}
  };

  return (
    <Modal
      animationType="slide"
      visible={props.visible}
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
        <View style={{ flex: 1, marginHorizontal: "4%" }}>
          <Text style={{ fontSize: 18 }}>Number of people</Text>
          <View
            style={{
              flexDirection: "row",
              gap: 28,
              marginTop: "4%",
              alignItems: "center",
            }}
          >
            <AntDesign
              onPress={() => handleChangeOccupants("sub")}
              name="minus"
              size={16}
            />
            <Animated.Text
              entering={SlideInDown.withInitialValues({ originY: 400 })}
              style={{ fontSize: 48, fontWeight: "bold" }}
            >
              {occupants}
            </Animated.Text>
            <Ionicons
              onPress={() => handleChangeOccupants("add")}
              name="add"
              size={16}
            />
          </View>
          <FormInput
            label="Rent"
            value={rent}
            inputProps={{
              keyboardType: "number-pad",
            }}
            onChange={(val) => {
              setRent(val);
            }}
            labelAbout="Enter rent you are willing to pay"
          />
          <TouchableOpacity onPress={onFormSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Send Request</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "center",
    backgroundColor: Colors.primary,
    borderRadius: 4,
    padding: "3%",
    minWidth: 128,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
