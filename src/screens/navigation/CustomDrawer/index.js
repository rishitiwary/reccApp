import React from 'react';
import { Text, View, Image, Dimensions } from 'react-native';
import { BASE_URL, IMG_URL } from '../../../config/config';
import { AuthContext } from '../../../components/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import Ionicons from '@react-native-vector-icons/ionicons';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LinearGradient } from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const CustomDrawer = props => {
  const { singOut, isLoading, userInfo } = React.useContext(AuthContext);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Spinner visible={isLoading} />

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: '#f9fafb' }}
      >
        {/* Modern Header with Gradient */}
        <LinearGradient
          colors={['#2563eb', '#1d4ed8', '#1e40af']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingTop: 50, paddingBottom: 30, paddingHorizontal: 20 }}
        >
          {/* Profile Image with Ring */}
          <View style={{
            alignItems: 'center',
            marginBottom: 20,
          }}>
            <View style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: 4,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}>
              <Image
                source={{ uri: IMG_URL + `${JSON.parse(userInfo).data.photo}` }}
                style={{
                  height: 92,
                  width: 92,
                  borderRadius: 46,
                  borderWidth: 3,
                  borderColor: '#fff',
                }}
              />
            </View>
            
            {/* Active Status Indicator */}
            <View style={{
              position: 'absolute',
              bottom: 15,
              right: width / 2 - 60,
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: '#22c55e',
              borderWidth: 3,
              borderColor: '#fff',
            }} />
          </View>

          {/* User Name */}
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Text style={{
              color: '#fff',
              fontSize: 22,
              fontWeight: '700',
              textTransform: 'capitalize',
              textAlign: 'center',
              marginBottom: 4,
            }}>
              {JSON.parse(userInfo).data.firstname}
            </Text>
            <View style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.3)',
            }}>
              <Text style={{
                color: 'rgba(255,255,255,0.95)',
                fontSize: 12,
                fontWeight: '600',
              }}>
                STUDENT
              </Text>
            </View>
          </View>

          {/* Contact Info Cards */}
          <View style={{ gap: 10 }}>
            {/* Email */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.15)',
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.2)',
            }}>
              <View style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: 'rgba(255,255,255,0.2)',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Ionicons name="mail" size={14} color="#fff" />
              </View>
              <Text numberOfLines={1} style={{
                color: '#fff',
                fontSize: 14,
                fontWeight: '500',
                marginLeft: 12,
                flex: 1,
              }}>
                {JSON.parse(userInfo).data.email}
              </Text>
            </View>

            {/* Phone */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.15)',
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.2)',
            }}>
              <View style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: 'rgba(255,255,255,0.2)',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Ionicons name="call" size={16} color="#fff" />
              </View>
              <Text style={{
                color: '#fff',
                fontSize: 14,
                fontWeight: '500',
                marginLeft: 12,
              }}>
                {JSON.parse(userInfo).data.mobileno}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Menu Items */}
        <View style={{
          flex: 1,
          backgroundColor: '#fff',
          paddingTop: 12,
        }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      {/* Bottom Actions */}
      <View style={{
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
      }}>
        {/* Logout Button */}
        <TouchableOpacity
          onPress={() => singOut()}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#ef4444', '#dc2626']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 14,
              paddingHorizontal: 20,
              borderRadius: 12,
              marginBottom: 10,
              shadowColor: '#ef4444',
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.3,
              shadowRadius: 6,
              elevation: 4,
            }}
          >
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(255,255,255,0.2)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Ionicons name="log-out-outline" size={22} color="#fff" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '700',
                color: '#fff',
              }}>
                Logout
              </Text>
              <Text style={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.8)',
                marginTop: 2,
              }}>
                Sign out from your account
              </Text>
            </View>
            <FontAwesome name="chevron-right" size={16} color="rgba(255,255,255,0.8)" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Share Button */}
        <TouchableOpacity
          activeOpacity={0.8}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 14,
            paddingHorizontal: 20,
            borderRadius: 12,
            backgroundColor: '#f9fafb',
            borderWidth: 1,
            borderColor: '#e5e7eb',
          }}>
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#dbeafe',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Ionicons name="share-social-outline" size={20} color="#2563eb" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '700',
                color: '#111827',
              }}>
                Share with Friends
              </Text>
              <Text style={{
                fontSize: 12,
                color: '#6b7280',
                marginTop: 2,
              }}>
                Invite your friends to join
              </Text>
            </View>
            <FontAwesome name="chevron-right" size={16} color="#9ca3af" />
          </View>
        </TouchableOpacity>

        {/* App Version */}
        <View style={{
          marginTop: 16,
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: 11,
            color: '#9ca3af',
            fontWeight: '500',
          }}>
            Raj Economics (RECC) v1.0.0
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CustomDrawer;
