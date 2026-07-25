import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Logo from '../../../assets/images/logo.png';
import styles from './style';
import {TextInput} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import * as Animatable from 'react-native-animatable';
import {useNavigation, useRoute} from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import api from '../../services/api';

const VerifyOtp = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const email = route.params?.email || '';
  
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value !== '' && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Move to previous input on backspace
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 4) {
      Alert.alert('Error', 'Please enter the complete 4-digit PIN');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/password/verify-pin', {
        email: email,
        pin: otpCode,
      });

      setIsLoading(false);
      if (response.data.success) {
        navigation.navigate('ResetPassword', {email: email, pin: otpCode});
      } else {
        Alert.alert('Error', response.data.message || 'Invalid PIN');
      }
    } catch (error) {
      setIsLoading(false);
      console.log('Verify OTP error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to verify PIN. Please try again.',
      );
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const response = await api.post('/forgotPassword', {
        email: email,
      });

      setIsLoading(false);
      if (response.data.success) {
        Alert.alert('Success', 'A new PIN has been sent to your email');
        setOtp(['', '', '', '']);
        inputRefs[0].current?.focus();
      } else {
        Alert.alert('Error', response.data.message || 'Failed to resend PIN');
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to resend PIN. Please try again.');
    }
  };

  return (
    <LinearGradient colors={['#2563eb', '#1d4ed8']} style={styles.container}>
      <Spinner visible={isLoading} />
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
            <Text style={styles.welcomeTitle}>Verify PIN</Text>
            <Text style={styles.welcomeSubtitle}>
              Enter the 4-digit PIN sent to {email}
            </Text>
          </Animatable.View>

          {/* OTP Card */}
          <Animatable.View
            animation="fadeInUp"
            duration={1000}
            delay={200}
            style={styles.otpCard}>
            {/* OTP Input */}
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={inputRefs[index]}
                  style={[
                    styles.otpInput,
                    digit !== '' && styles.otpInputFilled,
                  ]}
                  value={digit}
                  onChangeText={value => handleOtpChange(value, index)}
                  onKeyPress={e => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                />
              ))}
            </View>

            {/* Info Box */}
            <View style={styles.infoBox}>
              <MaterialIcons name="info-outline" size={20} color="#2563eb" />
              <Text style={styles.infoText}>
                Check your email inbox for the 4-digit PIN
              </Text>
            </View>

            {/* Verify Button */}
            <TouchableOpacity
              style={styles.verifyButton}
              onPress={handleVerifyOtp}
              activeOpacity={0.8}>
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.verifyButtonGradient}>
                <Text style={styles.verifyButtonText}>Verify PIN</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Resend OTP */}
            <TouchableOpacity
              style={styles.resendContainer}
              onPress={handleResendOtp}
              activeOpacity={0.7}>
              <Text style={styles.resendText}>Didn't receive the PIN? </Text>
              <Text style={styles.resendLink}>Resend</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Back to Login */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.7}>
              <MaterialIcons name="arrow-back" size={20} color="#fff" />
              <Text style={styles.backButtonText}>Back to Login</Text>
            </TouchableOpacity>
          </Animatable.View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default VerifyOtp;
