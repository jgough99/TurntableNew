import * as React from 'react';
import {  Text, View, Image, ShadowPropTypesIOS } from 'react-native';
import {Header, Card, Button} from 'react-native-elements';
import CustomHeader from '../components/Header';


export default function AtEvent({ route, navigation })
{
    const { eventTitle } = route.params;
    return (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>  
            <CustomHeader title={JSON.stringify(eventTitle)}/>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
             <Text> You are at an event called: {"\n"} {JSON.stringify(eventTitle)}</Text>
             <Button
                   
                    title="BACK"
                    onPress={() => navigation.navigate('Home')}
                />
            </View>
        </View>

    );
}
