import * as React from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { Header, Button, Card } from "react-native-elements";
import CustomHeader from "../components/Header";
import * as firebase from "firebase";
import firestore from "@firebase/firestore";
import { StackActions } from "@react-navigation/native";
import { NavigationEvents } from "react-navigation";
import { withNavigation } from "react-navigation";

export class MyEventsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      loading: true
    };
  }

  componentDidMount() {
    const db = firebase.firestore();

    db.collection("event")
      .where("userId", "==", firebase.auth().currentUser.uid.toString())
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log("No matching documents.");
          return;
        }

        snapshot.forEach(doc => {
          this.state.events.push({
            id: doc.id,
            title: doc.data().title,
            startTime: doc.data().startTime
          });
        });
        this.setState({ loading: false });
      })

      .catch(err => {
        console.log("Error getting documents", err);
        this.setState({ loading: false });
      });
  }

  renderList() {
    if (this.state.loading) {
      return <Text>Loading</Text>;
    } else {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%"
          }}
        >
          {this.state.events.map(event => (
            <TouchableOpacity
              key={event.id}
              style={{ width: "100%" }}
              onPress={() =>
                this.props.navigation.navigate("MyEvent", { eventId: event.id })
              }
            >
              <Card
                style={{
                  elevation: 6,
                  borderRadius: 15,
                  overflow: "hidden",
                  width: "90%"
                }}
              >
                <Text style={{ fontSize: 24 }}>{event.title}</Text>
                <Text style={{ fontSize: 14, color: "#737272" }}>
                  {event.startTime.toDate().toDateString()}
                </Text>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      );
    }
  }

  render() {
    return (
      <View
        style={{ flex: 1, justifyContent: "flex-start", alignItems: "center" }}
      >
        <CustomHeader title="My Events" />
        {this.renderList()}
      </View>
    );
  }
}

export default withNavigation(MyEventsList);
