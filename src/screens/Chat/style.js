import COLORS from '../../config/colors';
import {Dimensions, StyleSheet, Platform} from 'react-native';
import {
  
  moderateScale,
 
} from '../../config/Metrics';

const {height,width} = Dimensions.get('screen');
const height_logo = height * 0.1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  opacity: {
    opacity: 0.65,
  },
  logo: {
    height: height_logo,
    width: height_logo,
  },

  text: {
    color: COLORS.dark,
  },

  header: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    alignItems: 'flex-end',
    marginTop: 30,
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

  scrollview: {
    marginHorizontal: 5,
  },

  card: {
    marginHorizontal: 3,
    marginVertical: 2.7,
    padding: 10,
    width: Dimensions.get('window').width / 1.05,
    height: Dimensions.get('window').height / 4.4,
    borderRadius: 10,
    backgroundColor: COLORS.white,
  },

  image: {
    width: Dimensions.get('window').width / 3,
    height: Dimensions.get('window').height / 5.3,
     resizeMode: 'stretch',
    // borderRadius: 10,
  },
  elevation: {
    shadowColor: '#52006A',
    elevation: 4,
  },
  column: {
    flex: 1,
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(2),
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.dark,
    textTransform: 'capitalize',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  description2: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: moderateScale(0),
    paddingHorizontal: moderateScale(10),
  },
  descriptionText: {
    paddingHorizontal: 5,
    fontSize: 12,
    color: COLORS.dark,
  },
  buynow: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bgColor,
    width: moderateScale(180),
    height: moderateScale(40),
    borderRadius: 18,
    marginHorizontal: moderateScale(10),
  },
  pageTitle: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  pageDescription: {
    color: COLORS.dark,
    fontSize: 15,
    textTransform: 'capitalize',
  },

  DetailsImage: {
    width: Dimensions.get('window').width / 1.05,
    height: Dimensions.get('window').height / 3,
    resizeMode: 'contain',
    borderRadius: 10,
    marginVertical: moderateScale(5),
    paddingHorizontal: 5,
  },
  line: {
    margin: 10,
    width: Dimensions.get('window').width / 1,

    height: 1,
  },
  headerBanner: {
    
    flex: 0.8,
    width:width,
    backgroundColor:COLORS.bgColor,
 
  },
  headerText: {
    color:COLORS.white,
    marginVertical:20,
    paddingHorizontal:10,
    fontSize:20,
    fontWeight:'bold'
 
  },
});
export default styles;
