import * as React from 'react';
import {  Text, View, Image } from 'react-native';
import {Header, Card, Button} from 'react-native-elements';


export default function CreateEventScreen({navigation})
{
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Create Event</Text>
        <Button
       
        title="Create"
        onPress={() => navigation.navigate('MyEvent')}
      />
      </View>
    );
}
