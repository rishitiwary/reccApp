import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import {BASE_URL, IMG_URL} from '../../config/config';
import {useNavigation} from '@react-navigation/native';
import styles from './style';
import {BottomNavigation} from '../../components/BottomNavigation';
import {AuthContext} from '../../components/AuthContext';
import {Loader} from '../../components/Loader';
import {Payment} from '../../components/Payment';

const HomeScreen = () => {
  const [spinner, setSpinner] = useState(true);

  const navigation = useNavigation();
  const [getData, setData] = useState([]);
  const [courses, setCourses] = useState([]);

  const handleClick = async item => {
    await navigation.navigate('Course Details', {
      item,
    });
  };
  const coursesByCategory = async type => {
    await navigation.navigate('Course', {
      type: type.type,
      name: type.name,
    });
  };
  const {userInfo} = React.useContext(AuthContext);
  let purchaseVal = {
    name: JSON.parse(userInfo).firstname,
    email: JSON.parse(userInfo).email,
    mobile: JSON.parse(userInfo).mobileno,
    uid: JSON.parse(userInfo).id,
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
    }
  };
  const popularCourses = async () => {
    try {
      let result = await axios({
        method: 'GET',
        url: `${BASE_URL}/popularcourse/`,
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
    navigation.setOptions({title: 'recc Academy'});
    handleFetchData();
    popularCourses();
  });
  return (
    <SafeAreaView style={styles.container}>
      <Loader status={spinner} />
      <ScrollView keyboardShouldPersistTaps="always" nestedScrollEnabled>
        <View style={styles.popularCourses}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <Text style={styles.cardText}>Popular Courses</Text>
            </View>
            <View style={{flex: 1}}>
              <TouchableOpacity
                onPress={() =>
                  coursesByCategory({type: 'popular', name: 'Popular Courses'})
                }>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={courses.data}
            horizontal
            keyExtractor={item => item.id}
            removeClippedSubviews
            initialNumToRender={4}
            nestedScrollEnabled={true}
            scrollEnabled={true}
            renderItem={({item}) => (
              <View style={[styles.courses, styles.elevation]}>
                <View style={[styles.courseImage]}>
                  <Image
                    source={{uri: IMG_URL + `${item.course_thumbnail}`}}
                    style={styles.courseImage}
                    resizeMode="cover"
                  />

                  <View style={styles.description3}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.title}>
                      Course : {item.tradeName} ,{'   '}₹{' '}
                      <Text style={styles.price}>
                        {(
                          item.price -
                          item.price * (item.discount / 100)
                        ).toFixed(2)}{' '}
                        , {''}
                        <Text style={styles.oldPrice}>
                          {item.price.toFixed(2)}
                        </Text>
                      </Text>
                    </Text>

                    <TouchableOpacity
                      onPress={() => Payment([{purchaseVal, item}])}>
                      <View style={styles.buynow}>
                        <Text style={{color: 'white'}}>Buy Now</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleClick(item)}>
                      <View style={styles.demo}>
                        <Text style={{color: 'white'}}>Details</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <View style={styles.footer}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <Text style={styles.cardText}>Course Category</Text>
            </View>
            <View style={{flex: 1}}>
              <TouchableOpacity
                onPress={() =>
                  coursesByCategory({type: 'allCourses', name: 'All Courses'})
                }>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.row}>
            {typeof getData.data !== 'undefined'
              ? getData.data.map(item => {
                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() =>
                        coursesByCategory({type: item.id, name: item.type})
                      }>
                      <View style={[styles.card, styles.elevation]}>
                        <View style={[styles.image]}>
                          <Image
                            source={{uri: `${item.feature_image}`}}
                            style={styles.image}
                            resizeMode="cover"
                          />
                          <Text style={styles.cardText}>{item.type}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
              : ''}
          </View>
        </View>
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
};

export default HomeScreen;
