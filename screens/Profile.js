import * as React from 'react';
import {  Text, View, Image } from 'react-native';
import {Header, Card, Button} from 'react-native-elements';
import CustomHeader from '../components/Header';
import * as firebase from 'firebase';
import firestore from '@firebase/firestore';
import { StackActions } from '@react-navigation/native';
import { NavigationEvents } from 'react-navigation';
import {withNavigation} from 'react-navigation';
import BarChart from '../components/BarChart';

export class Profile extends React.Component
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
      signOutMethod()
      {
    
        firebase.auth().signOut()
        
      }

      componentDidMount() {
        this.onScreenFocus()
        this.props.navigation.addListener('focus', this.onScreenFocus)
      }

      onScreenFocus = () => {
        const db = firebase.firestore();
            
                db.collection('user').doc(firebase.auth().currentUser.uid).get()
                .then((doc)=>{
                    this.setState({rock:doc.data().rock})
                    this.setState({pop:doc.data().pop})
                    this.setState({house:doc.data().house})
                    this.setState({hipHop:doc.data().hipHop})
                    this.setState({electro:doc.data().electro})
                })
                .catch(err => {
                console.log('Error getting documents', err);
                });  

      }
      

render(){
    return (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>  
            <CustomHeader title="Profile"/>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',width:'100%'}}>
                <BarChart rock={Math.round(this.state.rock*100)} electro={Math.round(this.state.electro*100)} pop={Math.round(this.state.pop*100)} house={Math.round(this.state.house*100)} hiphop={Math.round(this.state.hipHop*100)}/>
                <Button
                title="Sign out"
                onPress={() => this.signOutMethod()} 
                />

                <Button
                  title="Create Event"
                  onPress={() => this.props.navigation.navigate("CreateEvent")} 
                />

                <Button
                  title="Go to my events"
                  onPress={() => this.props.navigation.navigate("MyEventsList")} 
                />
            </View>
        </View>

    );
}
}
    

export default withNavigation(Profile);
