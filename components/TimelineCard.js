import { Card, Button } from "react-native-elements";
import { Text, View, ActivityIndicator, Image } from "react-native";
import React, { Component } from "react";
import * as Constants from "../Constants";
import * as firebase from "firebase";
import firestore from "@firebase/firestore";
var ref = null;
var url = null;

export default class TimelineCard extends React.Component {
  state = {
    title: "",
    type: "",
    image: "",
    loading: true,
  };

  async componentDidMount() {
    await this.getEvent();
  }

  async getEvent() {
    const db = firebase.firestore();
    db.collection("event")
      .doc(this.props.eventId)
      .get()
      .then(async (doc) => {
        this.setState({ title: doc.data().title });
        this.setState({ type: doc.data().type });
        this.setState({ image: doc.data().userId + doc.data().title });
        ref = firebase.storage().ref("images/" + this.state.image);
        url = await ref.getDownloadURL();
        this.setState({ loading: false });
      });
  }

  cardContents() {
    if (!this.state.loading) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={{ fontSize: 24, marginLeft: 10 }}>
            {this.state.title}
          </Text>
          <Text style={{ fontSize: 14, color: "#737272", marginLeft: 10 }}>
            {this.state.type}
          </Text>

          <Button
            containerStyle={{ alignSelf: "baseline" }}
            type="clear"
            title="DETAILS"
            titleStyle={{
              color: Constants.colors.primary,
              fontSize: 12,
              marginLeft: 6,
            }}
          />
        </View>
      );
    } else {
      return <ActivityIndicator size="large" color="grey" />;
    }
  }

  render() {
    return (
      <View
        style={{
          marginTop: 20,
          borderRadius: 15,
          overflow: "hidden",
          minWidth: "90%",
          maxHeight: Constants.windowHeight * 0.35,
          borderWidth: 1,
          borderColor: "#CDCBCB",
        }}
      >
        <View style={{ flex: 1 }}>
          <Image style={{ minHeight: "50%" }} source={{ uri: url }} />
        </View>
        <View style={{ flex: 1, justifyContent: "center" }}>
          {this.cardContents()}
        </View>
      </View>
    );
  }
}
