import * as React from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import { Header, Card, Button } from "react-native-elements";
import CustomHeader from "./Header";
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
    width: 150,
    transform: [{ rotate: "-90deg" }],
    marginBottom: 70
  },
  bar: {
    backgroundColor: Constants.colors.primary,
    flexDirection: "column",
    alignItems: "center",
    borderTopEndRadius: 50,
    borderTopLeftRadius: 50,
    flex: 1,
    marginHorizontal: 3
  },
  number: {
    color: "white",
    fontFamily: "Rubik-Medium",
    fontSize: 20
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
          flexDirection: "row",
          alignItems: "flex-end"
        }}
      >
        <View
          style={[
            styles.bar,
            { height: 160 + this.props.rock, justifyContent: "flex-start" }
          ]}
        >
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={styles.number}>{this.props.rock}</Text>
          </View>
          <Text style={styles.text}>ROCK</Text>
        </View>
        <View style={[styles.bar, { height: 160 + this.props.electro }]}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={styles.number}>{this.props.electro}</Text>
          </View>

          <Text style={styles.text}>ELECTRO</Text>
        </View>
        <View style={[styles.bar, { height: 160 + this.props.pop }]}>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text style={styles.number}>{this.props.pop}</Text>
          </View>
          <Text style={styles.text}>POP</Text>
        </View>
        <View style={[styles.bar, { height: 160 + this.props.hiphop }]}>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text style={styles.number}>{this.props.hiphop}</Text>
          </View>
          <Text style={styles.text}>HIPHOP</Text>
        </View>
        <View style={[styles.bar, { height: 160 + this.props.house }]}>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text style={styles.number}>{this.props.house}</Text>
          </View>
          <Text style={styles.text}>HOUSE</Text>
        </View>
      </View>
    );
  }
}
