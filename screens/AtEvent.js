import * as React from "react";
import { Text, View, Image, ShadowPropTypesIOS } from "react-native";
import { Header, Card, Button } from "react-native-elements";
import CustomHeader from "../components/Header";
import { withNavigation } from "react-navigation";
import * as firebase from "firebase";
import firestore from "@firebase/firestore";
import Toast from "react-native-tiny-toast";
import * as Speech from "expo-speech";
import { Accelerometer } from "expo-sensors";
import functions from "@firebase/functions";

var firebaseConfig = {
  apiKey: "AIzaSyBIDYCkEOOxAsmdvIlgP4hhKqXx6yzAglU",
  authDomain: "reactnative-f82c6.firebaseapp.com",
  databaseURL: "https://reactnative-f82c6.firebaseio.com",
  projectId: "reactnative-f82c6",
  storageBucket: "reactnative-f82c6.appspot.com",
  messagingSenderId: "382800399674",
  appId: "1:382800399674:web:d83dc73f6fef1498851403",
  measurementId: "G-W29WJ4DWPY"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

var storageRef = firebase.storage().ref();
var mountainsRef = storageRef.child("thisFile.txt");

var theBigOne = [];
var accelerometerDatas = [];
var counter = 0;
var bigCounter = 0;
var data = "";
var htmlString = "";

export class AtEvent extends React.Component {
  state = {
    codeValue: this.props.route.params.eventId,
    title: "",
    loading: true,
    lastUpdatedSong: ""
  };

  componentDidMount() {
    const db = firebase.firestore();

    this._toggle();
    Accelerometer.setUpdateInterval(50);
    Speech.speak("Start Moving Now");

    db.collection("event")
      .doc(this.state.codeValue.toString())
      .get()
      .then(doc => {
        this.setState({ title: doc.data().title });
        this.setState({ loading: false });

        db.collection("attendance")
          .doc(doc.id.toString() + firebase.auth().currentUser.uid.toString())
          .set({
            userId: firebase.auth().currentUser.uid,
            eventId: doc.id,
            active: true
          });
      })
      .catch(err => {
        console.log("Error getting documents", err);
        this.setState({ loading: false });
      });
    this.onEventChange();
  }

  async getTheML() {
    var response = await fetch(
      "https://us-central1-reactnative-f82c6.cloudfunctions.net/HAR?{name:%20%27thisFile.txt%27}"
    );
    htmlString = await response.text();
    console.log(htmlString);
    Speech.speak(parseFloat(htmlString) * 100 + " percent dancing");
  }

  async performCloudFunct() {
    var blob = new Blob([data], { type: "application/json" });
    await mountainsRef.put(blob).then(function(snapshot) {
      console.log("Uploaded a blob!");
    });
    this.getTheML();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _toggle = () => {
    if (this._subscription) {
      this._unsubscribe();
    } else {
      this._subscribe();
    }
  };

  _subscribe = () => {
    this._subscription = Accelerometer.addListener(accelerometerData => {
      if (bigCounter < 5) {
        if (counter < 80) {
          var temp = [
            [accelerometerData.x * 9.81],
            [accelerometerData.y * 9.81],
            [accelerometerData.z * 9.81]
          ];
          accelerometerDatas.push(temp);
          counter = counter + 1;
        } else {
          theBigOne.push(accelerometerDatas);
          bigCounter = bigCounter + 1;
          counter = 0;
          accelerometerDatas = [];
          console.log(bigCounter);
          Speech.speak(bigCounter.toString());
        }
      } else {
        data = JSON.stringify(theBigOne);
        console.log(data);
        this.performCloudFunct();
        this._toggle();
      }
    });
  };

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };

  //Every time the attendance state of an event changes
  onEventChange() {
    const db = firebase.firestore();

    db.collection("event")
      .doc(this.props.route.params.eventId)
      .onSnapshot(
        querySnapshot => {
          if (
            querySnapshot.data().nextSong > 1 &&
            querySnapshot.data().previousSongId != this.state.lastUpdatedSong
          ) {
            Toast.show("Dance scores sent!");
            this.setState({
              lastUpdatedSong: querySnapshot.data().previousSongId
            });
            const decrement = firebase.firestore.FieldValue.increment(-1);
            //Add the users score to the database
            db.collection("userSong")
              .doc(
                this.props.route.params.eventId.toString() +
                  firebase.auth().currentUser.uid.toString() +
                  querySnapshot.data().previousSongId.toString()
              )
              .set({
                userId: firebase.auth().currentUser.uid,
                eventId: this.props.route.params.eventId,
                songId: querySnapshot.data().previousSongId,
                danceScore: 0.5
              });

            //Next song -1
            db.collection("event")
              .doc(this.props.route.params.eventId)
              .update({ nextSong: decrement });
          }
        },
        err => {
          console.log(`Encountered error: ${err}`);
        }
      );
  }

  exitEvent(navigation) {
    const db = firebase.firestore();
    db.collection("attendance")
      .doc(this.state.codeValue.toString() + firebase.auth().currentUser.uid)
      .set({
        eventId: this.state.codeValue,
        userId: firebase.auth().currentUser.uid,
        active: false
      });
    navigation.navigate("Profile");
  }

  render() {
    if (this.state.loading) {
      return <Text>Loading</Text>;
    } else {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <CustomHeader title={this.state.title} />
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text> You are at an event called:{this.state.title}</Text>
            <Text> Last updated song:{this.state.lastUpdatedSong}</Text>
            <Button
              title="BACK"
              onPress={() => this.exitEvent(this.props.navigation)}
            />
          </View>
        </View>
      );
    }
  }
}
export default withNavigation(AtEvent);
