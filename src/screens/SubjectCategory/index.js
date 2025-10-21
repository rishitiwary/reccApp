import React, {useState, useEffect, useMemo} from 'react';
import axios from 'axios';
import {BASE_URL, IMG_URL} from '../../config/config';
import {View, Text, FlatList, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from '../MyPurchase/style';

const SubjectCategory = ({route}) => {
  let flag = route.params.flag;

  const navigation = useNavigation();
  const regex = /(&nbsp|amp|quot|lt|gt|;|<([^>]+)>)/gi;
  let id = route.params.courseId;

  const [getData, setData] = useState([]);

  const handleFetchData = async () => {
    try {
      let result = await axios({
        method: 'GET',
        url: `${BASE_URL}/subjectbylevel/${id}`,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setData(result.data);
    } catch (error) {}
  };
  const handleClick = async item => {
    let id = item.id;
    let type = item.type;
    let name = item.subname;
    await navigation.navigate('SubjectSubCategory', {
      id,
      type,
      name,
      flag,
    });
  };
  useEffect(() => {
    navigation.setOptions({title: route.params.name});
    handleFetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.footer}>
        <FlatList
          data={getData.data}
          keyExtractor={item => item.id}
          removeClippedSubviews
          initialNumToRender={4}
          nestedScrollEnabled
          scrollEnabled={true}
          renderItem={({item}) => (
            <View style={[styles.card, styles.elevation]}>
              <View style={styles.row}>
                <View style={styles.image}>
                  <Image
                    key={item.id}
                    source={{uri: `${IMG_URL + item.images}`}}
                    style={styles.image}
                  />
                </View>
                <View style={styles.row}>
                  <Text style={[styles.title, styles.text]}>
                    {item.subname}
                  </Text>
                </View>
              </View>
              <View style={styles.description2}>
                <Text style={styles.descriptionText}>
                  {item.description.replace(regex, '')}
                </Text>
              </View>
              <View style={styles.description3}>
                <TouchableOpacity onPress={() => handleClick(item)}>
                  <View style={styles.buynow}>
                    <Text style={{color: 'white'}}>View</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default SubjectCategory;
