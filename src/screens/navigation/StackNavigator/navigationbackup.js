import React, {useState, useEffect, useContext, useMemo} from 'react';
import {StatusBar, View} from 'react-native';
import DrawerNavigator from '../DraweNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ActivityIndicator} from 'react-native-paper';
import SplashScreen from '../../SplashScreen';
import LoginScreen from '../../login';
import SignupScreen from '../../register';
import ForgetScreen from '../../forgetpassword';
import {AuthContext} from '../../../../src/components/context';
const Stack = createNativeStackNavigator();
const StackNavigator = () => {
  const initialLoginState = {
    isLoading: true,
    userEmail: null,
    userToken: null,
  };

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RERIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userEmail: action.id,
          userToken: action.token,
          isLoading: false,
        };

      case 'LOGOUT':
        return {
          ...prevState,
          userEmail: null,
          userToken: action.token,
          isLoading: false,
        };
      case 'REGISTER':
        return {
          ...prevState,
          userEmail: action.id,
          userToken: action.token,
          isLoading: false,
        };
    }
  };
  const [loginState, dispatch] = React.useReducer(
    loginReducer,
    initialLoginState,
  );
  const [Splash, setSplash] = useState(true);
  const authContext = useMemo(
    () => ({
      signIn: (userEmail, password) => {
        let userToken;
        userToken = null;
        if (userEmail == 'rishi694076@gmail.com' && password == 'admin') {
          userToken = 'hello rishi';
          console.log(userToken);
        }
        console.log('user token', userToken);
        dispatch({type: 'LOGIN', id: userEmail, token: userToken});
      },
      signOut: () => {
        dispatch({type: 'LOGOUT'});
      },
      signUp: () => {
        setUserToken('rishi');
      },
    }),
    [],
  );
  useEffect(() => {
    setTimeout(() => {
      let userToken;
      console.log('user token', userToken);
      dispatch({type: 'REGISTER', token: userToken});
    }, 1000);
    setTimeout(() => {
      setSplash(false);
    }, 4000);
  });
  if (loginState.isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large"></ActivityIndicator>
      </View>
    );
  }
  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <StatusBar hidden={false} backgroundColor={'#c72118'} />

        <Stack.Navigator>
          {Splash ? (
            <Stack.Screen
              name="Splash"
              component={SplashScreen}
              options={{headerShown: false}}
            />
          ) : null}
          {loginState.userToken !== null ? (
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
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};
export default StackNavigator;
