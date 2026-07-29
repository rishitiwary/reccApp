import React, {useState, useEffect} from 'react';
import { Text, View, Image, Dimensions, Animated, StyleSheet } from 'react-native';
import { IMG_URL } from '../../../config/config';
import { AuthContext } from '../../../components/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import Ionicons from '@react-native-vector-icons/ionicons';
import { TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const CustomDrawer = props => {
  const { singOut, isLoading, userInfo } = React.useContext(AuthContext);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Spinner visible={isLoading} />

      {/* Modern Header with Gradient */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <LinearGradient
          colors={['#1d6bde', '#1557c7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{ uri: `${JSON.parse(userInfo).data.photo}` }}
                style={styles.avatar}
              />
              <View style={styles.onlineBadge} />
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.greeting}>Hello,</Text>
              <Text style={styles.userName} numberOfLines={1}>
                {JSON.parse(userInfo).data.firstname}
              </Text>
              <View style={styles.roleBadge}>
                <Ionicons name="school-outline" size={12} color="#fff" />
                <Text style={styles.roleText}>Student</Text>
              </View>
            </View>
          </View>

          {/* Quick Info Cards */}
          <View style={styles.infoCards}>
            <View style={styles.infoCard}>
              <Ionicons name="mail" size={16} color="#1d6bde" />
              <Text style={styles.infoText} numberOfLines={1}>
                {JSON.parse(userInfo).data.email}
              </Text>
            </View>
            <View style={styles.infoCard}>
              <Ionicons name="call" size={16} color="#1d6bde" />
              <Text style={styles.infoText}>
                {JSON.parse(userInfo).data.mobileno}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Navigation Menu */}
        <View style={styles.menuContainer}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      {/* Modern Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Premium Card */}
        <TouchableOpacity activeOpacity={0.8} style={styles.premiumCard}>
          <LinearGradient
            colors={['#9c27b0', '#7b1fa2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.premiumGradient}
          >
            <Ionicons name="diamond" size={24} color="#fff" />
            <View style={styles.premiumInfo}>
              <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
              <Text style={styles.premiumSubtitle}>Get unlimited access</Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.shareButton} activeOpacity={0.7}>
            <Ionicons name="share-social" size={22} color="#ffffff" />
            <Text style={styles.shareText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.logoutButton} 
            activeOpacity={0.7}
            onPress={() => singOut()}
          >
            <Ionicons name="log-out" size={22} color="#ffffff" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>Powered by brainershub</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  
  // Modern Header Styles
  header: {
    shadowColor: '#1d6bde',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#fff',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#4caf50',
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  
  // Info Cards Styles
  infoCards: {
    gap: 12,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
  },
  
  // Scroll Content
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  
  // Menu Container
  menuContainer: {
    flex: 1,
    paddingTop: 8,
  },
  
  // Bottom Section Styles
  bottomSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  
  // Premium Card Styles
  premiumCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#9c27b0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  premiumGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 14,
  },
  premiumInfo: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  premiumSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  
  // Action Buttons Styles
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#1d6bde',
    borderRadius: 12,
    shadowColor: '#1d6bde',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  shareText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 8,
  },
  logoutButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#ef5350',
    borderRadius: 12,
    shadowColor: '#ef5350',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 8,
  },
  
  // Footer Styles
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
});

export default CustomDrawer;
