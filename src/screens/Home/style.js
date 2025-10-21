import COLORS from '../../config/colors';
import {Dimensions, StyleSheet, Platform} from 'react-native';
const {height, width} = Dimensions.get('screen');
const height_logo = height * 0.1;
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../config/Metrics';
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
    paddingTop: 20,
    color: '#fff',
    fontSize: 25,
  },

  header: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flex: 3,
    minWidth: '100%',
  },
  input: {
    borderColor: COLORS.primary,
    borderRadius: 2,
  },
  title: {
    color: COLORS.dark,
    fontSize: 16,
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
    marginVertical: 5,
    marginHorizontal: 5,
    padding: 5,
    width: Dimensions.get('window').width / 3.4,
    height: Dimensions.get('window').height / 5,
    borderRadius: 10,
    backgroundColor: COLORS.white,
  },
  paymentCard: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 5,
    margin: 10,
    padding: 5,
    width: Dimensions.get('window').width / 1.05,
    height: Dimensions.get('window').height,
    borderRadius: 10,
    backgroundColor: COLORS.white,
  },
  courses: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 5,
    marginHorizontal: 10,
    padding: 2,
    width: Dimensions.get('window').width / 1.06,
    height: Dimensions.get('window').height / 2.4,
    borderRadius: 10,
    backgroundColor: COLORS.white,
  },
  filter: {
    marginBottom: 5,
    marginHorizontal: 10,
    padding: 5,
    width: Dimensions.get('window').width / 2.3,
    height: Dimensions.get('window').height / 4.2,
    borderRadius: 10,

    justifyContent: 'center', //Centered vertically
  },
  courseImage: {
    flex: 1,
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(25),
    borderRadius: 5,
    resizeMode: 'contain',
    marginTop: moderateScale(-8),
  },
  backgroundImage: {
    flex: 1,
    height: moderateScale(120),
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(25),
    borderRadius: 5,
    resizeMode: 'contain',
    marginTop: moderateScale(-3),
  },
  cardText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'black',
    marginVertical: 10,
    marginHorizontal: 10,
    textAlign: 'left',
  },
  seeAll: {
    fontSize: 15,
    color: 'black',
    marginVertical: 10,
    marginHorizontal: 10,
    textAlign: 'right',
  },
  image: {
    flex:1,
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(5),
   
 
  },
  elevation: {
    shadowColor: '#52006A',
    elevation: 10,
  },
  headerBanner: {
    flex: 0.45,
    width: width,
    backgroundColor: COLORS.bgColor,
  },
  headerText: {
    flex: 2,
    color: COLORS.white,
    marginVertical: 20,
    paddingHorizontal: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.dark,
  },
  popularCourses: {
    flex: 1,
  },
  filterCourses: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    contentContainerStyle: 'space-between',
  },
  oldPrice: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    color: 'red',
  },
  price: {
    fontWeight: 'bold',
  },
  demo: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    width: moderateScale(100),
    height: moderateScale(40),
    borderRadius: 8,
  },
  description3: {
    flex: 0.7,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  buynow: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bgColor,
    width: moderateScale(100),
    height: moderateScale(40),
    borderRadius: 8,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  details: {
    flex: 6,
    flexDirection: 'column',

    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    paddingHorizontal: '5%',
  },
  detailsPadding: {
    borderWidth: 1,
    borderColor: 'thistle',
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
    backgroundColor: COLORS.grey,
  },

  line: {
    marginTop: 2,
    width: Dimensions.get('window').width / 1,
    height: 1,
  },
});
export default styles;
