import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, StatusBar} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import COLORS from '../../config/colors';

const AppHeader = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState(null);
  const [notificationCount, setNotificationCount] = useState(3);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const cachedSettings = await AsyncStorage.getItem('settings');
      if (cachedSettings) {
        setSettings(JSON.parse(cachedSettings));
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const openDrawer = () => {
    navigation.toggleDrawer();
  };

  const openSearch = () => {
    // Implement search functionality
    console.log('Open search');
  };

  const openNotifications = () => {
    // Implement notifications
    console.log('Open notifications');
  };

  return (
    <>
      <StatusBar backgroundColor="#1d6bde" barStyle="light-content" />
      <View style={[styles.header, {paddingTop: insets.top + 10}]}>
        {/* Left: Menu Button */}
        <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
          <FontAwesome name="bars" size={22} color={COLORS.headerText} />
        </TouchableOpacity>

        {/* Center: Logo and Title */}
        <View style={styles.centerSection}>
          {settings?.logo && (
            <Image
              source={{uri: settings.logo}}
              style={styles.logo}
              resizeMode="contain"
            />
          )}
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {settings?.site_name || 'Career Foundation'}
            </Text>
            <Text style={styles.tagline} numberOfLines={1}>
              {settings?.site_tagline || 'Dream · Learn · Achieve'}
            </Text>
          </View>
        </View>

        {/* Right: Search and Notifications */}
        <View style={styles.rightActions}>
          <TouchableOpacity onPress={openSearch} style={styles.iconButton}>
            <FontAwesome name="search" size={20} color={COLORS.headerText} />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={openNotifications} style={styles.iconButton}>
            <FontAwesome name="bell" size={20} color={COLORS.headerText} />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {notificationCount > 9 ? '9+' : notificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1d6bde',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 10,
    elevation: 3,
  },
  menuButton: {
    padding: 2,
    marginRight: 4,
  },
  centerSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 8,
    backgroundColor: '#fff',
    borderRadius: 6,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  tagline: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '400',
    opacity: 0.95,
    marginTop: 0,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 2,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ef4444',
    borderRadius: 9,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#1d6bde',
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
});

export default AppHeader;
