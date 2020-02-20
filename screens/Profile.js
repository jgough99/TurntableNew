import * as React from 'react';
import {  Text, View, Image } from 'react-native';
import {Header, Card, Button} from 'react-native-elements';
import CustomHeader from '../components/Header';
import * as firebase from 'firebase';
import firestore from '@firebase/firestore';



      
export default class Profile extends React.Component
{
    constructor(props){
        super(props)
    
        this.state = ({
          rock:'',
          pop:'',
          house:'',
          hipHop:'',
          electro:'',

        })
      }



render(){
    // const db = firebase.firestore();

    // db.collection('user').doc(firebase.auth().currentUser.uid).get()
    // .then((doc)=>{
    //     this.setState({rock:doc.data().rock})
    //     this.setState({pop:doc.data().pop})
    //     this.setState({house:doc.data().house})
    //     this.setState({hipHop:doc.data().hipHop})
    //     this.setState({electro:doc.data().electro})
    // })
    // .catch(err => {
    //   console.log('Error getting documents', err);
    // });  


    return (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>  
            <CustomHeader title="Profile"/>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                
            <Text>{firebase.auth().currentUser.email}</Text>
            <Text>Rock: {this.state.rock}</Text>
            <Text>HipHop: {this.state.hipHop}</Text>
            <Text>Pop: {this.state.pop}</Text>
            <Text>House: {this.state.house}</Text>
            <Text>Electro: {this.state.electro}</Text>
                <Button
                title="Sign out"
                onPress={() => firebase.auth().signOut()} 
                />
            </View>
        </View>

    );
}
}
    

