import {Card,Button} from 'react-native-elements';
import { Text } from 'react-native';
import React,{Component} from 'react';
import { useTheme } from '@react-navigation/native';

export default function TimelineCard(props) {
    const { colors } = useTheme();
        return(
            <Card  image={props.imagePath}  containerStyle={{elevation: 6,borderRadius:15,overflow:'hidden'}}>
            
                <Text style={{fontSize:24}}>
                    {props.title}
                </Text> 
                <Text style={{fontSize:14, color:'#737272'}}>
                    {props.type}
                </Text> 
                
                    <Button 
                    containerStyle={{alignSelf:'baseline'}}
                    type="clear"
                    title="DETAILS"
                    titleStyle={{color:colors.primary, fontSize:12}}
                />
                
            </Card>
        ) 
    }




