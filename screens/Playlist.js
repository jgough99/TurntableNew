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
import { Slider } from "react-native-elements";
import Toast from "react-native-tiny-toast";
var danceScore;

export default class PlaylistScreen extends React.Component {
  state = {
    playlist: [],
    loading: true,
    songsArray: [],
    attendees: [],
    timer: 0,
    currentSongIndex: 0,
    danceScoresAverage: [],
    adjustmentValues: [0, 0, 0, 0]
  };

  async componentDidMount() {
    await this.getArrayFromStorage();
    await this.initialPlaylistSetup();
    await this.onAttendanceChange();
    await this.onEventChange();
    await this.timer();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  //Get the songs from storage
  async getArrayFromStorage() {
    var value = await AsyncStorage.getItem("songsArray2");
    if (value !== null) {
      this.setState({ songsArray: JSON.parse(value) });
      console.log(this.state.songsArray[1]);
    }
  }

  //First playlist setup
  initialPlaylistSetup() {
    var songsArrayLength = this.state.songsArray.length;
    for (var i = 0; i < songsArrayLength; i++) {
      var data = this.state.songsArray[i];
      this.state.playlist.push([0, data]);
    }
  }

  //Every time the attendance state of an event changes
  onAttendanceChange() {
    const db = firebase.firestore();

    db.collection("attendance")
      .where("eventId", "==", this.props.eventId.toString())
      .where("active", "==", true)
      .onSnapshot(
        querySnapshot => {
          if (querySnapshot.empty) {
            console.log("No attendees");
          }
          this.setState({ attendees: [] });
          querySnapshot.forEach(doc => {
            db.collection("user")
              .doc(doc.data().userId)
              .get()
              .then(snapshot => {
                this.state.attendees.push(snapshot.data());
              });
          });

          this.playlistUpdate();
        },
        err => {
          console.log(`Encountered error: ${err}`);
        }
      );
  }

  //Get the dance scores from the database
  async getDanceScore() {
    const db = firebase.firestore();

    db.collection("userSong")
      .where("eventId", "==", this.props.eventId.toString())
      .where(
        "songId",
        "==",
        this.state.playlist[this.state.currentSongIndex - 1][1].id.toString()
      )
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log("No matching documents.");
          return null;
        }
        var danceScoreAverage = 0.0;
        var i = 0;
        snapshot.forEach(doc => {
          console.log("Found a score");
          danceScoreAverage = danceScoreAverage + parseFloat(doc.danceScore);
          i = i + 1;
        });
        return danceScoreAverage / i;
      });
  }
  //Calculate the adjustment values
  async calculateFeedbackAdjustment() {
    console.log("Calculating feedback adjustment");
    const db = firebase.firestore();
    var danceScoreAverage = 0.0;

    await db
      .collection("userSong")
      .where("eventId", "==", this.props.eventId.toString())
      .where(
        "songId",
        "==",
        this.state.playlist[this.state.currentSongIndex - 1][1].id.toString()
      )
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log("No matching documents.");
        }
        var i = 0;
        snapshot.forEach(doc => {
          console.log("Found a score");
          danceScoreAverage =
            danceScoreAverage + parseFloat(doc.data().danceScore);
          i = i + 1;
        });
        danceScoreAverage = danceScoreAverage / i;
        console.log("Average dance score:: " + danceScoreAverage);
      });
  }

  //Every time the attendance state of an event changes
  async onEventChange() {
    const db = firebase.firestore();

    db.collection("event")
      .doc(this.props.eventId.toString())
      .onSnapshot(
        querySnapshot => {
          if (querySnapshot.empty) {
            console.log("No event");
          }
          if (querySnapshot.data().nextSong === 1) {
            Toast.show("Dance scores are in!");

            this.calculateFeedbackAdjustment();

            this.playlistUpdate();

            db.collection("event")
              .doc(this.props.eventId)
              .update({ nextSong: 0 });
          }
        },
        err => {
          console.log(`Encountered error: ${err}`);
        }
      );
  }

  //Sorting the array
  sortFunction(a, b) {
    if (a[0] === b[0]) {
      return 0;
    } else {
      return a[0] > b[0] ? -1 : 1;
    }
  }

  //Update the playlist
  playlistUpdate() {
    var userPreferences = null;
    this.setState({ loading: true });
    const db = firebase.firestore();
    db.collection("user")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then(snapshot => {
        userPreferences = snapshot.data();
        var attendeesArrayLength = this.state.attendees.length;
        var rock = userPreferences.rock;
        var hiphop = userPreferences.hipHop;
        var electro = userPreferences.electro;
        var house = userPreferences.house;
        var pop = userPreferences.pop;
        var previousPlaylistStart = [];
        var previousPlaylistEnd = [];

        previousPlaylistStart = this.state.playlist.slice(
          0,
          this.state.currentSongIndex + 1
        );

        previousPlaylistEnd = this.state.playlist.slice(
          this.state.currentSongIndex + 1,
          this.state.songsArray.length
        );

        this.setState({
          playlist: []
        });

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

        var songsArrayLength = previousPlaylistEnd.length;
        for (var i = 0; i < songsArrayLength; i++) {
          var data = previousPlaylistEnd[i][1];
          this.state.playlist.push([
            similarity(
              [
                data.data.rock,
                data.data.hiphop,
                data.data.electro,
                data.data.house,
                data.data.pop
              ],
              [rock, hiphop, electro, house, pop]
            ),
            data
          ]);
        }

        this.state.playlist.sort(this.sortFunction);

        this.setState({
          playlist: previousPlaylistStart.concat(this.state.playlist)
        });
        this.setState({ loading: false });
      })

      .catch(err => {
        console.log("Error getting documents", err);
        this.setState({ loading: false });
      });
  }

  //Return true if the indexed item is the current song
  currentSongCheck(index) {
    if (index === this.state.currentSongIndex) {
      return true;
    } else {
      return false;
    }
  }

  //Return the timer state if the indexed item is the current song
  currentSongTimer(index) {
    if (index === this.state.currentSongIndex) {
      return this.state.timer;
    } else {
      return 1;
    }
  }

  //When the next song is loaded
  nextSong() {
    const db = firebase.firestore();
    this.setState({ currentSongIndex: this.state.currentSongIndex + 1 });
    this.setState({ timer: 0 });
    if (this.state.attendees.length != 0) {
      db.collection("event")
        .doc(this.props.eventId)
        .update({
          nextSong: this.state.attendees.length + 1,
          previousSongId: this.state.playlist[
            this.state.currentSongIndex - 1
          ][1].id
        });
    }
  }

  //Start the timer
  timer() {
    this.interval = setInterval(() => {
      if (
        (this.state.playlist[this.state.currentSongIndex][1].data.duration *
          60) /
          4 >
        this.state.timer
      ) {
        this.setState({ timer: this.state.timer + 1 });
      } else {
        this.nextSong();
      }
    }, 1000);
  }

  //Every time the playlist changes (MAYBE NOT NEEDED)
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
                title={song[1].data.title}
                artist={song[1].data.artist}
                jsonSong={song[1]}
                timer={this.currentSongTimer(index)}
              />
            ))}
          </ScrollView>
        </SafeAreaView>
      );
    } else {
      return (
        <View>
          <ActivityIndicator size="large" color={Constants.colors.primary} />
        </View>
      );
    }
  }
}
