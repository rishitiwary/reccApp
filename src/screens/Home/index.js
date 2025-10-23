import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import { BASE_URL, IMG_URL } from '../../config/config';
import { useNavigation } from '@react-navigation/native';
import { BottomNavigation } from '../../components/BottomNavigation';
import { AuthContext } from '../../components/AuthContext';
import { Loader } from '../../components/Loader';
import { Payment } from '../../components/Payment';
import { Topmenu } from '../../components/Topmenu';
import VersionCheck from 'react-native-version-check';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { LinearGradient } from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const [spinner, setSpinner] = useState(true);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { userInfo } = React.useContext(AuthContext);
  const email = JSON.parse(userInfo).data.email;
  const userName = JSON.parse(userInfo).data.firstname;
  const [getData, setData] = useState([]);
  const [courses, setCourses] = useState([]);

  // Check android version and send for auto update
  const checkForUpdate = () => {
    VersionCheck.needUpdate().then(async res => {
      console.log('Check for update', res.isNeeded);
      if (res.isNeeded) {
        Linking.openURL(res.storeUrl);
      }
    });
  };

  const handleClick = async item => {
    await navigation.navigate('Course Details', {
      item,
      paid: 1,
    });
  };

  const handleDetails = async item => {
    await navigation.navigate('Course Details', {
      item,
      paid: 0,
    });
  };

  const coursesByCategory = async type => {
    await navigation.navigate('Course', {
      type: type.type,
      name: type.name,
    });
  };

  let purchaseVal = {
    name: JSON.parse(userInfo).data.firstname,
    email: JSON.parse(userInfo).data.email,
    mobile: JSON.parse(userInfo).data.mobileno,
    uid: JSON.parse(userInfo).data.id,
  };

  const handleFetchData = async () => {
    try {
      setSpinner(true);
      let result = await axios({
        method: 'GET',
        url: `${BASE_URL}/coursecategory/`,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setData(result.data);
      setSpinner(false);
    } catch (error) {
      console.log(error);
      setSpinner(false);
    }
  };

  const popularCourses = async () => {
    try {
      let result = await axios({
        method: 'GET',
        url: `${BASE_URL}/popularcourse?email=${email}`,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setCourses(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkForUpdate();
    navigation.setOptions({ title: 'Raj Economics (RECC)' });
    handleFetchData();
    popularCourses();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb', paddingBottom: insets.bottom }}>
      <Loader status={spinner} />

      {/* Top Menu */}
      <View style={{ backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
        <Topmenu />
      </View>

      <ScrollView 
        keyboardShouldPersistTaps="always" 
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Header */}
     
        {/* Popular Courses Section */}
        <View style={{ marginTop: 24, marginBottom: 16 }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            marginBottom: 16,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: '#fef3c7',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
              }}>
                <FontAwesome name="fire" color="#f59e0b" size={18} />
              </View>
              <Text style={{
                fontSize: 20,
                fontWeight: '700',
                color: '#111827',
              }}>
                Popular Courses
              </Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                coursesByCategory({ type: 'popular', name: 'Popular Courses' })
              }
              activeOpacity={0.7}
            >
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
              }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: '#2563eb',
                }}>
                  See All
                </Text>
                <FontAwesome name="chevron-right" color="#2563eb" size={12} />
              </View>
            </TouchableOpacity>
          </View>

          <FlatList
            data={Array.isArray(courses.data) ? courses.data : []}
            horizontal
            keyExtractor={item => String(item.id)}
            removeClippedSubviews
            initialNumToRender={3}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleDetails(item)}
                activeOpacity={0.95}
              >
                <View style={{
                  width: 280,
                  marginRight: 16,
                  backgroundColor: '#fff',
                  borderRadius: 18,
                  overflow: 'hidden',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.12,
                  shadowRadius: 16,
                  elevation: 6,
                  borderWidth: 1,
                  borderColor: '#f0f0f0',
                }}>
                  {/* Course Image */}
                  <View style={{ position: 'relative' }}>
                    <Image
                      source={{ uri: IMG_URL + `${item.course_thumbnail}` }}
                      style={{
                        width: '100%',
                        height: 160,
                        resizeMode: 'cover',
                      }}
                    />
                    
                    {/* Gradient Overlay */}
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.4)']}
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 60,
                      }}
                    />

                    {/* Discount Badge */}
                    {item.discount > 0 && (
                      <View style={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                      }}>
                        <LinearGradient
                          colors={['#f59e0b', '#d97706']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={{
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 10,
                            shadowColor: '#f59e0b',
                            shadowOffset: { width: 0, height: 3 },
                            shadowOpacity: 0.6,
                            shadowRadius: 6,
                            elevation: 5,
                            borderWidth: 2,
                            borderColor: 'rgba(255,255,255,0.3)',
                          }}
                        >
                          <Text style={{
                            color: '#fff',
                            fontSize: 13,
                            fontWeight: '800',
                            letterSpacing: 0.5,
                          }}>
                            {item.discount}% OFF
                          </Text>
                        </LinearGradient>
                      </View>
                    )}

                    {/* Status Badge */}
                    {item.purchased && (
                      <View style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        backgroundColor: 'rgba(34, 197, 94, 0.95)',
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                      }}>
                        <FontAwesome name="check-circle" color="#fff" size={11} />
                        <Text style={{
                          color: '#fff',
                          fontSize: 10,
                          fontWeight: '700',
                        }}>
                          OWNED
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Course Content */}
                  <View style={{ padding: 14 }}>
                    <Text numberOfLines={2} style={{
                      fontSize: 16,
                      fontWeight: '700',
                      color: '#111827',
                      marginBottom: 8,
                      lineHeight: 22,
                    }}>
                      {item.title}
                    </Text>

                    {/* Category with Badge */}
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 12,
                      backgroundColor: '#f0f7ff',
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 8,
                      alignSelf: 'flex-start',
                    }}>
                      <FontAwesome name="tag" color="#2563eb" size={11} />
                      <Text style={{
                        fontSize: 12,
                        color: '#2563eb',
                        marginLeft: 5,
                        fontWeight: '600',
                      }}>
                        {item.tradeName}
                      </Text>
                    </View>

                    {/* Price Section with Background */}
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 14,
                      backgroundColor: '#fef3c7',
                      paddingHorizontal: 10,
                      paddingVertical: 8,
                      borderRadius: 10,
                    }}>
                      <FontAwesome name="rupee" color="#d97706" size={14} />
                      <Text style={{
                        fontSize: 20,
                        fontWeight: '800',
                        color: '#d97706',
                        marginLeft: 4,
                      }}>
                        {(item.price - item.price * (item.discount / 100)).toFixed(2)}
                      </Text>
                      {item.discount > 0 && (
                        <Text style={{
                          fontSize: 14,
                          color: '#9ca3af',
                          textDecorationLine: 'line-through',
                          marginLeft: 8,
                        }}>
                          ₹{item.price.toFixed(2)}
                        </Text>
                      )}
                    </View>

                    {/* Action Buttons */}
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      {item.purchased ? (
                        <TouchableOpacity
                          onPress={(e) => {
                            e.stopPropagation();
                            handleClick(item);
                          }}
                          activeOpacity={0.8}
                          style={{ flex: 1 }}
                        >
                          <LinearGradient
                            colors={['#10b981', '#059669', '#047857']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                              paddingVertical: 12,
                              borderRadius: 10,
                              alignItems: 'center',
                              shadowColor: '#10b981',
                              shadowOffset: { width: 0, height: 3 },
                              shadowOpacity: 0.4,
                              shadowRadius: 6,
                              elevation: 4,
                            }}
                          >
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                              <FontAwesome name="play-circle" color="#fff" size={15} />
                              <Text style={{
                                color: '#fff',
                                fontSize: 14,
                                fontWeight: '700',
                              }}>
                                Continue Learning
                              </Text>
                            </View>
                          </LinearGradient>
                        </TouchableOpacity>
                      ) : (
                        <>
                          <TouchableOpacity
                            onPress={(e) => {
                              e.stopPropagation();
                              Payment([{ purchaseVal, item }]);
                            }}
                            activeOpacity={0.8}
                            style={{ flex: 1 }}
                          >
                            <LinearGradient
                              colors={['#3b82f6', '#2563eb', '#1d4ed8']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 1 }}
                              style={{
                                paddingVertical: 12,
                                borderRadius: 10,
                                alignItems: 'center',
                                shadowColor: '#2563eb',
                                shadowOffset: { width: 0, height: 3 },
                                shadowOpacity: 0.4,
                                shadowRadius: 6,
                                elevation: 4,
                              }}
                            >
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <FontAwesome name="shopping-cart" color="#fff" size={14} />
                                <Text style={{
                                  color: '#fff',
                                  fontSize: 14,
                                  fontWeight: '700',
                                }}>
                                  Buy Now
                                </Text>
                              </View>
                            </LinearGradient>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={(e) => {
                              e.stopPropagation();
                              handleDetails(item);
                            }}
                            activeOpacity={0.8}
                          >
                            <LinearGradient
                              colors={['#f3f4f6', '#e5e7eb']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 0, y: 1 }}
                              style={{
                                paddingVertical: 12,
                                paddingHorizontal: 14,
                                borderRadius: 10,
                                borderWidth: 1,
                                borderColor: '#d1d5db',
                              }}
                            >
                              <FontAwesome name="info-circle" color="#6b7280" size={14} />
                            </LinearGradient>
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Course Category Section */}
        <View style={{ marginTop: 16, paddingBottom: 100 }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            marginBottom: 16,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: '#dbeafe',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
              }}>
                <FontAwesome name="th-large" color="#2563eb" size={16} />
              </View>
              <Text style={{
                fontSize: 20,
                fontWeight: '700',
                color: '#111827',
              }}>
                Course Categories
              </Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                coursesByCategory({ type: 'allCourses', name: 'All Courses' })
              }
              activeOpacity={0.7}
            >
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
              }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: '#2563eb',
                }}>
                  See All
                </Text>
                <FontAwesome name="chevron-right" color="#2563eb" size={12} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingHorizontal: 16,
          }}>
            {Array.isArray(getData.data) &&
              getData.data.map(item => {
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() =>
                      coursesByCategory({ type: item.id, name: item.type })
                    }
                    activeOpacity={0.8}
                    style={{ width: '50%', padding: 4 }}
                  >
                    <View style={{
                      backgroundColor: '#fff',
                      borderRadius: 14,
                      overflow: 'hidden',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.06,
                      shadowRadius: 8,
                      elevation: 2,
                      borderWidth: 1,
                      borderColor: '#f0f0f0',
                    }}>
                      <Image
                        source={{ uri: `${item.feature_image}` }}
                        style={{
                          width: '100%',
                          height: 110,
                          resizeMode: 'cover',
                        }}
                      />
                      <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.5)']}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 110,
                          justifyContent: 'flex-end',
                          padding: 10,
                        }}
                      >
                        <Text
                          numberOfLines={2}
                          style={{
                            fontSize: 14,
                            fontWeight: '700',
                            color: '#fff',
                            textShadowColor: 'rgba(0, 0, 0, 0.5)',
                            textShadowOffset: { width: 0, height: 1 },
                            textShadowRadius: 3,
                          }}
                        >
                          {item.type}
                        </Text>
                      </LinearGradient>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>
      </ScrollView>

      <BottomNavigation />
    </View>
  );
};

export default HomeScreen;
