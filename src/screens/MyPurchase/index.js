import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { BASE_URL, IMG_URL } from '../../config/config';
import { View, Text, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { AuthContext } from '../../components/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Topmenu } from '../../components/Topmenu';
import { BottomNavigation } from '../../components/BottomNavigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Loader } from '../../components/Loader';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { LinearGradient } from 'react-native-linear-gradient';

const MyPurchase = () => {
  const insets = useSafeAreaInsets();
  const { userInfo } = React.useContext(AuthContext);
  const navigation = useNavigation();
  const [spinner, setSpinner] = useState(true);
  const [getData, setData] = useState([]);
  let id = JSON.parse(userInfo).data.email;

  const handleFetchData = async () => {
    try {
      setSpinner(true);
      let result = await axios({
        method: 'GET',
        url: `${BASE_URL}/mypurchased/${id}`,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setData(result.data);
      setSpinner(false);
    } catch (error) {
      setSpinner(false);
    }
  };

  const handleClick = async item => {
    await navigation.navigate('Course Details', {
      item,
      paid: 1,
    });
  };

  const groupDiscussion = async item => {
    await navigation.navigate('Discussion Group', {
      courseId: item.id,
      courseTitle: item.title
    });
  };

  useEffect(() => {
    navigation.setOptions({ title: 'My Purchased' });
    handleFetchData();
  }, []);

  const EmptyState = () => (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 80,
      paddingHorizontal: 40,
    }}>
      <View style={{
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#f0f7ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
      }}>
        <FontAwesome name="shopping-bag" color="#2563eb" size={50} />
      </View>
      <Text style={{
        fontSize: 22,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 12,
        textAlign: 'center',
      }}>
        No Courses Yet
      </Text>
      <Text style={{
        fontSize: 15,
        color: '#6b7280',
        textAlign: 'center',
        lineHeight: 22,
      }}>
        Start learning today! Browse our courses and purchase your first course.
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb', paddingBottom: insets.bottom }}>
      <Loader status={spinner} />

      <View style={{ backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
        <Topmenu />
      </View>

      {/* Header Section */}
    

      <View style={{ flex: 1 }}>
        {!spinner && getData.data && getData.data.length === 0 ? (
          <EmptyState />
        ) : (
          <FlatList
            data={getData.data}
            keyExtractor={item => String(item.id)}
            removeClippedSubviews
            initialNumToRender={4}
            scrollEnabled={true}
            contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
            renderItem={({ item }) => (
              <View style={{
                marginBottom: 12,
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
                <View style={{ flexDirection: 'row', padding: 12 }}>
                  {/* Course Image - Left Side */}
                  <View style={{ position: 'relative' }}>
                    <Image
                      source={{ uri: IMG_URL + `${item.course_thumbnail}` }}
                      style={{
                        width: 110,
                        height: 140,
                        borderRadius: 10,
                        resizeMode: 'cover',
                      }}
                    />
                    <View style={{
                      position: 'absolute',
                      top: 6,
                      left: 6,
                      backgroundColor: 'rgba(34, 197, 94, 0.95)',
                      paddingHorizontal: 6,
                      paddingVertical: 3,
                      borderRadius: 5,
                    }}>
                      <Text style={{
                        color: '#fff',
                        fontSize: 9,
                        fontWeight: '700',
                        letterSpacing: 0.3,
                      }}>
                        OWNED
                      </Text>
                    </View>
                  </View>

                  {/* Course Content - Right Side */}
                  <View style={{ flex: 1, marginLeft: 12, justifyContent: 'space-between' }}>
                    {/* Title & Category */}
                    <View>
                      <Text numberOfLines={2} style={{
                        fontSize: 15,
                        fontWeight: '700',
                        color: '#111827',
                        marginBottom: 6,
                        lineHeight: 20,
                      }}>
                        {item.title}
                      </Text>

                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 8,
                      }}>
                        <FontAwesome name="tag" color="#6b7280" size={11} />
                        <Text style={{
                          fontSize: 12,
                          color: '#6b7280',
                          marginLeft: 5,
                        }}>
                          {item.tradeName}
                        </Text>
                      </View>

                      {/* Price */}
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                      }}>
                        <Text style={{
                          fontSize: 16,
                          fontWeight: '700',
                          color: '#2563eb',
                        }}>
                          ₹{(item.price - item.price * (item.discount / 100)).toFixed(2)}
                        </Text>
                        <Text style={{
                          fontSize: 12,
                          color: '#9ca3af',
                          textDecorationLine: 'line-through',
                          marginLeft: 6,
                        }}>
                          ₹{item.price.toFixed(2)}
                        </Text>
                        {item.discount > 0 && (
                          <View style={{
                            marginLeft: 6,
                            backgroundColor: '#22c55e',
                            paddingHorizontal: 6,
                            paddingVertical: 2,
                            borderRadius: 4,
                          }}>
                            <Text style={{
                              color: '#fff',
                              fontSize: 9,
                              fontWeight: '700',
                            }}>
                              {item.discount}% OFF
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={{
                      flexDirection: 'row',
                      gap: 6,
                    }}>
                      <TouchableOpacity
                        onPress={() => handleClick(item)}
                        activeOpacity={0.8}
                        style={{ flex: 1 }}
                      >
                        <LinearGradient
                          colors={['#3b82f6', '#2563eb']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={{
                            paddingVertical: 9,
                            borderRadius: 8,
                            alignItems: 'center',
                            shadowColor: '#2563eb',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.3,
                            shadowRadius: 4,
                            elevation: 3,
                          }}
                        >
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <FontAwesome name="play-circle" color="#fff" size={13} />
                            <Text style={{
                              color: '#fff',
                              fontSize: 13,
                              fontWeight: '700',
                            }}>
                              Start
                            </Text>
                          </View>
                        </LinearGradient>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => groupDiscussion(item)}
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={['#8b5cf6', '#7c3aed']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={{
                            paddingVertical: 9,
                            paddingHorizontal: 12,
                            borderRadius: 8,
                            alignItems: 'center',
                            shadowColor: '#8b5cf6',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.3,
                            shadowRadius: 4,
                            elevation: 3,
                          }}
                        >
                          <FontAwesome name="comments" color="#fff" size={13} />
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <BottomNavigation />
    </View>
  );
};

export default MyPurchase;
