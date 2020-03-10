import * as React from "react";
import { Text, View } from "react-native";
import * as firebase from "firebase";
import firestore from "@firebase/firestore";

export default class StatisticsScreen extends React.Component {
  state = {
    attendees: [],
    loading: true
  };

  componentDidMount() {
    this.getAttendees();
  }

  getAttendees() {
    const db = firebase.firestore();
    db.collection("attendance")
      .where("eventId", "==", this.props.eventId.toString())
      .where("active", "==", true)
      .onSnapshot(
        querySnapshot => {
          if (querySnapshot.empty) {
            console.log("No matching documents.");
            this.setState({ loading: false });
            this.setState({ attendees: [] });
            return;
          }
          this.setState({ attendees: [] });
          querySnapshot.forEach(doc => {
            this.state.attendees.push(doc.data().userId);
          });
          this.setState({ loading: false });
        },
        err => {
          console.log(`Encountered error: ${err}`);
        }
      );
  }

  render() {
    if (this.state.loading) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Loading</Text>
        </View>
      );
    } else {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>{this.state.attendees}</Text>
        </View>
      );
    }
  }
}
