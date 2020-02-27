import React from 'react';
import { StyleSheet, Text, View ,Image} from 'react-native';
import Geocoder from 'react-native-geocoding';
import { Button ,Input,ButtonGroup} from 'react-native-elements';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import DateTimePicker from '@react-native-community/datetimepicker';
import {withNavigation} from 'react-navigation';
import * as firebase from 'firebase';
import firestore from '@firebase/firestore';

Geocoder.init("AIzaSyCFSuAtTl2BKMcs44dtOTWOL9QRWSc51VU"); // use a valid API key

export class CreateEvent extends React.Component {

    state={
      lat:51.620685,
      lng:-3.943685,
      date: new Date(),
      type:0,
      eventName:''
    }

    confirm(navigation){
      const db = firebase.firestore();
          db.collection("event").add({
            location:new firebase.firestore.GeoPoint(this.state.lat,this.state.lng),
            title:this.state.eventName,
            type:this.state.type === 0 ? "Private":"Public",
            startTime:firebase.firestore.Timestamp.fromDate(this.state.date),
            userId : firebase.auth().currentUser.uid
          })  
          navigation.navigate('Home')
    }

    componentWillMount(){
      this.setState({lat:this.props.route.params.lat})
      this.setState({lng:this.props.route.params.lng})
      this.setState({eventName:this.props.route.params.name})
      this.setState({date:this.props.route.params.date})
      this.setState({type:this.props.route.params.type})
    }

  render(){


    return (
    <View style={styles.container}>

      <Text>Title: {this.state.eventName}</Text>
      <Text>Date: {this.state.date.toDateString()}</Text>
      <Text>Time: {this.state.date.toTimeString()}</Text>
      <Text>Type of event: {this.state.type === 0 ? "Private":"Public"}</Text>
        <View style={{flex:1,width:300,maxHeight:300}}>  
                
                    <MapView
                        style={styles.map}
                        region={{
                        latitude: this.state.lat, 
                        longitude: this.state.lng,
                        latitudeDelta: 0.003,
                        longitudeDelta: 0.003,
                        }}
                        >
                        <Marker
                        coordinate={{
                            latitude: this.state.lat, 
                            longitude: this.state.lng,
                        }}
                        title={"Club Y"}
                        >
                        <Image source={require('../assets/turntable_logo.png')} style={{height: 35, width:35 }} />
                        </Marker>
                    </MapView>
            </View> 

            <Button
          containerStyle={{width:'80%',marginBottom:30}}
          buttonStyle={{backgroundColor:'#EC6338', borderRadius:15,height:60,elevation:5}}
          title="Confirm"
          onPress={()=>this.confirm(this.props.navigation)}
      /> 
        </View>
  );
  }
  
}
const styles = StyleSheet.create({  
  container: {  
      flex: 1,  
      justifyContent: 'flex-start',  
      alignItems: 'center',
      marginTop:30
  },  map: {
    ...StyleSheet.absoluteFillObject,borderRadius:15
  }, 
}); 


export default withNavigation(CreateEvent);