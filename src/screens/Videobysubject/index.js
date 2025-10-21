import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {BASE_URL, IMG_URL} from '../../config/config';
import {View, Text, FlatList, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import styles from './style';
import {DownloadFiles} from '../../components/DownloadFiles';

const Videobysubject = ({route}) => {
  let flag = route.params.flag;
  const navigation = useNavigation();
  const [getData, setData] = useState([]);
  const [flags, setFlag] = useState(flag);
  let url;
  let pageName;

  if (route.params.name == 'demo') {
    url = `${BASE_URL}/demovideos/${route.params.catid}`;

    pageName = route.params.pageName;
  } else if (route.name == 'FreeVideos') {
    url = `${BASE_URL}/getFreeVideos`;
    pageName = 'Free Videos';
  } else {
    let id = route.params.id;
    let category = route.params.category;
    let type = route.params.type;
    url =
      category == undefined
        ? `${BASE_URL}/videos/${id}`
        : `${BASE_URL}/getSubjectVideo/${category}/${id}`;
    pageName = route.params.name;
  }
  const handleFetchData = async () => {
    try {
      let result = await axios({
        method: 'GET',
        url: url,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setData(result.data);
    } catch (error) {}
  };

  const handleClick = async item => {
    let video = item.videos;
    let description = item.description;
    await navigation.navigate('Description', {
      video,
      description,
      flag,
    });
  };
  const ViewPdf = item => {
    navigation.navigate('ViewPdf', {
      pdfs: item.pdfs,
    });
  };
  useEffect(() => {
    navigation.setOptions({title: pageName});
    setFlag(flag);
    handleFetchData();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={getData.data}
        keyExtractor={item => item.id}
        removeClippedSubviews
        initialNumToRender={4}
        nestedScrollEnabled
        scrollEnabled={true}
        renderItem={({item}) => (
          <View
            style={[
              styles.card,
              styles.elevation,
              flag == 1 ? styles.opacity : '',
            ]}>
            <TouchableOpacity
              onPress={() => handleClick(item)}
              disabled={flags == 1 ? true : false}>
              <View style={styles.image}>
                <Image
                  key={item.id}
                  source={{uri: `${IMG_URL + item.thumbnail}`}}
                  style={styles.image}
                />
              </View>
            </TouchableOpacity>
            <View
              style={{
                minHeight: 40,
                maxHeight: 40,
                paddingHorizontal: 20,
                marginTop: 15,
              }}>
              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>
            </View>
            <View style={styles.row}>
              <TouchableOpacity
                onPress={() => ViewPdf(item)}
                disabled={flags == 1 ? true : false}>
                <View style={styles.buynow}>
                  <Text style={{color: 'white'}}>View PDF</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => DownloadFiles(item.pdfs)}
                disabled={flags == 1 ? true : false}>
                <View style={styles.demo}>
                  <Text style={{color: 'white'}}>Download PDF</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default Videobysubject;
