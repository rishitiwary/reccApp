import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, Image} from 'react-native';
import styles from '../Chat/style';
import {useNavigation} from '@react-navigation/native';
import {Loader} from '../../components/Loader';
import axios from 'axios';
import {BASE_URL} from '../../config/config';
import {Topmenu} from '../../components/Topmenu';
const Pages = ({route}) => {
  const name = route.params.item.name;
  const url = route.params.item.url;
  const navigation = useNavigation();
  const [spinner, setSpinner] = useState(true);
  const [getData, setData] = useState([]);
  const handleFetchData = async () => {
    try {
      setSpinner(true);
      let result = await axios({
        method: 'GET',
        url: `${BASE_URL}/pages/${url}`,
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
  const handleClick = async item => {
    let id = item.id;
    let title = item.title;
    let pageurl = item.url;
    navigation.push('DetailsRelated', {id, title, pageurl, url});
  };
  useEffect(() => {
    navigation.setOptions({title: name});
    handleFetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Loader status={spinner} />
      <Topmenu />
      <FlatList
        data={getData.data}
        keyExtractor={item => item.id}
        removeClippedSubviews
        initialNumToRender={4}
        nestedScrollEnabled={true}
        scrollEnabled={true}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              handleClick(item);
            }}>
            <View style={[styles.card, styles.elevation]}>
              <View style={styles.row}>
                <View style={[styles.image]}>
                  <Image source={{uri: `${item.image}`}} style={styles.image} />
                </View>
                <View style={styles.column}>
                  <View style={styles.description2}>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.pageTitle}>
                        {item.title} :{' '}
                        <Text style={styles.pageDescription}>
                          {item.short_description}
                        </Text>
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};
export default Pages;
