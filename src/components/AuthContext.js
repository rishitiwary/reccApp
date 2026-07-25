import React, {createContext, useState, useEffect} from 'react';
import {BASE_URL, institute_id} from '../config/config';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppState, Alert} from 'react-native';
export const AuthContext = createContext();
export const AuthProvider = ({children}) => {
  const [userInfo, setUserInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const register = async data => {
    setMessage(null);
    setIsLoading(true);
    const formData = new FormData();
    formData.append('firstname', data.username);
    formData.append('tradegroup', data.tradegroupId);
    formData.append('trade', data.tradeId);
    formData.append('class_id', data.classId);
    formData.append('batch_id', data.batchId);
    formData.append('type', data.registration_type);
    formData.append('email', data.email);
    formData.append('gender', data.gender);
    formData.append('password', data.password);
    formData.append('confirm_password', data.confirm_password);
    formData.append('mobileno', data.mobile);
    formData.append('institute_id', institute_id);
    if (data.image != '') {
      const fileName = data.image.path.split('/');
      formData.append('file', {
        uri: data.image.path,
        name: fileName[fileName.length - 1],
        type: data.image.mime,
      });
    }

    await api.post('/registration', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(function (response) {
        let success = JSON.stringify(response.data.success);
        if (success == 'true') {
          let res = JSON.stringify(response.data.response);
          setResponseMessage(res);
          let results = JSON.stringify(response.data);
          setUserInfo(results);
          AsyncStorage.setItem('userInfo', results);
        }
        let result = JSON.stringify(response.data.message);
        setMessage(JSON.parse(result));
        setMessage(null);
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        console.log('error', error.data);
        setIsLoading(false);
      });
  };

  const login = async data => {
    setMessage(null);
    setIsLoading(true);
    let formData = {
      username: data.email,
      password: data.password,
      device_id: data.deviceId,
      deviceToken: data.deviceToken,
    };


    await api.post('/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(function (response) {
        let success = JSON.stringify(response.data.success);
        if (success == 'true') {
          let results = JSON.stringify(response.data);
          setUserInfo(results);
          AsyncStorage.setItem('userInfo', results);
        }
        let result = JSON.stringify(response.data.message);
        setMessage(JSON.parse(result));
        setMessage(null);
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log('error', error);
        setIsLoading(false);
      });
  };
  //forgot password

  const forgot = async (data, navigation) => {
    setMessage(null);
    setIsLoading(true);
    let formData = {
      email: data.email,
    };

    await api.post('/forgotPassword', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(function (response) {
        let result = JSON.parse(JSON.stringify(response.data));
        setIsLoading(false);
        
        if (result.success) {
          setMessage(result.message || 'A 4-digit PIN has been sent to your email address.');
          if (navigation) {
            navigation.navigate('ResetPassword', {email: data.email});
          }
        } else {
          Alert.alert(
            'Error',
            result.message || 'Failed to send PIN. Please try again.',
            [{text: 'OK'}]
          );
        }
      })
      .catch(function (error) {
        setIsLoading(false);
        console.log('Forgot password error:', error);
        Alert.alert(
          'Error',
          error.response?.data?.message || 'Something went wrong. Please check your email and try again.',
          [{text: 'OK'}]
        );
      });
  };
  //update profile
  const UpdateProfile = async data => {
    setIsLoading(true);
    let formData = {
      id: JSON.parse(userInfo).data.id,
      name: data.name,
      address: data.address,
      mobile: data.mobile,
    };
    await api.post('/updateProfile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(function (response) {
        let result = JSON.stringify(response.data.message);
        setIsLoading(false);
        setMessage(JSON.parse(result));
      })
      .catch(function (error) {
        console.log('error', error.response.data);
        setIsLoading(false);
      });
  };
  //update password
  const UpdatePassword = async data => {
    setIsLoading(true);

    let formData = {
      id: JSON.parse(userInfo).data.id,
      current_password: data.current_password,
      new_password: data.new_password,
      confirm_password: data.confirm_password,
    };

    console.log(formData);
    await api.post('/changePassword', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(function (response) {
        let result = JSON.stringify(response.data.message);
        console.log(result);
        setIsLoading(false);
        setMessage(JSON.parse(result));
      })
      .catch(function (error) {
        console.log('error', error.response.data);
        setIsLoading(false);
      });
  };

  //logout
  const singOut = async data => {
    setMessage(null);
    setIsLoading(true);
    let res = JSON.parse(userInfo).data;
    let formData = {
      id: res.id,
    };
    await api.post('/logout', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(function (response) {
        AsyncStorage.removeItem('userInfo');
        setUserInfo([]);
        setIsLoading(false);
        setMessage('Logout succesfully !');
      })
      .catch(function (error) {
        console.log('error', error);
        setIsLoading(false);
      });
  };
  //verify device - check if user is still logged in on this device
  const verifyDevice = async () => {
    try {
      const userInfoStr = await AsyncStorage.getItem('userInfo');
      if (!userInfoStr) {
        return;
      }

      const userInfoData = JSON.parse(userInfoStr);
      const email = userInfoData?.data?.email;
      const deviceId = await AsyncStorage.getItem('deviceId');

      if (!email || !deviceId) {
        return;
      }

      const response = await api.post('/verify-device', {
        email: email,
        device_id: deviceId,
      });

      if (!response.data.success) {
        // User has been logged out from another device
        await AsyncStorage.removeItem('userInfo');
        setUserInfo([]);
        
        Alert.alert(
          'Logged Out',
          response.data.message || 'You have been logged out because you logged in on another device.',
          [{text: 'OK'}]
        );
      }
    } catch (error) {
      console.log('Device verification error:', error);
    }
  };

  //isloggedin
  const isloggedin = async () => {
    try {
      setMessage(null);
      let userInfo = await AsyncStorage.getItem('userInfo');
      if (userInfo) {
        setUserInfo(userInfo);
        // Verify device on app start
        await verifyDevice();
      }
    } catch (e) {
      console.log('logged in error', e);
    }
  };

  useEffect(() => {
    isloggedin();

    // Listen for app state changes (foreground/background)
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        // App came to foreground - verify device
        verifyDevice();
      }
    });

    return () => {
      subscription?.remove();
    };
  }, []);
  return (
    <AuthContext.Provider
      value={{
        register,
        login,
        singOut,
        forgot,
        UpdateProfile,
        UpdatePassword,
        verifyDevice,
        message,
        isLoading,
        userInfo,
        setUserInfo,
        responseMessage,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
