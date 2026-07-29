import React, {useState, useContext} from 'react';
import DeviceInfo from 'react-native-device-info';
import {View, Text, Image, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import {TextInput, ScrollView} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-toast-message';
import {AuthContext} from '../../components/AuthContext';
import {BottomNavigation} from '../../components/BottomNavigation';
import COLORS from '../../config/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const {width} = Dimensions.get('window');

const EditProfile = () => {
  const insets = useSafeAreaInsets();
  const {UpdateProfile, isLoading} = useContext(AuthContext);
  const navigation = useNavigation();
  const [data, setData] = useState({
    address: '',
    name: '',
    mobile: '',
    check_textInputChange: false,
    check_textAddress: false,
    check_textMobile: false,
    secureTextEntry: true,
  });
  const textInputChange = val => {
    if (val.length != 0) {
      setData({
        ...data,
        name: val,
        deviceId: DeviceInfo.getUniqueId()._W,
        check_textInputChange: true,
      });
    } else {
      setData({
        ...data,
        name: val,
        check_textInputChange: false,
      });
    }
  };
  const handleAddress = val => {
    if (val.length != 0) {
      setData({
        ...data,
        address: val,
        check_textAddress: true,
      });
    } else {
      setData({
        ...data,
        address: val,
        check_textAddress: false,
      });
    }
  };
  const handleMobile = val => {
    if (val.length != 0) {
      setData({
        ...data,
        mobile: val,
        check_textMobile: true,
      });
    } else {
      setData({
        ...data,
        mobile: val,
        check_textMobile: false,
      });
    }
  };

  const handleUpdate = async () => {
    // Validate all fields are filled
    if (data.name.length === 0 || data.address.length === 0 || data.mobile.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please fill all the fields',
      });
      return;
    }

    // Validate mobile number
    if (data.mobile.length < 10) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Mobile',
        text2: 'Please enter a valid 10-digit mobile number',
      });
      return;
    }

    try {
      await UpdateProfile(data);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Profile updated successfully',
      });
      
      // Navigate back after success
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: error.message || 'Could not update profile. Please try again.',
      });
    }
  };

  return (
    <View style={[styles.container, {paddingBottom: insets.bottom}]}>
      <Spinner visible={isLoading} />
      
      {/* Modern Header */}
      <LinearGradient
        colors={['#1d6bde', '#1557c7']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.headerRight} />
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animatable.View animation="fadeInUp" duration={600} style={styles.formContainer}>
          
          {/* Username Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.iconWrapper}>
                <Ionicons name="person-outline" size={20} color="#1d6bde" />
              </View>
              <TextInput
                placeholder="Enter your full name"
                style={styles.input}
                autoCapitalize="words"
                value={data.name}
                onChangeText={val => textInputChange(val)}
                placeholderTextColor="#9ca3af"
              />
              {data.check_textInputChange ? (
                <Animatable.View animation="bounceIn">
                  <Ionicons name="checkmark-circle" size={22} color="#4caf50" />
                </Animatable.View>
              ) : null}
            </View>
          </View>

          {/* Address Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.iconWrapper}>
                <Ionicons name="location-outline" size={20} color="#1d6bde" />
              </View>
              <TextInput
                placeholder="Enter your address"
                style={styles.input}
                autoCapitalize="words"
                value={data.address}
                onChangeText={val => handleAddress(val)}
                placeholderTextColor="#9ca3af"
              />
              {data.check_textAddress ? (
                <Animatable.View animation="bounceIn">
                  <Ionicons name="checkmark-circle" size={22} color="#4caf50" />
                </Animatable.View>
              ) : null}
            </View>
          </View>

          {/* Mobile Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.iconWrapper}>
                <Ionicons name="call-outline" size={20} color="#1d6bde" />
              </View>
              <TextInput
                placeholder="Enter your mobile number"
                style={styles.input}
                keyboardType="phone-pad"
                value={data.mobile}
                onChangeText={val => handleMobile(val)}
                placeholderTextColor="#9ca3af"
                maxLength={10}
              />
              {data.check_textMobile ? (
                <Animatable.View animation="bounceIn">
                  <Ionicons name="checkmark-circle" size={22} color="#4caf50" />
                </Animatable.View>
              ) : null}
            </View>
          </View>

          {/* Update Button */}
          <TouchableOpacity 
            style={styles.updateButton}
            onPress={() => handleUpdate()}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#1d6bde', '#1557c7']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.updateGradient}
            >
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
              <Text style={styles.updateText}>Update Profile</Text>
            </LinearGradient>
          </TouchableOpacity>

        </Animatable.View>
      </ScrollView>
      
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    shadowColor: '#1d6bde',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  formContainer: {
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    paddingVertical: 12,
    fontWeight: '500',
  },
  updateButton: {
    marginTop: 16,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#1d6bde',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  updateGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  updateText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 8,
  },
});

export default EditProfile;
