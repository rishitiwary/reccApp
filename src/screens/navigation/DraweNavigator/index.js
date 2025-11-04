import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import WebUrl from '../../WebUrl';
import EditProfile from '../../Editprofile';
import ChangePassword from '../../ChangePassword';
import AboutUs from '../../Aboutus';
import Teachers from '../../Chat/Teachers';
import AIAssistant from '../../AIAssistant';
import CustomDrawer from '../CustomDrawer';
import Ionicons from '@react-native-vector-icons/ionicons';
import Chat from '../../Chat';
const Drawer = createDrawerNavigator();
import NavigationScreens from '../navigationScreens';

export default function MyDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      initialRouteName="HomeScreen"
      screenOptions={{
        drawerActiveBackgroundColor: '#dbeafe',
        drawerActiveTintColor: '#2563eb',
        drawerInactiveTintColor: '#6b7280',
        drawerLabelStyle: {
          marginLeft: -20,
          fontSize: 15,
          fontWeight: '600',
        },
        drawerItemStyle: {
          borderRadius: 10,
          marginHorizontal: 8,
          marginVertical: 2,
          paddingLeft: 8,
        },
        drawerStyle: {
          backgroundColor: '#fff',
          width: 280,
        },
        headerStyle: {
          backgroundColor: '#2563eb',
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
        headerShown: false,
        swipeEnabled: false,
      }}
    >
      {/* Home Screen */}
      <Drawer.Screen
        name="HomeScreen"
        component={NavigationScreens}
        options={{
          title: '  Home',
          drawerIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />

      {/* Edit Profile */}
      <Drawer.Screen
        name="Edit Profile"
        component={EditProfile}
        options={{
          title: '  Edit Profile',
          drawerIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "person" : "person-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
        screenOptions={{
          tabBarHideOnKeyboard: true,
        }}
      />

      {/* Change Password */}
      <Drawer.Screen
        name="Change Password"
        component={ChangePassword}
        options={{
          title: '  Change Password',
          drawerIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "lock-closed" : "lock-closed-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
        screenOptions={{
          tabBarHideOnKeyboard: true,
        }}
      />
   {/* AI Assistant */}
   <Drawer.Screen
        name="AI Assistant"
        component={AIAssistant}
        options={{
          title: '  AI Assistant',
          drawerIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "sparkles" : "sparkles-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
        screenOptions={{
          tabBarHideOnKeyboard: true,
        }}
      />

   {/* ADD THIS - Chat Screen */}
   {/* <Drawer.Screen
        name="Chat"
        component={Chat}
        options={{
          title: '  Chat',
          drawerItemStyle: { height: 0 }, // Hide from drawer menu
        }}
      /> */}
      {/* Chat Now */}
      <Drawer.Screen
        name="Chat Now"
        component={Teachers}
        options={{
          title: '  Chat Now',
          drawerIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "chatbubbles" : "chatbubbles-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
        screenOptions={{
          tabBarHideOnKeyboard: true,
        }}
      />

   
      {/* About Us */}
      <Drawer.Screen
        name="about-us"
        component={WebUrl}
        options={{
          title: '  About Us',
          drawerIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "information-circle" : "information-circle-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />

      {/* Contact Us */}
      <Drawer.Screen
        name="contact-us"
        component={WebUrl}
        options={{
          title: '  Contact Us',
          drawerIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "mail" : "mail-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
