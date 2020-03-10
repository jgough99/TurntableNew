import * as React from "react";
import { Text, View, StyleSheet, Button, Dimensions } from "react-native";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { useNavigation } from "@react-navigation/native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Ionicons } from "@expo/vector-icons";

//mdiImageFilterCenterFocusWeak

export default class BarcodeScannerScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    scanned: false
  };

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    this.getPermissionsAsync();
  }

  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  };

  render() {
    const { hasCameraPermission, scanned } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }

    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <BarCodeScanner
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={{ height: Dimensions.get("window").height }}
        />
        <View
          style={{
            flex: 1,
            position: "absolute",
            justifyContent: "center",
            alignSelf: "center"
          }}
        >
          <Ionicons name="ios-qr-scanner" color="white" size={300} />
        </View>
        {scanned && (
          <Button
            title={"Tap to Scan Again"}
            onPress={() => this.setState({ scanned: false })}
          />
        )}
      </View>
    );
  }

  handleBarCodeScanned = ({ type, data }) => {
    this.setState({ scanned: true });
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    this.props.nav.navigate("atEvent", { eventId: data });
  };
}
