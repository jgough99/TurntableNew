import * as React from 'react';
import { Text, View,Image,Dimensions,SafeAreaView, ScrollView,AsyncStorage } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CustomHeader from '../components/Header';
import * as firebase from 'firebase';
import firestore from '@firebase/firestore';
import {withNavigation} from 'react-navigation';
import QRCode from 'react-native-qrcode-svg';
import similarity from 'compute-cosine-similarity'


export default class PlaylistScreen extends React.Component {
  
    state={
      playlist:[],
      loading:true,
      songsArray:[]
    }
  
    sortFunction(a, b) {
      if (a[0] === b[0]) {
          return 0;
      }
      else {
          return (a[0] > b[0]) ? -1 : 1;
      }
  }

    pushToPlaylist()
    {
        
    }
  
    playlistUpdate(){ 
      var userPreferences = null;
      this.setState({loading:true})
      const db = firebase.firestore();
      db.collection("user").doc(firebase.auth().currentUser.uid).get()
      .then(snapshot => {
        userPreferences = snapshot.data()

        var arrayLength = this.state.songsArray.length;
        for (var i = 0; i < arrayLength; i++) {
               var data = this.state.songsArray[i].data;
               this.state.playlist.push([similarity([data.rock,data.hiphop,data.electro,data.house,data.pop],
               [userPreferences.rock,userPreferences.hipHop,userPreferences.electro,userPreferences.house,userPreferences.pop]),data]) 
         }
         
         this.state.playlist.sort(this.sortFunction);
         this.setState({loading:false})
      })



  
      .catch(err => {
          console.log('Error getting documents', err); 
          this.setState({loading:false})
      });
    }
  
  
    async componentDidMount(){  

        var value = await AsyncStorage.getItem('songsArray2');
        if (value !== null) {
            console.log(JSON.parse(value)[0]);
            this.setState({songsArray:JSON.parse(value)})
        }

      const db = firebase.firestore();
  
      //Every time the attendance state of an event changes 
      db.collection('attendance').where('eventId','==',this.props.eventId.toString()).onSnapshot(querySnapshot => {
        if (querySnapshot.empty) {
             console.log('No matching documents.');
             return;
             } 
             this.playlistUpdate();
             console.log('THE PLAYLIST HAS UPDATED')
             querySnapshot.forEach(doc => {

             }
             );
     }, err => {
        console.log(`Encountered error: ${err}`);
      }); 
  
    //Every time the playlist changes
    db.collection('event').doc(this.props.eventId.toString()).onSnapshot(docSnapshot => {
      //this.setState({playlist: docSnapshot.data().playlist});
  
    }, err => {
      console.log(`Encountered error: ${err}`);
    }); 
  }
  render(){
    if (this.state.loading == false)
      {
      return(
        <SafeAreaView style={{flex:1 }}>
              <ScrollView>
          {this.state.playlist.map((song,index) =>(
              <Text key={index}>{song[1].title}, {song[0]}</Text>
          ))}
              </ScrollView>
        </SafeAreaView> 
      )
      }
      else{
        return(
          <Text>Loading</Text>
        )
      }
  }
  }