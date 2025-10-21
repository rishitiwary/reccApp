import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {BASE_URL} from '../config/config';
import {FlatList, View, Text, TouchableOpacity} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {LinearGradient} from 'react-native-linear-gradient';
import LoginCheck from './LoginCheck';

export const Topmenu = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [getData, setData] = useState([]);
  
  const handleFetchData = async () => {
    try {
      let result = await axios({
        method: 'GET',
        url: `${BASE_URL}/menus`,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setData(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleFetchData();
  }, []);

  const isActive = (item) => {
    if (item.url === 'Home' && route.name === 'Home') return true;
    return false;
  };

  return (
    <>
      <LoginCheck/>
      <View style={{
        backgroundColor: '#f9fafb',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
      }}>
        <FlatList
          data={getData.data}
          horizontal
          keyExtractor={item => String(item.id)}
          removeClippedSubviews
          initialNumToRender={4}
          nestedScrollEnabled={true}
          scrollEnabled={true}
          contentContainerStyle={{
            paddingHorizontal: 8,
            alignItems: 'center',
          }}
          renderItem={({item}) => {
            const active = isActive(item);
            return (
              <TouchableOpacity
                onPress={() =>
                  item.url == 'Home'
                    ? navigation.navigate('Home')
                    : navigation.push('Pages', {item})
                }
                activeOpacity={0.8}
                style={{ marginHorizontal: 6 }}
              >
                <LinearGradient
                  colors={active 
                    ? ['#3b82f6', '#2563eb'] 
                    : ['#ffffff', '#ffffff']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    paddingHorizontal: 18,
                    paddingVertical: 10,
                    borderRadius: 20,
                    shadowColor: active ? '#2563eb' : '#000',
                    shadowOffset: { width: 0, height: active ? 3 : 2 },
                    shadowOpacity: active ? 0.25 : 0.08,
                    shadowRadius: active ? 6 : 4,
                    elevation: active ? 4 : 2,
                    borderWidth: active ? 0 : 1,
                    borderColor: '#e5e7eb',
                    minWidth: 80,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{
                    color: active ? '#ffffff' : '#374151',
                    fontSize: 14,
                    fontWeight: active ? '700' : '600',
                    letterSpacing: 0.3,
                  }}>
                    {item.name}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </>
  );
};
