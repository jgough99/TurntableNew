import * as React from 'react';
import { Text, View,Image,Dimensions,SafeAreaView, ScrollView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CustomHeader from '../components/Header';
import * as firebase from 'firebase';
import firestore from '@firebase/firestore';
import {withNavigation} from 'react-navigation';
import QRCode from 'react-native-qrcode-svg';
import similarity from 'compute-cosine-similarity'


export function GenericHomeScreen({navigation}) {
    return (
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Text>HELOOO</Text>
        </View>
    );
  }

export class PlaylistScreen extends React.Component {
  
  state={
    playlist:[],
    loading:true
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
    })


    db.collection("song").get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        var data = doc.data();
         this.state.playlist.push([similarity([data.rock,data.hiphop,data.electro,data.house,data.pop],
          [userPreferences.rock,userPreferences.hipHop,userPreferences.electro,userPreferences.house,userPreferences.pop]),data]) 
        });
        this.state.playlist.sort(this.sortFunction);
        console.log(this.state.playlist)
        this.setState({loading:false})
  }

    )
    

    .catch(err => {
        console.log('Error getting documents', err);
        this.setState({loading:false})
    });
  }


  componentDidMount(){
    this.playlistUpdate();

    const db = firebase.firestore();

    //Every time the attendance state of an event changes 
    db.collection('attendance').where('eventId','==',eventIdGlobal.toString()).onSnapshot(querySnapshot => {
      if (querySnapshot.empty) {
           console.log('No matching documents.');
           return;
           } 
           querySnapshot.forEach(doc => {
              console.log(doc.data())
           }
           );
   }, err => {
      console.log(`Encountered error: ${err}`);
    }); 

  //Every time the playlist changes
  db.collection('event').doc(eventIdGlobal.toString()).onSnapshot(docSnapshot => {
    this.setState({playlist: docSnapshot.data().playlist});

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
        {this.state.playlist.map(song =>(
            <Text key={song[1].id}>{song[1].title}, {song[0]}</Text>
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

export function CodeScreen() {
    return (
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <QRCode
              value={eventIdGlobal.toString()}
              size={Dimensions.get('window').width * 0.8}
              logo={require('../assets/turntable_logo.png')}
              logoSize={Dimensions.get('window').width * 0.25 }
            />
        </View>
    );
}

export class StatisticsScreen extends React.Component {

  state={
    attendees:[],
    loading:true
  }

  componentDidMount(){
    const db = firebase.firestore();
            
    db.collection('attendance').where('eventId','==',eventIdGlobal.toString())
    .where('active','==',true).onSnapshot(querySnapshot => {
      if (querySnapshot.empty) {
           console.log('No matching documents.');
           this.setState({loading:false})
           this.setState({attendees:[]})
           return;
           } 
           this.setState({attendees:[]})
           querySnapshot.forEach(doc => {
           this.state.attendees.push(doc.data().userId)
           }
           );
           this.setState({loading:false})
   }, err => {
      console.log(`Encountered error: ${err}`);
    }); 
  }

  render()
  {
    if (this.state.loading)
    {
      return (
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Text>Loading</Text>
        </View>
        ); 
    }
    else{
      return (
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <Text>{this.state.attendees}</Text>
      </View>
      ); 
    }

  }

}

var eventIdGlobal = 0;

export class MyEvent extends React.Component
{
  constructor(props){
    super(props)
    eventIdGlobal = this.props.route.params.eventId.toString()
    this.state = ({
        title:'',
        eventId:this.props.route.params.eventId.toString(),
        loading:true,
    })
  }

  componentDidMount(){
    const db = firebase.firestore();
            
    db.collection('event').doc(this.state.eventId.toString()).get()
    .then((doc)=>{
        this.setState({title:doc.data().title})
        this.setState({loading:false})
    })
    .catch(err => {
    console.log('Error getting documents', err);
    this.setState({loading:false})

    });  


  }

  renderComponents()
  {
    const Tab = createMaterialTopTabNavigator();

    if(this.state.loading)
    {
      return (<Text>Loading</Text>)
    }
    else{
      return (
        <View style={{flex:1}}>
        <Tab.Navigator
        initialRouteName="Feed"
        tabBarOptions={{
          activeTintColor: 'black',
          labelStyle: { fontSize: 15 , fontWeight:'bold'},
          style: { backgroundColor: 'white', borderTopColor:'white' },
          indicatorStyle: {
            backgroundColor: '#CA3C10',height: 4 
          }
        }}
      >
        <Tab.Screen
          name="Feed"
          component={PlaylistScreen}
          options={{ tabBarLabel: 'Playlist' }}
        />
        <Tab.Screen
          name="Notifications"
          component={CodeScreen}
          options={{ tabBarLabel: 'QR Code' }}
        />
        <Tab.Screen
          name="Profile"
          component={StatisticsScreen}
          options={{ tabBarLabel: 'Statistics' }}
        />
      </Tab.Navigator>
    </View>
      );    
    }
  }

  render()
  {

      return(
        <View style={{flex:1}}> 
          <CustomHeader title={this.state.title + ' dashboard'}/>
          {this.renderComponents()}
        </View>
        

      )
  }
}
    
export default withNavigation(MyEvent);
