import * as React from "react";
import { Text, View, Image } from "react-native";
import { Header, Card, Button } from "react-native-elements";
import CustomHeader from "../components/Header";
import BarcodeScannerScreen from "../components/Scanner";

//Load the barcode scanner component
export default function ScannerScreen({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <CustomHeader title="Scanner" left={"logo"} navigation={navigation} />
      <BarcodeScannerScreen nav={navigation} />
    </View>
  );
}
