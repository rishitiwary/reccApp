import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/components/AuthContext';
import StackNavigator from './src/screens/navigation/StackNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';
import api from './src/services/api';
import {institute_id} from './src/config/config';
import Toast from 'react-native-toast-message';

const App = () => {
  const [netInfo, setNetInfo] = useState('');

  useEffect(() => {
    const init = async () => {
      let deviceId = await DeviceInfo.getUniqueId();
      await AsyncStorage.setItem('deviceId', deviceId);
      
      // Fetch site settings on app start (like PublicHeader in institute-app)
      fetchSiteSettings();
    };

    init();

    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetInfo(
        `Connection type: ${state.type}
        Is connected?: ${state.isConnected}
        IP Address: ${state.details?.ipAddress || 'N/A'}`,
      );
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchSiteSettings = async () => {
    try {
      const response = await api.get(`/site-settings?institute_id=${institute_id}`);
      if (response.data.success) {
        // Store in AsyncStorage (like localStorage in institute-app)
        await AsyncStorage.setItem('settings', JSON.stringify(response.data.data));
      }
    } catch (error) {
      console.error('Error fetching site settings:', error);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <StackNavigator />
        </AuthProvider>
      </SafeAreaProvider>
      <Toast />
    </GestureHandlerRootView>
  );
};

export default App;
