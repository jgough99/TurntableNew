import * as React from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import { Header, Card, Button } from "react-native-elements";
import CustomHeader from "../components/Header";
import * as firebase from "firebase";
import firestore from "@firebase/firestore";
import { StackActions } from "@react-navigation/native";
import { NavigationEvents, ThemeColors } from "react-navigation";
import * as Constants from "../Constants";
const styles = StyleSheet.create({
  text: {
    color: "white",
    fontFamily: "Rubik-Medium",
    fontSize: 24,
    marginLeft: 5
  },
  bar: {
    backgroundColor: Constants.colors.primary,
    marginVertical: 3,
    flexDirection: "row",
    alignItems: "center",
    borderTopEndRadius: 50,
    borderBottomRightRadius: 50,
    flex: 1
  },
  number: {
    color: "white",
    fontFamily: "Rubik-Medium",
    fontSize: 20,
    marginRight: 5,
    transform: [{ rotate: "90deg" }]
  }
});

export default class BarChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rock: "",
      pop: "",
      house: "",
      hipHop: "",
      electro: ""
    };
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          maxHeight: Constants.windowWidth * 0.75,
          transform: [{ rotate: "-90deg" }]
        }}
      >
        <View style={[styles.bar, { width: 160 + this.props.rock }]}>
          <Text style={styles.text}>ROCK</Text>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text style={styles.number}>{this.props.rock}</Text>
          </View>
        </View>
        <View style={[styles.bar, { width: 160 + this.props.electro }]}>
          <Text style={styles.text}>ELECTRO</Text>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text style={styles.number}>{this.props.electro}</Text>
          </View>
        </View>
        <View style={[styles.bar, { width: 160 + this.props.pop }]}>
          <Text style={styles.text}>POP</Text>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text style={styles.number}>{this.props.pop}</Text>
          </View>
        </View>
        <View style={[styles.bar, { width: 160 + this.props.hiphop }]}>
          <Text style={styles.text}>HIPHOP</Text>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text style={styles.number}>{this.props.hiphop}</Text>
          </View>
        </View>
        <View style={[styles.bar, { width: 160 + this.props.house }]}>
          <Text style={styles.text}>HOUSE</Text>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text style={styles.number}>{this.props.house}</Text>
          </View>
        </View>
      </View>
    );
  }
}
