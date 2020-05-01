import * as React from "react";
import { Text, View } from "react-native";
import * as firebase from "firebase";
import firestore from "@firebase/firestore";
import BarChart from "../components/BarChartNew";
import * as Constants from "../Constants";

export default class StatisticsScreen extends React.Component {
  state = {
    attendees: [],
    rock: 0,
    pop: 0,
    house: 0,
    hipHop: 0,
    electro: 0,
    loading: true,
  };

  componentDidMount() {
    this.getAttendees();
  }

  async readUserData() {
    const db = firebase.firestore();
    this.setState({ rock: 0 });
    this.setState({ pop: 0 });
    this.setState({ house: 0 });
    this.setState({ hipHop: 0 });
    this.setState({ electro: 0 });
    var i = 0;
    for (i; i < this.state.attendees.length; ++i) {
      await db
        .collection("user")
        .doc(this.state.attendees[i])
        .get()
        .then((doc) => {
          this.setState({ rock: this.state.rock + doc.data().rock });
          this.setState({ pop: this.state.pop + doc.data().pop });
          this.setState({ house: this.state.house + doc.data().house });
          this.setState({ hipHop: this.state.hipHop + doc.data().hipHop });
          this.setState({ electro: this.state.electro + doc.data().electro });
        });
    }
    this.setState({ rock: this.state.rock / i });
    this.setState({ pop: this.state.pop / i });
    this.setState({ house: this.state.house / i });
    this.setState({ hipHop: this.state.hipHop / i });
    this.setState({ electro: this.state.electro / i });

    this.setState({ loading: false });
  }

  getAttendees() {
    const db = firebase.firestore();
    db.collection("attendance")
      .where("eventId", "==", this.props.eventId.toString())
      .where("active", "==", true)
      .onSnapshot(
        (querySnapshot) => {
          if (querySnapshot.empty) {
            console.log("No matching documents.");
            this.setState({ loading: false });
            this.setState({ attendees: [] });
            return;
          }
          this.setState({ attendees: [] });
          querySnapshot.forEach((doc) => {
            this.state.attendees.push(doc.data().userId);
          });
          this.readUserData();
        },
        (err) => {
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
          {!this.state.prefsLoading && (
            <View style={{ flex: 1, minWidth: Constants.windowWidth * 0.9 }}>
              <BarChart
                rock={Math.round(this.state.rock * 100)}
                electro={Math.round(this.state.electro * 100)}
                pop={Math.round(this.state.pop * 100)}
                house={Math.round(this.state.house * 100)}
                hiphop={Math.round(this.state.hipHop * 100)}
              />
              <Text>Number of attendees: {this.state.attendees.length}</Text>
            </View>
          )}
          {this.state.prefsLoading && (
            <ActivityIndicator color={Constants.colors.primary} />
          )}
        </View>
      );
    }
  }
}
