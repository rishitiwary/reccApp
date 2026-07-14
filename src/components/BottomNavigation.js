import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import {useNavigation, useRoute, CommonActions} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const BottomNavigation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  
  const coursesByCategory = async type => {
    await navigation.navigate('Course', {
      type: type.type,
      name: type.name,
    });
  };

  const navigateToHome = () => {
    const currentRoute = route.name;
    
    // Drawer screens that need to navigate to 'HomeScreen'
    const drawerScreens = ['Edit Profile', 'Change Password', 'AI Assistant', 'AI Doubt Solver', 'about-us', 'contact-us'];
    
    if (drawerScreens.includes(currentRoute)) {
      // From drawer screens, navigate to HomeScreen
      navigation.navigate('HomeScreen');
    } else {
      // From stack screens (LiveVideoList, My Purchased, Course, etc.), navigate to Home
      navigation.navigate('Home');
    }
  };

  const isActive = (routeName) => route.name === routeName;

  const NavItem = ({ onPress, iconName, label, active }) => {
    return (
      <TouchableOpacity 
        onPress={onPress}
        activeOpacity={0.8}
        style={styles.navItem}
      >
        <View style={[styles.iconCircle, active && styles.iconCircleActive]}>
          <FontAwesome 
            name={iconName} 
            color={active ? '#1976d2' : '#ffffff'} 
            size={22} 
          />
        </View>
        <Text style={[
          styles.label,
          active && styles.labelActive
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, {paddingBottom: insets.bottom}]}>
      <NavItem
        onPress={navigateToHome}
        iconName="home"
        label="Home"
        active={isActive('Home') || isActive('HomeScreen')}
      />
      <NavItem
        onPress={() => coursesByCategory({type: 'allCourses', name: 'All Courses'})}
        iconName="book"
        label="Courses"
        active={isActive('Course')}
      />
      <NavItem
        onPress={() => navigation.navigate('My Purchased')}
        iconName="shopping-bag"
        label="Purchased"
        active={isActive('My Purchased')}
      />
      <NavItem
        onPress={() => {
          try {
            navigation.navigate('LiveVideoList');
          } catch (error) {
            // If direct navigation fails, try navigating through HomeScreen
            navigation.navigate('HomeScreen', { 
              screen: 'LiveVideoList' 
            });
          }
        }}
        iconName="video-camera"
        label="Live Classes"
        active={isActive('LiveVideoList')}
      />
      <NavItem
        onPress={() => navigation.navigate('Edit Profile')}
        iconName="user"
        label="Profile"
        active={isActive('Edit Profile')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#1976d2',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 0,
    paddingHorizontal: 8,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 999,
    zIndex: 999,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginBottom: 4,
  },
  iconCircleActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  label: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  labelActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
