import * as React from 'react';
import {  Text, View, Image,KeyboardAvoidingView } from 'react-native';
import {Header, Card, Button,Input } from 'react-native-elements';
import CustomHeader from '../components/Header';
import { useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {withNavigation} from 'react-navigation';
import * as firebase from 'firebase';
import firestore from '@firebase/firestore';

export  class RegisterScreen extends React.Component
{
    constructor(props){
        super(props)
    
        this.state = ({
          email:'',
          password:'',
          confirm:'',

        })
      }
    
      signUpUser = (email,password,confirm) =>{
          try{
            if (password.length < 6)
            {
              alert("Please enter more than 6 chars")
            }
            else if(password != confirm)
            {
                alert("Passwords dont match")
            }
            else{
                firebase.auth().createUserWithEmailAndPassword(email,password);
                this.props.navigation.navigate('Home');
                
            }
            
          }
          catch(error){
            console.log(error.toString())
          }
      }
    
render(){
    
    return (
        <View style={{ flex: 1 }}> 
            <View style={{flex:1,position:'absolute',width:'100%',height:'100%'}}>
                <View style={{ flex: 2,alignItems:'center',justifyContent:'center' }}> 
                <Image
                    source={require('../assets/turntable_logo.png')}
                    fadeDuration={0}
                    style={{width:200,height:200}}
                />
                </View>
                <KeyboardAvoidingView 
                behavior="padding" 
                style={{ flex: 1,alignItems:'center',justifyContent:'center'}}
                keyboardVerticalOffset = {64}> 
                  <Input
                      placeholder='Email'
                      containerStyle={{width:'85%',marginVertical:10}}
                      leftIcon={<MaterialCommunityIcons name="email" color='grey' size={25}/>}
                      inputContainerStyle={{borderColor:'#CDCBCB',borderWidth:1,borderRadius:15,height:60}}
                      inputStyle={{marginLeft:15}}
                      onChangeText={(email) => this.setState({email})}/>
                      
                  
                  <Input
                    placeholder='Password'
                    containerStyle={{width:'85%',marginVertical:10}}
                    leftIcon={<MaterialCommunityIcons name="lock" color='grey' size={25}/>}
                    inputContainerStyle={{borderColor:'#CDCBCB',borderWidth:1,borderRadius:15,height:60}}
                    inputStyle={{marginLeft:15}}
                    onChangeText={(password) => this.setState({password})}/>

                
            
                    <Input
                        placeholder='Confirm Password'
                        containerStyle={{width:'85%',marginVertical:10}}
                        leftIcon={<MaterialCommunityIcons name="lock" color='grey' size={25}/>}
                        inputContainerStyle={{borderColor:'#CDCBCB',borderWidth:1,borderRadius:15,height:60}}
                        inputStyle={{marginLeft:15}}
                        onChangeText={(confirm) => this.setState({confirm})}/>
              
                  
                </KeyboardAvoidingView>
                <View style={{ flex: 1.3,alignItems:'center',justifyContent:'flex-end'}}> 
                  <Button
                      containerStyle={{width:'80%',marginBottom:30}}
                      buttonStyle={{backgroundColor:'#EC6338', borderRadius:15,height:60,elevation:5}}
                      title="Create Account"
                      onPress={()=>this.signUpUser(this.state.email,this.state.password,this.state.confirm)}

                  />

                </View>

                <View style={{ flex: 0.7,alignItems:'center',justifyContent:'flex-start'}}> 
                <Button
                      containerStyle={{width:'80%'}}
                      type="clear"
                      buttonStyle={{ borderRadius:15,height:60}}
                      title="Already have an account?"
                      titleStyle={{color:'#546E7A',fontWeight:'100'}}
                      onPress={() => this.props.navigation.navigate('Login')}
                  />

                </View>
                             
            </View>

        </View>

    );
}

}

export default withNavigation(RegisterScreen);
