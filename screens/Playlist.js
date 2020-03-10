import * as React from "react";
import {
  Text,
  View,
  Image,
  Dimensions,
  SafeAreaView,
  ScrollView,
  AsyncStorage,
  ActivityIndicator
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import PlaylistItem from "../components/PlaylistItem";
import * as firebase from "firebase";
import firestore from "@firebase/firestore";
import similarity from "compute-cosine-similarity";
import * as Constants from "../Constants";

export default class PlaylistScreen extends React.Component {
  state = {
    playlist: [],
    loading: true,
    songsArray: [],
    attendees: [],
    timer: 0,
    currentSongIndex: 6
  };

  async componentDidMount() {
    var value = await AsyncStorage.getItem("songsArray2");
    if (value !== null) {
      this.setState({ songsArray: JSON.parse(value) });
    }

    this.onPlaylistChange();
    this.onAttendanceChange();
  }

  onPlaylistChange() {
    //Every time the playlist changes
    const db = firebase.firestore();

    db.collection("event")
      .doc(this.props.eventId.toString())
      .onSnapshot(
        docSnapshot => {},
        err => {
          console.log(`Encountered error: ${err}`);
        }
      );
  }

  onAttendanceChange() {
    const db = firebase.firestore();

    //Every time the attendance state of an event changes
    db.collection("attendance")
      .where("eventId", "==", this.props.eventId.toString())
      .onSnapshot(
        querySnapshot => {
          if (querySnapshot.empty) {
            console.log("No matching documents.");
          }
          this.setState({ attendees: [] });
          querySnapshot.forEach(doc => {
            if (doc.data().active === true) {
              db.collection("user")
                .doc(doc.data().userId)
                .get()
                .then(snapshot => {
                  this.state.attendees.push(snapshot.data());
                });
            }
          });

          this.playlistUpdate();
          console.log("THE PLAYLIST HAS UPDATED");
        },
        err => {
          console.log(`Encountered error: ${err}`);
        }
      );
  }

  sortFunction(a, b) {
    if (a[0] === b[0]) {
      return 0;
    } else {
      return a[0] > b[0] ? -1 : 1;
    }
  }

  playlistUpdate() {
    var userPreferences = null;
    this.setState({ loading: true });
    const db = firebase.firestore();
    db.collection("user")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then(snapshot => {
        userPreferences = snapshot.data();
        console.log(this.state.attendees);

        var attendeesArrayLength = this.state.attendees.length;
        var rock = userPreferences.rock;
        var hiphop = userPreferences.hipHop;
        var electro = userPreferences.electro;
        var house = userPreferences.house;
        var pop = userPreferences.pop;

        this.setState({ playlist: [] });
        if (attendeesArrayLength > 0) {
          for (var i = 0; i < attendeesArrayLength; i++) {
            rock = rock + this.state.attendees[i].rock;
            hiphop = hiphop + this.state.attendees[i].hipHop;
            electro = electro + this.state.attendees[i].electro;
            house = house + this.state.attendees[i].house;
            pop = pop + this.state.attendees[i].pop;
          }
        }

        var totalNumberOfAttendees = attendeesArrayLength + 1;

        rock = rock / totalNumberOfAttendees;
        hiphop = hiphop / totalNumberOfAttendees;
        electro = electro / totalNumberOfAttendees;
        house = house / totalNumberOfAttendees;
        pop = pop / totalNumberOfAttendees;

        var songsArrayLength = this.state.songsArray.length;
        for (var i = 0; i < songsArrayLength; i++) {
          var data = this.state.songsArray[i].data;
          this.state.playlist.push([
            similarity(
              [data.rock, data.hiphop, data.electro, data.house, data.pop],
              [rock, hiphop, electro, house, pop]
            ),
            data
          ]);
        }

        this.state.playlist.sort(this.sortFunction);
        this.setState({ loading: false });
      })

      .catch(err => {
        console.log("Error getting documents", err);
        this.setState({ loading: false });
      });
  }

  currentSongCheck(index) {
    if (index === this.state.currentSongIndex) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    if (this.state.loading == false) {
      return (
        <SafeAreaView
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 50,
              borderBottomWidth: 1,
              borderColor: "#CDCBCB",
              width: Dimensions.get("window").width * 0.9,
              marginTop: 10
            }}
          >
            {/* Index */}
            <View
              style={{
                flex: 2,
                height: "100%",
                justifyContent: "center",
                fontFamily: "Rubik-Regular"
              }}
            >
              <Text
                style={{
                  color: "#514F4F",
                  fontSize: 12,
                  fontFamily: "Rubik-Regular"
                }}
              >
                POSITION
              </Text>
            </View>

            {/* Title/Artist */}
            <View style={{ flex: 6, height: "100%", justifyContent: "center" }}>
              <Text
                style={{
                  color: "#514F4F",
                  fontSize: 12,
                  fontFamily: "Rubik-Regular"
                }}
              >
                TITLE/ARTIST
              </Text>
            </View>

            {/* Genre */}
            <View
              style={{
                flex: 2,
                height: "100%",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  color: "#514F4F",
                  fontSize: 12,
                  fontFamily: "Rubik-Regular"
                }}
              >
                GENRES
              </Text>
            </View>
          </View>

          <ScrollView
            contentContainerStyle={{
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {this.state.playlist.map((song, index) => (
              <PlaylistItem
                key={index}
                index={index}
                currentSong={this.currentSongCheck(index)}
                title={song[1].title}
                artist={song[1].artist}
                jsonSong={song[1]}
              />
            ))}
          </ScrollView>
        </SafeAreaView>
      );
    } else {
      return (
        <ActivityIndicator size="large" color={Constants.colors.primary} />
      );
    }
  }
}
