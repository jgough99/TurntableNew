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
import * as Constants from "../Constants";

//Firebase configuration values for database connection
var firebaseConfig = {
  apiKey: "AIzaSyBIDYCkEOOxAsmdvIlgP4hhKqXx6yzAglU",
  authDomain: "reactnative-f82c6.firebaseapp.com",
  databaseURL: "https://reactnative-f82c6.firebaseio.com",
  projectId: "reactnative-f82c6",
  storageBucket: "reactnative-f82c6.appspot.com",
  messagingSenderId: "382800399674",
  appId: "1:382800399674:web:d83dc73f6fef1498851403",
  measurementId: "G-W29WJ4DWPY",
};

//Initialise Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

var currentID = "";
var storageRef = firebase.storage().ref();
var mountainsRef;
var mainAccData = [];
var accelerometerDatas = [];
var counter = 0;
var data = "";
var htmlString = "";

export class AtEvent extends React.Component {
  state = {
    codeValue: this.props.route.params.eventId,
    title: "",
    loading: true,
    lastUpdatedSong: "",
    songChange: false,
    danceScore: "",
  };

  //Upon the loading of the screen
  componentDidMount() {
    const db = firebase.firestore();

    //If the user is logged in, get the current UserId and create a reference for the accelerometer text file
    if (firebase.auth()) {
      currentID = firebase.auth().currentUser.uid.toString();
      mountainsRef = storageRef.child(currentID + ".txt");
    }
    //Toggle on accelerometer data
    this._toggle();
    Accelerometer.setUpdateInterval(50);

    //Add attendance for the user and event
    db.collection("event")
      .doc(this.state.codeValue.toString())
      .get()
      .then((doc) => {
        this.setState({ title: doc.data().title });
        this.setState({ loading: false });

        db.collection("attendance")
          .doc(doc.id.toString() + firebase.auth().currentUser.uid.toString())
          .set({
            userId: firebase.auth().currentUser.uid,
            eventId: doc.id,
            active: true,
          });
      })
      .catch((err) => {
        console.log("Error getting documents", err);
        this.setState({ loading: false });
      });
    this.onEventChange();
  }

  //Get the classification from cloud hosted neural network model
  async getTheML() {
    var response = await fetch(
      "https://us-central1-reactnative-f82c6.cloudfunctions.net/HAR?name=" +
        firebase.auth().currentUser.uid.toString() +
        ".txt"
    );
    htmlString = await response.text();
    console.log(htmlString);
    //Calclualte the dance score for the song
    Speech.speak(Math.round(parseFloat(htmlString) * 100) + " percent dancing");
    this.setState({ danceScore: htmlString });
  }

  //Upload the accelerometer data as a text file to firebase storage
  async performCloudFunct() {
    var blob = new Blob([data], { type: "application/json" });
    await mountainsRef.put(blob).then(function (snapshot) {
      console.log("Uploaded a blob!");
    });
    await this.getTheML();
  }

  //When the component unmounts unmount the accelerometer
  componentWillUnmount() {
    this._unsubscribe();
  }

  //Toggle accelerometer
  _toggle = () => {
    if (this._subscription) {
      this._unsubscribe();
    } else {
      this._subscribe();
    }
  };

  //Subscribe the accelerometer
  _subscribe = () => {
    this._subscription = Accelerometer.addListener((accelerometerData) => {
      if (this.state.songChange == false) {
        if (counter < 80) {
          var temp = [
            [accelerometerData.x * 9.81],
            [accelerometerData.y * 9.81],
            [accelerometerData.z * 9.81],
          ];
          accelerometerDatas.push(temp);
          counter = counter + 1;
        } else {
          mainAccData.push(accelerometerDatas);
          counter = 0;
          accelerometerDatas = [];
        }
      } else {
        mainAccData = [];
        counter = 0;
        accelerometerDatas = [];
        this.setState({ songChange: false });
      }
    });
  };
  //Unsubscribe the accelerometer
  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };

  //Every time the attendance state of an event changes
  async onEventChange() {
    const db = firebase.firestore();

    db.collection("event")
      .doc(this.props.route.params.eventId)
      .onSnapshot(
        async (querySnapshot) => {
          if (
            querySnapshot.data().nextSong > 1 &&
            querySnapshot.data().previousSongId != this.state.lastUpdatedSong
          ) {
            this.setState({
              lastUpdatedSong: querySnapshot.data().previousSongId,
            });
            data = JSON.stringify(mainAccData);
            await this.performCloudFunct();
            Toast.show("Dance scores sent!");

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
                danceScore: this.state.danceScore,
              });
            const decrement = firebase.firestore.FieldValue.increment(-1);
            //Next song -1
            db.collection("event")
              .doc(this.props.route.params.eventId)
              .update({ nextSong: decrement });
          }
        },
        (err) => {
          console.log(`Encountered error: ${err}`);
        }
      );
  }

  //When the event is exited navigate to the profile screen
  exitEvent(navigation) {
    const db = firebase.firestore();
    db.collection("attendance")
      .doc(this.state.codeValue.toString() + firebase.auth().currentUser.uid)
      .set({
        eventId: this.state.codeValue,
        userId: firebase.auth().currentUser.uid,
        active: false,
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
            alignItems: "center",
          }}
        >
          <CustomHeader
            title={this.state.title}
            left={"back"}
            navigation={this.props.navigation}
          />
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Image
              source={require("../assets/dancing.png")}
              fadeDuration={0}
              style={{
                width: Constants.windowWidth * 0.9,
                height: Constants.windowWidth * 0.9,
              }}
            />

            <Text
              style={{
                width: Constants.windowWidth * 0.6,
                textAlign: "center",
                marginTop: 10,
                fontFamily: "Rubik-Regular",
                fontSize: 15,
              }}
            >
              Dance around to show your love for songs playing!
            </Text>
            <Button
              title="LEAVE EVENT"
              type="clear"
              containerStyle={{ marginTop: 30 }}
              titleStyle={{ color: Constants.colors.primary }}
              onPress={() => this.exitEvent(this.props.navigation)}
            />
          </View>
        </View>
      );
    }
  }
}
export default withNavigation(AtEvent);
