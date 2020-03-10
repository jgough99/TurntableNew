import * as React from "react";
import { Text, View, Image, SafeAreaView, ScrollView } from "react-native";
import { Header, Card, Button } from "react-native-elements";
import CustomHeader from "../components/Header";
import TimelineCard from "../components/TimelineCard";
export default function Timeline() {
  return (
    <View style={{ flex: 1 }}>
      <CustomHeader title="Timeline" />
      <View style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView>
            <Text
              style={{
                fontWeight: "700",
                color: "#737272",
                marginLeft: 15,
                marginTop: 15
              }}
            >
              23/01/2020
            </Text>
            <TimelineCard
              title="Club One"
              type="Commercial Event"
              imagePath={require("../assets/club.jpg")}
            />
            <TimelineCard
              title="Club Two"
              type="Commercial Event"
              imagePath={require("../assets/club2.jpg")}
            />
            <TimelineCard
              title="Beach Party"
              type="Private Event"
              imagePath={require("../assets/party.jpg")}
            />
            <TimelineCard
              title="Club Three"
              type="Commercial Event"
              imagePath={require("../assets/club3.jpg")}
            />
          </ScrollView>
        </SafeAreaView>
      </View>
    </View>
  );
}
