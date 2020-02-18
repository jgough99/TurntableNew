import * as React from 'react';
import { Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CustomHeader from '../components/Header';
const Tab = createMaterialTopTabNavigator();


export function GenericHomeScreen({navigation}) {
    return (
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Text>HELOOO</Text>
        </View>
    );
  }
  

export default function MyEvent({navigaton})
{
return (
    <View style={{flex:1}}> 
    <CustomHeader title="Hello"/>
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
            component={GenericHomeScreen}
            options={{ tabBarLabel: 'QR Code' }}
          />
          <Tab.Screen
            name="Profile"
            component={GenericHomeScreen}
            options={{ tabBarLabel: 'Statistics' }}
          />
        </Tab.Navigator>
      </View>
  </View>
  );
  
}
    

