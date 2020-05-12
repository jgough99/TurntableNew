import * as React from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import { Header, Card, Button } from "react-native-elements";
import CustomHeader from "./Header";
import * as firebase from "firebase";
import firestore from "@firebase/firestore";
import { StackActions } from "@react-navigation/native";
import { NavigationEvents, ThemeColors } from "react-navigation";
import * as Constants from "../Constants";

//The bar height
const barHeight = Constants.windowHeight * 0.25;

//The styles for the bar chart
const styles = StyleSheet.create({
  text: {
    color: "white",
    fontFamily: "Rubik-Medium",
    fontSize: 24,
    width: 150,
    transform: [{ rotate: "-90deg" }],
    marginBottom: 70,
  },
  bar: {
    backgroundColor: Constants.colors.primary,
    flexDirection: "column",
    alignItems: "center",
    borderTopEndRadius: 50,
    borderTopLeftRadius: 50,
    flex: 1,
    marginHorizontal: 3,
  },
  number: {
    color: "white",
    fontFamily: "Rubik-Medium",
    fontSize: 20,
  },
});

export default class BarChart extends React.Component {
  constructor(props) {
    super(props);

    //The bar chart values
    this.state = {
      rock: "",
      pop: "",
      house: "",
      hipHop: "",
      electro: "",
    };
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          flexDirection: "row",
          alignItems: "flex-end",
        }}
      >
        <View
          style={[
            styles.bar,
            {
              height: barHeight + this.props.rock / 2,
              justifyContent: "flex-start",
            },
          ]}
        >
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={styles.number}>{this.props.rock}</Text>
          </View>
          <Text style={styles.text}>ROCK</Text>
        </View>
        <View
          style={[styles.bar, { height: barHeight + this.props.electro / 2 }]}
        >
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={styles.number}>{this.props.electro}</Text>
          </View>

          <Text style={styles.text}>ELECTRO</Text>
        </View>
        <View style={[styles.bar, { height: barHeight + this.props.pop / 2 }]}>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text style={styles.number}>{this.props.pop}</Text>
          </View>
          <Text style={styles.text}>POP</Text>
        </View>
        <View
          style={[styles.bar, { height: barHeight + this.props.hiphop / 2 }]}
        >
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text style={styles.number}>{this.props.hiphop}</Text>
          </View>
          <Text style={styles.text}>HIPHOP</Text>
        </View>
        <View
          style={[styles.bar, { height: barHeight + this.props.house / 2 }]}
        >
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text style={styles.number}>{this.props.house}</Text>
          </View>
          <Text style={styles.text}>HOUSE</Text>
        </View>
      </View>
    );
  }
}
