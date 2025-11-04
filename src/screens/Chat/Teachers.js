import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ToastAndroid,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import {BASE_URL, IMG_URL} from '../../config/config';
import {useNavigation} from '@react-navigation/native';
import styles from './style';
import {Loader} from '../../components/Loader';
import {AuthContext} from '../../components/AuthContext';
import {BottomNavigation} from '../../components/BottomNavigation';
import {Topmenu} from '../../components/Topmenu';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const Teachers = () => {
  const navigation = useNavigation();
  const {userInfo} = React.useContext(AuthContext);
  const [getData, setData] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(true);

  const insets = useSafeAreaInsets();
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
          navigation.navigate('HomeScreen', {
            screen: 'Chat',
            params: {
              user_id: sid,
              connectionId: response.data.connectionId,
            },
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
    <View style={{ flex: 1, backgroundColor: '#f9fafb', paddingBottom: insets.bottom }}>
    <SafeAreaView style={styles.container}>
      <Loader status={loadingStatus} />

      <ScrollView
        stickyHeaderIndices={[0]}
        keyboardShouldPersistTaps="always"
        nestedScrollEnabled>
        <View style={styles.headerBanner}>
          <Text style={styles.headerText}>Teacher List</Text>
        </View>
        <View style={styles.header}>
          <Topmenu />
        </View>
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
    </View>
  );
};
export default Teachers;
