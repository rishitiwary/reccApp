import COLORS from './colors';
import {Dimensions} from 'react-native';

export default {
  logo: {},
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bgColor,
  },
  logo: {
    height: 150,
    width: 150,
  },
  text: {
    paddingTop: 20,
    color: '#fff',
    fontSize: 28,
  },
  scrollview: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    contentContainerStyle: 'space-evenly',
  },
  view: {
    paddingHorizontal: 10,
    paddingTop: 5,
    borderColor: COLORS.bgColor,
    borderWidth: 2,
    borderRadius: 12,
    margin: 5,
    marginHorizontal: 10,
    backgroundColor: COLORS.bgColor,
    height: 35,
  },
  text1: {
    paddingBottom: 10,
    color: COLORS.light,
    fontSize: 14,
  },
  bottomNavigation: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    backgroundColor: COLORS.bgColor,
    color: COLORS.white,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
  },
  bottomText: {
    color: COLORS.white,
  },
  bottomIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
};
