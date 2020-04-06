import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import Geocoder from "react-native-geocoding";
import { Button, Input, ButtonGroup } from "react-native-elements";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import DateTimePicker from "@react-native-community/datetimepicker";
import { withNavigation } from "react-navigation";
import * as Constants from "../Constants";
import CustomHeader from "../components/Header";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import * as firebase from "firebase";
import firestore from "@firebase/firestore";

Geocoder.init("AIzaSyCFSuAtTl2BKMcs44dtOTWOL9QRWSc51VU"); // use a valid API key

export class CreateEvent extends React.Component {
  state = {
    lat: 51.620685,
    lng: -3.943685,
    placeName: "",
    postcode: "",
    date: new Date(),
    mode: "date",
    show: false,
    buttonState: 0,
    eventName: "",
    image: null,
  };

  uploadImage = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    var ref = firebase
      .storage()
      .ref()
      .child("images/" + imageName);
    return ref.put(blob);
  };

  findTheCoords() {
    Geocoder.from(this.state.postcode + this.state.placeName + "UK")
      .then((json) => {
        this.setState({ lat: json.results[0].geometry.location.lat });
        this.setState({ lng: json.results[0].geometry.location.lng });
        console.log(this.state.lat);
        console.log(this.state.lng);
        this.props.navigation.navigate("ConfirmEvent", {
          name: this.state.eventName,
          lat: this.state.lat,
          lng: this.state.lng,
          date: this.state.date,
          type: this.state.buttonState,
        });
      })
      .catch((error) => console.warn(error));
  }

  onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    this.setState({ show: Platform.OS === "ios" ? true : false });
    this.setState({ date: currentDate });
  };

  updateIndex = (selectedIndex) => {
    this.setState({ buttonState: selectedIndex });
  };

  showMode = (currentMode) => {
    this.setState({ show: true });
    this.setState({ mode: currentMode });
  };

  showDatepicker = () => {
    this.showMode("date");
  };

  showTimepicker = () => {
    this.showMode("time");
  };

  componentDidMount() {
    this.getPermissionAsync();
    console.log("hi");
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
      this.uploadImage(result.uri, "test-image");
    }
  };

  render() {
    let { image } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <CustomHeader title="Create Event" navigation={this.props.navigation} />
        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,

              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Name of event input */}
            <Input
              placeholder="Name of event"
              containerStyle={{ width: "85%", marginVertical: 10 }}
              inputContainerStyle={{
                borderColor: "#CDCBCB",
                bottomBorderWidth: 1,
                height: "90%",
              }}
              inputStyle={{ fontSize: 24, fontFamily: "Rubik-Regular" }}
              onChangeText={(eventName) => this.setState({ eventName })}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <View
            style={{
              flex: 1,

              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Upload event image button */}
            <Button
              containerStyle={{ width: "85%" }}
              buttonStyle={{
                backgroundColor: Constants.colors.primary,
                borderRadius: 15,
                height: 60,
                elevation: 5,
              }}
              icon={
                <MaterialCommunityIcons
                  name="cloud-upload"
                  color="white"
                  size={25}
                />
              }
              title="UPLOAD EVENT IMAGE"
              onPress={this._pickImage}
            />
          </View>

          <View
            style={{
              flex: 1,

              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Date and time buttons */}
            <View
              style={{
                flex: 1,
                alignItems: "center",
                flexDirection: "row",
                width: "85%",
              }}
            >
              <View
                style={{
                  flex: 1,
                }}
              >
                <Button
                  buttonStyle={{
                    alignSelf: "flex-start",
                    backgroundColor: "white",
                    borderRadius: 15,
                    height: 60,
                    width: "95%",
                    borderColor: "#CDCBCB",
                    borderWidth: 1,
                  }}
                  onPress={this.showDatepicker}
                  title={
                    this.state.date.getDate().toString() +
                    "/" +
                    (this.state.date.getMonth() + 1).toString() +
                    "/" +
                    this.state.date.getFullYear().toString() +
                    "  "
                  }
                  titleStyle={{ color: "grey" }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  onPress={this.showTimepicker}
                  title={
                    this.state.date.getHours().toString() +
                    ":" +
                    this.state.date.getMinutes().toString() +
                    " "
                  }
                  titleStyle={{ color: "grey" }}
                  buttonStyle={{
                    alignSelf: "flex-end",
                    backgroundColor: "white",
                    borderRadius: 15,
                    height: 60,
                    width: "95%",
                    borderColor: "#CDCBCB",
                    borderWidth: 1,
                  }}
                />
              </View>
            </View>
          </View>
          {this.state.show && (
            <DateTimePicker
              testID="dateTimePicker"
              timeZoneOffsetInMinutes={0}
              value={this.state.date}
              mode={this.state.mode}
              minimumDate={new Date()}
              is24Hour={true}
              display="default"
              onChange={this.onChange}
            />
          )}

          {/* Public/Private buttons */}
          <View
            style={{
              flex: 1,

              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ButtonGroup
              buttons={["PRIVATE", "PUBLIC"]}
              containerStyle={{
                width: "85%",
                borderRadius: 15,
                height: 60,
              }}
              selectedButtonStyle={{
                backgroundColor: Constants.colors.primary,
              }}
              onPress={this.updateIndex}
              selectedIndex={this.state.buttonState}
            />
          </View>

          {/* Address input */}
          <View style={{ flex: 2 }}>
            {this.state.buttonState == 1 && (
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flex: 1,

                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Input
                    placeholder="First line of address"
                    containerStyle={{ width: "85%" }}
                    inputContainerStyle={{
                      borderColor: "#CDCBCB",
                      borderWidth: 1,
                      borderRadius: 15,
                      height: 60,
                    }}
                    inputStyle={{ marginLeft: 15 }}
                    onChangeText={(placeName) => this.setState({ placeName })}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                <View
                  style={{
                    flex: 1,

                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Input
                    placeholder="Postcode"
                    containerStyle={{ width: "85%" }}
                    inputContainerStyle={{
                      borderColor: "#CDCBCB",
                      borderWidth: 1,
                      borderRadius: 15,
                      height: 60,
                    }}
                    inputStyle={{ marginLeft: 15 }}
                    onChangeText={(postcode) => this.setState({ postcode })}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>
            )}
          </View>

          <View
            style={{
              flex: 2,

              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Button
              containerStyle={{ width: "80%", marginBottom: 30 }}
              buttonStyle={{
                backgroundColor: Constants.colors.primary,
                borderRadius: 15,
                height: 60,
                elevation: 5,
              }}
              title="Create"
              onPress={() => this.findTheCoords()}
            />
          </View>
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
