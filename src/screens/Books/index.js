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
  Linking
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from './style';
import COLORS from '../../config/colors';
const Books = ({route}) => {
  const navigation = useNavigation();
  const regex = /(&nbsp|amp|quot|lt|gt|;|<([^>]+)>)/gi;
  const [imageLoading, setImageLoading] = useState(true);
  const [getData, setData] = useState([]);
  const [activityIndicator, setActivityIndicator] = useState(true);
  let url;
  let pageName;
  url = `${BASE_URL}/getBooks`;
  pageName = 'Purchase Books';

  const handleFetchData = async () => {
    try{
      let result = await axios({
        method: 'GET',
        url: url,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setData(result.data);
    }catch(e){
console.log(e);
    }
  };
  useEffect(() => {
    navigation.setOptions({title: pageName});
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
      <FlatList
        data={getData.data}
        renderItem={({item}) => (
          <View style={[styles.card, styles.elevation]}>
             <View style={styles.row}>
            <TouchableOpacity onPress={async () => await Linking.openURL(item.link)}>
             
              <View style={styles.image}>
                {imageLoading ? (
                  <Image
                    key={item.id}
                    source={require('../../../assets/images/book.jpeg')}
                    style={styles.image}
                    onLoad={() => setImageLoading(true)}
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
            <View style={{flex:1,alignItems:'center',justifyContent:'space-between' }}>
              <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.descriptionText}>{item.summary}</Text>
                <View style={[styles.buynow,{marginTop:20}]}><Text style={{color:'white'}}>{item.price} ₹</Text></View>
            </View>
            
          </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default Books;
