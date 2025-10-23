import React, {useState, useEffect, useContext, useCallback} from 'react';
import axios from 'axios';
import {BASE_URL, IMG_URL} from '../../config/config';
import {AuthContext} from '../../components/AuthContext';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from '../MyPurchase/style';
import {Payment, verifyPayment} from '../../components/Payment';
import {Loader} from '../../components/Loader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import COLORS from '../../config/colors';

const debounce = (func, delay) => {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

const Course = ({route}) => {
  const insets = useSafeAreaInsets();
  const [payStatus, setPayStatus] = useState(false);
  const [payResponse, setPayResponse] = useState(null);
  const [spinner, setSpinner] = useState(true);
  const {userInfo} = useContext(AuthContext);
  const email = JSON.parse(userInfo).data.email;
  const navigation = useNavigation();
  const [getData, setData] = useState([]);
  const [keyword, setKeyword] = useState('');
  const type = route.params.type;
  let url;
  let purchaseVal = {
    name: JSON.parse(userInfo).data.firstname,
    email: JSON.parse(userInfo).data.email,
    mobile: JSON.parse(userInfo).data.mobileno,
    uid: JSON.parse(userInfo).data.id,
  };
  if (type === 'popular') {
    url = `${BASE_URL}/popularcourse?type=all&email=${email}&keyword=${keyword}`;
  } else if (type === 'allCourses') {
    url = `${BASE_URL}/popularcourse?type=allCourses&email=${email}&keyword=${keyword}`;
  } else {
    url = `${BASE_URL}/coursebycategory/${type}?email=${email}&keyword=${keyword}`;
  }

  const fetchData = useCallback(async () => {
    try {
      setSpinner(true);
      const result = await axios.get(url, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setData(result.data);
      setSpinner(false);
    } catch (error) {
      // console.log(error);
      setSpinner(false);
    }
  }, []);
  useEffect(() => {
    // verifyPayment(payResponse);
    if (payStatus == true) {
      navigation.push('My Purchased');
    }
  }, [payStatus]);

  useEffect(() => {
    navigation.setOptions({title: route.params.name});
    fetchData();
  }, [fetchData, payStatus]);

  const searchData = useCallback(async () => {
    try {
      setSpinner(true);
      const result = await axios.get(url, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setData(result.data);
      setSpinner(false);
    } catch (error) {
      setSpinner(false);
    }
  });

  const debouncedSearch = debounce(searchData, 2000);
  const search = text => {
    setKeyword(text);
    debouncedSearch(text);
  };
  const handleClick = item => {
    navigation.navigate('Course Details', {
      item,
    });
  };
  const startLesson = item => {
    navigation.navigate('Course Details', {
      item,
      paid: 1,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingBottom: insets.bottom }}>
      <View style={{ flex: 1 }}>
      <Loader status={spinner} />
      <View style={styles.footer}>
        <View style={styles.searchContainer}>
          <TextInput
            placeholderTextColor="black"
            placeholder="Search course"
            style={styles.searchInput}
            onChangeText={search}
          />
        </View>
        <FlatList
          data={getData.data}
          keyExtractor={item => item.id.toString()}
          removeClippedSubviews
          initialNumToRender={4}
          nestedScrollEnabled
          scrollEnabled={true}
          renderItem={({item}) => (
            <View style={[styles.card, styles.elevation]}>
              <View style={styles.row}>
                <View style={styles.image}>
                  <Image
                    source={{uri: IMG_URL + `${item.course_thumbnail}`}}
                    style={styles.image}
                    resizeMode="stretch"
                  />
                </View>

                <View style={styles.column}>
                  <Text numberOfLines={2} style={[styles.title, styles.text]}>
                    {item.title}
                  </Text>
                  <View style={styles.description2}>
                    <Text style={styles.descriptionText}>
                      Course: {item.tradeName}
                    </Text>
                    <View>
                      <Text style={styles.price}>
                        {' '}
                        ₹{' '}
                        {(
                          item.price -
                          item.price * (item.discount / 100)
                        ).toFixed(2)}{' '}
                        , {''}
                        <Text style={styles.oldPrice}>
                          {item.price.toFixed(2)}
                        </Text>
                      </Text>
                    </View>
                  </View>
                  <View style={styles.row}>
                    {item.purchased ? (
                      <TouchableOpacity onPress={() => startLesson(item)}>
                        <View style={styles.buynow}>
                          <Text style={{color: 'white', fontWeight: '600'}}>Start Lesson</Text>
                        </View>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() =>
                          Payment([
                            {purchaseVal, item, setPayStatus, setPayResponse},
                          ])
                        }>
                        <View style={styles.buynow}>
                          <Text style={{color: 'white', fontWeight: '600'}}>Buy Now</Text>
                        </View>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity onPress={() => handleClick(item)}>
                      <View style={styles.demo}>
                        <Text style={{color: COLORS.primary, fontWeight: '600'}}>Details</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
    </View>
  );
};

export default Course;
