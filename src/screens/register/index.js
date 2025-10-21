import React, {useState, useContext, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import axios from 'axios';
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
import ImagePicker from 'react-native-image-crop-picker';
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
      let result = await axios({
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
      let result = await axios({
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
      let result = await axios({
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
      let result = await axios({
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

  const chooseImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log(image);
      // console.log(image.path.replace('file://', ''));
      // setImage(image.path);
      setData({
        ...data,
        image: image,
      });
    });
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
  const confirmHandlePassword = val => {
    if (val.length != 0) {
      setData({
        ...data,
        confirm_password: val,
      });
    } else {
      setData({
        ...data,
        confirm_password: val,
      });
    }
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
    <View style={styles.container}>
      <Loader status={spinner} />
      <Loader status={isLoading} />

      <Animatable.View style={styles.header} animation="fadeInDownBig">
        <Text style={styles.text}>Register Now</Text>
      </Animatable.View>

      <Animatable.View style={styles.footer} animation="fadeInUpBig">
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          {/* <View style={styles.typeButton}>
            <TouchableOpacity onPress={() => chooseType(1)}>
              <View style={type == 1 ? styles.activeButton : styles.default}>
                <Text style={styles.typeText}>Online</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => chooseType(0)}>
              <View style={type == 0 ? styles.activeButton : styles.default}>
                <Text style={styles.typeText}>Offline</Text>
              </View>
            </TouchableOpacity>
          </View> */}
          {/* for online */}
          {type == 1 ? (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                itemTextStyle={styles.itemTextStyle}
                data={tradegroup}
                search
                maxHeight={300}
                labelField="name"
                valueField="id"
                placeholder="Select Course"
                searchPlaceholder="Search..."
                value={typeof id !== 'undefined' ? id : ''}
                onChange={item => {
                  handleTrade(item.id);
                  setData({
                    ...data,
                    tradegroupId: item.id,
                  });
                }}
                renderLeftIcon={() => (
                  <AntDesign
                    style={styles.icon}
                    color="black"
                    name="Safety"
                    size={20}
                  />
                )}
              />
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                itemTextStyle={styles.itemTextStyle}
                data={trade}
                search
                maxHeight={300}
                labelField="name"
                valueField="id"
                placeholder="Select Course"
                searchPlaceholder="Search..."
                value={typeof id !== 'undefined' ? id : ''}
                onChange={item => {
                  setData({
                    ...data,
                    tradeId: item.id,
                  });
                }}
                renderLeftIcon={() => (
                  <AntDesign
                    style={styles.icon}
                    color="black"
                    name="Safety"
                    size={20}
                  />
                )}
              />
            </View>
          ) : (
            ''
          )}

          {/* for Offline */}
          {type == 0 ? (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                itemTextStyle={styles.itemTextStyle}
                data={classes}
                search
                maxHeight={300}
                labelField="class"
                valueField="id"
                placeholder="Select Category"
                searchPlaceholder="Search..."
                value={typeof id !== 'undefined' ? id : ''}
                onChange={item => {
                  setData({
                    ...data,
                    classId: item.id,
                  });
                  handleBatch(item.batches);
                }}
                renderLeftIcon={() => (
                  <AntDesign
                    style={styles.icon}
                    color="black"
                    name="Safety"
                    size={20}
                  />
                )}
              />
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                itemTextStyle={styles.itemTextStyle}
                data={batch}
                search
                maxHeight={300}
                labelField="batch"
                valueField="id"
                placeholder="Select Batch"
                searchPlaceholder="Search..."
                value={typeof id !== 'undefined' ? id : ''}
                onChange={item => {
                  setData({
                    ...data,
                    batchId: item.id,
                  });
                }}
                renderLeftIcon={() => (
                  <AntDesign
                    style={styles.icon}
                    color="black"
                    name="Safety"
                    size={20}
                  />
                )}
              />
            </View>
          ) : (
            ''
          )}
          <View style={styles.action}>
            <FontAwesome name="user-o" color="#05375a" size={20} />

            <TextInput
              placeholder=" Your Name"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={val => usernameInputChange(val)}
              placeholderTextColor="#000"
            />
            {data.check_usernameInputChange ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="green" size={20} />
              </Animatable.View>
            ) : null}
          </View>
          <View style={styles.action}>
            <FontAwesome name="envelope-o" color="#05375a" size={20} />

            <TextInput
              placeholder="Email Address"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={val => emailInputChange(val)}
              placeholderTextColor="#000"
            />
            {data.check_emailInputChange ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="green" size={20} />
              </Animatable.View>
            ) : null}
            
          </View>
          {emailValidError ? <Text style={{color:'red'}}>{emailValidError}</Text> : null}
          <View style={styles.action}>
            <FontAwesome name="mobile" color="#05375a" size={20} />

            <TextInput
              placeholder="Mobile Number (10 digits only)"
              style={styles.textInput}
              autoCapitalize="none"
              maxLength={10}
              onChangeText={val => mobileInputChange(val)}
              placeholderTextColor="#000"
              keyboardType="numeric"
              autoComplete='off'
            />
            {data.check_mobileInputChange ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="green" size={20} />
              </Animatable.View>
            ) : null}
          </View>
          {numberValidError ? <Text style={{color:'red'}}>{numberValidError}</Text> : null}
          <View style={{flexDirection: 'row'}}>
            <Dropdown
              style={styles.dropdownGender}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              itemTextStyle={styles.itemTextStyle}
              data={genderData}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select Gender"
              searchPlaceholder="Search..."
              value={gender}
              onChange={item => {
                setGender(item.value);
                setData({
                  ...data,
                  gender: item.value,
                });
              }}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  color="black"
                  name="Safety"
                  size={20}
                />
              )}
            />
          </View>

          {/* <View style={styles.action}>
            <FontAwesome name="photo" color="#05375a" size={20} />

            <TouchableOpacity onPress={chooseImage}>
              <Text style={{color: 'black'}}> Choose Image</Text>
            </TouchableOpacity>
          </View> */}
          <View style={styles.action}>
            <FontAwesome name="lock" color="#05375a" size={20} />

            <TextInput
              placeholder="  Your password"
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
          <View style={styles.action}>
            <FontAwesome name="lock" color="#05375a" size={20} />

            <TextInput
              placeholder="Confirm Your password"
              style={styles.textInput}
              autoCapitalize="none"
              secureTextEntry={data.confirmsecureTextEntry ? true : false}
              onChangeText={val => confirmHandlePassword(val)}
              placeholderTextColor="#000"
            />
            <TouchableOpacity onPress={updateConfirmSecureText}>
              {data.confirmsecureTextEntry ? (
                <Feather name="eye-off" color="green" size={20} />
              ) : (
                <Feather name="eye" color="green" size={20} />
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity
          disabled={emailValidError=='' && numberValidError=='' ?false:true}
            onPress={() => {
              handleRegister();
            }}>
            <LinearGradient
              colors={COLORS.linearGradient}
              style={styles.signIn}>
              <Text style={styles.textSingIn}>Register Now</Text>
              <MaterialIcons name="navigate-next" color="#fff" size={20} />
            </LinearGradient>
          </TouchableOpacity>
          <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text
                style={[
                  styles.textSingIn,
                  {
                    color: COLORS.dark,
                  },
                ]}>
                Existing User ? Login
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
        </ScrollView>
      </Animatable.View>
    </View>
  );
};
export default Register;
