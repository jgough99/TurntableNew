import * as React from 'react';
import {  Text, View, Image,ActivityIndicator } from 'react-native';
import {Header, Card, Button} from 'react-native-elements';
import { useTheme } from '@react-navigation/native';
import * as firebase from 'firebase';
import {withNavigation} from 'react-navigation';
import firestore from '@firebase/firestore';

export class LoginCheck extends React.Component {
    state = { loggedIn: null,
            loading:true,
            newUser:false,
    };

    newUserCheck(){

      const db = firebase.firestore();

      db.collection('user').doc(firebase.auth().currentUser.uid).get()
      .then((doc)=>{
        if (doc.data().rock > -1)
        { 
            this.setState({newUser: false})
        }
        else{
          this.setState({newUser: true})
        }
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
    }
    


    componentDidMount() {
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

      
   
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.setState({ loggedIn: true })
          this.newUserCheck();
          this.setState({ loading: false });
        } else {
          this.setState({ loggedIn: false })
        }
        if (this.state.loading) {
            this.setState({ loading: false });
        }
      })
    }

  renderComponent() {
      
      if(this.state.loading) {
          return( <ActivityIndicator size="large" color="grey" />)
      }
      if (this.state.loggedIn) {
        
        if(this.state.newUser)
        {
          this.props.navigation.navigate('Preferences')
        }
        else{
          this.props.navigation.navigate('Home')
        }
        
      } else {
         this.props.navigation.navigate('Welcome')
        
      }
    }

    render() {
      
      return (
        <View style={{flex:1,alignItems:'center', justifyContent:'center'}}>
          {this.renderComponent()}
        </View>
      );
    }
  }

  export default withNavigation(LoginCheck);
