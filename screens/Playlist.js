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
      songsArray:[],
      attendees:[]
    }
  
    sortFunction(a, b) {
      if (a[0] === b[0]) {
          return 0;
      }
      else {
          return (a[0] > b[0]) ? -1 : 1;
      }
  }


    playlistUpdate(){
      var userPreferences = null;
      this.setState({loading:true})
      const db = firebase.firestore();
      db.collection("user").doc(firebase.auth().currentUser.uid).get()
      .then(snapshot => {
        userPreferences = snapshot.data()

        var attendeesArrayLength = this.state.attendees.length;
        console.log(this.state.attendees)
        var rock = userPreferences.rock;
        var hiphop = userPreferences.hipHop;
        var electro = userPreferences.electro;
        var house = userPreferences.house;
        var pop = userPreferences.pop;


        this.setState({playlist: []})
        if (attendeesArrayLength>0)
        {
            for (var i = 0; i < attendeesArrayLength; i++){
                rock = rock + this.state.attendees[i].rock;
                hiphop = hiphop + this.state.attendees[i].hipHop;
                electro = electro + this.state.attendees[i].electro;
                house = house + this.state.attendees[i].house;
                pop = pop + this.state.attendees[i].pop;
            }            
        }

 
        var totalNumberOfAttendees = attendeesArrayLength+1;

        rock = rock /totalNumberOfAttendees;
        hiphop = hiphop/totalNumberOfAttendees;
        electro = electro/totalNumberOfAttendees;
        house = house/totalNumberOfAttendees;
        pop = pop/totalNumberOfAttendees;

        var songsArrayLength = this.state.songsArray.length;
        for (var i = 0; i < songsArrayLength; i++) {
               var data = this.state.songsArray[i].data;
               this.state.playlist.push([similarity([data.rock,data.hiphop,data.electro,data.house,data.pop],
               [rock,hiphop,electro,house,pop]),data]) 
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
             this.setState({attendees:[]})
             querySnapshot.forEach(doc => {
                 if (doc.data().active == true)
                 {
                     db.collection('user').doc(doc.data().userId).get()
                     .then(snapshot => {
                        this.state.attendees.push(snapshot.data())
                     });
                     
                 }
                
             }
             );
             this.playlistUpdate();
             console.log('THE PLAYLIST HAS UPDATED')
     }, err => {
        console.log(`Encountered error: ${err}`);
      }); 
  
    //Every time the playlist changes
    db.collection('event').doc(this.props.eventId.toString()).onSnapshot(docSnapshot => {
  
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