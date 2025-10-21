import React, {useState, useContext} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
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

const ChangePassword = () => {
  const {UpdatePassword, isLoading} = useContext(AuthContext);
  const navigation = useNavigation();
  const [data, setData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
    check_textPassword: false,
    check_textNePassword: false,
    check_textConfirmPassword: false,
  });
  const handleCurrentPassword = val => {
    if (val.length != 0) {
      setData({
        ...data,
        current_password: val,
        check_textPassword: true,
      });
    } else {
      setData({
        ...data,
        current_password: val,
        check_textPassword: false,
      });
    }
  };
  const handlePassword = val => {
    if (val.length != 0) {
      setData({
        ...data,
        new_password: val,
        check_textNePassword: true,
      });
    } else {
      setData({
        ...data,
        new_password: val,
        check_textNePassword: false,
      });
    }
  };
  const handleConfirmPassword = val => {
    if (val.length != 0) {
      setData({
        ...data,
        confirm_password: val,
        check_textConfirmPassword: true,
      });
    } else {
      setData({
        ...data,
        confirm_password: val,
        check_textConfirmPassword: false,
      });
    }
  };

  const handleUpdate = () => {
    if (
      data.current_password.length > 0 &&
      data.new_password.length > 0 &&
      data.confirm_password.length > 0
    ) {
      UpdatePassword(data);
    } else {
      alert('Please fill all the fields.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBanner}>
        <Text style={styles.headerText}>Change Password</Text>
      </View>
      {/* <View style={styles.header}>
      <Topmenu />
    </View> */}
      <Spinner visible={isLoading} />
      <Animatable.View
        style={[styles.footer, styles.elevation]}
        animation="fadeInUpBig">
        <ScrollView>
          <Text style={styles.text_footer}>Existing Password</Text>
          <View style={styles.action}>
            <FontAwesome name="lock" color="#05375a" size={20} />
            <TextInput
              placeholder="Your Current Password"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={val => handleCurrentPassword(val)}
              placeholderTextColor="#000"
              secureTextEntry
            />
            {data.check_textPassword ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="green" size={20} />
              </Animatable.View>
            ) : null}
          </View>

          <Text style={[styles.text_footer]}>New Password</Text>
          <View style={styles.action}>
            <FontAwesome name="lock" color="#05375a" size={20} />

            <TextInput
              placeholder="Your New Password"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={val => handlePassword(val)}
              placeholderTextColor="#000"
              secureTextEntry
            />

            {data.check_textNePassword ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="green" size={20} />
              </Animatable.View>
            ) : null}
          </View>

          <Text style={[styles.text_footer]}>Confirm Password</Text>
          <View style={styles.action}>
            <FontAwesome name="lock" color="#05375a" size={20} />
            <TextInput
              placeholder="Your Mobile Number"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={val => handleConfirmPassword(val)}
              placeholderTextColor="#000"
              secureTextEntry
            />

            {data.check_textConfirmPassword ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="green" size={20} />
              </Animatable.View>
            ) : null}
          </View>

          <TouchableOpacity onPress={() => handleUpdate()}>
            <LinearGradient
              colors={[COLORS.bgColor ,COLORS.bgColor]}
              style={styles.signIn}>
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
export default ChangePassword;
