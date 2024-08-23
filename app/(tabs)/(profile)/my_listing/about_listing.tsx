import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { ListingResponse } from "@/utils/schema/listing";
import usePropertyListing from "@/hooks/api/usePropertyListing";
import { useAuthStore } from "@/utils/storage/useAuthStore";
import { width } from "@/constants/Screen";
import Listing from "@/components/Listing";
import { TabView, SceneMap, TabBarProps } from "react-native-tab-view";
import RequestsPage from "./requests_page";
import OptionsPage from "./options_page";

export default function AboutListing() {
  const { id } = useLocalSearchParams();
  const { userData } = useAuthStore();
  const { get_listing } = usePropertyListing();
  const [listing, setListing] = useState<ListingResponse>();

  const _renderTabBar = (props: TabBarProps<any>) => {
    return (
      <View key={Math.random().toString(36)} style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          return (
            <TouchableOpacity
              key={Math.random().toString(36)}
              style={{
                backgroundColor:
                  route.key === routes[tabIndex].key
                    ? "#f7f7f7"
                    : "transparent",
                width: width / 3 - 30,
                margin: 12,
                padding: "4%",
                borderRadius: 10,
                opacity: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => setTabIndex(i)}
            >
              <Text style={{ fontSize: 16, fontWeight: "600" }}>
                {route.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const fetchListing = async () => {
    if (id && userData.jwtToken) {
      const res = await get_listing.mutateAsync({
        id: id as string,
        token: userData.jwtToken,
      });
      setListing(res.data);
    }
  };
  useEffect(() => {
    fetchListing();
  }, []);

  const renderScene = SceneMap({
    listing: () => <Listing key="1" listing={listing} />,
    requests: () => <RequestsPage key="2" request={listing?.requests} property_id={listing?._id} />,
    edit: () => <OptionsPage key="3" listing={listing}/>,
  });
  const [tabIndex, setTabIndex] = useState(0);
  const [routes] = useState([
    { key: "listing", title: "Listing" },
    { key: "requests", title: "Requests" },
    { key: "edit", title: "Options" },
  ]);
  return (
    <TabView
      style={{
        marginTop: StatusBar.currentHeight || 0 + 60,
        backgroundColor: "white",
      }}
      navigationState={{ index: tabIndex, routes }}
      renderScene={renderScene}
      renderTabBar={_renderTabBar}
      onIndexChange={setTabIndex}
      initialLayout={{ width: width }}
    />
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    paddingTop: StatusBar.currentHeight,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
});
