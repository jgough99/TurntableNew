import React from 'react';
import { StyleSheet, Text, View ,Image} from 'react-native';
import Geocoder from 'react-native-geocoding';
import { Button ,Input,ButtonGroup} from 'react-native-elements';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import DateTimePicker from '@react-native-community/datetimepicker';
import {withNavigation} from 'react-navigation';

Geocoder.init("AIzaSyCFSuAtTl2BKMcs44dtOTWOL9QRWSc51VU"); // use a valid API key

export class CreateEvent extends React.Component {
  
  state={
    lat:51.620685,
    lng:-3.943685,
    placeName:'',
    postcode:'',
    date: new Date(),
    mode:'date',
    show: false,
    buttonState:0,
    eventName:''
  }

  findTheCoords(){
    
         Geocoder.from(this.state.postcode+this.state.placeName + "UK")
            .then(json => {
                this.setState({lat:json.results[0].geometry.location.lat})
                this.setState({lng:json.results[0].geometry.location.lng})
                console.log(this.state.lat)
                console.log(this.state.lng)
                this.props.navigation.navigate('ConfirmEvent', {
                  name:this.state.eventName,
                  lat: this.state.lat,
                  lng: this.state.lng,
                  date:this.state.date,
                  type:this.state.buttonState,
                });
            })
            .catch(error => console.warn(error));
            
            


  }

  onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    this.setState({show: (Platform.OS === 'ios' ? true : false)})
    this.setState({date:currentDate})
  };


  updateIndex =  selectedIndex  =>{
    this.setState({buttonState: selectedIndex})
  }

  showMode = currentMode => {
    this.setState({show:true})
    this.setState({mode:currentMode})
  };

  showDatepicker = () => {
    this.showMode('date');
  };

  showTimepicker = () => {
    this.showMode('time');
  };
  
  render(){
    return (
    <View style={styles.container}>

      <Input
          placeholder='Name of event'
          containerStyle={{width:'85%',marginVertical:10}}
          inputContainerStyle={{borderColor:'#CDCBCB',borderWidth:1,borderRadius:15,height:60}}
          inputStyle={{marginLeft:15}}
          onChangeText={(eventName) => this.setState({eventName})}
         autoCapitalize="none" 
         autoCorrect={false}/>

      <View style={{flexDirection:'row'}}>
      
        <Button 
        
  
        buttonStyle={{backgroundColor:'#EC6338', borderRadius:15,height:60,elevation:5}}
        onPress={this.showDatepicker} title={
          (((this.state.date).getDate()).toString())+ "/" +
          (((this.state.date).getMonth() + 1).toString())+"/"+
          (((this.state.date).getFullYear()).toString())+"  "}/>
       
        
        <Button onPress={this.showTimepicker} title={
          (((this.state.date).getHours()).toString())+ ":" +
          (((this.state.date).getMinutes() ).toString())+" "
        } 
        buttonStyle={{backgroundColor:'#EC6338', borderRadius:15,height:60,elevation:5}}/>
      </View>
      {this.state.show && (
          <DateTimePicker
            testID="dateTimePicker"
            timeZoneOffsetInMinutes={0}
            value={this.state.date}
            mode={this.state.mode}
            minimumDate={new Date()}
            is24Hour={true}
            display="default"
            onChange={this.onChange}
          />
        )}

      <ButtonGroup
      buttons={['PRIVATE','PUBLIC']}
      containerStyle={{width:'85%',marginVertical:10,borderRadius:15,height:60}}
      selectedButtonStyle={{backgroundColor:'#EC6338'}}
      onPress={this.updateIndex}
      selectedIndex={this.state.buttonState}
      />


        {(this.state.buttonState)==1 &&(
        <View style={{width:'100%',alignItems:'center'}}>
         <Input 
          placeholder='First line of address'
          containerStyle={{width:'85%',marginVertical:10}}
          inputContainerStyle={{borderColor:'#CDCBCB',borderWidth:1,borderRadius:15,height:60}}
          inputStyle={{marginLeft:15}}
          onChangeText={(placeName) => this.setState({placeName})}
         autoCapitalize="none" 
         autoCorrect={false}/>


          <Input 
          placeholder='Postcode'
          containerStyle={{width:'85%',marginVertical:10}}
          inputContainerStyle={{borderColor:'#CDCBCB',borderWidth:1,borderRadius:15,height:60}}
          inputStyle={{marginLeft:15}}
          onChangeText={(postcode) => this.setState({postcode})}
         autoCapitalize="none" 
         autoCorrect={false}/>
        
        </View>
      )}


    <Button
          containerStyle={{width:'80%',marginBottom:30}}
          buttonStyle={{backgroundColor:'#EC6338', borderRadius:15,height:60,elevation:5}}
          title="Create"
          onPress={()=>this.findTheCoords()}
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