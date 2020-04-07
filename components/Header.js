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
    //function to make two option alert
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
      { cancelable: false }
      //clicking out side of alert will not cancel
    );
  };

  setMenuRef = (ref) => {
    this._menu = ref;
  };

  showMenu = () => {
    this._menu.show();
  };
  hideMenu = () => {
    this._menu.hide();
    this._twoOptionAlertHandler();
  };
  signOut() {}

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
          <Image
            source={require("../assets/turntable_logo.png")}
            fadeDuration={0}
            style={{ width: 35, height: 35 }}
          />
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
              <MenuItem onPress={this.hideMenu}>Sign Out</MenuItem>
            </Menu>

            {/* <MaterialCommunityIcons
              name="account-circle"
              color={Constants.colors.primary}
              size={30}
            /> */}
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
