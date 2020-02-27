import * as React from 'react';
import { Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CustomHeader from '../components/Header';
import * as firebase from 'firebase';
import firestore from '@firebase/firestore';
import {withNavigation} from 'react-navigation';


export function GenericHomeScreen({navigation}) {
    return (
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Text>HELOOO</Text>
        </View>
    );
  }

export function CodeScreen() {
    return (
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>

        </View>
    );
}

var eventIdGlobal = 0;

export class MyEvent extends React.Component
{
  constructor(props){
    super(props)
    eventIdGlobal = this.props.route.params.eventId.toString()
    this.state = ({
   
        title:'',
        eventId:this.props.route.params.eventId.toString(),
        loading:true,
    
    })
  }
  


  componentDidMount(){
    const db = firebase.firestore();
            
    db.collection('event').doc(this.state.eventId.toString()).get()
    .then((doc)=>{
        this.setState({title:doc.data().title})
        this.setState({loading:false})
    })
    .catch(err => {
    console.log('Error getting documents', err);
    this.setState({loading:false})

    });  
  }

  renderComponents()
  {
    const Tab = createMaterialTopTabNavigator();

    if(this.state.loading)
    {
      return (<Text>Loading</Text>)
    }
    else{
      return (
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
          component={CodeScreen}
          options={{ tabBarLabel: 'QR Code' }}
        />
        <Tab.Screen
          name="Profile"
          component={GenericHomeScreen}
          options={{ tabBarLabel: 'Statistics' }}
        />
      </Tab.Navigator>
    </View>
      );    
    }
  }


  render()
  {

      return(
        <View style={{flex:1}}> 
          <CustomHeader title={this.state.title}/>
          {this.renderComponents()}
        </View>
        

      )
  }
}
    
export default withNavigation(MyEvent);
