import RazorpayCheckout from 'react-native-razorpay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import {BASE_URL, MAIN_URL} from '../config/config';
import COLORS from '../config/colors';

export const Payment = async ([
  {purchaseVal, item, setPayStatus, setPayResponse},
]) => {
  try {
    // Get settings from AsyncStorage (like localStorage.getItem('settings') in institute-app)
    const cachedSettings = await AsyncStorage.getItem('settings');
    const settings = cachedSettings ? JSON.parse(cachedSettings) : null;

    // Phase 1: Create order on backend BEFORE opening Razorpay (like institute-app)
    const orderResponse = await api.post('/create-course-order', {
      course_id: item.id,
      user_id: purchaseVal.uid,
      email: purchaseVal.email,
      mobile: purchaseVal.mobile
    });

    const orderData = orderResponse.data;

    if (!orderData.success) {
      alert('Failed to create order: ' + (orderData.message || 'Unknown error'));
      return;
    }

    // Phase 2: Open Razorpay with dynamic key and order_id from backend
    let options = {
      key: orderData?.key, // Dynamic razorpay_key from backend (multi-tenant)
      amount: orderData?.amount * 100,
      currency: 'INR',
      name: orderData?.course_title || item?.title,
      description: orderData?.course_title || item?.title,
      image: item?.course_thumbnail,
      order_id: orderData?.order_id, // Order ID from backend
      prefill: {
        email: purchaseVal?.email,
        contact: purchaseVal?.contact,
        name: purchaseVal?.name,
      },
      theme: {color: COLORS.bgColor},
    };
   
    
    RazorpayCheckout.open(options)
      .then(async (data) => {
        // Phase 3: Verify payment on backend (like institute-app)
        try {
          const verifyResponse = await api.post('/verify-course-payment', {
            razorpay_order_id: data.razorpay_order_id,
            razorpay_payment_id: data.razorpay_payment_id,
            razorpay_signature: data.razorpay_signature
          });

          const verifyData = verifyResponse.data;

          if (verifyData.success) {
            alert('Course purchased successfully!');
            setPayStatus(true);
            setPayResponse({
              razorpay_payment_id: data.razorpay_payment_id,
              razorpay_order_id: data.razorpay_order_id
            });
          } else {
            alert('Payment verification failed. Please contact support with payment ID: ' + data.razorpay_payment_id);
          }
        } catch (error) {
          console.error('Payment verification failed:', error);
          alert('Payment completed but verification failed. Please contact support with payment ID: ' + data.razorpay_payment_id);
        }
      })
      .catch(error => {
        console.log(`Payment Error: ${error.code} | ${error.description}`);
      });
  } catch (error) {
    console.error('Order creation failed:', error);
    alert('Failed to initiate payment. Please try again.');
  }
};

//Admission payments
//verify payment status
export const verifyPayment = async payResponse => {
  await api({
    method: 'POST',
    url: `${BASE_URL}/paymentVerification`,
    data: payResponse,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(function (response) {
      let result = JSON.stringify(response.data.message);
      alert(
        `Payment Verified Successfully: Your TransactionId - ${payResponse.razorpay_payment_id}`,
      );

      payResponse.setPayStatus(true);
    })
    .catch(function (error) {
      alert(
        `Sorry some error occured.Please try again.${error.response.message}`,
      );
    });
};

//end verification
export const AdmissionPayments = async ([{purchaseVal, setPayStatus}]) => {
  try {
    // Get settings from AsyncStorage (like localStorage.getItem('settings') in institute-app)
    const cachedSettings = await AsyncStorage.getItem('settings');
    const settings = cachedSettings ? JSON.parse(cachedSettings) : null;

    // Phase 1: Create admission order on backend BEFORE opening Razorpay
    const orderResponse = await api.post('/create-admission-order', {
      user_id: purchaseVal.id,
      email: purchaseVal.email,
      mobile: purchaseVal.mobile
    });

    const orderData = orderResponse.data;

    if (!orderData.success) {
      alert('Failed to create order: ' + (orderData.message || 'Unknown error'));
      return;
    }

    // Phase 2: Open Razorpay with dynamic key and order_id from backend
    let options = {
      key: orderData.key, // Dynamic razorpay_key from backend (multi-tenant)
      amount: orderData.amount * 100,
      currency: 'INR',
      name: settings?.site_name || 'Admission Payment',
      description: 'Admission Payment',
      image: settings?.logo || `${MAIN_URL}public/uploads/certificate/recc-global-logo.png`,
      order_id: orderData.order_id, // Order ID from backend
      prefill: {
        email: purchaseVal.email,
        contact: purchaseVal.mobile,
        name: purchaseVal.name,
      },
      theme: {color: COLORS.bgColor},
     
    };
    
    RazorpayCheckout.open(options)
      .then(async (data) => {
        // Phase 3: Verify admission payment on backend
        try {
          const verifyResponse = await api.post('/verify-admission-payment', {
            razorpay_order_id: data.razorpay_order_id,
            razorpay_payment_id: data.razorpay_payment_id,
            razorpay_signature: data.razorpay_signature
          });

          const verifyData = verifyResponse.data;

          if (verifyData.success) {
            alert('Admission payment successful!');
            setPayStatus('done');
          } else {
            alert('Payment verification failed. Please contact support with payment ID: ' + data.razorpay_payment_id);
          }
        } catch (error) {
          console.error('Payment verification failed:', error);
          alert('Payment completed but verification failed. Please contact support with payment ID: ' + data.razorpay_payment_id);
        }
      })
      .catch(error => {
        console.log(`Payment Error: ${error.code} | ${error.description}`);
      });
  } catch (error) {
    console.error('Order creation failed:', error);
    alert('Failed to initiate payment. Please try again.');
  }
};
