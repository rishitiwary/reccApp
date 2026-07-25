import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Logo from '../../../assets/images/logo.png';
import styles from './style';
import {TextInput} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import Feather from '@react-native-vector-icons/feather';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from '../../components/AuthContext';
import COLORS from '../../config/colors';

const Forgot = () => {
  const {forgot, isLoading} = useContext(AuthContext);
  const navigation = useNavigation();
  const [emailFocused, setEmailFocused] = useState(false);
  const [data, setData] = useState({
    email: '',
    check_textInputChange: false,
  });

  const textInputChange = val => {
    if (val.length != 0) {
      setData({
        ...data,
        email: val,
        check_textInputChange: true,
      });
    } else {
      setData({
        ...data,
        email: val,
        check_textInputChange: false,
      });
    }
  };

  const handleClick = () => {
    if (data.email.length > 0) {
      forgot(data, navigation);
    } else {
      alert('Please enter your email address.');
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
            <Text style={styles.welcomeTitle}>Forgot Password?</Text>
            <Text style={styles.welcomeSubtitle}>
              Don't worry! Enter your email and we'll send you a reset link
            </Text>
          </Animatable.View>

          {/* Reset Card */}
          <Animatable.View
            animation="fadeInUp"
            duration={1000}
            delay={200}
            style={styles.resetCard}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View
                style={[
                  styles.inputWrapper,
                  emailFocused && styles.inputWrapperFocused,
                ]}>
                <FontAwesome
                  name="envelope-o"
                  size={18}
                  color="#9ca3af"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Enter your registered email"
                  style={styles.textInput}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onChangeText={val => textInputChange(val)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  placeholderTextColor="#9ca3af"
                />
                {data.check_textInputChange && (
                  <Feather name="check-circle" color="#10b981" size={20} />
                )}
              </View>
            </View>

            {/* Info Box */}
            <View style={styles.infoBox}>
              <MaterialIcons name="info-outline" size={20} color="#2563eb" />
              <Text style={styles.infoText}>
                We'll send a password reset link to your registered email
                address
              </Text>
            </View>

            {/* Send Button */}
            <TouchableOpacity
              onPress={() => handleClick()}
              activeOpacity={0.8}
              style={styles.sendButtonWrapper}>
              <LinearGradient
                colors={['#2563eb', '#1d4ed8']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.sendButton}>
                <Text style={styles.sendButtonText}>Send Reset Link</Text>
                <MaterialIcons name="arrow-forward" color="#fff" size={24} />
              </LinearGradient>
            </TouchableOpacity>

            {/* Back to Login */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={styles.backButton}>
              <MaterialIcons name="arrow-back" color="#6b7280" size={20} />
              <Text style={styles.backText}>Back to Login</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.signupLink}>Sign Up</Text>
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
export default Forgot;
