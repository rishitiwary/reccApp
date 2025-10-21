import React, {useState, useContext} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
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
  const [data, setData] = useState({
    email: '',
    password: '',
    check_textInputChange: false,
    secureTextEntry: true,
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
      forgot(data);
    } else {
      alert('Please fill all the fields.');
    }
  };

  return (
    <View style={styles.container}>
      <Spinner visible={isLoading} />
      <Animatable.View style={styles.header} animation="fadeInDownBig">
        <Image source={Logo} style={styles.logo} />
        <Text style={styles.text}>Forgot Password</Text>
      </Animatable.View>

      <Animatable.View style={styles.footer} animation="fadeInUpBig">
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <Text style={styles.title}>Enter your registered email</Text>
          <Text style={styles.text_footer}>Email</Text>
          <View style={styles.action}>
            <FontAwesome name="envelope-o" color="#05375a" size={20} />

            <TextInput
              placeholder="Your Email"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={val => textInputChange(val)}
              placeholderTextColor="#000"
            />
            {data.check_textInputChange ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="green" size={20} />
              </Animatable.View>
            ) : null}
          </View>

          <View style={{flex: 1}}></View>
          <TouchableOpacity onPress={() => handleClick()}>
            <LinearGradient
              colors={COLORS.linearGradient}
              style={styles.signIn}>
              <Text style={styles.textSingIn}>Send Email</Text>
              <MaterialIcons name="navigate-next" color="#fff" size={20} />
            </LinearGradient>
          </TouchableOpacity>

          <View style={{flex: 1, flexDirection: 'row', marginTop: 20}}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text
                style={[
                  styles.textSingIn,
                  {
                    color: COLORS.dark,
                  },
                ]}>
                Existing User ? Login
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text
                style={[
                  styles.textSingIn,
                  {
                    color: COLORS.bgColor,
                  },
                ]}>
                Register Now
              </Text>
            </TouchableOpacity>
          </View>

          <View></View>
        </ScrollView>
      </Animatable.View>
    </View>
  );
};
export default Forgot;
