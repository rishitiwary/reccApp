import React from 'react';
import {useState, useEffect, memo} from 'react';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import {BASE_URL} from '../config/config';
import {AuthContext} from './AuthContext';
const LoginCheck = () => {
  const {userInfo, singOut} = React.useContext(AuthContext);
  let number = JSON.parse(userInfo).data.mobileno;
  const [deviceids, setDeviceId] = useState('');
  const [getData, setData] = useState([]);

  const loginCheck = async () => {
    await setDeviceId(DeviceInfo.getUniqueId()._W);
  };
  const handleFetchData = async () => {
    try {
      let result = await axios({
        method: 'GET',
        url: `${BASE_URL}/loginInfo/${number}`,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setData(result.data);
    } catch (error) {}
  };

  useEffect(() => {
    loginCheck();
    handleFetchData();
  }, []);
  
  if (getData.error) {
    singOut('Please log in again.');
  } else {
    if (getData.data != undefined && getData.data[0].deviceId != deviceids) {
      singOut('Already logged in on some other device.');
    }
  }
  
};

export default memo(LoginCheck);
