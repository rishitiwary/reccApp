import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {BASE_URL, IMG_URL} from '../../config/config';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Topmenu} from '../../components/Topmenu';
import styles from './style';
import {BottomNavigation} from '../../components/BottomNavigation';
import COLORS from '../../config/colors';

const Category = () => {
  const navigation = useNavigation();
  const handleClick = item => {
    let courseId = item.id;
    let courseName = item.course_name;
    let flag = 1;
    navigation.navigate('Course', {
      courseId: courseId,
      courseName: courseName,
      flag,
    });
  };

  const [getData, setData] = useState([]);
 
  const [activityIndicator, setActivityIndicator] = useState(true);
  const handleFetchData = async () => {
    try {
      let result = await axios({
        method: 'GET',
        url: `${BASE_URL}/categories`,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setData(result.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    navigation.setOptions({title: 'All Course'});
    handleFetchData();
    setActivityIndicator(false);
  }, []);

  return (
    <View style={styles.container}>
      {activityIndicator ? (
        <ActivityIndicator
          color={COLORS.bgColor}
          size="large"
          style={styles.activityIndicator}
        />
      ) : (
        ''
      )}
      <View style={styles.header}>
        <Topmenu />
      </View>

      <View style={styles.footer}>
        <FlatList
          data={getData.data}
          keyExtractor={item => item.id}
          removeClippedSubviews
          initialNumToRender={4}
          nestedScrollEnabled
          scrollEnabled={true}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => handleClick(item)}>
              <View style={[styles.card, styles.elevation]}>
                <View
                  style={{
                    flex: 2,
                    justifyContent: 'space-evenly',
                    paddingBottom: 50,
                    paddingHorizontal: 10,
                  }}>
                  <Image
                    key={item.id}
                    source={{uri: `${IMG_URL + item.images}`}}
                    style={styles.image}
                  />
                </View>
                <View style={styles.text}>
                  <Text style={styles.cardText} numberOfLines={2}>
                    {item.course_name}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          numColumns={2}
        />
      </View>
      <BottomNavigation />
    </View>
  );
};

export default Category;
