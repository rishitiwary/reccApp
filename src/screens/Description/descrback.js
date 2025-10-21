import React, {useState, useEffect, useCallback, useRef} from 'react';
import {Loader} from '../../components/Loader';
import YoutubePlayer from 'react-native-youtube-iframe';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import ytdl from 'react-native-ytdl';
import {DownloadYoutubeVideo} from '../../components/DownloadFiles';
import {
  View,
  TouchableOpacity,
  useWindowDimensions,
  Alert,
  Text,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from './style';
const Description = ({route}) => {
  const [loadingStatus, setLoadingStatus] = useState(true);
  const navigation = useNavigation();
  let video = route.params.videoId;
  let videoTitle = route.params.videoTitle;
  let youtubeURL = `https://www.youtube.com/watch?v=${video}`;
  const controlRef = useRef();
  const width = useWindowDimensions().width;
  const height = useWindowDimensions().height;
  const [playing, setPlaying] = useState(false);
  const onStateChange = useCallback(state => {
    if (state === 'ended') {
      setPlaying(true);
      Alert.alert('video has finished playing!');
    }
  }, []);
  const fullscreen = elapsed_sec => {
    setPlaying(false);
    navigation.navigate('FullScreen', {video: video, elapsed_sec: elapsed_sec});
  };
  const stopLoader = () => {
    setLoadingStatus(false);
  };

  const DownloadVideo = async () => {
    let ytUrl = '';
    const urls = await ytdl(youtubeURL, {quality: '18'});
    urls.map(i => {
      ytUrl = i.url;
    });
    await DownloadYoutubeVideo(ytUrl, videoTitle);
  };
  //end forword and backword 10 seconds
  useEffect(() => {
    // setLoadingStatus(true);
    navigation.setOptions({title: 'Description'});
  }, []);

  return (
    <View style={styles.container}>
      <Loader status={loadingStatus} />
      <View style={styles.row}>
        <YoutubePlayer
          ref={controlRef}
          height={height}
          width={width}
          play={playing}
          videoId={video}
          onChangeState={onStateChange}
          onReady={stopLoader}
          rel={false}
          modestbranding={false}
          showinfo={false}
          initialPlayerParams={{
            modestbranding: 'true',
            preventFullScreen: 'true',
            frameborder: 'false',
            start: 0,
          }}
        />
        <TouchableOpacity style={styles.hideShare} />
      </View>
      <View style={styles.functionButtons}>
        <TouchableOpacity
          onPress={async () => {
            const elapsed_sec = await controlRef.current.getCurrentTime(); // this is a promise. dont forget to await
            fullscreen(elapsed_sec);
          }}>
          <MaterialIcons
            name="fullscreen"
            color="#fff"
            fontWeight="bold"
            size={25}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 4.5,
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: '100%',
          marginTop: 20,
        }}>
        {/* <TouchableOpacity onPress={() => DownloadVideo()}>
          <Text style={{color: 'black'}}>Download Video</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default Description;
