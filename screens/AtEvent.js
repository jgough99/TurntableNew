import * as React from 'react';
import {  Text, View, Image, ShadowPropTypesIOS } from 'react-native';
import {Header, Card, Button} from 'react-native-elements';
import CustomHeader from '../components/Header';
import {withNavigation} from 'react-navigation';
import * as firebase from 'firebase';
import firestore from '@firebase/firestore';

export class AtEvent extends React.Component
{
    state={
        codeValue: this.props.route.params.eventId,
        title:'',
        loading:true
    }

    componentDidMount(){
        const db = firebase.firestore();
                
        db.collection('event').doc(this.state.codeValue.toString()).get()
        .then((doc)=>{
            this.setState({title:doc.data().title})
            this.setState({loading:false})

            db.collection("attendance").doc(doc.id.toString() + firebase.auth().currentUser.uid.toString()).set({
                userId : firebase.auth().currentUser.uid,
                eventId : doc.id,
                active:true
              })  
        })
        .catch(err => {
        console.log('Error getting documents', err);
        this.setState({loading:false})
        });  
      }

      exitEvent(navigation){
        const db = firebase.firestore();
        db.collection("attendance").doc(this.state.codeValue.toString()+firebase.auth().currentUser.uid).set({
            eventId: this.state.codeValue,
            userId : firebase.auth().currentUser.uid,
            active:false
          })  
          navigation.navigate( 'Profile' )
      }

    render()
    {
        if(this.state.loading)
        {
            return(
                <Text>Loading</Text>
            )
        }
        else{
            return (
            <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>  
                <CustomHeader title={this.state.title}/>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text> You are at an event called:{this.state.title}</Text>
                <Button
                        title="BACK"
                        onPress={() => this.exitEvent(this.props.navigation)}
                    />
                </View>
            </View>
        );              
        }

    }

}
export default withNavigation(AtEvent);