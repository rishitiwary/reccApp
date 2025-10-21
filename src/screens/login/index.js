import React, {useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import Logo from '../../../assets/images/logo.png';
import styles from './style';
import {TextInput} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import Feather from '@react-native-vector-icons/feather';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import {Loader} from '../../components/Loader';
import {AuthContext} from '../../components/AuthContext';
import COLORS from '../../config/colors';

const Login = () => {
  const {login, isLoading} = useContext(AuthContext);
  const navigation = useNavigation();
  const [deviceToken, setDeviceToken] = useState('');
  const [deviceId, setDeviceid] = useState('');
  const getDeviceId = async () => {
    setDeviceid(await AsyncStorage.getItem('deviceId'));
    setDeviceToken(await AsyncStorage.getItem('fcmToken'));
  };
  const [data, setData] = useState({
    deviceId: '',
    email: '',
    password: '',
    check_textInputChange: false,
    secureTextEntry: true,
  });
  const textInputChange = val => {
    if (val.length != 0) {
      setData({
        ...data,
        email: val,
        check_textInputChange: true,
        deviceId: deviceId,
        deviceToken: deviceToken,
      });
    } else {
      setData({
        ...data,
        email: val,
        check_textInputChange: false,
      });
    }
  };
  const handlePassword = val => {
    if (val.length != 0) {
      setData({
        ...data,
        password: val,
      });
    } else {
      setData({
        ...data,
        password: val,
      });
    }
  };
  const updateSecureText = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };
  const handleLogin = () => {
    if (data.email.length > 0 && data.password.length > 0) {
      login(data);
    } else {
      alert('Please fill all the fields.');
    }
  };
  useEffect(() => {
    getDeviceId();
  }, []);
  return (
    <View style={styles.container}>
      <Loader status={isLoading} />
      <Animatable.View style={styles.header} animation="fadeInDownBig">
        <Image source={Logo} style={styles.logo} />
        <Text style={styles.text}>Login Now</Text>
      </Animatable.View>

      <Animatable.View style={styles.footer} animation="fadeInUpBig">
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <Text style={styles.title}>Sign in with accounts</Text>
          <Text style={styles.text_footer}>Email</Text>
          <View style={styles.action}>
            <FontAwesome name="envelope-o" color="#05375a" size={20} />

            <TextInput
              placeholder="Your Email"
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

          <Text style={[styles.text_footer]}>Password</Text>
          <View style={styles.action}>
            <FontAwesome name="lock" color="#05375a" size={20} />

            <TextInput
              placeholder="Your password"
              style={styles.textInput}
              autoCapitalize="none"
              secureTextEntry={data.secureTextEntry ? true : false}
              onChangeText={val => handlePassword(val)}
              placeholderTextColor="#000"
            />
            <TouchableOpacity onPress={updateSecureText}>
              {data.secureTextEntry ? (
                <Feather name="eye-off" color="green" size={20} />
              ) : (
                <Feather name="eye" color="green" size={20} />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => handleLogin()}>
            <LinearGradient
              colors={COLORS.linearGradient}
              style={styles.signIn}>
              <Text style={styles.textSingIn}>Login</Text>
              <MaterialIcons name="navigate-next" color="#fff" size={20} />
            </LinearGradient>
          </TouchableOpacity>
          <View style={{flexDirection: 'row', marginTop: 5}}>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text
                style={[
                  styles.textSingIn,
                  {
                    color: COLORS.dark,
                  },
                ]}>
                New User ? Register
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Forgot')}>
              <Text
                style={[
                  styles.textSingIn,
                  {
                    color: COLORS.bgColor,
                  },
                ]}>
                Forgot Password
              </Text>
            </TouchableOpacity>
          </View>
          {/* <View style={{marginTop:6,flexDirection: 'row',alignContent:'center',justifyContent:'center'}}>
            <TouchableOpacity onPress={() => navigation.navigate('AdminLogin')}>
              <Text
                style={[
                  styles.textSingIn,
                  {
                    color: COLORS.bgColor,
                    fontSize:20,
                    fontStyle:'italic'
                  },
                ]}>
                Admin Login
              </Text>
            </TouchableOpacity>
          </View> */}
        </ScrollView>
      </Animatable.View>
    </View>
  );
};
export default Login;
