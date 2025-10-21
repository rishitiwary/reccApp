import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ToastAndroid,
  SafeAreaView,
  ScrollView
} from 'react-native';
import axios from 'axios';
import {BASE_URL, IMG_URL} from '../../config/config';
import {useNavigation} from '@react-navigation/native';
import styles from './style';
import {Loader} from '../../components/Loader';
import {AuthContext} from '../../components/AuthContext';
import { BottomNavigation } from '../../components/BottomNavigation';
import { Topmenu } from '../../components/Topmenu';
const Teachers = () => {
  const navigation = useNavigation();
  const {userInfo} = React.useContext(AuthContext);
  const [getData, setData] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(true);

  const createConnection = async item => {
    try {
      setLoadingStatus(true);
      const sid = JSON.parse(userInfo).data.id;
      const tid = item.id;
      let connection = await axios({
        method: 'GET',
        url: `${BASE_URL}/chat_connections/${tid}/${sid}`,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(function (response) {
          console.log(response.data.connectionId);
          ToastAndroid.show(
            JSON.stringify(response.data.message),
            ToastAndroid.SHORT,
          );
          navigation.navigate('Chat', {
            user_id: sid,
            connectionId: response.data.connectionId,
          });
        })
        .catch(function (error) {
          console.log('error', error);
        });
      setLoadingStatus(false);
    } catch (error) {}
  };
  const handleFetchData = async () => {
    try {
      setLoadingStatus(true);
      let result = await axios({
        method: 'GET',
        url: `${BASE_URL}/staff/`,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setData(result.data);
      setLoadingStatus(false);
    } catch (error) {}
  };
  useEffect(() => {
    navigation.setOptions({title: 'Chat Screen'});
    handleFetchData();
  }, []);

  return (
    
      <SafeAreaView style={styles.container}>
        
      <Loader status={loadingStatus} />

      <ScrollView keyboardShouldPersistTaps="always" nestedScrollEnabled>
         
      <FlatList
        data={getData.data}
        keyExtractor={item => item.id}
        removeClippedSubviews
        initialNumToRender={4}
        nestedScrollEnabled
        scrollEnabled={true}
        renderItem={({item}) => (
          <TouchableOpacity>
            <View style={[styles.card, styles.elevation]}>
              <View style={styles.row}>
                <View style={[styles.image]}>
                  <Image
                    source={{uri: `${IMG_URL + item.image}`}}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.column}>
                  <View style={styles.description2}>
                    <Text style={styles.title}>
                      Name : {item.name} {item.surname}
                    </Text>

                    <Text style={styles.title}>
                      Designation : {item.designation}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => createConnection(item)}>
                    <View style={styles.buynow}>
                      <Text style={{color: 'white'}}>Chat Now</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      </ScrollView>

<BottomNavigation />
</SafeAreaView>
  );
};
export default Teachers;
