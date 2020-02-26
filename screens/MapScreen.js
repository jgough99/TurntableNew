import React from 'react';  
import {StyleSheet, Text, View,Image,Button,ActivityIndicator} from 'react-native';  
import * as firebase from 'firebase';
import firestore from '@firebase/firestore';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import CustomHeader from '../components/Header';


const styles = StyleSheet.create({  
    container: {  
        flex: 1,  
        justifyContent: 'center',  
        alignItems: 'center'  
    },  map: {
      ...StyleSheet.absoluteFillObject,
    }, 
});


export default class MapScreen extends React.Component {  

    state={
        markers: [],
        loading:true
    }

    componentDidMount(){
        const db = firebase.firestore();

        db.collection("event").where('type', '==', 'Public').get()
        .then(snapshot => {
            if (snapshot.empty) {
            console.log('No matching documents.');
            this.setState({loading:false})
            return;
            }
            var i = 0;  
            snapshot.forEach(doc => {
            this.state.markers.push({id: i, location: doc.data().location, title:doc.data().title, startTime:doc.data().startTime})
            i++;
            }
            );
            this.setState({loading:false})
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
    }
      
    renderMap()
    {
        if (this.state.loading == false)
        {
        return (
                    <MapView
                        style={styles.map}
                        initialRegion={{
                        latitude: 51.620685, 
                        longitude: -3.943685,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                        }}
                        >
                            {console.log(this.state.markers)}
                        {this.state.markers.map(marker => (
                            
                            <Marker
                            key={marker.id}
                            coordinate={{
                                latitude: marker.location.U, 
                                longitude: marker.location.k,
                            }}
                            title={marker.title}
                            description={marker.startTime.toDate().toDateString()}
                            >
                            <Image source={require('../assets/turntable_logo.png')} style={{height: 35, width:35 }} />
                            </Marker>
                        ))}
                    </MapView>

        );  
         }
         else{
                <ActivityIndicator size="large" color="grey" />
         }
    }

    render() {  
        return(
        <View style={{flex:1, justifyContent:'flex-start'}}>
        <CustomHeader title='Club Finder'/>
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>  
            {this.renderMap()}
        </View>  
    </View>  
        )
    }  
}  