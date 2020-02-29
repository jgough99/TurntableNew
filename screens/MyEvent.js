import * as React from 'react';
import { Text, View,Image,Dimensions,SafeAreaView, ScrollView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CustomHeader from '../components/Header';
import * as firebase from 'firebase';
import firestore from '@firebase/firestore';
import {withNavigation} from 'react-navigation';
import QRCode from 'react-native-qrcode-svg';
import similarity from 'compute-cosine-similarity'
import PlaylistScreen from './Playlist'

export function GenericHomeScreen() {
    return (
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <PlaylistScreen eventId = {eventIdGlobal}/>
        </View>
    );
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
          component={GenericHomeScreen}
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
