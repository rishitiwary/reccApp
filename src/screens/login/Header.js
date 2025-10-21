import React from 'react';
import { Pressable,
    Text,
    StyleSheet,Button, View} from 'react-native';

    const HeaderDesign=()=>{
        return(
 <View style={styles.header}>

     <Text style={{fontSize:20,fontWeight:'bold', color:'#ffffff'}}>recc Academy</Text>
 </View>
      
        )
       
    }
    const styles=StyleSheet.create({
        header:{
             width:'100%',
             height:50,
            backgroundColor:'#2222ee',
            alignContent:'center',
            justifyContent:'center',
            alignItems:'center',
            marginBottom:20,
           
        }
    });
    export default HeaderDesign;