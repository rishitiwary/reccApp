import React, {useState, useEffect} from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ProfileScreen from '../../Profile';
import HomeScreen from '../../Home';
import SettingScreen from '../../Settings';
const Tab = createMaterialBottomTabNavigator();

import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import COLORS from '../../../config/colors';
import MyPurchase from '../../MyPurchase';
const BottomNavigator = () => {
  return (
    // drawer navigation
    <Tab.Navigator
      activeColor={COLORS.primary}
      inactiveColor={COLORS.light}
      barStyle={{backgroundColor: COLORS.bgColor}}
      shifting={false}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="My Purchased"
        component={MyPurchase}
        options={{
          tabBarLabel: 'My Purchased',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="cart-arrow-down"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          tabBarLabel: 'Setting',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="cog-outline"
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigator;
