import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {BASE_URL} from '../../config/config';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {AuthContext} from '../../components/AuthContext';
import {useNavigation} from '@react-navigation/native';
import styles from '../MyPurchase/style.js';
import {BottomNavigation} from '../../components/BottomNavigation';
import {Loader} from '../../components/Loader';
import ImagePlaceHolder from '../../../assets/images/placeholder.jpeg';
import BlinkingText from '../../components/BlinkingText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const LiveVideoList = () => {
  const insets = useSafeAreaInsets();
  const [loadingStatus, setLoadingStatus] = useState(true);
  const {userInfo} = React.useContext(AuthContext);
  const navigation = useNavigation();
  const [getData, setData] = useState([]);
  let id = JSON.parse(userInfo).data.email;
  const [keyword, setKeyword] = useState('');

  let url = `${BASE_URL}/liveVideos/${id}?keyword=${keyword}`;

  const Search = async val => {
    setKeyword(val);
    try {
      // setSpinner(true);
      let result = await axios({
        method: 'GET',
        url: url,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setData(result.data);
      // setSpinner(false);
    } catch (e) {
      console.log(e);
    }
  };

  const playLiveVideo = async item => {
    navigation.push('Live', {
      user_id: id,
      videoId: item.video_id,
    });
  };
  const handleFetchData = async () => {
    try {
      setLoadingStatus(true);
      let result = await axios({
        method: 'GET',
        url: `${BASE_URL}/liveVideos/${id}`,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (result.status === 200) {
        setData(result.data);
        setLoadingStatus(false);
      } else {
        Alert.alert('Server Error', result.status);
        setLoadingStatus(false);
      }
    } catch (error) {
      Alert.alert('Error', error);
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({title: 'Live Videos'});
    handleFetchData();
    setTimeout(() => {
      setLoadingStatus(false);
    }, 4000);
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingBottom: insets.bottom }}>
      <View style={{ flex: 1 }}>
      <Loader status={loadingStatus} />
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
                <TouchableOpacity onPress={() => playLiveVideo(item)}>
                  <View style={styles.image2}>
                    <Image
                      key={item.id}
                      source={ImagePlaceHolder}
                      style={styles.image2}
                    />
                  </View>
                </TouchableOpacity>
                <View style={{width: 220}}>
                  <Text style={[styles.title, styles.text]} numberOfLines={3}>
                    {item.title}
                  </Text>
                </View>
              </View>

              <View style={styles.description3}>
                <TouchableOpacity onPress={() => playLiveVideo(item)}>
                  <View style={styles.chatBtn2}>
                    <BlinkingText text="Live Now" />
                  </View>
                </TouchableOpacity>
                <Text style={{fontWeight: 'bold', padding: 5, color: 'black'}}>
                  {item.live_date}
                </Text>
              </View>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <BottomNavigation />
    </View>
    </View>
  );
};

export default React.memo(LiveVideoList);
