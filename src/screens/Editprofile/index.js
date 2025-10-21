import React, {useState, useContext} from 'react';
import DeviceInfo from 'react-native-device-info';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import Logo from '../../../assets/images/logo.png';
import styles from './style';
import {TextInput, ScrollView} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import Feather from '@react-native-vector-icons/feather';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from '../../components/AuthContext';
import {BottomNavigation} from '../../components/BottomNavigation';
import {Topmenu} from '../../components/Topmenu';
import COLORS from '../../config/colors';

const EditProfile = () => {
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

  const handleUpdate = () => {
    
    if (data.name.length > 0 && data.address.length > 0 && data.mobile.length > 0) {
      UpdateProfile(data);
    } else {
      alert('Please fill all the fields.');
    }
  };

  return (
    <View style={styles.container}>
    <View style={styles.headerBanner}><Text style={styles.headerText}>Personal Details</Text></View>
    {/* <View style={styles.header}>
      <Topmenu />
    </View> */}
      <Spinner visible={isLoading} />
      <Animatable.View style={[styles.footer,styles.elevation]} animation="fadeInUpBig">
   <ScrollView>


        <Text style={styles.text_footer}>Username</Text>
        <View style={styles.action}>
          <FontAwesome name="user-o" color="#05375a" size={20} />

          <TextInput
            placeholder="Your Name"
            style={styles.textInput}
            autoCapitalize="none"
            onChangeText={val => textInputChange(val)}
            placeholderTextColor="#000"
          />
          {data.check_textInputChange ? (
            <Animatable.View animation="bounceIn">
              <Feather name="check-circle" color="green" size={20} />
            </Animatable.View>
          ) : null}
        </View>

        <Text style={[styles.text_footer]}>Address</Text>
        <View style={styles.action}>
          <FontAwesome name="home" color="#05375a" size={20} />

          <TextInput
            placeholder="Your Address"
            style={styles.textInput}
            autoCapitalize="none"
            onChangeText={val => handleAddress(val)}
            placeholderTextColor="#000"
          />

          {data.check_textAddress ? (
            <Animatable.View animation="bounceIn">
              <Feather name="check-circle" color="green" size={20} />
            </Animatable.View>
          ) : null}
        </View>

        <Text style={[styles.text_footer]}>Mobile Number</Text>
        <View style={styles.action}>
          <FontAwesome name="phone" color="#05375a" size={20} />
          <TextInput
            placeholder="Your Mobile Number"
            style={styles.textInput}
            autoCapitalize="none"
            onChangeText={val => handleMobile(val)}
            placeholderTextColor="#000"
          />

          {data.check_textMobile ? (
            <Animatable.View animation="bounceIn">
              <Feather name="check-circle" color="green" size={20} />
            </Animatable.View>
          ) : null}
        </View>

        <TouchableOpacity onPress={() => handleUpdate()}>
          <LinearGradient colors={[COLORS.bgColor, COLORS.bgColor]} style={styles.signIn}>
            <Text style={styles.textSingIn}>Update</Text>
            <MaterialIcons name="navigate-next" color="#fff" size={20} />
          </LinearGradient>
        </TouchableOpacity>
        </ScrollView>
      </Animatable.View>
      
      <BottomNavigation />
    </View>
  );
};
export default EditProfile;
