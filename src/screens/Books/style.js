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
 
  title: {
    fontSize: 24,
    fontWeight: 'bolder',
    marginTop: -20,
    color: COLORS.dark,
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
    marginHorizontal: 10,
    marginVertical: 10,
    padding: 10,
    width: Dimensions.get('window').width / 1.1,
    height: Dimensions.get('window').height / 4,
    borderRadius: 10,
    backgroundColor: COLORS.white,
  },
 
  image: {
    paddingHorizontal: 5,
    width: Dimensions.get('window').width / 3,
    height: Dimensions.get('window').height / 5,
    borderRadius:5,
    resizeMode: 'contain'
  },
  elevation: {
    shadowColor: '#52006A',
    elevation: 4,
  },
  row: {
 
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop:10,
    height: 60,
  },
 
  
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    paddingHorizontal: 5,
    color: COLORS.dark,
  },
  descriptionText: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    fontSize: 12,
    color: COLORS.dark,
  },
   
  buynow: {
    height:40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bgColor,
    width: Dimensions.get('window').width / 2.5,
    borderRadius: 6,
    minHeight:40,
 
    
  },
   
  
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
  },
});
export default styles;
