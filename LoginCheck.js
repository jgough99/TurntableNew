import * as React from "react";
import {
  Text,
  View,
  Image,
  ActivityIndicator,
  AsyncStorage
} from "react-native";
import { Header, Card, Button } from "react-native-elements";
import { useTheme } from "@react-navigation/native";
import * as firebase from "firebase";
import { withNavigation } from "react-navigation";
import firestore from "@firebase/firestore";
import * as Font from "expo-font";

export class LoginCheck extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: null,
      loading: true,
      newUser: false,
      fontLoaded: false
    };
  }

  newUserCheck() {
    //SOME SORT OF LOOP WHICH ONLY BREAKS WHEN THE CURRENT USERS DATABASE COPY HAS BEEN MADE
    const db = firebase.firestore();

    db.collection("user")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then(doc => {
        if (doc.data().rock > -1) {
          console.log("FIRST " + doc.data().rock);
          this.setState({ newUser: false });
          this.setState({ loggedIn: true });
          this.setState({ loading: false });
        } else {
          console.log("SECOND " + doc.data().rock);

          this.setState({ newUser: true });
          this.setState({ loggedIn: true });
          this.setState({ loading: false });
        }
      })
      .catch(err => {
        this.newUserCheck();
      });
  }

  async writeSongsArray(songsArray) {
    await AsyncStorage.setItem("songsArray2", JSON.stringify(songsArray));
  }

  async componentDidMount() {
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
    //GET THE SONGS
    try {
      const value = await AsyncStorage.getItem("songsArray2");
      if (value !== null) {
        // Our data is fetched successfully
      } else {
        try {
          var songsArray = [];
          db.collection("song")
            .get()
            .then(snapshot => {
              snapshot.forEach(doc => {
                var data = doc.data();
                songsArray.push({ id: doc.id, data: data });
              });
              this.writeSongsArray(songsArray);
            });
        } catch (error) {}
      }
    } catch (error) {
      // Error retrieving data
    }

    await Font.loadAsync({
      "Rubik-Regular": require("./assets/fonts/Rubik-Regular.ttf"),
      "Rubik-Medium": require("./assets/fonts/Rubik-Medium.ttf")
    });

    this.setState({ fontLoaded: true });

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.newUserCheck();
      } else {
        this.setState({ loggedIn: false });
      }
      if (this.state.loading) {
        this.setState({ loading: false });
      }
    });
  }

  renderComponent() {
    if (this.state.loading) {
      return <ActivityIndicator size="large" color="grey" />;
    }
    if (this.state.loggedIn) {
      if (this.state.newUser) {
        this.props.navigation.navigate("Preferences");
      }
      if (!this.state.newUser) {
        this.props.navigation.navigate("Home");
      }
    } else if (this.state.loggedIn == false) {
      this.props.navigation.navigate("Welcome");
    }
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {this.state.fontLoaded ? this.renderComponent() : null}
      </View>
    );
  }
}

export default withNavigation(LoginCheck);
