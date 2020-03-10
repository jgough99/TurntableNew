import * as React from "react";
import { Text, View, Image, ActivityIndicator } from "react-native";
import { Header, Card, Button, Slider } from "react-native-elements";
import { useTheme } from "@react-navigation/native";
import * as firebase from "firebase";
import firestore from "@firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Constants from "../Constants";

export default class PlaylistItem extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    topGenre: "",
    secondGenre: ""
  };

  sortFunction(a, b) {
    if (a[0] === b[0]) {
      return 0;
    } else {
      return a[0] > b[0] ? -1 : 1;
    }
  }

  componentDidMount() {
    var song = this.props.jsonSong;
    var genresArray = [
      [song.rock, "ROCK"],
      [song.house, "HOUSE"],
      [song.pop, "POP"],
      [song.hiphop, "HIPHOP"],
      [song.electro, "ELECTRO"]
    ];
    var sortedArray = genresArray.sort(this.sortFunction);
    var topGenre = sortedArray[0];
    var secondGenre = sortedArray[1];
    this.setState({ topGenre: topGenre[1] });
    this.setState({ secondGenre: secondGenre[1] });
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height: 70,
          borderBottomWidth: 1,
          borderColor: "#CDCBCB",
          width: Constants.windowWidth * 0.9
        }}
      >
        {/* Index */}
        <View
          style={{
            flex: 1,
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "Rubik-Regular"
          }}
        >
          <Text style={{ color: "#514F4F" }}>{this.props.index + 1}</Text>
        </View>

        {/* Position change */}
        <View
          style={{
            flex: 1,
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "Rubik-Regular"
          }}
        >
          <Text>-</Text>
        </View>

        {/* Title/Artist */}
        <View style={{ flex: 6, height: "100%", justifyContent: "center" }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Rubik-Regular",
              color: "#383838"
            }}
          >
            {this.props.title}
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontFamily: "Rubik-Regular",
              color: "#8F8F8F"
            }}
          >
            {this.props.artist}
          </Text>
        </View>

        {/* Genres */}
        <View
          style={{
            flex: 2,
            height: "100%",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text
            style={{
              backgroundColor: "#E17A5A",
              width: "90%",
              textAlign: "center",
              textAlignVertical: "center",
              borderRadius: 15,
              margin: 2,
              color: "white",
              fontFamily: "Rubik-Medium",
              fontSize: 12,
              height: "40%"
            }}
          >
            {this.state.topGenre}
          </Text>
          <Text
            style={{
              backgroundColor: "#E17A5A",
              width: "90%",
              textAlign: "center",
              textAlignVertical: "center",
              borderRadius: 15,
              margin: 2,
              color: "white",
              fontFamily: "Rubik-Regular",
              fontFamily: "Rubik-Medium",
              fontSize: 12,
              height: "40%"
            }}
          >
            {this.state.secondGenre}
          </Text>
        </View>
      </View>
    );
  }
}
