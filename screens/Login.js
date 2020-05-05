import * as React from "react";
import {
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  KeyboardAvoidingViewBase,
} from "react-native";
import { Header, Card, Button, Input } from "react-native-elements";
import CustomHeader from "../components/Header";
import { useTheme } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { withNavigation } from "react-navigation";
import * as firebase from "firebase";
import firestore from "@firebase/firestore";
import InputScrollView from "react-native-input-scroll-view";
import * as Constants from "../Constants";
const boxHeight = Constants.windowHeight * 0.08;

export class LoginScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      error: "",
    };
  }

  loginUser = (email, password, navigation) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(function (user) {
        navigation.navigate("Home");
      })
      .catch((error) => {
        if (
          error.message.toString() ==
          "The password is invalid or the user does not have a password."
        ) {
          this.setState({
            error: "Password is incorrect",
          });
        } else if (
          error.message.toString() ==
          "There is no user record corresponding to this identifier. The user may have been deleted."
        ) {
          this.setState({
            error: "Email address not recognised",
          });
        } else {
          console.log(error.message);
          this.setState({
            error: error.message,
          });
        }
      });
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

            <View style={{ flex: 0.8, alignItems: "center" }}>
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
                onChangeText={(email) => this.setState({ email })}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <View style={{ flex: 0.8, alignItems: "center" }}>
              <Input
                style={{ alignSelf: "center" }}
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
                onChangeText={(password) => this.setState({ password })}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={true}
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
                containerStyle={{ width: "80%", marginBottom: 30 }}
                buttonStyle={{
                  backgroundColor: "#EC6338",
                  borderRadius: 15,
                  height: boxHeight,
                  elevation: 5,
                }}
                title="Sign In"
                onPress={() =>
                  this.loginUser(
                    this.state.email,
                    this.state.password,
                    this.props.navigation
                  )
                }
              />
            </View>

            <View
              style={{
                flex: 0.7,
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <Button
                containerStyle={{ width: "80%" }}
                type="clear"
                buttonStyle={{ borderRadius: 15, height: boxHeight }}
                title="Don't have an account?"
                titleStyle={{ color: "#546E7A", fontWeight: "100" }}
                onPress={() => this.props.navigation.navigate("Register")}
              />
            </View>
          </View>
        </View>
      </InputScrollView>
    );
  }
}
export default withNavigation(LoginScreen);
