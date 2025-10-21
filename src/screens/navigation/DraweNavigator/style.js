import COLORS from '../../../config/colors';
import { Dimensions,StyleSheet,Platform } from 'react-native';
const {height}=Dimensions.get("screen");
const height_logo=height * 0.10;
 
const  styles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingLeft: 0,
        color: 'black'
      },
      inputAndroid: {
        fontSize: 16,
        paddingLeft: 0,
        color: 'black'
      },
    container:{
        flex:1,
        backgroundColor:COLORS.bgColor, 
        
    },
    logo:{
        height:height_logo,
        width:height_logo,
    },
   
    text:{
        paddingTop:20,
        color:'#fff',
        fontSize:25,
        
    },
     
    header:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        marginBottom:20,
        marginTop:20,

            },
            footer:{
                flex:2,
                backgroundColor:COLORS.white,
                borderTopLeftRadius:30,
                borderTopRightRadius:30,
                paddingVertical:50,
                paddingHorizontal:30,
                
            
            },
input:{
    borderColor:COLORS.primary,
    borderRadius:2,
},
title:{
color:'#05375a',
fontSize:24,
fontWeight:'bolder',
marginTop:-20

},
 

button:{
    alignItems:'flex-end',
    marginTop:30
},
signIn:{
    marginTop:15,
    width:'100%',
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:30,
    flexDirection:'row'
},
textSingIn:{
    fontSize: 16,
    fontWeight: 'bold',
    color:COLORS.light,
    paddingLeft:15
},
button: {
    alignItems: 'center',
    marginTop: 50
},
textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
},
errorMsg: {
    color: '#FF0000',
    fontSize: 14,
},
text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30
},
text_footer: {
    color: '#05375a',
    fontSize: 18,
    paddingTop:30
},
action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5
},
actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5
},
  })
  export default styles;