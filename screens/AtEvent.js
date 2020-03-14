import * as React from "react";
import { Text, View, Image, ShadowPropTypesIOS } from "react-native";
import { Header, Card, Button } from "react-native-elements";
import CustomHeader from "../components/Header";
import { withNavigation } from "react-navigation";
import * as firebase from "firebase";
import firestore from "@firebase/firestore";
import Toast from "react-native-tiny-toast";

export class AtEvent extends React.Component {
  state = {
    codeValue: this.props.route.params.eventId,
    title: "",
    loading: true,
    lastUpdatedSong: ""
  };

  componentDidMount() {
    const db = firebase.firestore();

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
