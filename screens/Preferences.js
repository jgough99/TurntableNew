import * as React from "react";
import { Text, View, Image, ActivityIndicator } from "react-native";
import { Header, Card, Button, Slider } from "react-native-elements";
import { useTheme } from "@react-navigation/native";
import * as firebase from "firebase";
import { withNavigation } from "react-navigation";
import firestore from "@firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PreferenceSlider from "../components/PreferenceSlider";

export class Preferences extends React.Component {
  state = { value: 0.5 };

  arrayOfValues(navigation) {
    var firebaseConfig = {
      apiKey: "AIzaSyBIDYCkEOOxAsmdvIlgP4hhKqXx6yzAglU",
      authDomain: "reactnative-f82c6.firebaseapp.com",
      databaseURL: "https://reactnative-f82c6.firebaseio.com",
      projectId: "reactnative-f82c6",
      storageBucket: "reactnative-f82c6.appspot.com",
      messagingSenderId: "382800399674",
      appId: "1:382800399674:web:d83dc73f6fef1498851403",
      measurementId: "G-W29WJ4DWPY"
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.firestore();
    db.collection("user")
      .doc(firebase.auth().currentUser.uid)
      .set({
        rock: this.rock.current.getValue(),
        pop: this.pop.current.getValue(),
        electro: this.electro.current.getValue(),
        hipHop: this.hipHop.current.getValue(),
        house: this.house.current.getValue()
      });
    navigation.navigate("Home");
  }

  rock = React.createRef();
  pop = React.createRef();
  electro = React.createRef();
  hipHop = React.createRef();
  house = React.createRef();

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            width: "90%",
            marginTop: 30
          }}
        >
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              alignSelf: "flex-start"
            }}
          >
            Tell us about your music taste.
          </Text>
          <Text style={{ fontSize: 18, alignSelf: "flex-start" }}>
            How do you feel about...
          </Text>
          <PreferenceSlider ref={this.rock} title="Rock?" />
          <PreferenceSlider ref={this.pop} title="Pop?" />
          <PreferenceSlider ref={this.electro} title="Electro?" />
          <PreferenceSlider ref={this.hipHop} title="Hip Hop? " />
          <PreferenceSlider ref={this.house} title="House?" />
        </View>
        <Button
          containerStyle={{ width: "80%", marginBottom: 30 }}
          buttonStyle={{
            backgroundColor: "#EC6338",
            borderRadius: 15,
            height: 60,
            elevation: 5
          }}
          title="Lets Go!"
          onPress={() => this.arrayOfValues(this.props.navigation)}
        />
      </View>
    );
  }
}

export default withNavigation(Preferences);
