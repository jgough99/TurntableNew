import * as React from "react";
import {
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import { Header, Card, Button, Input } from "react-native-elements";
import CustomHeader from "../components/Header";
import { useTheme } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { withNavigation } from "react-navigation";
import * as firebase from "firebase";
import firestore from "@firebase/firestore";
import * as Constants from "../Constants";
import InputScrollView from "react-native-input-scroll-view";

const boxHeight = Constants.windowHeight * 0.08;

export class RegisterScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      confirm: "",
      error: "",
    };
  }
  //Method to sign the user up for an account in the firebase database with validation
  signUpUser = (email, password, confirm, navigation) => {
    if (password.length < 6) {
      this.setState({ error: "Password must be more than 6 characters" });
    } else if (password != confirm) {
      this.setState({ error: "Password's do not match" });
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(function (user) {
          firebase.auth().signInWithEmailAndPassword(email, password);
        })
        .catch((error) => this.setState({ error: error.message }));
    }
  };

  render() {
    return (
      <InputScrollView
        topOffset={10}
        style={{ flex: 1 }}
        useAnimatedScrollView={true}
      >
        <View style={{ flex: 1, height: Constants.windowHeight * 0.97 }}>
          <View
            style={{
              flex: 1,
              position: "absolute",
              width: "100%",
              height: "100%",
            }}
          >
            <View
              style={{
                flex: 3,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={require("../assets/turntable_logo.png")}
                fadeDuration={0}
                style={{
                  width: Constants.windowWidth / 2,
                  height: Constants.windowWidth / 2,
                }}
              />
            </View>
            <View style={{ flex: 0.7, alignItems: "center" }}>
              <Input
                placeholder="Email"
                containerStyle={{ width: "85%" }}
                leftIcon={
                  <MaterialCommunityIcons name="email" color="grey" size={25} />
                }
                inputContainerStyle={{
                  borderColor: "#CDCBCB",
                  borderWidth: 1,
                  borderRadius: 15,
                  height: boxHeight,
                }}
                inputStyle={{ marginLeft: 15 }}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(email) => this.setState({ email })}
              />
            </View>
            <View style={{ flex: 0.7, alignItems: "center" }}>
              <Input
                placeholder="Password"
                containerStyle={{ width: "85%" }}
                leftIcon={
                  <MaterialCommunityIcons name="lock" color="grey" size={25} />
                }
                inputContainerStyle={{
                  borderColor: "#CDCBCB",
                  borderWidth: 1,
                  borderRadius: 15,
                  height: boxHeight,
                }}
                inputStyle={{ marginLeft: 15 }}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={true}
                onChangeText={(password) => this.setState({ password })}
              />
            </View>
            <View style={{ flex: 0.7, alignItems: "center" }}>
              <Input
                placeholder="Confirm Password"
                containerStyle={{ width: "85%" }}
                leftIcon={
                  <MaterialCommunityIcons name="lock" color="grey" size={25} />
                }
                inputContainerStyle={{
                  borderColor: "#CDCBCB",
                  borderWidth: 1,
                  borderRadius: 15,
                  height: boxHeight,
                }}
                inputStyle={{ marginLeft: 15 }}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={true}
                onChangeText={(confirm) => this.setState({ confirm })}
              />
              <Text style={{ marginTop: 10, color: "red" }}>
                {this.state.error}
              </Text>
            </View>

            <View
              style={{
                flex: 1.3,
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Button
                containerStyle={{ width: "80%" }}
                buttonStyle={{
                  backgroundColor: "#EC6338",
                  borderRadius: 15,
                  height: boxHeight,
                  elevation: 5,
                }}
                title="Create Account"
                onPress={() =>
                  this.signUpUser(
                    this.state.email,
                    this.state.password,
                    this.state.confirm,
                    this.props.navigation
                  )
                }
              />
            </View>

            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                containerStyle={{ width: "80%" }}
                type="clear"
                buttonStyle={{ borderRadius: 15, height: boxHeight }}
                title="Already have an account?"
                titleStyle={{ color: "#546E7A", fontWeight: "100" }}
                onPress={() => this.props.navigation.navigate("Login")}
              />
            </View>
          </View>
        </View>
      </InputScrollView>
    );
  }
}

export default withNavigation(RegisterScreen);
