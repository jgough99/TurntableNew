import * as React from "react";
import { Text, View, Image, ActivityIndicator } from "react-native";
import { Header, Card, Button } from "react-native-elements";
import CustomHeader from "../components/Header";
import * as firebase from "firebase";
import firestore from "@firebase/firestore";
import { StackActions } from "@react-navigation/native";
import { NavigationEvents } from "react-navigation";
import { withNavigation } from "react-navigation";
import BarChart from "../components/BarChartNew";
import * as Constants from "../Constants";

export class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rock: "",
      pop: "",
      house: "",
      hipHop: "",
      electro: "",
      prefsLoading: true,
    };
  }
  signOutMethod() {
    firebase.auth().signOut();
  }

  componentDidMount() {
    this.onScreenFocus();
    this.props.navigation.addListener("focus", this.onScreenFocus);
  }

  onScreenFocus = () => {
    this.setState({ prefsLoading: true });
    const db = firebase.firestore();
    db.collection("user")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((doc) => {
        this.setState({ rock: doc.data().rock });
        this.setState({ pop: doc.data().pop });
        this.setState({ house: doc.data().house });
        this.setState({ hipHop: doc.data().hipHop });
        this.setState({ electro: doc.data().electro });
        this.setState({ prefsLoading: false });
      })
      .catch((err) => {
        console.log("Error getting documents", err);
      });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <CustomHeader title="Profile" navigation={this.props.navigation} />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            width: "90%",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              flex: 1,
              justifyContent: "center",
              borderRadius: 15,
              padding: 15,
              minWidth: "100%",
              borderColor: "white",
              //4borderWidth: 1,
              marginTop: 15,
              borderColor: "#CDCBCB",
            }}
          >
            {!this.state.prefsLoading && (
              <BarChart
                rock={Math.round(this.state.rock * 100)}
                electro={Math.round(this.state.electro * 100)}
                pop={Math.round(this.state.pop * 100)}
                house={Math.round(this.state.house * 100)}
                hiphop={Math.round(this.state.hipHop * 100)}
              />
            )}
            {this.state.prefsLoading && (
              <ActivityIndicator color={Constants.colors.primary} />
            )}
          </View>
          <View style={{ alignSelf: "flex-start" }}>
            <Button
              type="clear"
              title="IMPROVE ACCURACY"
              onPress={() => this.props.navigation.navigate("MyEventsList")}
              titleStyle={{ color: Constants.colors.secondary }}
            />
          </View>

          <View
            style={{
              flex: 0.7,
              flexDirection: "row",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                backgroundColor: "white",
                borderRadius: 15,
                borderWidth: 1,
                borderColor: "#CDCBCB",
                width: "100%",
                marginRight: 7,
              }}
            ></View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                backgroundColor: "white",
                borderRadius: 15,
                borderWidth: 1,
                borderColor: "#CDCBCB",
                width: "100%",
                marginLeft: 7,
              }}
            ></View>
          </View>
          <View
            style={{
              flex: 0.3,
              justifyContent: "center",
              backgroundColor: "white",
              borderRadius: 15,
              borderWidth: 1,
              borderColor: "#CDCBCB",
              width: "100%",
              margin: 15,
            }}
          >
            <Button
              style={{ width: "95%" }}
              title="Go to my events"
              onPress={() => this.props.navigation.navigate("MyEventsList")}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default withNavigation(Profile);
