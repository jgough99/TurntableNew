import { Header } from "react-native-elements";
import { Image, View, Text, Alert } from "react-native";
import React, { Component } from "react";
import * as Constants from "../Constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";
import * as firebase from "firebase";

export default class CustomHeader extends Component {
  constructor(props) {
    super(props);
  }
  _menu = null;

  _twoOptionAlertHandler = () => {
    //function to confirm sign out
    Alert.alert(
      //title
      "Are you sure?",
      //body
      "Are you sure you want to sign out?",
      [
        { text: "Yes", onPress: () => firebase.auth().signOut() },
        {
          text: "No",
          onPress: () => console.log("No Pressed"),
          style: "cancel",
        },
      ],
      { cancelable: true }
      //clicking out side of alert will cancel
    );
  };

  //Set a reference for the three dots menu
  setMenuRef = (ref) => {
    this._menu = ref;
  };

  //Function to show the three dots menu
  showMenu = () => {
    this._menu.show();
  };

  //Function to hide the menu
  hideMenu = () => {
    this._menu.hide();
    this._twoOptionAlertHandler();
  };

  render() {
    return (
      <Header
        placement="left"
        containerStyle={{
          backgroundColor: "#ffffff",
          borderBottomColor: "white",
          elevation: 1,
        }}
        leftComponent={
          <View>
            {this.props.left == "logo" && (
              <Image
                source={require("../assets/turntable_logo.png")}
                fadeDuration={0}
                style={{ width: 35, height: 35 }}
              />
            )}
            {this.props.left == "back" && (
              <MaterialCommunityIcons
                name="arrow-left"
                color={"grey"}
                size={30}
                onPress={() => this.props.navigation.goBack()}
              />
            )}
          </View>
        }
        rightComponent={
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons
              name="calendar-plus"
              color={Constants.colors.primary}
              size={30}
              onPress={() => this.props.navigation.navigate("CreateEvent")}
            />
            <Menu
              ref={this.setMenuRef}
              button={
                <MaterialCommunityIcons
                  name="dots-vertical"
                  color={"grey"}
                  size={30}
                  onPress={this.showMenu}
                />
              }
            >
              <MenuItem onPress={this._twoOptionAlertHandler}>
                Sign Out
              </MenuItem>
            </Menu>
          </View>
        }
        centerComponent={{
          text: this.props.title,
          style: { color: "black", fontSize: 25, fontFamily: "Rubik-Regular" },
        }}
      />
    );
  }
}
