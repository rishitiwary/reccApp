import COLORS from '../../config/colors';
import {Dimensions, StyleSheet, Platform} from 'react-native';
const {height} = Dimensions.get('screen');
const height_logo = height * 0.1;
const styles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingLeft: 0,
    color: 'black',
  },
  inputAndroid: {
    fontSize: 16,
    paddingLeft: 0,
    color: 'black',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: height_logo,
    width: height_logo,
  },

  text: {
    fontWeight:'bold',
    paddingTop: 10,
    color: 'black',
    fontSize: 14,
  },

  header: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flex: 3,
    backgroundColor: COLORS.white,
  },
  input: {
    borderColor: COLORS.primary,
    borderRadius: 2,
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
    paddingLeft: 5,
  },

  button: {
    alignItems: 'flex-end',
    marginTop: 30,
  },
  signIn: {
    marginTop: 15,
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    flexDirection: 'row',
  },
  textSingIn: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.light,
    paddingLeft: 15,
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#000',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
    paddingBottom: 10,
    marginTop: -30,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  scrollview: {
    marginHorizontal: 5,
  },
  view: {
    padding: 10,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 5,
    marginHorizontal: 10,
    padding: 5,
    width: Dimensions.get('window').width / 2.3,
    height: Dimensions.get('window').height / 4.2,
    borderRadius: 10,
    backgroundColor:COLORS.white,
    
  },
  cardText: {
    fontSize: 13,
    fontWeight:'bold',
    color: 'black',
    justifyContent:'flex-start',
    marginBottom:-50

  },
  opacity:{
    opacity:0.65
  },
  image:{
    width: Dimensions.get('window').width / 3.8,
    height: Dimensions.get('window').height / 5.5,
    resizeMode: 'stretch',
  },
  elevation: {  
    shadowColor: '#52006A',  
    elevation: 4,  
  },  
  row:{
    flex:1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent:'space-evenly'
  },
  card2: {
    marginHorizontal:10,
    marginVertical:10,
       padding: 10,
       width: Dimensions.get('window').width/1.1,
       height: Dimensions.get('window').height / 4,
       borderRadius: 10,
       backgroundColor:COLORS.white,
       
       
     },
     buynow:{
 
      alignItems:'center',
      justifyContent:'center',
      backgroundColor:COLORS.bgColor,
      width:Dimensions.get('window').width / 3,
      borderRadius:8,
      height:40,
     
    },
    description3:{
      flex:1,
      justifyContent:'flex-start',
      flexWrap: "wrap",
      justifyContent:'space-between',
      marginLeft:Dimensions.get('window').width / 2.5,
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    demo: {
      flex: 0.5,
   
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLORS.primary,
      width: Dimensions.get('window').width / 4,
      borderRadius: 6,
      
    },
    card2: {
      marginHorizontal: 10,
      marginVertical: 10,
      padding: 5.3,
      width: Dimensions.get('window').width / 1.07,
      height: Dimensions.get('window').height / 5,
      borderRadius: 10,
      backgroundColor: COLORS.white,
    },
    description2: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginLeft: Dimensions.get('window').width / 3.7,
      marginTop: 10,
    },
});
export default styles;
