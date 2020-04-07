import * as React from "react";
import { Text, View, Image, ActivityIndicator } from "react-native";
import { Header, Card, Button, Slider } from "react-native-elements";
import * as firebase from "firebase";
import firestore from "@firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Constants from "../Constants";

export default class PreferenceSlider extends React.Component {
  constructor(props) {
    super(props);
  }
  state = { value: 0.5, changed: false };

  getValue() {
    return this.state.value;
  }

  changed() {
    return this.state.changed;
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ marginBottom: 20, fontSize: 20, fontWeight: "bold" }}>
          {this.props.title}{" "}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialCommunityIcons name="thumb-down" color="#737272" size={40} />
          <View style={{ flex: 1, alignItems: "stretch" }}>
            <Slider
              style={{ width: "90%", alignSelf: "center" }}
              thumbStyle={{
                borderRadius: 15,
                backgroundColor: "white",
                borderColor: "#CDCBCB",
                borderWidth: 1,
                width: 40,
                height: 40,
              }}
              value={this.state.value}
              trackStyle={{ height: 6 }}
              minimumTrackTintColor={Constants.colors.primary}
              maximumTrackTintColor={"#CDCBCB"}
              onValueChange={(value) => this.setState({ value })}
              onSlidingComplete={(value) => {
                this.setState({ changed: true });
              }}
            />
          </View>
          <MaterialCommunityIcons name="thumb-up" color="#737272" size={40} />
        </View>
      </View>
    );
  }
}
