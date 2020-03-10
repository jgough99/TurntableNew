import * as React from "react";
import { Text, View, Image } from "react-native";
import { Header, Card, Button } from "react-native-elements";
import CustomHeader from "../components/Header";
import * as firebase from "firebase";
import firestore from "@firebase/firestore";
import * as Constants from "../Constants";

export default function Welcome({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <Image
        source={require("../assets/welcome_screen.png")}
        fadeDuration={0}
        style={{ width: "100%", height: "100%" }}
      />
      <View
        style={{ flex: 2, position: "absolute", width: "100%", height: "100%" }}
      >
        <View
          style={{ flex: 2, alignItems: "center", justifyContent: "center" }}
        >
          <Image
            source={require("../assets/turntable_logo.png")}
            fadeDuration={0}
            style={{ width: 200, height: 200 }}
          />
        </View>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "flex-end" }}
        >
          <Text
            style={{
              fontSize: 50,
              color: "white",
              textShadowRadius: 20,
              textAlign: "center",
              fontFamily: "Rubik-Regular",
              marginBottom: 10
            }}
          >
            turntable.
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "flex-start"
          }}
        >
          <Text
            style={{
              fontSize: 20,
              color: "white",
              textShadowRadius: 20,
              textShadowColor: "rgba(0, 0, 0, 0.5)",
              textAlign: "center",
              fontFamily: "Rubik-Regular"
            }}
          >
            The tables have turned. {"\n"} Now you're in control.
          </Text>
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              width: "80%",
              flex: 1
            }}
          >
            <Button
              containerStyle={{ width: "55%", marginHorizontal: 10 }}
              buttonStyle={{
                backgroundColor: Constants.colors.primary,
                borderRadius: 15,
                height: 60,
                elevation: 5
              }}
              title="LOGIN"
              onPress={() => navigation.navigate("Login")}
            />
            <Button
              containerStyle={{ width: "55%", marginHorizontal: 10 }}
              buttonStyle={{
                backgroundColor: Constants.colors.secondary,
                borderRadius: 15,
                height: 60,
                elevation: 5
              }}
              title="REGISTER"
              onPress={() => navigation.navigate("Register")}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
