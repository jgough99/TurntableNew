import * as React from "react";
import {
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Header, Card, Button } from "react-native-elements";
import CustomHeader from "../components/Header";
import TimelineCard from "../components/TimelineCard";
import * as Constants from "../Constants";
import * as firebase from "firebase";
import firestore from "@firebase/firestore";

export default class Timeline extends React.Component {
  state = {
    events: [],
    noEvents: null,
  };

  componentDidMount() {
    this.getEventList();
  }

  onScreenFocus = () => {
    this.componentDidMount();
  };

  getEventList() {
    const db = firebase.firestore();

    db.collection("attendance")
      .where("userId", "==", firebase.auth().currentUser.uid.toString())
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          this.setState({ noEvents: true });
          return;
        }
        snapshot.forEach((doc) => {
          this.state.events.push(doc.data().eventId);
        });
        this.setState({ noEvents: false });

        this.getEventDetails();
      })

      .catch((err) => {
        console.log("Error getting documents", err);
      });
  }

  render() {
    if (this.state.noEvents == false) {
      return (
        <View style={{ flex: 1 }}>
          <CustomHeader title="Timeline" />
          <View style={{ flex: 1, alignItems: "center", minWidth: "100%" }}>
            {this.state.events.map((event, index) => (
              <TimelineCard eventId={event} />
            ))}
          </View>
        </View>
      );
    }
    if (this.state.noEvents == true) {
      return (
        <View style={{ flex: 1 }}>
          <CustomHeader title="Timeline" />
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
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
    } else {
      return <ActivityIndicator size="large" color="grey" />;
    }
  }
}
