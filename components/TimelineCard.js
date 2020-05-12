import { Card, Button, Overlay } from "react-native-elements";
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
    visible: false,
    songs: [],
    songData: [],
  };

  //On load, get the songs and event details for the timeline
  async componentDidMount() {
    await this.getEvent();
    await this.getSongs();
  }

  //Function to get the songs from firebase which were played while the user was at the event
  async getSongs() {
    const db = firebase.firestore();
    db.collection("userSong")
      .where("eventId", "==", this.props.eventId)
      .where("userId", "==", firebase.auth().currentUser.uid.toString())
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          console.log("Song found");
          this.state.songs.push(doc.data().songId);
          this.getSongDetails(doc.data().songId);
        });
      });
    this.setState({ loading: false });
  }

  //Toggle the overlay for the playlist
  toggleOverlay = () => {
    this.setState({ visible: !this.state.visible });
  };

  //Get the event details from the firebase database
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
      });
  }

  //Get the details of a particular song in the playlist
  getSongDetails(song) {
    const db = firebase.firestore();
    db.collection("song")
      .doc(song)
      .get()
      .then(async (doc) => {
        this.state.songData.push(doc.data());
        console.log("hi");
      });
  }

  //Render the contents of the card if loaded
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
            onPress={this.toggleOverlay}
            type="clear"
            title="PLAYLIST"
            titleStyle={{
              color: Constants.colors.primary,
              fontSize: 12,
              marginLeft: 6,
            }}
          />
          <Overlay
            overlayStyle={{ borderRadius: 15 }}
            isVisible={this.state.visible}
            onBackdropPress={this.toggleOverlay}
          >
            <Text style={{ fontSize: 22 }}>Playlist{"\n"}</Text>
            {this.state.songData.map((song, index) => (
              <Text>
                {index + 1}. {song.title}
              </Text>
            ))}
          </Overlay>
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
