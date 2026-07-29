import React, {useState, useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import {TextInput, ScrollView} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-toast-message';
import {AuthContext} from '../../components/AuthContext';
import {BottomNavigation} from '../../components/BottomNavigation';
import COLORS from '../../config/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const {width} = Dimensions.get('window');

const ChangePassword = () => {
  const insets = useSafeAreaInsets();
  const {UpdatePassword, isLoading} = useContext(AuthContext);
  const navigation = useNavigation();
  const [data, setData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
    check_textPassword: false,
    check_textNePassword: false,
    check_textConfirmPassword: false,
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  });
  const handleCurrentPassword = val => {
    if (val.length != 0) {
      setData({
        ...data,
        current_password: val,
        check_textPassword: true,
      });
    } else {
      setData({
        ...data,
        current_password: val,
        check_textPassword: false,
      });
    }
  };
  const handlePassword = val => {
    if (val.length != 0) {
      setData({
        ...data,
        new_password: val,
        check_textNePassword: true,
      });
    } else {
      setData({
        ...data,
        new_password: val,
        check_textNePassword: false,
      });
    }
  };
  const handleConfirmPassword = val => {
    if (val.length != 0) {
      setData({
        ...data,
        confirm_password: val,
        check_textConfirmPassword: true,
      });
    } else {
      setData({
        ...data,
        confirm_password: val,
        check_textConfirmPassword: false,
      });
    }
  };

  const handleUpdate = async () => {
    // Validate all fields are filled
    if (
      data.current_password.length === 0 ||
      data.new_password.length === 0 ||
      data.confirm_password.length === 0
    ) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please fill all the fields',
      });
      return;
    }

    // Validate new password length
    if (data.new_password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Weak Password',
        text2: 'Password must be at least 6 characters',
      });
      return;
    }

    // Validate passwords match
    if (data.new_password !== data.confirm_password) {
      Toast.show({
        type: 'error',
        text1: 'Password Mismatch',
        text2: 'New password and confirm password do not match',
      });
      return;
    }

    try {
      await UpdatePassword(data);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Password updated successfully',
      });
      
      // Clear form and navigate back after success
      setTimeout(() => {
        setData({
          current_password: '',
          new_password: '',
          confirm_password: '',
          check_textPassword: false,
          check_textNePassword: false,
          check_textConfirmPassword: false,
          showCurrentPassword: false,
          showNewPassword: false,
          showConfirmPassword: false,
        });
        navigation.goBack();
      }, 1500);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: error.message || 'Could not update password. Please try again.',
      });
    }
  };

  return (
    <View style={[styles.container, {paddingBottom: insets.bottom}]}>
      <Spinner visible={isLoading} />
      
      {/* Modern Header */}
      <LinearGradient
        colors={['#1d6bde', '#1557c7']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={styles.headerRight} />
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animatable.View animation="fadeInUp" duration={600} style={styles.formContainer}>
          
          {/* Security Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoIconWrapper}>
              <Ionicons name="shield-checkmark" size={24} color="#1d6bde" />
            </View>
            <View style={styles.infoTextWrapper}>
              <Text style={styles.infoTitle}>Secure Your Account</Text>
              <Text style={styles.infoSubtitle}>Choose a strong password to keep your account safe</Text>
            </View>
          </View>

          {/* Current Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Current Password</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.iconWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color="#1d6bde" />
              </View>
              <TextInput
                placeholder="Enter your current password"
                style={styles.input}
                autoCapitalize="none"
                value={data.current_password}
                onChangeText={val => handleCurrentPassword(val)}
                placeholderTextColor="#9ca3af"
                secureTextEntry={!data.showCurrentPassword}
              />
              <TouchableOpacity
                onPress={() => setData({...data, showCurrentPassword: !data.showCurrentPassword})}
                style={styles.eyeButton}
              >
                <Ionicons 
                  name={data.showCurrentPassword ? "eye-outline" : "eye-off-outline"} 
                  size={22} 
                  color="#9ca3af" 
                />
              </TouchableOpacity>
              {data.check_textPassword ? (
                <Animatable.View animation="bounceIn">
                  <Ionicons name="checkmark-circle" size={22} color="#4caf50" />
                </Animatable.View>
              ) : null}
            </View>
          </View>

          {/* New Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.iconWrapper}>
                <Ionicons name="key-outline" size={20} color="#1d6bde" />
              </View>
              <TextInput
                placeholder="Enter your new password"
                style={styles.input}
                autoCapitalize="none"
                value={data.new_password}
                onChangeText={val => handlePassword(val)}
                placeholderTextColor="#9ca3af"
                secureTextEntry={!data.showNewPassword}
              />
              <TouchableOpacity
                onPress={() => setData({...data, showNewPassword: !data.showNewPassword})}
                style={styles.eyeButton}
              >
                <Ionicons 
                  name={data.showNewPassword ? "eye-outline" : "eye-off-outline"} 
                  size={22} 
                  color="#9ca3af" 
                />
              </TouchableOpacity>
              {data.check_textNePassword ? (
                <Animatable.View animation="bounceIn">
                  <Ionicons name="checkmark-circle" size={22} color="#4caf50" />
                </Animatable.View>
              ) : null}
            </View>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm New Password</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.iconWrapper}>
                <Ionicons name="key-outline" size={20} color="#1d6bde" />
              </View>
              <TextInput
                placeholder="Confirm your new password"
                style={styles.input}
                autoCapitalize="none"
                value={data.confirm_password}
                onChangeText={val => handleConfirmPassword(val)}
                placeholderTextColor="#9ca3af"
                secureTextEntry={!data.showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setData({...data, showConfirmPassword: !data.showConfirmPassword})}
                style={styles.eyeButton}
              >
                <Ionicons 
                  name={data.showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                  size={22} 
                  color="#9ca3af" 
                />
              </TouchableOpacity>
              {data.check_textConfirmPassword ? (
                <Animatable.View animation="bounceIn">
                  <Ionicons name="checkmark-circle" size={22} color="#4caf50" />
                </Animatable.View>
              ) : null}
            </View>
          </View>

          {/* Password Requirements */}
          <View style={styles.requirementsCard}>
            <Text style={styles.requirementsTitle}>Password Requirements:</Text>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4caf50" />
              <Text style={styles.requirementText}>At least 8 characters</Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4caf50" />
              <Text style={styles.requirementText}>Include uppercase & lowercase letters</Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4caf50" />
              <Text style={styles.requirementText}>Include at least one number</Text>
            </View>
          </View>

          {/* Update Button */}
          <TouchableOpacity 
            style={styles.updateButton}
            onPress={() => handleUpdate()}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#1d6bde', '#1557c7']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.updateGradient}
            >
              <Ionicons name="shield-checkmark" size={24} color="#fff" />
              <Text style={styles.updateText}>Update Password</Text>
            </LinearGradient>
          </TouchableOpacity>

        </Animatable.View>
      </ScrollView>
      
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    shadowColor: '#1d6bde',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  formContainer: {
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#1d6bde',
  },
  infoIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoTextWrapper: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1d6bde',
    marginBottom: 4,
  },
  infoSubtitle: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    paddingVertical: 12,
    fontWeight: '500',
  },
  eyeButton: {
    padding: 8,
    marginLeft: 4,
  },
  requirementsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 13,
    color: '#6b7280',
    marginLeft: 8,
    fontWeight: '500',
  },
  updateButton: {
    marginTop: 8,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#1d6bde',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  updateGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  updateText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 8,
  },
});

export default ChangePassword;
