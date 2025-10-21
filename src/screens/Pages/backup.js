import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';
import styles from '../Chat/style';
import {useNavigation} from '@react-navigation/native';
import {Loader} from '../../components/Loader';
import axios from 'axios';
import {BASE_URL} from '../../config/config';
import {ScrollView} from 'react-native-gesture-handler';
import {Topmenu} from '../../components/Topmenu';
const DetailsRelated = ({route}) => {
  const url = route.params.url;
  console.log(route.params.pageurl);
  const [spinner, setSpinner] = useState(true);
  const [getData, setData] = useState([]);
  const [relatedData, setRelatedData] = useState([]);
  const navigation = useNavigation();
  const handleFetchData = async () => {
    try {
      setSpinner(true);
      let result = await axios({
        method: 'GET',
        url: `${BASE_URL}/related/${route.params.id}/${url}`,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setData(result.data.data);
      setRelatedData(result.data.related);
      setSpinner(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleClick = async item => {
    console.log(item);
    let id = item.id;
    let title = item.title;
    navigation.push('DetailsRelated', {id, title, url});
  };
  useEffect(() => {
    navigation.setOptions({title: route.params.title});
    handleFetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Topmenu />
      <ScrollView>
        <Loader status={spinner} />

        <View style={{marginHorizontal: 5}}>
          {typeof getData.title !== undefined ? (
            <Text style={styles.pageTitle}>
              {getData.title} :{' '}
              <Text style={styles.pageDescription}>
                {getData.short_description}
              </Text>
            </Text>
          ) : (
            ''
          )}

          <View style={[styles.DetailsImage]}>
            {typeof getData.image !== undefined ? (
              <Image
                source={{
                  uri: `${getData.image}`,
                }}
                style={styles.DetailsImage}
                resizeMode="cover"
              />
            ) : (
              ''
            )}
          </View>
          <View style={styles.line} />
          {typeof getData.description !== undefined ? (
            <Text style={styles.descriptionText}>{getData.description}</Text>
          ) : (
            ''
          )}
        </View>
        <FlatList
          data={relatedData}
          horizontal
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
                    <Image
                      source={{uri: `${item.image}`}}
                      style={styles.image}
                      resizeMode="cover"
                    />
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
      </ScrollView>
    </View>
  );
};
export default DetailsRelated;
