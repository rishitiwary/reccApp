import COLORS from '../../config/colors';
import {Dimensions, StyleSheet, Platform} from 'react-native';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../config/Metrics';
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
    backgroundColor: COLORS.bgColor,
  },
  logo: {
    height: height_logo,
    width: height_logo,
  },

  text: {
    paddingTop: moderateScale(20),
    color: '#fff',
    fontSize: 25,
  },

  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: moderateScale(10),
  },
  footer: {
    flex: 5,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: moderateScale(30),
    borderTopRightRadius: moderateScale(30),
    paddingVertical: moderateScale(30),
    paddingHorizontal: moderateScale(20),
  },
  input: {
    borderColor: COLORS.primary,
    borderRadius: 2,
  },
  title: {
    color: '#05375a',
    fontSize: moderateScale(24),
    fontWeight: 'bolder',
    marginTop: moderateScale(-20),
  },

  button: {
    alignItems: 'flex-end',
    marginTop: moderateScale(30),
  },
  signIn: {
    marginTop: moderateScale(15),
    width: '100%',
    height: moderateScale(50),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(30),
    flexDirection: 'row',
  },
  textSingIn: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: COLORS.light,
    paddingLeft: moderateScale(15),
  },
  button: {
    alignItems: 'center',
    marginTop: moderateScale(50),
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
    paddingBottom: moderateScale(10),
    marginTop: moderateScale(-30),
  },
  action: {
    flexDirection: 'row',
    marginTop: moderateScale(10),
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: moderateScale(5),
  },
  actionError: {
    flexDirection: 'row',
    marginTop: moderateScale(10),
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: moderateScale(5),
  },
  typeButton: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  activeButton: {
    height: moderateScale(35),
    backgroundColor: COLORS.primary,
    width: moderateScale(150),
    borderRadius: 20,
  },
  default: {
    height: moderateScale(35),
    backgroundColor: COLORS.dark,
    width: moderateScale(170),
    borderRadius: 20,
  },
  typeText: {
    textAlign: 'center',
    paddingVertical: moderateScale(6),
    color: COLORS.light,
    fontSize: 17,
  },
  dropdown: {
    margin: 0,
    height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    width: moderateScale(150),
    
    
  },
  dropdownGender: {
    margin: 0,
    height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    width: '100%',
  },
  icon: {
    marginRight: moderateScale(5),
  },
  placeholderStyle: {
    fontSize: 14,
    color:'black'
  },
  selectedTextStyle: {
    fontSize: 14,
    color:'black'
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
    color:'black'
  },

  itemTextStyle:{
    fontSize: 14,
    color:'black'
  }
});
export default styles;
