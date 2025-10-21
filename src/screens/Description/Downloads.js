import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, Alert} from 'react-native';
import styles from './style';
import {useNavigation} from '@react-navigation/native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import RNFetchBlob from 'rn-fetch-blob';
import COLORS from '../../config/colors';
const Downloads = () => {
 
  const [data, setData] = useState([]);
  const [fileExistence, setFileExistence] = useState({});
  const navigation = useNavigation();
  // const delFile = async path => {
  //   let arr = JSON.parse(await AsyncStorage.getItem('videoList'));
  //   const filterArr = arr.filter(item => item.path !== path);
  //   await AsyncStorage.setItem('videoList', JSON.stringify(filterArr));
  //   setData(JSON.parse(await AsyncStorage.getItem('videoList')));
  // };
  //delete videos
  // const deleteVideo = async path => {
  //   await RNFetchBlob.fs
  //     .unlink(path)
  //     .then(() => {
  //       Alert.alert('File deleted');
  //     })
  //     .catch(err => {
  //       Alert.alert('Error:', err.message);
  //     });
  //   delFile(path);
  // };

  // const fileExists = async path => {
  //   try {
  //     const exist = await RNFetchBlob.fs.exists(path);
  //     setFileExistence(prevState => ({...prevState, [path]: exist}));
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const playVideo = async path => {
    await navigation.navigate('VideoPlayer', path);
  };
  const getVideos = async () => {
    setData(JSON.parse(await AsyncStorage.getItem('videoList')));
  };

  useEffect(() => {
    getVideos();
  }, []);




  useEffect(() => {
    if (data) {
      // data.forEach(item => {
      //   fileExists(item.path);
      // });
    }
  }, [data]);

  return (
    <View style={styles.container}>
      <Text style={{color: 'black', fontWeight: 'bold', fontSize: 24}}>
        Download List
      </Text>

      <FlatList
        data={data}
        keyExtractor={item => item.id}
        removeClippedSubviews
        initialNumToRender={4}
        nestedScrollEnabled
        scrollEnabled={true}
        renderItem={({item, index}) => (
          <View style={styles.row2} key={index}>
            {fileExistence[item.path] === true ? (
              <>
                <Text style={styles.pdnText}>{index + 1}</Text>

                <TouchableOpacity
                  key={index}
                  onPress={() => playVideo(item.path)}>
                  <View style={{width: 300}}>
                    <Text style={styles.pdnText} numberOfLines={2}>
                      {item.title}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  // onPress={() => {
                  //   deleteVideo(item.path);
                  // }}
                  
                  >
                  <Text style={styles.pdnText}>
                    {' '}
                    <FontAwesome name="trash" color="#f3da35" size={20} />
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.pdnText}>{index + 1}</Text>
                <TouchableOpacity key={index}>
                  <View style={{width: 300}}>
                    <Text style={{color: COLORS.dark}}>Downloading...</Text>
                    <Text style={styles.pdnText} numberOfLines={1}>
                      {item.title}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  // onPress={() => {
                  //   deleteVideo(item.path);
                  // }}
                  
                  >
                  <Text style={styles.pdnText}>
                    {' '}
                    <FontAwesome name="trash" color="#f3da35" size={20} />
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
      {/* <View style={styles.row2}>
        <Text>Video Title</Text>
        <TouchableOpacity onPress={() => playVideo()}>
          <View>
            <Text>Play Video</Text>
          </View>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

export default Downloads;
