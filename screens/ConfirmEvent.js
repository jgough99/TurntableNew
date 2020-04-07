import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import Geocoder from "react-native-geocoding";
import { Button, Input, ButtonGroup } from "react-native-elements";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import DateTimePicker from "@react-native-community/datetimepicker";
import { withNavigation } from "react-navigation";
import * as firebase from "firebase";
import firestore from "@firebase/firestore";
import CustomHeader from "../components/Header";
import * as Constants from "../Constants";

Geocoder.init("AIzaSyCFSuAtTl2BKMcs44dtOTWOL9QRWSc51VU"); // use a valid API key
var ref = null;
var url = null;

export class CreateEvent extends React.Component {
  state = {
    lat: 51.620685,
    lng: -3.943685,
    date: new Date(),
    type: 0,
    eventName: "",
  };

  confirm(navigation) {
    const db = firebase.firestore();
    db.collection("event").add({
      location: new firebase.firestore.GeoPoint(this.state.lat, this.state.lng),
      title: this.state.eventName,
      type: this.state.type === 0 ? "Private" : "Public",
      startTime: firebase.firestore.Timestamp.fromDate(this.state.date),
      userId: firebase.auth().currentUser.uid,
      playlist: [],
      nextSong: 0,
    });
    navigation.navigate("Home");
  }

  async componentDidMount() {
    ref = firebase
      .storage()
      .ref(
        "images/" +
          firebase.auth().currentUser.uid.toString() +
          this.props.route.params.name
      );
    url = await ref.getDownloadURL();
    this.setState({ lat: this.props.route.params.lat });
    this.setState({ lng: this.props.route.params.lng });
    this.setState({ eventName: this.props.route.params.name });
    this.setState({ date: this.props.route.params.date });
    this.setState({ type: this.props.route.params.type });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <CustomHeader title="Create Event" navigation={this.props.navigation} />

        <View
          style={{
            flex: 0.75,
            justifyContent: "center",
            alignSelf: "center",
            width: "90%",
          }}
        >
          <Text
            style={{
              fontFamily: "Rubik-Regular",
              fontSize: 25,
              marginLeft: 10,
            }}
          >
            Is this right?
          </Text>
        </View>
        <View style={{ flex: 4, alignItems: "center" }}>
          <View
            style={{
              flex: 1,
              borderRadius: 15,
              overflow: "hidden",
              width: "90%",
              borderWidth: 1,
              borderColor: "grey",
            }}
          >
            <View style={{ flex: 2 }}>
              <Image
                source={{ uri: url }}
                style={{ width: "100%", height: "100%" }}
              />
            </View>
            <View
              style={{
                flex: 1,

                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Rubik-Regular",
                  fontSize: 25,
                  marginLeft: 10,
                }}
              >
                {this.state.eventName}
              </Text>
              <Text
                style={{
                  fontFamily: "Rubik-Regular",
                  fontSize: 20,
                  marginLeft: 10,
                  color: "grey",
                }}
              >
                {this.state.type === 0 ? "Private" : "Public"} Event
              </Text>
              <View
                style={{
                  marginTop: 5,
                  flex: 0.5,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Rubik-Regular",
                    fontSize: 15,
                    marginLeft: 10,
                    color: "grey",
                  }}
                >
                  {this.state.date.getDate() +
                    "/" +
                    this.state.date.getMonth() +
                    "/" +
                    this.state.date.getFullYear()}
                </Text>
                <Text
                  style={{
                    fontFamily: "Rubik-Regular",
                    fontSize: 15,
                    marginLeft: 25,
                    color: "grey",
                  }}
                >
                  {this.state.date.toTimeString().slice(0, 5)}
                </Text>
              </View>
            </View>

            <View style={{ flex: 3, marginTop: 10 }}>
              <MapView
                style={styles.map}
                region={{
                  latitude: this.state.lat,
                  longitude: this.state.lng,
                  latitudeDelta: 0.003,
                  longitudeDelta: 0.003,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: this.state.lat,
                    longitude: this.state.lng,
                  }}
                  title={"Club Y"}
                >
                  <Image
                    source={require("../assets/turntable_logo.png")}
                    style={{ height: 35, width: 35 }}
                  />
                </Marker>
              </MapView>
            </View>
          </View>
        </View>
        <View
          style={{
            flex: 1,

            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            containerStyle={{ width: "90%" }}
            buttonStyle={{
              backgroundColor: Constants.colors.primary,
              borderRadius: 15,
              height: 60,
              elevation: 5,
            }}
            title="Confirm"
            onPress={() => this.confirm(this.props.navigation)}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 30,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 15,
  },
});

export default withNavigation(CreateEvent);

{
  /* <View style={styles.container}>
<Text>Title: {this.state.eventName}</Text>
<Text>Date: {this.state.date.toDateString()}</Text>
<Text>Time: {this.state.date.toTimeString()}</Text>
<Text>
  Type of event: {this.state.type === 0 ? "Private" : "Public"}
</Text>
<View
  style={{
    flex: 1,
    width: 300,
    maxHeight: 300,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5
  }}
>
  <MapView
    style={styles.map}
    region={{
      latitude: this.state.lat,
      longitude: this.state.lng,
      latitudeDelta: 0.003,
      longitudeDelta: 0.003
    }}
  >
    <Marker
      coordinate={{
        latitude: this.state.lat,
        longitude: this.state.lng
      }}
      title={"Club Y"}
    >
      <Image
        source={require("../assets/turntable_logo.png")}
        style={{ height: 35, width: 35 }}
      />
    </Marker>
  </MapView>
</View>

<Button
  containerStyle={{ width: "80%", marginBottom: 30 }}
  buttonStyle={{
    backgroundColor: "#EC6338",
    borderRadius: 15,
    height: 60,
    elevation: 5
  }}
  title="Confirm"
  onPress={() => this.confirm(this.props.navigation)}
/>
</View> */
}
