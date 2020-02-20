import * as React from 'react';
import { Button, Text, View, Image,BackHandler } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {Header} from 'react-native-elements';
import WelcomeScreen from './screens/Welcome';
import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';
import MyEvent from './screens/MyEvent';
import CreateEventScreen from './screens/CreateEventScreen';
import Timeline from './screens/Timeline';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import ScannerScreen from './screens/ScannerScreen';
import AtEvent from './screens/AtEvent';
import MapScreen from './screens/MapScreen';
import Profile from './screens/Profile';
import * as firebase from 'firebase';

import firestore from '@firebase/firestore';
import { LoginCheck } from './LoginCheck';



BackHandler.addEventListener('hardwareBackPress', function() {
  return true;
});

//////////////// HOME ////////////////////

const HomeTabs = createBottomTabNavigator();

export function BottomNavScreen({navigation}) {
  const { colors } = useTheme();
  return (
      <HomeTabs.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerShown: false
      }}
      
      
      tabBarOptions={{activeTintColor:colors.primary}}
      >
          <HomeTabs.Screen name="Map" component={MapScreen} options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="map" color={color} size={size} />
          ),
        }} />
          <HomeTabs.Screen name="Scanner" component={ScannerScreen} options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="qrcode-scan" color={color} size={size} />
          ),
        }}/>
          <HomeTabs.Screen name="Profile" component={Profile} options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-circle" color={color} size={size} />
          ),
        }}/>
          <HomeTabs.Screen name="Timeline" component={Timeline} options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="history" color={color} size={size} />
          ),
        }}/>
      </HomeTabs.Navigator>
  );
}

//////////////// ROOT ////////////////////

const MyTheme = {
  colors: {
    primary: '#EC6338',
    secondary: '#546E7A',
    background: 'white',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(199, 199, 204)',
  },
};

const RootStack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer theme={MyTheme}>
      
    <RootStack.Navigator screenOptions={{
    headerShown: false, gestureEnabled:false, 

  }}
  initialRouteName={"LoginCheck"}

  >
    <RootStack.Screen name="LoginCheck" component={LoginCheck} />
    <RootStack.Screen name="Welcome" component={WelcomeScreen} />
    <RootStack.Screen name="Login" component={LoginScreen} />
    <RootStack.Screen name="Register" component={RegisterScreen} />
    <RootStack.Screen name="Home" component={BottomNavScreen} />
    <RootStack.Screen name= "atEvent" component={AtEvent} />
    <RootStack.Screen name= "MyEvent" component={MyEvent} />
    <RootStack.Screen name="CreateEvent" component={CreateEventScreen} />
  </RootStack.Navigator>
  </NavigationContainer>
  );
}