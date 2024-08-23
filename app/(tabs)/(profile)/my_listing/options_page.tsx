import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { ListingResponse, OptionsFormSchema } from "@/utils/schema/listing";
import { Controller, useForm } from "react-hook-form";
import FormInput from "@/components/FormInput";
import { Colors } from "@/constants/Colors";
import usePropertyListing from "@/hooks/api/usePropertyListing";
import { useAuthStore } from "@/utils/storage/useAuthStore";

type OptionsForm = z.infer<typeof OptionsFormSchema>;

export default function OptionsPage({
  listing,
}: {
  listing: ListingResponse | undefined;
}) {
  const { control, handleSubmit, setValue, getValues } = useForm<OptionsForm>();
  const { update_property_data } = usePropertyListing();
  const { userData } = useAuthStore();
  const [loading, setLoading] = useState<boolean>(false);
  const onSubmit = async (data: OptionsForm) => {
    if (loading) return;
    if (userData?.jwtToken) {
      setLoading(true);
      const query = {
        ...data,
        id: listing?._id,
      };
      console.log(getValues(("availableForListing")))
      if (getValues("availableForListing") === undefined) {
        query["availableForListing"] = listing?.isActive as boolean;
      }
      console.log(query)
      await update_property_data.mutateAsync(query, {
        onSuccess: (data) => {
          alert("Property updated. Please refresh.");
          setLoading(false);
        },
        onError: () => {
          alert("Property could not be updated.");
          setLoading(false);
        },
      });
    }
  };
  const [isAvailable, setIsAvailable] = useState<boolean | undefined>(
    listing?.isActive
  );
  useEffect(() => {
    setValue("rent", listing?.monthly_rent.toString() || "");
    setValue("information", listing?.information || "");
    if (listing?.max_occupancy && listing.occupied) {
      setValue(
        "spaceLeft",
        (listing?.max_occupancy - listing?.occupied).toString() || ""
      );
    }
  }, []);
  return (
    <View style={{ flex: 1, padding: "4%" }}>
      <View
        style={{
          backgroundColor: "#f7f7f7",
          padding: "3%",
          borderRadius: 8,
          marginBottom: "4%",
        }}
      >
        <Text style={styles.label}>Property available to rent</Text>
        <Text
          onPress={() => {
            setValue("availableForListing", !getValues("availableForListing"));
            setIsAvailable((s) => !s);
          }}
          style={{ fontSize: 28, fontWeight: "600", marginTop: "2%" }}
        >
          {isAvailable ? "Yes" : "No"}
        </Text>
      </View>
      <Controller
        control={control}
        name="rent"
        render={({ field: { onChange, value } }) => (
          <>
            <FormInput
              label="Rent per month"
              onChange={onChange}
              value={value}
            />
          </>
        )}
      />
      <Controller
        control={control}
        name="spaceLeft"
        render={({ field: { onChange, value } }) => (
          <>
            <FormInput label="Space Left" onChange={onChange} value={value} />
          </>
        )}
      />
      <Controller
        control={control}
        name="information"
        render={({ field: { onChange, value } }) => (
          <>
            <FormInput
              label="Information"
              onChange={onChange}
              value={value}
              inputProps={{
                multiline: true,
                style: {
                  height: 80,
                  backgroundColor: "#f7f7f7",
                  borderRadius: 4,
                  marginTop: 8,
                  padding: "3%",
                },
              }}
            />
          </>
        )}
      />
      <TouchableOpacity onPress={handleSubmit(onSubmit)} style={styles.button}>
        {loading ? (
          <ActivityIndicator color={"white"} />
        ) : (
          <Text style={styles.buttonText}>Update</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    marginTop: "2%",
  },
  button: {
    alignSelf: "center",
    backgroundColor: Colors.primary,
    borderRadius: 4,
    padding: "3%",
    minWidth: 128,
    alignItems: "center",
    marginTop: "5%",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
