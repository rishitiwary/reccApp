import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {BASE_URL} from '../../config/config';
import axios from 'axios';
import {AuthContext} from '../../components/AuthContext';
import styles from '../../screens/Home/style';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {AdmissionPayments} from '../../components/Payment';
import AsyncStorage from '@react-native-async-storage/async-storage';
const AdmissionPayment = () => {
  const [payStatus, setPayStatus] = useState([]);
  const {userInfo, responseMessage, setUserInfo} =
    React.useContext(AuthContext);

  const purchaseVal = {
    name: JSON.parse(userInfo).data.firstname,
    email: JSON.parse(userInfo).data.email,
    mobile: JSON.parse(userInfo).data.mobileno,
    uid: JSON.parse(userInfo).data.id,
  };
  const handleFetchData = async () => {
    try {
      let result = await axios({
        method: 'GET',
        url: `${BASE_URL}/userInfo/${JSON.parse(userInfo).data.id}`,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      let results = JSON.stringify(result.data);
      setUserInfo(results);
      AsyncStorage.setItem('userInfo', results);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (payStatus == 'done') {
      handleFetchData();
    }
  });

  return (
    <View style={[styles.paymentCard, styles.elevation]}>
      <View style={styles.description3}>
        <Text style={styles.descriptionText}>
          {JSON.parse(responseMessage)}
        </Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.cardText}>Basic Details</Text>
        <View style={styles.detailsPadding}>
          <Text styles={styles.descriptionText}>
            Refrence No : {JSON.parse(userInfo).data.refrence_no}
          </Text>
        </View>
       
        <View style={styles.detailsPadding}>
          <Text styles={styles.descriptionText}>
            Form Status : Not Submitted
          </Text>
        </View>

        <View style={styles.detailsPadding}>
          <Text styles={styles.descriptionText}>Payment Status : 'Unpaid'</Text>
        </View>
        <View style={styles.detailsPadding}>
          <Text styles={styles.descriptionText}>
            Name : {JSON.parse(userInfo).data.firstname}
          </Text>
        </View>
        <View style={styles.detailsPadding}>
          <Text styles={styles.descriptionText}>
            Course : {JSON.parse(userInfo).data.class}
          </Text>
        </View>
        <View style={styles.detailsPadding}>
          <Text styles={styles.descriptionText}>
            Gender : {JSON.parse(userInfo).data.gender}
          </Text>
        </View>
        <View style={styles.detailsPadding}>
          <Text styles={styles.descriptionText}>
            Mobile : {JSON.parse(userInfo).data.mobileno}
          </Text>
        </View>
        <View style={styles.detailsPadding}>
          <Text styles={styles.descriptionText}>
            Email : {JSON.parse(userInfo).data.email}
          </Text>
        </View>
        <View style={{paddingHorizontal: '30%'}}>
          <TouchableOpacity
            onPress={() => AdmissionPayments([{purchaseVal, setPayStatus}])}>
            <View style={styles.buynow}>
              <Text style={{color: 'white'}}>Pay Now</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AdmissionPayment;
