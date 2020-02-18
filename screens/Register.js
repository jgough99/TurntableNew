import * as React from 'react';
import {  Text, View, Image } from 'react-native';
import {Header, Card, Button,Input } from 'react-native-elements';
import CustomHeader from '../components/Header';
import { useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function RegisterScreen({navigation})
{
    const { colors } = useTheme();

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
                <View style={{ flex: 1,alignItems:'center',justifyContent:'center'}}> 
                  <Input
                      placeholder='Email'
                      containerStyle={{width:'85%',marginVertical:10}}
                      leftIcon={<MaterialCommunityIcons name="email" color='grey' size={25}/>}
                      inputContainerStyle={{borderColor:'#CDCBCB',borderWidth:1,borderRadius:15,height:60}}
                      inputStyle={{marginLeft:15}}
                  />
                  <Input
                    placeholder='Password'
                    containerStyle={{width:'85%',marginVertical:10}}
                    leftIcon={<MaterialCommunityIcons name="lock" color='grey' size={25}/>}
                    inputContainerStyle={{borderColor:'#CDCBCB',borderWidth:1,borderRadius:15,height:60}}
                    inputStyle={{marginLeft:15}}
                />
                  <Input
                    placeholder='Confirm Password'
                    containerStyle={{width:'85%',marginVertical:10}}
                    leftIcon={<MaterialCommunityIcons name="lock" color='grey' size={25}/>}
                    inputContainerStyle={{borderColor:'#CDCBCB',borderWidth:1,borderRadius:15,height:60}}
                    inputStyle={{marginLeft:15}}
                />
                </View>
                <View style={{ flex: 1.3,alignItems:'center',justifyContent:'flex-end'}}> 
                  <Button
                      containerStyle={{width:'80%',marginBottom:30}}
                      buttonStyle={{backgroundColor:colors.primary, borderRadius:15,height:60,elevation:5}}
                      title="Create Account"
                      onPress={() => navigation.navigate('Home')}
                  />

                </View>

                <View style={{ flex: 0.7,alignItems:'center',justifyContent:'flex-start'}}> 
                <Button
                      containerStyle={{width:'80%'}}
                      type="clear"
                      buttonStyle={{ borderRadius:15,height:60}}
                      title="Already have an account?"
                      titleStyle={{color:colors.secondary,fontWeight:'100'}}
                      onPress={() => navigation.navigate('Login')}
                  />

                </View>
                             
            </View>

        </View>

    );
}

