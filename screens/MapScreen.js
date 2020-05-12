import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  ActivityIndicator,
} from "react-native";
import * as firebase from "firebase";
import firestore from "@firebase/firestore";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import CustomHeader from "../components/Header";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default class MapScreen extends React.Component {
  state = {
    markers: [],
    loading: true,
    mapRegion: null,
    hasLocationPermissions: false,
    locationResult: null,
  };

  //When the map region is changed, change the state
  handleMapRegionChange(mapRegion) {
    console.log(mapRegion);
    this.setState({ mapRegion });
  }

  //Get the location permission
  async getLocationAsync() {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        locationResult: "Permission to access location was denied",
      });
    } else {
      this.setState({ hasLocationPermissions: true });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ locationResult: location });

    // Center the map on the location we just fetched.
    this.setState({
      mapRegion: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    });
  }

  //When the component mounts
  componentDidMount() {
    this.getLocationAsync();

    const db = firebase.firestore();

    //Get the events which are public and display on the map
    db.collection("event")
      .where("type", "==", "Public")
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          console.log("No matching documents.");
          this.setState({ loading: false });
          return;
        }
        var i = 0;
        snapshot.forEach((doc) => {
          this.state.markers.push({
            id: i,
            location: doc.data().location,
            title: doc.data().title,
            startTime: doc.data().startTime,
          });
          i++;
        });
        this.setState({ loading: false });
      })
      .catch((err) => {
        console.log("Error getting documents", err);
      });
  }

  renderMap() {
    if (this.state.loading == false) {
      return (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: this.state.locationResult.coords.latitude,
            longitude: this.state.locationResult.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {console.log(this.state.markers)}
          {this.state.markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.location.U,
                longitude: marker.location.k,
              }}
              title={marker.title}
              description={marker.startTime.toDate().toDateString()}
            >
              <Image
                source={require("../assets/turntable_logo.png")}
                style={{ height: 35, width: 35 }}
              />
            </Marker>
          ))}
        </MapView>
      );
    } else {
      <ActivityIndicator size="large" color="grey" />;
    }
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "flex-start" }}>
        <CustomHeader
          title="Event Finder"
          navigation={this.props.navigation}
          left={"logo"}
        />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {this.state.locationResult && this.renderMap()}
        </View>
      </View>
    );
  }
}
