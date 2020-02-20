import * as React from 'react';
import {  Text, View, Image } from 'react-native';
import {Header, Card, Button} from 'react-native-elements';
import CustomHeader from '../components/Header';
import * as firebase from 'firebase';
import firestore from '@firebase/firestore';

export default function Profile({navigation})
{
    return (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>  
            <CustomHeader title="Profile"/>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                
            <Text>{firebase.auth().currentUser.email}</Text>
                <Button
                title="Sign out"
                onPress={() => firebase.auth().signOut()} 
                />
            </View>
        </View>

    );
}
