import * as React from "react";
import { Text, View, Image, ActivityIndicator, StyleSheet } from "react-native";
import { Header, Card, Button, Slider } from "react-native-elements";
import { useTheme } from "@react-navigation/native";
import * as firebase from "firebase";
import firestore from "@firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Constants from "../Constants";

//Styles for the playlist
const styles = StyleSheet.create({
  triangleUp: {
    maxWidth: "1%",
    maxHeight: "1%",
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "green",
  },
  triangleDown: {
    maxWidth: "1%",
    maxHeight: "1%",
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "red",
    transform: [{ rotate: "-180deg" }],
  },
});

export default class PlaylistItem extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    topGenre: "",
    secondGenre: "",
  };

  //Function to sort the genres to find the top two
  sortFunction(a, b) {
    if (a[0] === b[0]) {
      return 0;
    } else {
      return a[0] > b[0] ? -1 : 1;
    }
  }

  //Upon mountint a playlist item
  componentDidMount() {
    //Get the data for the song
    var song = this.props.jsonSong.data;
    var genresArray = [
      [song.rock, "ROCK"],
      [song.house, "HOUSE"],
      [song.pop, "POP"],
      [song.hiphop, "HIPHOP"],
      [song.electro, "ELECTRO"],
    ];

    //Order the genres and assign top two
    var sortedArray = genresArray.sort(this.sortFunction);
    var topGenre = sortedArray[0];
    var secondGenre = sortedArray[1];
    this.setState({ topGenre: topGenre[1] });
    this.setState({ secondGenre: secondGenre[1] });
  }

  //Funttion to get the background colour of the song item
  getBackround() {
    if (this.props.currentSong === true) {
      return Constants.colors.greyHighlight;
    } else {
      return "white";
    }
  }

  //Function to take draw the correct shape depending on position change
  drawShape(positionChange) {
    if (positionChange === "u") {
      return <View style={[styles.triangleUp]} />;
    }
    if (positionChange === "d") {
      return <View style={[styles.triangleDown]} />;
    } else {
      return <Text>-</Text>;
    }
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",

          borderBottomWidth: 1,
          borderColor: "#CDCBCB",
          width: Constants.windowWidth * 0.9,
          backgroundColor: this.getBackround(),
        }}
      >
        <View
          style={{
            flex: 1,
            height: 70,
            flexDirection: "row",
            width: Constants.windowWidth * 0.9,
          }}
        >
          {/* Index */}
          <View
            style={{
              flex: 1,
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              fontFamily: "Rubik-Regular",
            }}
          >
            {this.props.currentSong && (
              <MaterialCommunityIcons
                name="volume-high"
                size={25}
                color="#514F4F"
              />
            )}
            {!this.props.currentSong && (
              <Text style={{ color: "#514F4F" }}>{this.props.index + 1}</Text>
            )}
          </View>

          {/* Position change */}
          <View
            style={{
              flex: 1,
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              fontFamily: "Rubik-Regular",
            }}
          >
            {this.drawShape(this.props.indexChange)}
          </View>

          {/* Title/Artist */}
          <View style={{ flex: 6, height: "100%", justifyContent: "center" }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Rubik-Regular",
                color: "#383838",
              }}
            >
              {this.props.title}
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Rubik-Regular",
                color: "#8F8F8F",
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
              alignItems: "center",
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
                height: "40%",
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
                height: "40%",
              }}
            >
              {this.state.secondGenre}
            </Text>
          </View>
        </View>
        {this.props.currentSong && (
          <View
            style={{
              alignItems: "center",
              width: "100%",
              height: 40,
              backgroundColor: Constants.colors.greyHighlight,
            }}
          >
            <Slider
              style={{ width: "70%" }}
              value={this.props.timer}
              onValueChange={(value) => this.setState({ value })}
              thumbStyle={{ width: 0 }}
              maximumValue={(this.props.jsonSong.data.duration * 60) / 4}
              disabled={true}
            />
          </View>
        )}
      </View>
    );
  }
}
