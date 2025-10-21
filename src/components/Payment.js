import RazorpayCheckout from 'react-native-razorpay';
import axios from 'axios';
import {BASE_URL, MAIN_URL, razorpay_key} from '../config/config';
import COLORS from '../config/colors';

export const Payment = ([
  {purchaseVal, item, setPayStatus, setPayResponse},
]) => {
  let price = item.price - item.price * (item.discount / 100);
  let options = {
    description: item.title,
    image:
      'https://recc.org.in/public/uploads/certificate/IMG_20240611_161940.png',
    currency: 'INR',
    key: razorpay_key,
    amount: price * 100,
    name: item.title,
    // order_id: 'order_DslnoIgkIDL8Zt',//Replace this with an order_id created using Orders API.
    prefill: {
      email: purchaseVal.email,
      contact: purchaseVal.mobile,
      name: purchaseVal.name,
    },
    theme: COLORS.bgColor,
  };
  RazorpayCheckout.open(options)
    .then(data => {
      let courseInfo = {
        amount: price,
        purpose: item.title,
        courseid: item.id,
        tradegroup_id: item.tradegroup_id,
        trade_id: item.trade_id,
        pay_status: 'captured',
        razorpay_payment_id: data.razorpay_payment_id,
        setPayStatus,
        setPayResponse,
        // setTransactionId,
      };

      let paySuccessVal = Object.assign(purchaseVal, courseInfo);

      handlePayment(paySuccessVal);
    })
    .catch(error => {
      // handle failure
      console.log(`Error: ${error.code} | ${error.description}`);
    });
};

const handlePayment = async paySuccessVal => {
  await axios({
    method: 'POST',
    url: `${BASE_URL}/coursepayment`,
    data: paySuccessVal,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(function (response) {
      let result = JSON.stringify(response.data.message);
      alert(
        `Payment Successful: Your TransactionId - ${paySuccessVal.razorpay_payment_id}`,
      );
      paySuccessVal.setPayStatus(true);
      paySuccessVal.setPayResponse(paySuccessVal);
    })
    .catch(function (error) {
      console.log('payerror', error);
    });
};
//Admission payments
//verify payment status
export const verifyPayment = async payResponse => {
  await axios({
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
      // console.log('error', error.response.message);
      alert(
        `Sorry some error occured.Please try again.${error.response.message}`,
      );
    });
};

//end verification
export const AdmissionPayments = ([{purchaseVal, setPayStatus}]) => {
  let price = 100;
  let options = {
    description: 'Admission Payment',
    image:
      `${MAIN_URL}public/uploads/certificate/recc-global-logo.png`,
    currency: 'INR',
    key: razorpay_key,
    amount: price * 100,
    name: 'Admission Payment',
    // order_id: 'order_DslnoIgkIDL8Zt',//Replace this with an order_id created using Orders API.
    prefill: {
      email: purchaseVal.email,
      contact: purchaseVal.mobile,
      name: purchaseVal.name,
    },
    theme: {color: COLORS.bgColor},
  };
  RazorpayCheckout.open(options).then(data => {
    let Info = {
      razorpay_payment_id: data.razorpay_payment_id,
      setPayStatus,
    };

    let paySuccessVal = Object.assign(purchaseVal, Info);
    handleAdmissionPayment(paySuccessVal);
  });
};

const handleAdmissionPayment = async paySuccessVal => {
  await axios({
    method: 'POST',
    url: `${BASE_URL}/AdmissionPayment`,
    data: paySuccessVal,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(function (response) {
      let results = JSON.stringify(response.data);
      alert(
        `Payment Successful: Your TransactionId - ${paySuccessVal.razorpay_payment_id}`,
      );
      paySuccessVal.setPayStatus('done');
    })
    .catch(function (error) {
      alert(`Sorry some error occured.Please try again.${error.response}`);
    });
};
