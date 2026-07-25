import React, {useState} from 'react';
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
import FontAwesome from '@react-native-vector-icons/fontawesome';
import Feather from '@react-native-vector-icons/feather';
import * as Animatable from 'react-native-animatable';
import {useNavigation, useRoute} from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import api from '../../services/api';

const ResetPassword = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const email = route.params?.email || '';

  const [isLoading, setIsLoading] = useState(false);
  const [pinFocused, setPinFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [data, setData] = useState({
    pin: '',
    password: '',
    confirmPassword: '',
    secureTextEntry: true,
    confirmSecureTextEntry: true,
  });

  const handlePin = val => {
    setData({
      ...data,
      pin: val,
    });
  };

  const handlePassword = val => {
    setData({
      ...data,
      password: val,
    });
  };

  const handleConfirmPassword = val => {
    setData({
      ...data,
      confirmPassword: val,
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
      confirmSecureTextEntry: !data.confirmSecureTextEntry,
    });
  };

  const handleResetPassword = async () => {
    if (data.pin.length === 0) {
      Alert.alert('Error', 'Please enter the 4-digit PIN sent to your email');
      return;
    }

    if (data.pin.length !== 4) {
      Alert.alert('Error', 'PIN must be 4 digits');
      return;
    }

    if (data.password.length === 0) {
      Alert.alert('Error', 'Please enter a new password');
      return;
    }

    if (data.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (data.password !== data.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/password/reset', {
        email: email,
        pin: data.pin,
        password: data.password,
      });

      setIsLoading(false);
      if (response.data.success) {
        Alert.alert(
          'Success',
          'Password has been reset successfully. Please login with your new password.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login'),
            },
          ],
        );
      } else {
        Alert.alert('Error', response.data.message || 'Invalid PIN or failed to reset password');
      }
    } catch (error) {
      setIsLoading(false);
      console.log('Reset password error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to reset password. Please try again.',
      );
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
            <Text style={styles.welcomeTitle}>Reset Password</Text>
            <Text style={styles.welcomeSubtitle}>
              Create a new password for your account
            </Text>
          </Animatable.View>

          {/* Reset Card */}
          <Animatable.View
            animation="fadeInUp"
            duration={1000}
            delay={200}
            style={styles.resetCard}>
            {/* Info Box */}
            <View style={styles.infoBox}>
              <MaterialIcons name="email" size={20} color="#2563eb" />
              <Text style={styles.infoText}>
                Enter the 4-digit PIN sent to {email}
              </Text>
            </View>

            {/* PIN Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>4-Digit PIN</Text>
              <View
                style={[
                  styles.inputWrapper,
                  pinFocused && styles.inputWrapperFocused,
                ]}>
                <MaterialIcons
                  name="dialpad"
                  size={18}
                  color="#9ca3af"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Enter 4-digit PIN"
                  style={styles.textInput}
                  keyboardType="number-pad"
                  maxLength={4}
                  onChangeText={val => handlePin(val)}
                  onFocus={() => setPinFocused(true)}
                  onBlur={() => setPinFocused(false)}
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            {/* New Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>New Password</Text>
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
                  placeholder="Enter new password"
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
                  placeholder="Confirm new password"
                  style={styles.textInput}
                  autoCapitalize="none"
                  secureTextEntry={data.confirmSecureTextEntry}
                  onChangeText={val => handleConfirmPassword(val)}
                  onFocus={() => setConfirmPasswordFocused(true)}
                  onBlur={() => setConfirmPasswordFocused(false)}
                  placeholderTextColor="#9ca3af"
                />
                <TouchableOpacity
                  onPress={updateConfirmSecureText}
                  activeOpacity={0.7}>
                  <Feather
                    name={data.confirmSecureTextEntry ? 'eye-off' : 'eye'}
                    color="#9ca3af"
                    size={20}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Password Info Box */}
            <View style={styles.passwordInfoBox}>
              <MaterialIcons name="info-outline" size={18} color="#6b7280" />
              <Text style={styles.passwordInfoText}>
                Password must be at least 6 characters
              </Text>
            </View>

            {/* Reset Button */}
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleResetPassword}
              activeOpacity={0.8}>
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.resetButtonGradient}>
                <Text style={styles.resetButtonText}>Reset Password</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Back to Login */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.7}>
              <MaterialIcons name="arrow-back" size={20} color="#2563eb" />
              <Text style={styles.backButtonText}>Back to Login</Text>
            </TouchableOpacity>
          </Animatable.View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default ResetPassword;
