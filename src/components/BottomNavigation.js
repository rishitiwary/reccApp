import React from 'react';
import {View, Text, TouchableOpacity, Dimensions} from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import Ionicons from '@react-native-vector-icons/ionicons';
import COLORS from '../config/colors';
import {useNavigation, useRoute} from '@react-navigation/native';

const {width} = Dimensions.get('window');

export const BottomNavigation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const coursesByCategory = async type => {
    await navigation.navigate('Course', {
      type: type.type,
      name: type.name,
    });
  };

  const isActive = (routeName) => route.name === routeName;

  const NavItem = ({ onPress, iconName, label, active, useIonicons = false }) => {
    const Icon = useIonicons ? Ionicons : FontAwesome;
    return (
      <TouchableOpacity 
        onPress={onPress}
        activeOpacity={0.7}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 8,
        }}
      >
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <View style={{
            width: 50,
            height: 32,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 16,
            backgroundColor: active ? 'rgba(255,255,255,0.15)' : 'transparent',
          }}>
            <Icon 
              name={iconName} 
              color={active ? COLORS.white : 'rgba(255,255,255,0.7)'} 
              size={active ? 24 : 22} 
            />
          </View>
          <Text style={{
            color: active ? COLORS.white : 'rgba(255,255,255,0.7)',
            fontSize: 11,
            fontWeight: active ? '600' : '500',
            marginTop: 4,
          }}>
            {label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{
      flexDirection: 'row',
      width: width,
      backgroundColor: COLORS.bgColor,
      alignItems: 'center',
      justifyContent: 'space-evenly',
      paddingVertical: 2,
      paddingBottom: 0,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255,255,255,0.1)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
    }}>
      <NavItem
        onPress={() => navigation.navigate('Home')}
        iconName="home"
        label="Home"
        active={isActive('Home')}
        useIonicons={true}
      />
      <NavItem
        onPress={() => coursesByCategory({type: 'allCourses', name: 'All Courses'})}
        iconName="book"
        label="Courses"
        active={isActive('Course')}
      />
      <NavItem
        onPress={() => navigation.navigate('My Purchased')}
        iconName="cart-arrow-down"
        label="Purchased"
        active={isActive('My Purchased')}
      />
      <NavItem
        onPress={() => navigation.navigate('LiveVideoList')}
        iconName="youtube-play"
        label="Live"
        active={isActive('LiveVideoList')}
      />
      <NavItem
        onPress={() => navigation.toggleDrawer()}
        iconName="bars"
        label="Menu"
        active={false}
      />
    </View>
  );
};
