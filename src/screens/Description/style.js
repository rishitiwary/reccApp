import { Dimensions, Platform, StyleSheet } from 'react-native';
import COLORS from '../../config/colors';
import { moderateScale } from '../../config/Metrics';

const { width, height } = Dimensions.get('window');

const wp = percentage => width * (percentage / 100);
const hp = percentage => height * (percentage / 100);

const styles = StyleSheet.create({
  // Main Container Styles
  container: {
    
    flex: 1,
    backgroundColor: COLORS.white,
  },

  // Video Player Styles
  row: {
    width: '100%',
    backgroundColor: 'black',
    position: 'relative',
    elevation: Platform.OS === 'android' ? 5 : 0,
    shadowColor: Platform.OS === 'ios' ? '#000' : 'transparent',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  // YouTube UI Hiding Elements
  hideShare: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: hp(7),
    width: wp(65),
    backgroundColor: 'transparent',
    zIndex: 10,
  },

  hideYoutubeLogoLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: hp(7),
    width: wp(100),
    backgroundColor: 'transparent',
    zIndex: 10,
  },

  hideYoutubeLogoRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: hp(12),
    width: wp(50),
    backgroundColor: 'transparent',
    zIndex: 10,
  },

  // Function Buttons
  functionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: wp(5),
    paddingVertical: hp(1),
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },

  functionButtonSpace: {
    padding: moderateScale(8),
    borderRadius: moderateScale(8),
    backgroundColor: '#F5F5F5',
    marginHorizontal: moderateScale(5),
    elevation: Platform.OS === 'android' ? 2 : 0,
    shadowColor: Platform.OS === 'ios' ? '#000' : 'transparent',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },

  // Content Sections
  descriptionContainer: {
    flex: 1,
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    backgroundColor: COLORS.white,
  },

  messageText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: moderateScale(8),
  },

  descriptionText: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(22),
    color: COLORS.dark,
    opacity: 0.8,
  },

  // Fullscreen Styles
  fullscreen: {
    flex: 1,
    backgroundColor: 'black',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

fullscreenVideo: {
  flex: 1,
  width: wp(100),
  height: hp(100), // Add this
  backgroundColor: 'black',
  alignItems: 'center',
  justifyContent: 'center',
},

  // Fullscreen UI Hiding Elements
  hideSharefullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: hp(10),
    width: wp(80),
    backgroundColor: 'red',
    zIndex: 10,
  },

  hideSharefullScreenleft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: hp(9.5),
    width: wp(10),
    backgroundColor: 'blue',
    zIndex: 10,
  },

  hideSharefullScreenRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: hp(12),
    width: wp(50),
    backgroundColor: 'green',
    zIndex: 10,
  },

  // Chat Section Styles
  chatContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },

  // Loading States
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  btn: {
    height: moderateScale(50),
    width: moderateScale(50),
    backgroundColor: 'red',
    textAlign: 'center',
    color: 'white'
  },
   speedButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    minWidth: 30,
  },

  // Modal overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Speed selection modal
  speedModal: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    minWidth: 200,
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  // Modal title
  speedModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: 'black',
  },

  // Speed option button
  speedOption: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 3,
    backgroundColor: '#f0f0f0',
  },

  // Selected speed option
  selectedSpeedOption: {
    backgroundColor: '#007AFF',
  },

  // Speed option text
  speedOptionText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
  },

  // Selected speed option text
  selectedSpeedOptionText: {
    color: 'white',
    fontWeight: 'bold',
  },

  // Close button
  closeButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },

  // Close button text
  closeButtonText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
  },
  
  // Responsive Design Adjustments
  ...(Platform.OS === 'ios' && {
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
      paddingTop: 0, // Remove extra padding on iOS
    },
  }),
  fullscreenRoot: {
  flex: 1,
  backgroundColor: 'black',
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
},

});

export default styles;