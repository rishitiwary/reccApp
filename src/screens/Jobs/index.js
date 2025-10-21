import React, {useState, useEffect, useMemo} from 'react';
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
import styles from './style';
import COLORS from '../../config/colors';


const Jobs = ({route}) => {
  const navigation = useNavigation();
  const regex = /(&nbsp|amp|quot|lt|gt|;|<([^>]+)>)/gi;
  const [imageLoading, setImageLoading] = useState(true);
  const [getData, setData] = useState([]);
  const [activityIndicator, setActivityIndicator] = useState(true);
  let url;
  let pageName;
  url = `${BASE_URL}/getBooks`;
  pageName = 'Purchase Books';

  const handleFetchData = useMemo(async () => {
    let result = await axios({
      method: 'GET',
      url: url,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    setData(result.data);
  });

  useEffect(() => {
    navigation.setOptions({title: pageName});
    handleFetchData;
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
      <FlatList
        data={getData.data}
        renderItem={({item}) => (
          <View style={[styles.card, styles.elevation]}>
            <TouchableOpacity onPress={() => alert('yes')}>
              <View style={styles.image}>
                {imageLoading ? (
                  <Image
                    key={item.id}
                    source={require('../../../assets/images/book.jpeg')}
                    style={styles.image}
                    onLoad={() => setImageLoading(false)}
                  />
                ) : (
                  <Image
                    key={item.id}
                    source={{uri: `${IMG_URL + item.post_image}`}}
                    style={styles.image}
                  />
                )}
              </View>
            </TouchableOpacity>
            <View style={{paddingVertical: 10}}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.descriptionText}>
                {item.description.replace(regex, '')}
              </Text>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default Jobs;
