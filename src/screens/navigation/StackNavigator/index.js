import React, {useState, useEffect, useContext} from 'react';
import {StatusBar, ToastAndroid} from 'react-native';
import DrawerNavigator from '../DraweNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from '../../SplashScreen';
import LoginScreen from '../../login';
import SignupScreen from '../../register';
import ForgetScreen from '../../forgetpassword';
import AdminLogin from '../../TestSeries/AdminLogin';
import {AuthContext} from '../../../components/AuthContext';
import COLORS from '../../../config/colors';
const Stack = createNativeStackNavigator();
const StackNavigator = () => {
  const {userInfo, message} = useContext(AuthContext);
  const [Splash, setSplash] = useState(true);
  let loginStatus;
  if (userInfo.length > 0) {
    loginStatus = JSON.parse(userInfo).status !== '403' ? 'success' : 'error';
  } else {
    loginStatus = 'error';
  }

  if (message !== null) {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  }

  useEffect(() => {
    setTimeout(() => {
      setSplash(false);
    }, 4000);
  });

  return (
    <NavigationContainer>
      <StatusBar hidden={false} backgroundColor={COLORS.bgColor} />
      <Stack.Navigator>
        {Splash ? (
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{headerShown: false}}
          />
        ) : null}
        {loginStatus === 'success' ? (
          <Stack.Screen
            name="DrawerNavigator"
            component={DrawerNavigator}
            options={{headerShown: false}}
          />
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Register"
              component={SignupScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Forgot"
              component={ForgetScreen}
              options={{headerShown: false}}
            />
               <Stack.Screen
              name="AdminLogin"
              component={AdminLogin}
              options={{headerShown: false}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default StackNavigator;
