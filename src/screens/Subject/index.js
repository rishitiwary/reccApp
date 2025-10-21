import React, {useState, useEffect, useMemo} from 'react';
import axios from 'axios';
import {BASE_URL, IMG_URL} from '../../config/config';

import {View, Text, FlatList, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Topmenu} from '../../components/Topmenu';
import styles from './style';
import {BottomNavigation} from '../../components/BottomNavigation';
let type = '';
const Subject = ({route}) => {
  let flag = route.params.flag;
  let id = route.params.id;
  type = route.params.type;

  const navigation = useNavigation();
  const handleClick = async item => {
    let courseId = item.id;
    type = item.type;
    let name = item.subname;
    await navigation.navigate('SubjectCategory', {
      courseId: courseId,
      type: type,
      name: name,
      flag: flag,
    });
  };
  const handleClick2 = async item => {
    let id = item.id;
    let category = item.category;
    type = item.type;
    let name = item.subname;
    await navigation.navigate('Videobysubject', {
      id,
      type,
      name,
      category,
      flag,
    });
  };
  const [getData, setData] = useState([]);
  const handleFetchData = async () => {
    try {
      let result = await axios({
        method: 'GET',
        url: `${BASE_URL}/getSubjectById/${id}`,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setData(result.data);
    } catch (error) {}
  };

  useEffect(() => {
    navigation.setOptions({title: route.params.subject});
    handleFetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Topmenu />
      </View>

      <View style={styles.footer}>
        {type == 'new' ? (
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
                      alignItems: 'center',
                      paddingBottom: 50,
                      paddingHorizontal: 10,
                    }}>
                    <Image
                      key={item.id}
                      source={{uri: `${IMG_URL + item.images}`}}
                      style={styles.image}
                    />

                    <Text style={styles.cardText} numberOfLines={2}>
                      {item.subname}{' '}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            numColumns={2}
          />
        ) : (
          <FlatList
            style={flag == 1 ? styles.opacity : ''}
            data={getData.data}
            initialNumToRender={4}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => handleClick2(item)}
                disabled={flag == 1 ? true : false}>
                <View style={[styles.card, styles.elevation]}>
                  <View
                    style={{
                      flex: 2,
                      justifyContent: 'space-evenly',
                      alignItems: 'center',
                      paddingBottom: 50,
                      paddingHorizontal: 10,
                    }}>
                    <Image
                      key={item.id}
                      source={{uri: `${IMG_URL + item.images}`}}
                      style={styles.image}
                    />

                    <Text style={styles.cardText} numberOfLines={2}>
                      {item.subname}{' '}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            numColumns={2}
          />
        )}
      </View>

      <BottomNavigation />
    </View>
  );
};

export default Subject;
