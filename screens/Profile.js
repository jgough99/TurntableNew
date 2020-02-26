import * as React from 'react';
import {  Text, View, Image } from 'react-native';
import {Header, Card, Button} from 'react-native-elements';
import CustomHeader from '../components/Header';
import * as firebase from 'firebase';
import firestore from '@firebase/firestore';
import { StackActions } from '@react-navigation/native';
import { NavigationEvents } from 'react-navigation';
import {withNavigation} from 'react-navigation';

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
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start',width:'100%'}}>
             <Text style={{ width:(((this.state.rock)*100).toString()+"%"),borderTopRightRadius:15,borderBottomRightRadius:15, backgroundColor:'#EC6338',marginVertical:5}}>Rock</Text>
            <Text style={{ width:(((this.state.hipHop)*100).toString()+"%"),borderTopRightRadius:15,borderBottomRightRadius:15, backgroundColor:'#EC6338',marginVertical:5}}>HipHop</Text>
            <Text style={{ width:(((this.state.pop)*100).toString()+"%"),borderTopRightRadius:15,borderBottomRightRadius:15, backgroundColor:'#EC6338',marginVertical:5}}>Pop</Text>
            <Text style={{ width:(((this.state.house)*100).toString()+"%"),borderTopRightRadius:15,borderBottomRightRadius:15, backgroundColor:'#EC6338',marginVertical:5}}>House</Text>
            <Text style={{ width:(((this.state.electro)*100).toString()+"%"), borderTopRightRadius:15,borderBottomRightRadius:15,backgroundColor:'#EC6338',marginVertical:5}}>Electro</Text>
                <Button
                title="Sign out"
                onPress={() => this.signOutMethod()} 
                />

                <Button
                  title="Create Event"
                  onPress={() => this.props.navigation.navigate("CreateEvent")} 
                />
            </View>
        </View>

    );
}
}
    

export default withNavigation(Profile);
