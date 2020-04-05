import * as React from "react";
import { Text, View, Image, SafeAreaView, ScrollView } from "react-native";
import { Header, Card, Button } from "react-native-elements";
import CustomHeader from "../components/Header";
import TimelineCard from "../components/TimelineCard";
import * as Constants from "../Constants";
export default function Timeline() {
  return (
    <View style={{ flex: 1 }}>
      <CustomHeader title="Timeline" />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Image
          source={require("../assets/flags.png")}
          fadeDuration={0}
          style={{
            width: Constants.windowWidth * 0.9,
            height: Constants.windowWidth * 0.6,
          }}
        />
        <Text
          style={{
            width: "70%",
            textAlign: "center",
            marginTop: 10,
            fontFamily: "Rubik-Regular",
            fontSize: 22,
          }}
        >
          Your timeline is empty
        </Text>
        <Text
          style={{
            width: "60%",
            textAlign: "center",
            marginTop: 10,
            fontFamily: "Rubik-Regular",
            fontSize: 15,
          }}
        >
          When you attend an event, it will show up here.
        </Text>
      </View>
    </View>
  );
}
