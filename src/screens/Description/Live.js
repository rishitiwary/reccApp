import React, {useState, useEffect, useCallback, useRef} from 'react';
import {Loader} from '../../components/Loader';
import YoutubePlayer from 'react-native-youtube-iframe';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {
  View,
  TouchableOpacity,
  useWindowDimensions,
  Alert,
  BackHandler,

  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../../components/AuthContext';
import {WebView} from 'react-native-webview';
import {CHAT_URL} from '../../config/config';
import styles from './style';

const Live = ({route}) => {
  const {userInfo} = React.useContext(AuthContext);
  const navigation = useNavigation();
  const videoId = route.params.videoId;
  const user_id = JSON.parse(userInfo).data.id;
  const [loadingStatus, setLoadingStatus] = useState(true);
  const controlRef = useRef();
  const width = useWindowDimensions().width;
  const height = useWindowDimensions().height;
  const [playing, setPlaying] = useState(false);
  const webView = useRef();
  const page = `${CHAT_URL}${user_id}/${videoId}`;
  //end forword and backword 10 seconds
  useEffect(() => {
    setLoadingStatus(true);

    setTimeout(() => {
      setLoadingStatus(false);
    }, 4000);
    navigation.setOptions({title: 'Live Streaming'});
  }, []);
  const onStateChange = useCallback(state => {
    if (state === 'ended') {
      setPlaying(true);
      Alert.alert('video has finished playing!');
    }
  }, []);
  const fullscreen = elapsed_sec => {
    setPlaying(false);
    navigation.navigate('FullScreen', {
      video: videoId,
      elapsed_sec: elapsed_sec,
    });
  };
  const stopLoader = () => {
    setLoadingStatus(false);
  };
  const connectionId = videoId;
  const [canGoBack, setCanGoBack] = useState(false);
  const handleBack = useCallback(() => {
    if (canGoBack && webView.current) {
      webView.current.goBack();
      return true;
    }
    return false;
  }, [canGoBack]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBack);
    };
  }, [handleBack]);
  return (
    <SafeAreaView style={{flex: 1}}>
      <Loader status={loadingStatus} />
      <View style={styles.container}>
        <View style={styles.chatScreen}>
          <WebView
            onLoadStart={() => setLoadingStatus(true)}
            onLoad={() => setLoadingStatus(false)}
            source={{
              uri: page,
            }}
            onLoadProgress={event => setCanGoBack(event.nativeEvent.canGoBack)}
          />
        </View>
        <View style={styles.containerLive}>
          <YoutubePlayer
            ref={controlRef}
            height={height}
            width={width}
            play={playing}
            videoId={connectionId}
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
          <TouchableOpacity style={styles.hideYoutubeLogo} />
          <View style={styles.functionButtons}>
            <TouchableOpacity
              onPress={async () => {
                const elapsed_sec = await controlRef.current.getCurrentTime(); // this is a promise. dont forget to await
                fullscreen(elapsed_sec);
              }}
              style={styles.functionButtonSpace}>
              <MaterialIcons
                name="fullscreen"
                color="#fff"
                fontWeight="bold"
                size={25}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Live;
