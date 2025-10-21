import React, {createContext, useState, useEffect} from 'react';
import {BASE_URL} from '../config/config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    if (data.image != '') {
      const fileName = data.image.path.split('/');
      formData.append('file', {
        uri: data.image.path,
        name: fileName[fileName.length - 1],
        type: data.image.mime,
      });
    }

    await axios({
      method: 'POST',
      url: `${BASE_URL}/registration`,
      data: formData,
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


    await axios({
      method: 'POST',
      url: `${BASE_URL}/login`,
      data: formData,
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

  const forgot = async data => {
    setMessage(null);
    setIsLoading(true);
    let formData = {
      email: data.email,
    };

    await axios({
      method: 'POST',
      url: `${BASE_URL}/forgotPassword`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(function (response) {
        let result = JSON.stringify(response.data);
        setIsLoading(false);
        setMessage(JSON.parse(result).message);
        setMessage(null);
      })
      .catch(function (error) {
        setIsLoading(false);
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
    await axios({
      method: 'POST',
      url: `${BASE_URL}/updateProfile`,
      data: formData,
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
    await axios({
      method: 'POST',
      url: `${BASE_URL}/changePassword`,
      data: formData,
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
    await axios({
      method: 'POST',
      url: `${BASE_URL}/logout`,
      data: formData,
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
  //isloggedin

  const isloggedin = async () => {
    try {
     
      setMessage(null);
      let userInfo = await AsyncStorage.getItem('userInfo');
      if (userInfo) {
        setUserInfo(userInfo);
      }
    } catch (e) {
      console.log('logged in error', e);
    }
  };
  useEffect(() => {
    isloggedin();
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
