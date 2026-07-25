import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import api from '../../services/api';
import {BASE_URL} from '../../config/config';
import {Dropdown} from 'react-native-element-dropdown';
import styles from './style';
import {TextInput} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import Feather from '@react-native-vector-icons/feather';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../../components/AuthContext';
import COLORS from '../../config/colors';
import AntDesign from '@react-native-vector-icons/ant-design';
import {Loader} from '../../components/Loader';

const Register = () => {
  const navigation = useNavigation();
  const genderData = [
    {label: 'Male', value: 'Male'},
    {label: 'Female', value: 'Female'},
  ];
  const [type, setType] = useState(1);
  const [gender, setGender] = useState(null);
  const {register, isLoading, responseMessage} = useContext(AuthContext);
  const [spinner, setSpinner] = useState(true);
  const [tradegroup, setTradegroup] = useState([]);
  const [trade, setTrade] = useState([]);
  const [classes, setClasses] = useState([]);
  const [batch, setBatch] = useState([]);
  const [emailValidError, setEmailValidError] = useState('');
  const [numberValidError, setNumberValidError] = useState('');
  
  // Focus states
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [mobileFocused, setMobileFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const chooseType = type => {
    setType(type);
    setData({
      ...data,
      registration_type: type,
      check_usernameInputChange: false,
    });
  };

  if (responseMessage !== null) {
    navigation.push('Login');
  }

  const handleTradegroup = async () => {
    try {
      setSpinner(true);
      let result = await api({
        method: 'GET',
        url: `${BASE_URL}/tradegroup`,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setTradegroup(result.data);
      setSpinner(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTrade = async id => {
    try {
      setSpinner(true);
      let result = await api({
        method: 'GET',
        url: `${BASE_URL}/trade/${id}`,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setTrade(result.data);
      setSpinner(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBatch = async batches => {
    try {
      setSpinner(true);
      let result = await api({
        method: 'GET',
        url: `${BASE_URL}/batches?batch_id=${batches}`,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setBatch(result.data);
      setSpinner(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClass = async () => {
    try {
      setSpinner(true);
      let result = await api({
        method: 'GET',
        url: `${BASE_URL}/class`,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setClasses(result.data);
      setSpinner(false);
    } catch (error) {
      console.log(error);
    }
  };

  const [data, setData] = useState({
    registration_type: type,
    username: '',
    tradegroupId: '',
    tradeId: '',
    classId: '',
    batchId: '',
    email: '',
    mobile: '',
    gender: '',
    image: '',
    password: '',
    confirm_password: '',
    check_usernameInputChange: false,
    check_emailInputChange: false,
    check_mobileInputChange: false,
    secureTextEntry: true,
    confirmsecureTextEntry: true,
  });

  const usernameInputChange = val => {
    if (val.length != 0) {
      setData({
        ...data,
        username: val,
        check_usernameInputChange: true,
      });
    } else {
      setData({
        ...data,
        username: val,
        check_usernameInputChange: false,
      });
    }
  };

  const emailInputChange = val => {
    handleValidEmail(val);
    if (val.length != 0) {
      setData({
        ...data,
        email: val,
        check_emailInputChange: true,
      });
    } else {
      setData({
        ...data,
        email: val,
        check_emailInputChange: false,
      });
    }
  };

  const mobileInputChange = val => {
    handleValidNumber(val);
    if (val.length != 0) {
      setData({
        ...data,
        mobile: val,
        check_mobileInputChange: true,
      });
    } else {
      setData({
        ...data,
        mobile: val,
        check_mobileInputChange: false,
      });
    }
  };

  const handlePassword = val => {
    setData({
      ...data,
      password: val,
    });
  };

  const confirmHandlePassword = val => {
    setData({
      ...data,
      confirm_password: val,
    });
  };

  const updateSecureText = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const updateConfirmSecureText = () => {
    setData({
      ...data,
      confirmsecureTextEntry: !data.confirmsecureTextEntry,
    });
  };

  const handleRegister = () => {
    if (
      data.username.length > 0 &&
      data.email.length > 0 &&
      data.mobile.length > 0 &&
      data.password.length > 0 &&
      data.confirm_password.length > 0
    ) {
      if (data.password !== data.confirm_password) {
        alert('Confirm password not matched');
      } else {
        register(data);
      }
    } else {
      alert('Please fill all the fields.');
    }
  };

  const handleValidEmail = val => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (val.length === 0) {
      setEmailValidError('Email address must be enter.');
    } else if (reg.test(val) === false) {
      setEmailValidError('Enter valid email address.');
    } else if (reg.test(val) === true) {
      setEmailValidError('');
    }
  };

  const handleValidNumber = val => {
    const reg = /^[0]?[7896]/;
    if (val.length === 0) {
      setNumberValidError('Mobile number must be enter.');
    } else if (reg.test(val) === false) {
      setNumberValidError('Enter valid mobile number.');
    } else if (reg.test(val) === true) {
      setNumberValidError('');
    }
  };

  useEffect(() => {
    handleTradegroup();
    handleClass();
  }, []);

  return (
    <LinearGradient colors={['#2563eb', '#1d4ed8']} style={styles.container}>
      <Loader status={spinner} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Animatable.View
            animation="fadeInDown"
            duration={1000}
            style={styles.headerContainer}>
            <Text style={styles.welcomeTitle}>Create Account</Text>
            <Text style={styles.welcomeSubtitle}>
              Sign up to start your learning journey
            </Text>
          </Animatable.View>

          {/* Register Card */}
          <Animatable.View
            animation="fadeInUp"
            duration={1000}
            delay={200}
            style={styles.registerCard}>
            
            {/* Course Selection */}
            {/* {type == 1 && (
              <View style={styles.dropdownRow}>
                <View style={styles.dropdownHalf}>
                  <Text style={styles.inputLabel}>Course Category</Text>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    itemTextStyle={styles.itemTextStyle}
                    containerStyle={styles.dropdownContainer}
                    data={tradegroup}
                    search
                    maxHeight={300}
                    labelField="name"
                    valueField="id"
                    placeholder="Select"
                    searchPlaceholder="Search..."
                    onChange={item => {
                      handleTrade(item.id);
                      setData({
                        ...data,
                        tradegroupId: item.id,
                      });
                    }}
                  />
                </View>

                <View style={styles.dropdownHalf}>
                  <Text style={styles.inputLabel}>Course</Text>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    itemTextStyle={styles.itemTextStyle}
                    containerStyle={styles.dropdownContainer}
                    data={trade}
                    search
                    maxHeight={300}
                    labelField="name"
                    valueField="id"
                    placeholder="Select"
                    searchPlaceholder="Search..."
                    onChange={item => {
                      setData({
                        ...data,
                        tradeId: item.id,
                      });
                    }}
                  />
                </View>
              </View>
            )} */}

            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View
                style={[
                  styles.inputWrapper,
                  nameFocused && styles.inputWrapperFocused,
                ]}>
                <FontAwesome
                  name="user-o"
                  size={18}
                  color="#9ca3af"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Enter your full name"
                  style={styles.textInput}
                  autoCapitalize="words"
                  onChangeText={val => usernameInputChange(val)}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                  placeholderTextColor="#9ca3af"
                />
                {data.check_usernameInputChange && (
                  <Feather name="check-circle" color="#10b981" size={20} />
                )}
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View
                style={[
                  styles.inputWrapper,
                  emailFocused && styles.inputWrapperFocused,
                  emailValidError && styles.inputWrapperError,
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
                  onChangeText={val => emailInputChange(val)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  placeholderTextColor="#9ca3af"
                />
                {data.check_emailInputChange && !emailValidError && (
                  <Feather name="check-circle" color="#10b981" size={20} />
                )}
              </View>
              {emailValidError ? (
                <Text style={styles.errorText}>{emailValidError}</Text>
              ) : null}
            </View>

            {/* Mobile Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Mobile Number</Text>
              <View
                style={[
                  styles.inputWrapper,
                  mobileFocused && styles.inputWrapperFocused,
                  numberValidError && styles.inputWrapperError,
                ]}>
                <FontAwesome
                  name="mobile"
                  size={22}
                  color="#9ca3af"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="10 digit mobile number"
                  style={styles.textInput}
                  autoCapitalize="none"
                  maxLength={10}
                  keyboardType="numeric"
                  onChangeText={val => mobileInputChange(val)}
                  onFocus={() => setMobileFocused(true)}
                  onBlur={() => setMobileFocused(false)}
                  placeholderTextColor="#9ca3af"
                />
                {data.check_mobileInputChange && !numberValidError && (
                  <Feather name="check-circle" color="#10b981" size={20} />
                )}
              </View>
              {numberValidError ? (
                <Text style={styles.errorText}>{numberValidError}</Text>
              ) : null}
            </View>

            {/* Gender Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Gender</Text>
              <Dropdown
                style={styles.dropdownFull}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                itemTextStyle={styles.itemTextStyle}
                containerStyle={styles.dropdownContainer}
                data={genderData}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select your gender"
                value={gender}
                onChange={item => {
                  setGender(item.value);
                  setData({
                    ...data,
                    gender: item.value,
                  });
                }}
              />
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
                  placeholder="Create a password"
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

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View
                style={[
                  styles.inputWrapper,
                  confirmPasswordFocused && styles.inputWrapperFocused,
                ]}>
                <FontAwesome
                  name="lock"
                  size={18}
                  color="#9ca3af"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Confirm your password"
                  style={styles.textInput}
                  autoCapitalize="none"
                  secureTextEntry={data.confirmsecureTextEntry}
                  onChangeText={val => confirmHandlePassword(val)}
                  onFocus={() => setConfirmPasswordFocused(true)}
                  onBlur={() => setConfirmPasswordFocused(false)}
                  placeholderTextColor="#9ca3af"
                />
                <TouchableOpacity onPress={updateConfirmSecureText} activeOpacity={0.7}>
                  <Feather
                    name={data.confirmsecureTextEntry ? 'eye-off' : 'eye'}
                    color="#9ca3af"
                    size={20}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              disabled={emailValidError != '' || numberValidError != ''}
              onPress={() => handleRegister()}
              activeOpacity={0.8}
              style={styles.registerButtonWrapper}>
              <LinearGradient
                colors={['#2563eb', '#1d4ed8']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.registerButton}>
                <Text style={styles.registerButtonText}>Create Account</Text>
                <MaterialIcons name="arrow-forward" color="#fff" size={24} />
              </LinearGradient>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Sign In</Text>
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
export default Register;
