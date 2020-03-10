import { Header } from "react-native-elements";
import { Image, View } from "react-native";
import React, { Component } from "react";
import * as Constants from "../Constants";

export default class CustomHeader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Header
        placement="left"
        containerStyle={{
          backgroundColor: "#ffffff",
          borderBottomColor: "white",
          elevation: 1
        }}
        leftComponent={
          <Image
            source={require("../assets/turntable_logo.png")}
            fadeDuration={0}
            style={{ width: 35, height: 35 }}
          />
        }
        centerComponent={{
          text: this.props.title,
          style: { color: "black", fontSize: 25, fontFamily: "Rubik-Regular" }
        }}
      />
    );
  }
}
