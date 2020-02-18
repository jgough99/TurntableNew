import React from 'react';  
import {StyleSheet, Text, View,Image} from 'react-native';  

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
    render() {  
        return (
            <View style={{flex:1, justifyContent:'flex-start'}}>
                <CustomHeader title='Club Finder'/>
                <View style={styles.container}>  
                    <MapView
                        style={styles.map}
                        initialRegion={{
                        latitude: 51.620685, 
                        longitude: -3.943685,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                        }}
                        >
                        
                    </MapView>
                </View>  
            </View>  

        );  
    }  
}  