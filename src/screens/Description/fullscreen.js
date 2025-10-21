import React, { useState, useRef, useEffect } from 'react';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Loader } from '../../components/Loader';

import {
  View,
  TouchableOpacity,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import styles from './style';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { moderateScale } from '../../config/Metrics';
const Fullscreen = ({ route }) => {
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [readyToRender, setReadyToRender] = useState(false);
  const { width, height } = useWindowDimensions();

  const isLandscape = width > height;

  const controlRef = useRef();
  const [playing, setPlaying] = useState(true);
  let video = route.params.video;
  console.log("fullscreen video", video);
  let elapsed_sec = route.params.elapsed_sec.toFixed(0);

  useEffect(() => {
    setLoadingStatus(false);
    const timeout = setTimeout(() => {
      setReadyToRender(true);
    }, 800); // allow layout to settle

    return () => clearTimeout(timeout);
  }, []);


  return (


    <SafeAreaView style={styles.fullscreen}>
      <Loader status={loadingStatus} />
      <StatusBar hidden={true} />

      {isLandscape ? <><View style={{
        position: 'absolute',
        top: (isLandscape ? hp(12) : hp(10)),
        left: 0,
        right: 0,
        bottom: 0,
        width,
        height,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {readyToRender && (
          <YoutubePlayer
            ref={controlRef}
            height={isLandscape ? moderateScale(600) : height * 0.3}
            width={isLandscape ? moderateScale(700) : width}
            play={playing}
            videoId={video}
            onReady={() => setLoadingStatus(false)}
            initialPlayerParams={{
              modestbranding: true,
              preventFullScreen: true,
              frameborder: false,
              start: elapsed_sec,
              rel: false,
            }}
          />
        )}
        <TouchableOpacity style={{
          position: 'absolute',
          top: (hp(-12)),
          left: 0,
          right: 0,
          height: hp(10),
          width: wp(145),
          backgroundColor: 'transparent',
          zIndex: 10,
        }} />
        <TouchableOpacity style={{
          position: 'absolute',
          bottom: 0,  // This places it at the bottom
          left: 0,
          height: hp(18),
          width: width,
          backgroundColor: 'transparent',
          zIndex: 100, // Higher z-index to ensure visibility
        }} />

      </View></> : <><View style={{
        width,
        height,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {readyToRender && (
          <YoutubePlayer
            ref={controlRef}
            height={isLandscape ? moderateScale(600) : height * 0.3}
            width={isLandscape ? moderateScale(700) : width}
            play={playing}
            videoId={video}
            onReady={() => setLoadingStatus(false)}
            initialPlayerParams={{
              modestbranding: true,
              preventFullScreen: true,
              frameborder: false,
              start: elapsed_sec,
              rel: false,
            }}
          />
        )}
        <TouchableOpacity style={{

          justifyContent: 'center',
          alignItems: 'center',
          top: hp(-30),
          left: hp(-15),
          right: 0,
          height: hp(8),
          width: wp(90),
          backgroundColor: 'transparent',
          zIndex: 10,
        }} />
        <TouchableOpacity style={{
          justifyContent: 'center',
          alignItems: 'center',
          bottom: hp(18),  // This places it at the bottom
          left: 0,
          height: hp(10),
          width: wp(100),
          backgroundColor: 'transparent',
          zIndex: 100, // Higher z-index to ensure visibility
        }} />

      </View></>}
    </SafeAreaView>

  );
};


export default Fullscreen;