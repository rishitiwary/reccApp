import React, {useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
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
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

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
    setData({
      ...data,
      password: val,
    });
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
    <LinearGradient colors={['#2563eb', '#1d4ed8']} style={styles.container}>
      <Loader status={isLoading} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Logo Section */}
          <Animatable.View
            animation="fadeInDown"
            duration={1000}
            style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Image source={Logo} style={styles.logo} />
            </View>
            <Text style={styles.welcomeTitle}>Welcome Back!</Text>
            <Text style={styles.welcomeSubtitle}>
              Sign in to continue your learning journey
            </Text>
          </Animatable.View>

          {/* Login Card */}
          <Animatable.View
            animation="fadeInUp"
            duration={1000}
            delay={200}
            style={styles.loginCard}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View
                style={[
                  styles.inputWrapper,
                  emailFocused && styles.inputWrapperFocused,
                ]}>
                <FontAwesome
                  name="envelope-o"
                  size={18}
                  color="#9ca3af"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Enter your email"
                  style={styles.textInput}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onChangeText={val => textInputChange(val)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  placeholderTextColor="#9ca3af"
                />
                {data.check_textInputChange && (
                  <Feather name="check-circle" color="#10b981" size={20} />
                )}
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View
                style={[
                  styles.inputWrapper,
                  passwordFocused && styles.inputWrapperFocused,
                ]}>
                <FontAwesome
                  name="lock"
                  size={18}
                  color="#9ca3af"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Enter your password"
                  style={styles.textInput}
                  autoCapitalize="none"
                  secureTextEntry={data.secureTextEntry}
                  onChangeText={val => handlePassword(val)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholderTextColor="#9ca3af"
                />
                <TouchableOpacity onPress={updateSecureText} activeOpacity={0.7}>
                  <Feather
                    name={data.secureTextEntry ? 'eye-off' : 'eye'}
                    color="#9ca3af"
                    size={20}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Forgot')}
              style={styles.forgotButton}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              onPress={() => handleLogin()}
              activeOpacity={0.8}
              style={styles.loginButtonWrapper}>
              <LinearGradient
                colors={['#2563eb', '#1d4ed8']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Login</Text>
                <MaterialIcons name="arrow-forward" color="#fff" size={24} />
              </LinearGradient>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};
export default Login;
